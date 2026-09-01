---
layout: blog-post
title: "How to Harden OpenClaw on a VPS Without Breaking the Good Parts"
description: "A practical guide to hardening OpenClaw on a VPS with least-privilege credentials, network restrictions, approval boundaries, and operations checks that actually matter."
date: 2026-03-27
tags:
  - OpenClaw
  - VPS
  - Security
  - Operations
image: data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2309141f'/%3E%3Cstop offset='100%25' stop-color='%2311263f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='630' fill='url(%23bg)'/%3E%3Ccircle cx='960' cy='120' r='150' fill='%2327d3ff' fill-opacity='0.12'/%3E%3Ccircle cx='180' cy='520' r='190' fill='%238d6bff' fill-opacity='0.14'/%3E%3Crect x='110' y='110' width='980' height='410' rx='28' fill='%230f172a' stroke='%2338bdf8' stroke-opacity='0.35'/%3E%3Ctext x='165' y='235' fill='white' font-family='Arial, sans-serif' font-size='56' font-weight='700'%3EHarden OpenClaw%3C/text%3E%3Ctext x='165' y='305' fill='%2390cdf4' font-family='Arial, sans-serif' font-size='56' font-weight='700'%3Eon a VPS%3C/text%3E%3Ctext x='165' y='390' fill='%23cbd5e1' font-family='Arial, sans-serif' font-size='28'%3EKeep the assistant useful without giving it a blank check%3C/text%3E%3C/svg%3E
---

# How to Harden OpenClaw on a VPS Without Breaking the Good Parts

OpenClaw gets interesting the moment it stops being a toy. A local chat bot is nice. A self-hosted assistant that can read files, schedule jobs, open pull requests, and interact with real accounts is a different category of system entirely.

That is also the moment where VPS deployment stops being a “just ship it” problem and becomes an operations problem. If the box is exposed, the model has too much tool access, or your tokens are over-scoped, you are not running a quirky assistant anymore. You are running an automation surface with credentials.

The trick is not to lock OpenClaw down so hard that it becomes useless. The trick is to narrow the blast radius while keeping the workflows that actually matter. Here is the practical hardening baseline I would want before calling a public VPS deployment healthy.

## 1. Start with a threat model that matches reality

Before touching firewall rules, define what the assistant can reach and what would actually hurt if it went wrong.

- **Public surface:** web UI, gateway, reverse proxy, SSH, webhook endpoints
- **Secrets:** API keys, GitHub tokens, mail credentials, session cookies, OAuth refresh tokens
- **Actions:** writing files, sending messages, opening PRs, running commands, browser automation
- **Failure modes:** prompt injection, over-broad tools, leaked tokens, outbound spam, filesystem escape, accidental cron loops

If you do not enumerate those early, you end up with fake security: lots of settings, no clear boundary.

## 2. Keep the network surface boring

The best OpenClaw VPS is the one that exposes as little as possible. In practice, that usually means:

1. put OpenClaw behind a reverse proxy
2. terminate TLS there
3. avoid direct public binds unless you have to
4. restrict admin-only paths by IP, VPN, or tailnet when possible

Do not leave miscellaneous service ports open just because the install worked once. Ask what truly needs to be reachable from the public internet.

```bash
# Example baseline idea, not a copy-paste prescription
# Public: 80/443
# Admin: SSH only from trusted IPs or a tailnet
# Internal: app ports bound to localhost when possible

ss -tulpn
ufw status verbose
```

If a service can bind to localhost and only be reached through the proxy, that is usually a win.

## 3. Treat SSH like a production interface

Most self-hosted incidents are less glamorous than prompt injection. They start with weak SSH posture or stale packages. Minimum sane baseline:

- disable password auth if you can
- use keys only
- limit which users can SSH in
- keep sudo access narrow
- turn on unattended security updates or an equivalent patch routine
- log auth failures and review them occasionally

If your assistant is high-value enough to carry secrets, the host is high-value enough to deserve grown-up access control.

## 4. Run with least privilege all the way down

The common failure mode is to grant one big credential to the whole stack because it is convenient. That convenience turns into lateral movement.

Instead:

- use separate tokens for read-heavy versus write-heavy integrations
- prefer fine-grained GitHub tokens over classic all-repo tokens
- scope filesystem access to the actual workspace, not the whole home directory
- give browser automation its own profile and data directory
- split privileged maintenance tasks from normal assistant tasks

If one tool goes sideways, it should not inherit every other permission on the box.

## 5. Be explicit about which tools are allowed to write

Read tools and write tools should not feel morally equivalent. The assistant can inspect a repo, summarize a log, or read a document with much lower risk than sending an email, merging a PR, or editing a production config.

A practical policy is:

- **default allow:** safe read-only tools
- **default review:** anything that writes externally
- **default deny:** destructive or broad shell-like capabilities unless you really need them

This is one reason OpenClaw approval flows matter so much. A human checkpoint for external or destructive actions is not friction for its own sake. It is what keeps one bad interpretation from becoming a real-world mistake.

## 6. Put boundaries around cron and automation

Cron jobs are great right up until they become a persistence mechanism for bad behavior. A reminder job is harmless. A badly scoped recurring agent task with broad tools can quietly burn budget, spam channels, or keep touching files long after the original need is gone.

Good cron hygiene:

- use exact one-shot reminders for exact timing
- prefer isolated runs for recurring agent jobs
- keep schedules human-readable and documented
- review enabled jobs periodically
- set timeouts and keep delivery targets intentional

```bash
# Useful operational checks
openclaw gateway status
openclaw cron list
openclaw cron runs <job-id>
```

Automation should be discoverable. If you cannot quickly answer “what jobs are active and what do they touch?”, the system is too opaque.

## 7. Separate the machine from the memory

OpenClaw is unusually useful because it can carry context across files, memory, and sessions. That also means your memory files can become sensitive. Long-term notes often contain names, preferences, decisions, internal URLs, and fragments of credentials or workflows if you are not careful.

Hardening here is mostly discipline:

- keep memory curated, not secret-dense
- avoid storing raw tokens or passwords in workspace files
- keep backups encrypted if the workspace leaves the machine
- be careful about exposing main-session memory into shared or public contexts

Memory is part of your attack surface because it shapes future actions.

## 8. Watch outbound traffic and external actions

People focus on inbound security and forget that a compromised or badly instructed assistant can do damage by talking outwards: posting publicly, emailing strangers, hitting APIs in loops, or shipping sensitive text to third-party endpoints.

Useful safeguards include:

- outbound allowlists for especially sensitive environments
- separate API keys per integration so abuse is easier to revoke
- budget limits where providers support them
- clear review before sending messages outside the machine

If the assistant can leave the box, that path deserves the same scrutiny as inbound access.

## 9. Add observability before you need it

When something weird happens, you want evidence, not vibes. Basic operational visibility should answer:

- which sessions were active
- which tools were called
- which cron jobs ran
- whether a task was isolated or attached to a persistent session
- what changed on disk and in git

The point is not just forensic debugging. Good visibility also tells you when the setup is too broad or too noisy.

```bash
# A compact host-level checklist
journalctl -u openclaw --since "24 hours ago"
git -C /path/to/repo status --short
openclaw gateway status
```

## 10. Keep a small, repeatable hardening checklist

The best security posture is the one you can repeat after upgrades, migrations, and sleep deprivation. Mine would be something like this:

1. Host updated and SSH hardened
2. Only necessary public ports exposed
3. OpenClaw services bound narrowly where possible
4. Reverse proxy terminates TLS
5. Secrets split by integration and privilege level
6. Dangerous tools gated by approval or disabled
7. Cron jobs reviewed and time-bounded
8. Workspace access scoped and backups handled safely
9. Outbound integrations intentionally enabled
10. Operational checks documented so future-you can verify the setup fast

## What not to do

- Do not expose every service directly because reverse proxy config felt annoying
- Do not give the assistant a giant personal access token “just for testing” and forget about it
- Do not leave browser sessions logged into sensitive sites without thinking about what tools can reach them
- Do not treat memory files as a safe place for secrets
- Do not assume prompt instructions are a substitute for permission boundaries

## References and resources

- OpenClaw on GitHub: https://github.com/openclaw/openclaw
- OpenClaw operations and troubleshooting docs: https://github.com/openclaw/openclaw#operations--troubleshooting
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP SSRF Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

## Key takeaways

1. OpenClaw on a VPS is an operations system, not just a chat app.
2. Least privilege matters more than clever prompting.
3. Read, write, and destructive actions should live under different levels of trust.
4. Cron, memory, and outbound integrations are part of the attack surface.
5. The right hardening posture keeps the assistant useful while making mistakes much less expensive.

---

*If you are building agent tooling in 2026, securing the host and tightening permissions is still one of the highest-leverage moves you can make.*
