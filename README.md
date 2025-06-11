💹 PropForge — Prop Firm Training Simulator
============================

![](https://raw.githubusercontent.com/michaelsboost/PropForge/main/imgs/screenshot.jpeg)

## 🌟 Overview
**PropForge** is an interactive **prop firm training simulator** built for traders preparing to pass challenges like those from **TopStep**, **FTMO**, **Apex**, and **other proprietary trading firms**.

It features **phase-based evaluations**, **profit/loss tracking**, **challenge resets**, and **realistic trading constraints** modeled after actual prop firm rules.

> **🛠️ Built Using [kodeWeave](https://michaelsboost.github.io/kodeWeave/)**  
> Lightweight, fast, and designed for accessibility across devices. No build step required.

## 🚨 Project Status
> **Actively in development — NOT a PWA yet**  
> Initial version is web-based only. PWA support and full feature set are coming in future updates.

## 🚀 Launch the App
🌍 Try it live: [PropForge Simulator](https://michaelsboost.github.io/PropForge/)

No installation required. Fully browser-based!

## 🛠️ Key Features  

### **📊 Challenge System**
- **Phase-based training** (Phase 1 → Phase 2).
- Simulates funded account progression from **$25K to $1M**.
- Customizable **profit targets, max drawdown, and lot limits**.
- Tracks **open P&L**, **daily P&L**, and **challenge progress**.

### **🔁 Reset & Advancement Logic**
- Challenge resets automatically if max total loss is breached.
- Upon meeting profit target:
  - Advance to next phase (Phase 1 → Phase 2)
  - Next challenge tier unlocks ($25K → $50K → … → $1M)
- Clear messaging and animated banners upon completion.

### **🧠 Realistic Trade Mechanics**
- Supports:
  - **Micro/Nano contracts**
  - **Stop Loss (SL)** and **Take Profit (TP)**
  - **Scaling**, **flipping positions**, **unrealized P&L**, and **margin management**

Enforcement of **lot restrictions** and **margin usage**

Error handling to ensure the app never freezes after all phases are complete

### **📉 Real-Time Simulation**
- **Live candlestick chart** with simulated price ticks
- Trade placement, SL/TP evaluation, and floating P&L
- Auto-update of **phase progress**, **tier progress**, and **trading stats**

## 🗂️ Planned Features (TODO)  
Coming soon to PropForge:

* **📐 Drawing Tools** – Trendlines, support/resistance zones, channels, and freehand drawing (like TradingView)
* **📊 Indicators** – Swing highs/lows, auto S/R, and lightweight moving averages (for bots and user reference)
* **🤖 Strategy Bots** – Visual trading bots that simulate real methods:
  - ICT Ghost, FVG Sniper, Price Action Pro
  - Trend Trader, S/R Hunter, Breakout Bot, Structure Bot, Scalper
* **🏆 Leaderboard** – Compare your stats to each bot: ROI, win rate, drawdown, and more

(No replay system — built to run fast and store data locally)

## ⚡ **Getting Started**
### **1️⃣ Install & Run Locally**
```sh
# Clone the repository
git clone https://github.com/michaelsboost/PropForge.git
cd PropForge

# Open index.html in a browser
```

### **2️⃣ Dependencies**
- [Tailwind](https://tailwindcss.com/) + [Pico CSS](https://picocss.com/) for styling
- Vanilla JS – No frameworks, just pure JavaScript
- [kodeWeave](https://michaelsboost.github.io/kodeWeave/) – Used for all prototyping and building

## 🧠 Contributing
PropForge is open for contribution!  

- Fork the repository
- Create a new branch: (`feature/add-chart-tools`)
- Submit a Pull Request

Contributors welcome!

## 📜 License
Licensed under the MIT License — free to use, remix, and distribute.

Developed by: [Michael Schwartz](https://michaelsboost.com/)  
Maintained by: The open-source community

## **☕ Support This Project**
If PropForge was helpful for you, consider showing your appreciation in the following ways:

- 🎨 Check out my Graphic Design Course: https://michaelsboost.com/graphicdesign  
- 🛒 Register as a customer on my store: https://michaelsboost.com/store  
- ☕ Buy me a coffee: http://ko-fi.com/michaelsboost  
- 👕 Purchase a T-Shirt: https://michaelsboost.com/gear  
- 🖼️ Buy my art prints: https://deviantart.com/michaelsboost/prints 
- 💰 Donate via PayPal: https://michaelsboost.com/donate 
- 💵 Donate via Cash App: https://cash.me/$michaelsboost  

Your support is greatly appreciated and helps fund this & future projects! 🚀