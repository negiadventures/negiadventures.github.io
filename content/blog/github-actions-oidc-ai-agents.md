---
title: "Using GitHub Actions OIDC for AI Agents Without Long-Lived Cloud Keys"
date: 2026-04-18
slug: github-actions-oidc-ai-agents
description: "A practical guide to using GitHub Actions OIDC for AI agents so CI jobs can deploy, evaluate, and run ops tasks with short-lived cloud credentials instead of stored secrets."
tags:
  - GitHub Actions
  - OIDC
  - AI Agents
  - Cloud Security
  - CI/CD
visual_plan:
  hero: "Dark CI security banner showing GitHub OIDC token exchange into a short-lived cloud role"
  diagram: "Workflow from pull request to GitHub OIDC token to cloud STS to bounded deploy and eval jobs"
  optional_terminal: "AWS caller identity and deploy logs proving ephemeral credentials"
  optional_table: "Comparison of static keys, OIDC, and self-hosted runner credentials"
  code_sections:
    - "GitHub Actions workflow with id-token permissions and bounded jobs"
    - "AWS IAM trust policy for repo, branch, and environment restrictions"
---

# Using GitHub Actions OIDC for AI Agents Without Long-Lived Cloud Keys

Most teams that bolt AI agents into CI eventually make the same bad shortcut. They give the workflow a long-lived cloud key, store it in GitHub Secrets, and hope review plus branch protection is enough. It works right up until the wrong workflow runs, a forked change finds a path around the guardrails, or nobody remembers where else that key was reused.

That is a lousy fit for agentic systems. AI jobs are good at doing many steps quickly, but that also means a leaked credential can do many wrong things quickly.

The better pattern is to let GitHub Actions mint a short-lived OIDC identity per run, exchange it for a tightly scoped cloud role, and make the agent operate inside that short-lived boundary. This is how I would wire deploys, eval jobs, and repo automation that need cloud access without leaving static keys behind.

## Why this matters

If an AI workflow can open PRs, run evaluations, push artifacts, or trigger deployments, then credential shape matters as much as prompt shape. Static secrets create hidden blast radius:

- the same key often gets reused across workflows
- rotation is rare because it breaks pipelines
- reviewers cannot tell which future jobs can reuse the credential
- a compromised secret stays valid long after the triggering run ends

OIDC shifts the control point. Instead of trusting a secret copied into CI months ago, you trust a signed identity token from GitHub plus a cloud-side policy that says which repo, branch, environment, and workflow may assume a role.

## Architecture and workflow overview

```mermaid
flowchart LR
    A[Pull request or deploy workflow] --> B[GitHub Actions runner]
    B --> C[Request OIDC token]
    C --> D[Cloud STS / workload identity]
    D --> E[Short-lived role credentials]
    E --> F[Agent job: eval, deploy, migrate]
    F --> G[Logs, artifacts, approvals]
```

The core rule is simple: the workflow earns credentials at runtime, only for that run, and only for the exact trust conditions you allow.

### Recommended trust shape

1. GitHub workflow has `id-token: write` but no stored cloud key.
2. Cloud IAM trust policy checks repo, ref, workflow, and optionally environment.
3. Workflow assumes a narrow role for one job, not the whole pipeline.
4. Agent only gets access to the exact cloud actions needed for that stage.
5. Production steps stay behind environments, approvals, or both.

## Implementation details

### 1. Minimal GitHub Actions workflow

This pattern is clean for AI-driven deploy or evaluation jobs because the credential only exists after GitHub attests the workflow identity.

```yaml
name: ai-eval-and-deploy

on:
  workflow_dispatch:
  push:
    branches: [master]

permissions:
  contents: read
  id-token: write

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-ai-eval
          aws-region: us-east-1

      - name: Run agent evaluation suite
        run: |
          python scripts/run_eval.py \
            --dataset evals/release.json \
            --output artifacts/eval-report.json

      - name: Upload eval artifacts
        uses: actions/upload-artifact@v4
        with:
          name: eval-report
          path: artifacts/eval-report.json

  deploy:
    needs: eval
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure deploy role via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-ai-deploy
          aws-region: us-east-1

      - name: Deploy bounded release
        run: ./scripts/deploy.sh
```

A few things matter here:

- `id-token: write` is required, but only for jobs that need cloud auth
- `environment: production` gives you an extra review gate if configured in GitHub
- split `eval` and `deploy` roles so a model scoring job cannot also mutate production

### 2. AWS trust policy that actually constrains the workflow

A lot of OIDC examples stop too early. They prove the login works, but they do not lock the role to a safe caller shape.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": [
            "repo:negiadventures/negiadventures.github.io:ref:refs/heads/master",
            "repo:negiadventures/negiadventures.github.io:environment:production"
          ],
          "token.actions.githubusercontent.com:job_workflow_ref": "negiadventures/negiadventures.github.io/.github/workflows/ai-eval-and-deploy.yml@refs/heads/master"
        }
      }
    }
  ]
}
```

This is where the real safety comes from. I would rather spend time here than on another round of secret masking rules.

### 3. Session policy to narrow what the agent can do per run

Even with a good base role, it is smart to carve permissions down further when an individual run only needs a subset.

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/github-ai-deploy \
  --role-session-name pr-ship-1842 \
  --policy '{
    "Version":"2012-10-17",
    "Statement":[
      {
        "Effect":"Allow",
        "Action":["s3:PutObject","cloudfront:CreateInvalidation"],
        "Resource":[
          "arn:aws:s3:::my-site-bucket/*",
          "arn:aws:cloudfront::123456789012:distribution/E123ABC456DEF"
        ]
      }
    ]
  }'
```

That extra policy trim is useful when the same deploy role serves multiple release paths. The agent still gets a short-lived credential, but the run becomes even more specific.

### 4. Terminal proof that the credential is ephemeral

A fast sanity check in CI is to print the caller identity and session context before the real step runs.

```text
$ aws sts get-caller-identity
{
  "UserId": "AROAXXXXXXXX:GitHubActions",
  "Account": "123456789012",
  "Arn": "arn:aws:sts::123456789012:assumed-role/github-ai-deploy/GitHubActions"
}

$ aws configure list
      Name                    Value             Type    Location
      ----                    -----             ----    --------
   access_key     ****************ABCD temporary-credentials-file
   secret_key     ****************wxyz temporary-credentials-file
       region                us-east-1         env    AWS_REGION
```

If you see a normal IAM user here, something is off. The whole point is that the run should look like an assumed role session, not a permanent machine user.

## Comparison table

| Approach | Security posture | Operational pain | Good fit | What I would not do |
| --- | --- | --- | --- | --- |
| Static cloud keys in GitHub Secrets | Weak, long-lived blast radius | Easy at first, painful later | Legacy pipelines you are actively retiring | New agent workflows |
| GitHub OIDC to cloud role | Strong, short-lived, auditable | Medium setup, low ongoing pain | Deploys, eval jobs, infra reads, bounded writes | Broad wildcard trust rules |
| Self-hosted runner with machine identity | Mixed, depends on host hardening | High ops burden | Specialized internal networks | Public repos or lightly managed runners |

OIDC usually wins because it improves both security and reviewability. Once configured, it is less annoying than secret rotation and easier to reason about during audits.

## What went wrong and the tradeoffs

### Failure mode 1: trust policy too broad

The most common mistake is allowing any workflow in the repo to assume the role. That turns OIDC into a nicer credential transport, but not a safer one. Lock it to the workflow path and branch or environment.

### Failure mode 2: production trust tied only to branch

Branch checks alone are weak if many workflows can run on that branch. Use environments for sensitive stages and bind the trust to the environment subject when possible.

### Failure mode 3: agent job has more permission than the human reviewer expected

This one is subtle. The PR might only change prompt logic, but the workflow role can still write infra or production artifacts. Pair OIDC with role separation and human approvals for high-risk jobs.

### Tradeoffs worth accepting

- setup is more annoying than pasting a secret once
- trust policy debugging is fiddly the first time
- some cloud providers expose different claim names and rough edges
- local reproduction is less direct because the credential comes from GitHub, not your shell

I still think this is absolutely worth it for agent workflows. The alternative is pretending secret masking is a control plane.

## Best practices I would keep

> **Best-practice callout**
>
> - Use separate roles for eval, deploy, and read-only inspection jobs.
> - Match on repo plus workflow path, not repo alone.
> - Prefer environment-gated production roles.
> - Emit caller identity into logs before doing writes.
> - Keep cloud permissions narrower than the workflow permissions.

## Pitfalls to watch for

> **Pitfalls callout**
>
> - `pull_request_target` can change your threat model fast if you are not careful.
> - Reusable workflows need their own trust assumptions reviewed.
> - Self-hosted runners can turn a short-lived credential into a host compromise problem.
> - Artifact upload and deployment credentials should not share the same role by default.

## Practical checklist

- [ ] No long-lived cloud keys stored in GitHub for this workflow
- [ ] Workflow requests `id-token: write` only where needed
- [ ] Trust policy checks repo, branch or environment, and workflow path
- [ ] Eval and deploy jobs use separate roles
- [ ] Production path requires environment approval or equivalent guardrail
- [ ] Logs prove the run used an assumed role session
- [ ] Session policies or narrow IAM policies limit write scope

## Conclusion

If an AI agent can touch cloud systems, give it credentials that expire fast and only exist when the workflow proves who it is. GitHub Actions OIDC is not just a cleaner auth trick. It is one of the few changes that reduces both operational mess and security risk at the same time.
