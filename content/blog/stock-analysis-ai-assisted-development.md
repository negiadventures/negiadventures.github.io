---
layout: blog-post
title: "Stock Analysis - Built with AI Assistance"
description: "How I built a comprehensive stock tracking and analysis tool using Claude Code and Qwen."
date: 2024-01-08
tags:
  - AI-Assisted
  - Finance
  - Python
  - Data Analysis
image: /images/blog/stock-analysis.png
---

# Stock Analysis - Built with AI Assistance

## Overview
Stock Analysis is a comprehensive tool for tracking stocks, analyzing price movements, and generating trading insights. It includes price tracking, technical indicators, portfolio management, and performance visualization. Built with AI pair programming assistance.

## The Goal
Create a stock analysis tool that provides:
1. Real-time and historical price data
2. Technical analysis indicators (moving averages, RSI, MACD)
3. Portfolio tracking and performance metrics
4. Visual charts and insights
5. Alert system for price movements

## AI Tools Used
- **Claude Code**: Financial calculations, API integration, data visualization
- **Qwen**: Pandas optimization, statistical analysis, chart styling

## How AI Helped

### API Integration

#### Stock Data Fetcher
Claude helped implement robust API handling:

```python
import requests
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import pandas as pd

class StockDataFetcher:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.alpaca.markets/v2"
        self.headers = {
            "APCA-API-KEY-ID": api_key,
            "APCA-API-SECRET-KEY": api_key
        }

    def get_historical_data(
        self,
        symbol: str,
        start_date: datetime,
        end_date: datetime,
        timeframe: str = "1Day"
    ) -> pd.DataFrame:
        """Fetch historical stock data."""
        params = {
            "timeframe": timeframe,
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        }

        response = requests.get(
            f"{self.base_url}/stocks/{symbol}/bars",
            headers=self.headers,
            params=params
        )
        response.raise_for_status()

        bars = response.json()["bars"]

        df = pd.DataFrame(bars)
        df["timestamp"] = pd.to_datetime(df["t"])
        df.set_index("timestamp", inplace=True)

        return df[["open", "high", "low", "close", "volume"]]

    def get_current_price(self, symbol: str) -> Optional[float]:
        """Get current stock price."""
        params = {"timeframe": "1Min"}
        response = requests.get(
            f"{self.base_url}/stocks/{symbol}/bars",
            headers=self.headers,
            params=params
        )

        if response.status_code == 200:
            bars = response.json()["bars"]
            if bars:
                return bars[-1]["c"]
        return None

    def get_multiple_stocks(
        self,
        symbols: List[str],
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, pd.DataFrame]:
        """Fetch data for multiple stocks."""
        data = {}
        for symbol in symbols:
            try:
                data[symbol] = self.get_historical_data(symbol, start_date, end_date)
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
        return data
```

### Technical Indicators

#### Indicator Calculations
AI generated technical analysis functions:

```python
import numpy as np

class TechnicalAnalyzer:
    @staticmethod
    def calculate_sma(prices: pd.Series, window: int) -> pd.Series:
        """Calculate Simple Moving Average."""
        return prices.rolling(window=window).mean()

    @staticmethod
    def calculate_ema(prices: pd.Series, window: int) -> pd.Series:
        """Calculate Exponential Moving Average."""
        return prices.ewm(span=window, adjust=False).mean()

    @staticmethod
    def calculate_rsi(prices: pd.Series, window: int = 14) -> pd.Series:
        """Calculate Relative Strength Index."""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()

        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    @staticmethod
    def calculate_macd(prices: pd.Series) -> pd.DataFrame:
        """Calculate MACD indicator."""
        ema_12 = prices.ewm(span=12, adjust=False).mean()
        ema_26 = prices.ewm(span=26, adjust=False).mean()

        macd_line = ema_12 - ema_26
        signal_line = macd_line.ewm(span=9, adjust=False).mean()
        histogram = macd_line - signal_line

        return pd.DataFrame({
            "macd": macd_line,
            "signal": signal_line,
            "histogram": histogram
        })

    @staticmethod
    def calculate_bollinger_bands(
        prices: pd.Series,
        window: int = 20,
        num_std: float = 2.0
    ) -> pd.DataFrame:
        """Calculate Bollinger Bands."""
        sma = prices.rolling(window=window).mean()
        std = prices.rolling(window=window).std()

        upper_band = sma + (std * num_std)
        lower_band = sma - (std * num_std)

        return pd.DataFrame({
            "upper": upper_band,
            "middle": sma,
            "lower": lower_band
        })

    @staticmethod
    def calculate_volatility(prices: pd.Series, window: int = 20) -> pd.Series:
        """Calculate rolling volatility (standard deviation of returns)."""
        returns = prices.pct_change()
        return returns.rolling(window=window).std() * np.sqrt(252)  # Annualized
```

### Portfolio Management

#### Portfolio Tracker
AI designed a comprehensive portfolio tracking system:

```python
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from datetime import datetime

@dataclass
class Holding:
    symbol: str
    shares: float
    avg_cost: float
    purchase_date: datetime = field(default_factory=datetime.now)

    @property
    def total_cost(self) -> float:
        return self.shares * self.avg_cost

@dataclass
class Portfolio:
    holdings: Dict[str, Holding] = field(default_factory=dict)
    cash: float = 100000.0

    def add_position(self, symbol: str, shares: float, price: float):
        """Add or increase a position."""
        if symbol in self.holdings:
            existing = self.holdings[symbol]
            total_shares = existing.shares + shares
            total_cost = existing.total_cost + (shares * price)
            new_avg_cost = total_cost / total_shares

            self.holdings[symbol] = Holding(
                symbol=symbol,
                shares=total_shares,
                avg_cost=new_avg_cost,
                purchase_date=existing.purchase_date
            )
        else:
            self.holdings[symbol] = Holding(
                symbol=symbol,
                shares=shares,
                avg_cost=price
            )

        self.cash -= shares * price

    def remove_position(self, symbol: str, shares: float, price: float) -> float:
        """Sell shares and return proceeds."""
        if symbol not in self.holdings:
            raise ValueError(f"No position in {symbol}")

        holding = self.holdings[symbol]
        if shares > holding.shares:
            raise ValueError(f"Cannot sell more than owned: {holding.shares}")

        proceeds = shares * price
        self.cash += proceeds

        if shares == holding.shares:
            del self.holdings[symbol]
        else:
            holding.shares -= shares

        return proceeds

    def get_total_value(self, current_prices: Dict[str, float]) -> float:
        """Calculate total portfolio value."""
        stock_value = sum(
            holding.shares * current_prices.get(holding.symbol, 0)
            for holding in self.holdings.values()
        )
        return self.cash + stock_value

    def get_performance(self, current_prices: Dict[str, float]) -> List[Dict]:
        """Get performance for each holding."""
        performance = []

        for symbol, holding in self.holdings.items():
            current_price = current_prices.get(symbol, 0)
            current_value = holding.shares * current_price
            gain_loss = current_value - holding.total_cost
            gain_loss_pct = (gain_loss / holding.total_cost) * 100

            performance.append({
                "symbol": symbol,
                "shares": holding.shares,
                "avg_cost": holding.avg_cost,
                "current_price": current_price,
                "current_value": current_value,
                "gain_loss": gain_loss,
                "gain_loss_pct": gain_loss_pct
            })

        return performance
```

### Data Visualization

#### Chart Generator
AI helped create comprehensive visualizations:

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

class StockChartGenerator:
    def __init__(self, style: str = "dark"):
        self.style = style
        self.colors = {
            "dark": {
                "background": "#0f172a",
                "grid": "#334155",
                "text": "#e2e8f0",
                "up": "#22c55e",
                "down": "#ef4444"
            },
            "light": {
                "background": "#ffffff",
                "grid": "#e5e7eb",
                "text": "#1f2937",
                "up": "#16a34a",
                "down": "#dc2626"
            }
        }

    def create_price_chart(
        self,
        df: pd.DataFrame,
        symbol: str,
        show_ma: bool = True,
        show_volume: bool = True
    ) -> plt.Figure:
        """Create a comprehensive price chart with indicators."""
        fig, axes = plt.subplots(2, 1, figsize=(14, 8), gridspec_kw={'height_ratios': [3, 1]})

        colors = self.colors[self.style]

        # Price chart
        ax1 = axes[0]
        ax1.plot(df.index, df["close"], color=colors["up"], linewidth=1.5, label="Price")

        if show_ma:
            sma_20 = TechnicalAnalyzer.calculate_sma(df["close"], 20)
            sma_50 = TechnicalAnalyzer.calculate_sma(df["close"], 50)
            ax1.plot(sma_20.index, sma_20, "w--", linewidth=1, label="SMA 20")
            ax1.plot(sma_50.index, sma_50, "w--", linewidth=1, label="SMA 50")

        ax1.set_title(f"{symbol} Price History", fontsize=14, color=colors["text"])
        ax1.set_ylabel("Price", color=colors["text"])
        ax1.grid(True, alpha=0.3, color=colors["grid"])
        ax1.legend(loc="upper left")

        # Volume chart
        if show_volume:
            ax2 = axes[1]
            colors_volume = [colors["up"] if df["close"].iloc[i] >= df["open"].iloc[i]
                           else colors["down"] for i in range(len(df))]

            ax2.bar(df.index, df["volume"], color=colors_volume, alpha=0.5)
            ax2.set_ylabel("Volume", color=colors["text"])
            ax2.grid(True, alpha=0.3, color=colors["grid"])

        # Formatting
        ax1.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m-%d"))
        plt.xticks(rotation=45)
        plt.tight_layout()

        return fig
```

## The Process

### Prompting Strategy

**Effective approach:**
1. Define data models (Holding, Portfolio)
2. Implement API layer
3. Add technical indicators
4. Build portfolio management
5. Create visualizations

**Example prompt:**
```
I need a Python class for tracking stock portfolio.
It should:
1. Track holdings with symbol, shares, and average cost
2. Allow adding and removing positions
3. Calculate current value and gains/losses
4. Support multiple stocks

Start with the dataclass definitions.
```

### Human Decisions
- Which indicators to include
- Alert thresholds
- Portfolio allocation strategy
- Risk management rules

### Iteration Cycle
1. Define data structure
2. Generate API integration
3. Add calculations
4. Test with real data
5. Build visualization

## Challenges

### What AI Couldn't Help With
- **Market prediction**: AI cannot predict stock movements
- **Regulatory compliance**: Legal requirements need human review
- **Risk assessment**: Investment decisions require human judgment

### Unexpected Issues
- API rate limits
- Data gaps in historical data
- Stock splits and adjustments

## Results

### Quantitative
- **Development time**: 4 days with AI vs estimated 6-8 days without
- **Indicators**: 10+ technical indicators implemented
- **Data support**: Works with major stock exchanges

### Qualitative
- Clean, modular code structure
- Well-documented calculations
- Extensible architecture

## Key Learnings

1. **AI excels at calculations** - Technical indicators are well-defined
2. **Modular design helps** - Separate API, calculations, and visualization
3. **Testing is crucial** - Validate calculations against known values
4. **Error handling matters** - API calls can fail
5. **Documentation is key** - Explain financial concepts clearly

## Code Samples

### Example Prompt
```
I need to calculate RSI (Relative Strength Index) for stock analysis.
Use pandas for efficiency.
Include proper handling of the first 14 periods where RSI is undefined.
```

### Resulting Code
```python
def calculate_rsi(prices: pd.Series, window: int = 14) -> pd.Series:
    """Calculate Relative Strength Index."""
    delta = prices.diff()

    # Separate gains and losses
    gain = delta.where(delta > 0, 0)
    loss = (-delta).where(delta < 0, 0)

    # Calculate average gain and loss
    avg_gain = gain.rolling(window=window).mean()
    avg_loss = loss.rolling(window=window).mean()

    # Calculate RS and RSI
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi
```

## Next Steps
- Add real-time alerts
- Integrate with trading platforms
- Add fundamental analysis
- Create mobile app

---

*This project was built with AI pair programming assistance using Claude Code and Qwen.*
