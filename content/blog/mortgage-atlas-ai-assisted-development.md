---
layout: blog-post
title: "Mortgage Atlas - Built with AI Assistance"
description: "How I built a comprehensive mortgage cost calculator using Claude Code and Qwen."
date: 2024-01-10
tags:
  - AI-Assisted
  - Finance
  - TypeScript
  - Data Visualization
image: /images/blog/mortgage-atlas.png
---

# Mortgage Atlas - Built with AI Assistance

## Overview
Mortgage Atlas is a comprehensive homeownership cost estimator that goes beyond basic mortgage calculators. It models the true cost of homeownership including mortgage payments, property taxes, insurance, maintenance, and opportunity costs. Built with AI pair programming assistance.

## The Goal
Create a mortgage calculator that answers the question: "What does homeownership REALLY cost?" Most calculators only show monthly payments, but the true cost includes many hidden factors.

## AI Tools Used
- **Claude Code**: Financial formulas, chart.js integration, state management
- **Qwen**: TypeScript type definitions, validation logic, edge case handling

## How AI Helped

### Financial Formulas

#### Mortgage Payment Calculation
Claude helped implement the standard mortgage formula with precision:

```typescript
function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) return principal / numberOfPayments;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}
```

#### Amortization Schedule
AI generated a complete amortization schedule generator:

```typescript
interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  year: number;
}

function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 12;
  const totalPayments = years * 12;
  const monthlyPayment = calculateMortgagePayment(principal, annualRate, years);

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= totalPayments; month++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
      year: Math.ceil(month / 12)
    });
  }

  return schedule;
}
```

### Data Visualization

#### Chart.js Integration
AI helped set up interactive charts for amortization:

```typescript
function createAmortizationChart(
  ctx: CanvasRenderingContext2D,
  schedule: AmortizationRow[]
) {
  const labels = schedule.map(row => `Year ${row.year}`);
  const principalData = schedule
    .reduce((acc, row, i) => {
      if (i === 0 || i % 12 === 0) {
        acc.push(row.balance);
      }
      return acc;
    }, [] as number[]);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Remaining Balance',
        data: principalData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (context) =>
              `$${context.parsed.y.toLocaleString('en-US', {
                maximumFractionDigits: 0
              })}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) =>
              `$${(value / 1000).toFixed(0)}k`
          }
        }
      }
    }
  });
}
```

### State Management

#### Form State with Validation
AI created a robust state management system:

```typescript
interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  homeInsurance: number;
  hoaFees: number;
  maintenanceRate: number;
}

class MortgageCalculator {
  private inputs: MortgageInputs;
  private errors: Record<string, string> = {};

  constructor(defaults: Partial<MortgageInputs> = {}) {
    this.inputs = {
      homePrice: 500000,
      downPayment: 100000,
      interestRate: 6.5,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsurance: 1200,
      hoaFees: 0,
      maintenanceRate: 0.5,
      ...defaults
    };
  }

  validate(): boolean {
    this.errors = {};

    if (this.inputs.downPayment > this.inputs.homePrice) {
      this.errors.downPayment = 'Down payment cannot exceed home price';
    }

    if (this.inputs.interestRate < 0 || this.inputs.interestRate > 20) {
      this.errors.interestRate = 'Interest rate must be between 0% and 20%';
    }

    return Object.keys(this.errors).length === 0;
  }

  getTotalMonthlyCost(): number {
    const principalAndInterest = this.calculatePrincipalAndInterest();
    const propertyTax = this.inputs.homePrice * (this.inputs.propertyTaxRate / 100) / 12;
    const homeInsurance = this.inputs.homeInsurance / 12;
    const hoa = this.inputs.hoaFees;
    const maintenance = this.inputs.homePrice * (this.inputs.maintenanceRate / 100) / 12;

    return principalAndInterest + propertyTax + homeInsurance + hoa + maintenance;
  }
}
```

## The Process

### Prompting Strategy

**Effective approach:**
1. Define the data model first with AI
2. Generate validation logic
3. Implement calculation functions
4. Build the UI components
5. Add visualization

**Example prompt:**
```
I need a TypeScript class for a mortgage calculator.
It should:
1. Accept inputs: home price, down payment, interest rate, loan term
2. Calculate monthly payment using standard formula
3. Generate amortization schedule
4. Include property tax, insurance, HOA, maintenance

Start with the TypeScript interfaces, then we'll implement the class.
```

### Human Decisions
- Financial assumptions (maintenance rate, property tax estimates)
- UI layout and user experience
- Which costs to include/exclude
- Default values for calculations

### Iteration Cycle
1. Define financial model with AI
2. Generate calculation functions
3. Test with real-world examples
4. Refine based on edge cases
5. Build UI layer

## Challenges

### What AI Couldn't Help With
- **Local variations**: Property tax rates vary wildly by location
- **Market predictions**: AI couldn't predict interest rate trends
- **User education**: Need to explain complex financial concepts

### Unexpected Issues
- Floating point precision in financial calculations
- Edge cases with very short/long loan terms
- Handling zero interest rate scenarios

## Results

### Quantitative
- **Development time**: 2 days with AI vs estimated 4-5 days without
- **Code coverage**: AI helped write tests for edge cases
- **Accuracy**: Validated against multiple online calculators

### Qualitative
- Clean, type-safe TypeScript code
- Well-documented financial formulas
- Reusable components for future financial tools

## Key Learnings

1. **AI is great at formulas** - Financial calculations are well-documented
2. **TypeScript + AI = fewer bugs** - Type errors caught early
3. **Edge cases matter** - AI helps identify scenarios you might miss
4. **Documentation is key** - AI-generated docs help explain complex logic
5. **Validation is crucial** - Always validate financial calculations

## Code Samples

### Example Prompt
```
I need to calculate the true cost of homeownership including:
- Principal and interest
- Property taxes
- Home insurance
- HOA fees
- Maintenance (typically 1% of home value per year)

Create a function that takes all these inputs and returns monthly cost breakdown.
```

### Resulting Code
```typescript
function calculateHomeownershipCost(inputs: HomeownershipInputs): CostBreakdown {
  const pmi = calculatePMI(inputs);
  const monthlyPI = calculateMortgagePayment(
    inputs.homePrice - inputs.downPayment,
    inputs.interestRate,
    inputs.loanTerm
  );

  return {
    principalAndInterest: monthlyPI,
    propertyTax: inputs.homePrice * inputs.propertyTaxRate / 100 / 12,
    homeInsurance: inputs.homeInsurance / 12,
    hoa: inputs.hoaFees,
    pmi: pmi,
    maintenance: inputs.homePrice * 0.01 / 12,
    total: monthlyPI + pmi +
      inputs.homePrice * inputs.propertyTaxRate / 100 / 12 +
      inputs.homeInsurance / 12 +
      inputs.hoaFees +
      inputs.homePrice * 0.01 / 12
  };
}
```

## Next Steps
- Add refinance calculator
- Compare renting vs buying scenarios
- Add inflation adjustments
- Export reports as PDF

---

*This project was built with AI pair programming assistance using Claude Code and Qwen.*
