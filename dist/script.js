/*
=== TODOS ===

1. 🤖 Bot Strategy Visualization:
   - Implement visualization of how bots (ICT, FVG, Price Action, etc.) are currently trading
     the chart using their actual strategy logic — ideally show trades in real time or ghost lines.

2. ✏️ Chart Drawing Tools:
   - Add drawing tools:
     - Trendlines
     - Support/Resistance Zones
     - Channels
     - Free-hand/manual drawing (lines should lock to candles and scroll with the chart like TradingView)
*/

// === PHASE CONFIGURATION ===
const Phases = {
  "25k_phase1": {
    name: "25K Challenge - Phase 1",
    target: 1250,
    maxLoss: 1500,
    maxLots: 4,
    startBalance: 25000,
    next: "25k_phase2"
  },
  "25k_phase2": {
    name: "25K Challenge - Phase 2 (Sim Funded)",
    target: 1250,
    maxLoss: 1500,
    maxLots: 4,
    startBalance: 25000,
    next: "50k_phase1"
  },
  "50k_phase1": {
    name: "50K Challenge - Phase 1",
    target: 2500,
    maxLoss: 3000,
    maxLots: 6,
    startBalance: 50000,
    next: "50k_phase2"
  },
  "50k_phase2": {
    name: "50K Challenge - Phase 2 (Sim Funded)",
    target: 2500,
    maxLoss: 3000,
    maxLots: 6,
    startBalance: 50000,
    next: "100k_phase1"
  },
  "100k_phase1": {
    name: "100K Challenge - Phase 1",
    target: 6000,
    maxLoss: 6000,
    maxLots: 12,
    startBalance: 100000,
    next: "100k_phase2"
  },
  "100k_phase2": {
    name: "100K Challenge - Phase 2 (Sim Funded)",
    target: 6000,
    maxLoss: 6000,
    maxLots: 12,
    startBalance: 100000,
    next: "150k_phase1"
  },
  "150k_phase1": {
    name: "150K Challenge - Phase 1",
    target: 9000,
    maxLoss: 7500,
    maxLots: 15,
    startBalance: 150000,
    next: "150k_phase2"
  },
  "150k_phase2": {
    name: "150K Challenge - Phase 2 (Sim Funded)",
    target: 9000,
    maxLoss: 7500,
    maxLots: 15,
    startBalance: 150000,
    next: "300k_phase1"
  },
  "300k_phase1": {
    name: "300K Challenge - Phase 1",
    target: 18000,
    maxLoss: 12000,
    maxLots: 25,
    startBalance: 300000,
    next: "300k_phase2"
  },
  "300k_phase2": {
    name: "300K Challenge - Phase 2 (Sim Funded)",
    target: 18000,
    maxLoss: 12000,
    maxLots: 25,
    startBalance: 300000,
    next: "1m_phase1"
  },
  "1m_phase1": {
    name: "1M Challenge - Phase 1",
    target: 40000,
    maxLoss: 25000,
    maxLots: 40,
    startBalance: 1000000,
    next: "1m_phase2"
  },
  "1m_phase2": {
    name: "1M Challenge - Phase 2 (Sim Funded)",
    target: 40000,
    maxLoss: 25000,
    maxLots: 40,
    startBalance: 1000000,
    next: null
  }
};

// === CORE MODULE ===
const Core = (() => {
  const state = {
    phase: "25k_phase1",
    balance: 25000,
    marginUsed: 0,
    contract: 'mini',
    lotSize: 1,
    stopLoss: 10,
    takeProfit: 10,
    trades: [],
    openTrades: [],
    currentPrice: 4215.25,
    todayPNL: 0,
    justAdvanced: false,
    isFullyTrained: false,
    challenge: {
      phase: 1,
      level: '25K',
      profitTarget: 1250,
      maxTotalLoss: 1500,
      startingBalance: 25000,
      phaseProgress: 0
    },
    candles: (() => {
      const candles = [];
      let price = 4200;
      let trend = 1;
      for (let i = 0; i < 100; i++) {
        const volatility = 3;
        const open = price;
        const bodySize = Math.random() * volatility;
        const direction = Math.random() > 0.3 ? trend : -trend;
        const close = open + bodySize * direction;
        const high = Math.max(open, close) + Math.random();
        const low = Math.min(open, close) - Math.random();
        price = close;
        trend = direction;
        candles.push({ open, close, high, low, timestamp: Date.now() - (1000 * (100 - i)) });
      }
      return candles;
    })(),
  };

  function resetChallenge() {
    const currentPhase = Core.state.phase;
    const config = Phases[currentPhase];
  
    alert("🚨 Max total loss exceeded. Resetting the challenge...");
  
    Core.state.balance = config.startBalance;
    Core.state.marginUsed = 0;
    Core.state.trades = [];
    Core.state.openTrades = [];
    Core.state.todayPNL = 0;
  
    Core.state.challenge = {
      phase: 1,
      level: '25K',
      profitTarget: 1250,
      maxTotalLoss: 1500,
      startingBalance: 25000,
      speed: 'tick',
      phaseProgress: 0
    };
  
    Stats.update(Core.state);
    Chart.draw(Core.state);
  }

  function resetPhase() {
    const config = Phases[state.phase];
    state.balance = config.startBalance;
    state.marginUsed = 0;
    state.trades = [];
    state.openTrades = [];
    state.todayPNL = 0;
  }

  function showPhaseCompleteBanner(challenge) {
    // ✅ Prevent override if user has fully completed all training
    if (Core.state.isFullyTrained) return;
      
    const banner = document.getElementById("phase-complete-banner");
    if (!banner) return;
  
    banner.textContent = `✅ ${challenge.level} Phase ${challenge.phase} Complete!`;
  
    banner.classList.remove("hidden", "opacity-0");
    banner.classList.add("opacity-100");
  
    setTimeout(() => {
      banner.classList.add("opacity-0");
      setTimeout(() => banner.classList.add("hidden"), 500);
    }, 3000);
  }

  function advancePhase() {
    const currentPhaseKey = Core.state.phase;
    const currentPhase = Phases[currentPhaseKey];
    const nextPhaseKey = currentPhase?.next;
  
    Core.state.justAdvanced = true;
  
    // ✅ Exit if there's no next phase
    if (!nextPhaseKey) {
      if (!Core.state.isFullyTrained) {
        const banner = document.getElementById("phase-complete-banner");
        if (banner) {
          banner.textContent = "🎯 Training complete! You're now ready to take on a real prop firm challenge.";
          banner.classList.remove("hidden", "opacity-0");
          banner.classList.add("opacity-100");
  
          setTimeout(() => {
            banner.classList.add("opacity-0");
            setTimeout(() => banner.classList.add("hidden"), 500);
          }, 4000);
  
          Core.state.isFullyTrained = true; // ✅ Flag prevents banner spam
        }
      }
  
      Core.state.justAdvanced = false;
      return;
    }
  
    // Move to next phase config
    const nextConfig = Phases[nextPhaseKey];
    Core.state.phase = nextPhaseKey;
  
    Core.state.balance = nextConfig.startBalance;
    Core.state.marginUsed = 0;
    Core.state.trades = [];
    Core.state.openTrades = [];
    Core.state.todayPNL = 0;
  
    Core.state.challenge = {
      phase: nextConfig.name.includes("Phase 1") ? 1 : 2,
      level: nextConfig.name.split(" ")[0].replace("K", "K"), // e.g. '50K'
      profitTarget: nextConfig.target,
      maxTotalLoss: nextConfig.maxLoss,
      startingBalance: nextConfig.startBalance,
      phaseProgress: 0
    };
    
    setTimeout(() => {
      Core.state.justAdvanced = false;
    }, 1500);
  
    Stats.update(Core.state);
  }

  function evaluatePhaseRules() {
    if (state.justAdvanced) return;
  
    const config = Phases[state.phase];
    if (!config) return; // ✅ Prevent error after all phases done
  
    const totalProfit = state.balance - config.startBalance;
  
    // Max loss enforcement (if desired)
    if (state.balance <= config.startBalance - config.maxLoss) {
      alert("🚨 Challenge failed. Restarting 25K Phase 1.");
      Core.state.phase = "25k_phase1";
      resetPhase();
      return;
    }
  
    // ✅ Profit Target Met
    if (totalProfit >= config.target) {
      Core.state.justAdvanced = true;
      showPhaseCompleteBanner(Core.state.challenge);
      advancePhase();
    }
  }

  function simulateTick() {
    const { challenge } = state;
  
    // Adjust volatility based on speed
    let changeFactor = 2;
  
    // Simulate price change
    const change = (Math.random() * changeFactor - changeFactor / 2).toFixed(2);
    state.currentPrice = parseFloat((state.currentPrice + parseFloat(change)).toFixed(2));
  
    const last = state.candles[state.candles.length - 1];
    const now = Date.now();
  
    if (!last || now - last.timestamp > 1000) {
      state.candles.push({
        open: state.currentPrice,
        high: state.currentPrice,
        low: state.currentPrice,
        close: state.currentPrice,
        timestamp: now
      });
    } else {
      last.high = Math.max(last.high, state.currentPrice);
      last.low = Math.min(last.low, state.currentPrice);
      last.close = state.currentPrice;
    }
  
    if (state.candles.length > 200) state.candles.shift();
  
    Trades.evaluate(state); // triggers daily loss check
    evaluatePhaseRules();   // handles progress/advancement

    // === Check unrealized + realized loss total
    const floatingLoss = state.openTrades.reduce((acc, trade) => {
      const entry = trade.entry;
      const current = state.currentPrice;
      const unrealized = trade.type === 'buy'
        ? (current - entry)
        : (entry - current);
    
      return acc + (unrealized * trade.qty * trade.contractValue);
    }, 0);
    
    const totalLoss = state.challenge.startingBalance - (state.balance + floatingLoss);
    
    if (totalLoss >= state.challenge.maxTotalLoss) {
      resetChallenge();
      return; // Stop this tick from continuing
    }

    Stats.update(state);
    Chart.draw(state);
  }

  setInterval(simulateTick, 100);

  return { state, resetPhase, advancePhase };
})();

// === CHART MODULE ===
const Chart = (() => {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  let scaleX = 1;
  let offsetX = 0;
  let isDragging = false;
  let lastX = 0;
  let selectedLine = null;
  let dragOffset = 0;

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scaleX *= delta;
    scaleX = Math.max(0.5, Math.min(scaleX, 10));
  });

  function getXYFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function handleDown(e) {
    const { x, y } = getXYFromEvent(e);
    selectedLine = null;

    const state = Core.state;
    const height = canvas.height;
    const padding = 10;
    const viewCount = Math.floor(60 / scaleX);
    const start = Math.max(0, state.candles.length - viewCount - Math.floor(offsetX));
    const candles = state.candles.slice(start, start + viewCount);
    let max = Math.max(...candles.map(c => c.high));
    let min = Math.min(...candles.map(c => c.low));
    const priceBuffer = (max - min) * 0.05;
    max += priceBuffer;
    min -= priceBuffer;

    state.openTrades.forEach(trade => {
      max = Math.max(max, trade.entry, trade.stop, trade.target);
      min = Math.min(min, trade.entry, trade.stop, trade.target);
    });

    const scaleY = (height - 2 * padding) / (max - min);

    state.openTrades.forEach(trade => {
      const test = (price, key) => {
        const py = height - (price - min) * scaleY - padding;
        const tolerance = e.touches ? 10 : 6;
        if (Math.abs(py - y) < tolerance) {
          selectedLine = { trade, key };
          dragOffset = py - y;
        }
      };
      test(trade.stop, 'stop');
      test(trade.target, 'target');
    });

    if (!selectedLine) {
      isDragging = true;
      lastX = e.touches ? e.touches[0].clientX : e.clientX;
    }
  }

  function handleUpLeave() {
    isDragging = false;
    selectedLine = null;
  }

  function handleMove(e) {
    if (!canvas) return;

    const state = Core.state;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const y = clientY - rect.top;

    const height = canvas.height;
    const padding = 10;
    const viewCount = Math.floor(60 / scaleX);
    const start = Math.max(0, state.candles.length - viewCount - Math.floor(offsetX));
    const candles = state.candles.slice(start, start + viewCount);
    let max = Math.max(...candles.map(c => c.high));
    let min = Math.min(...candles.map(c => c.low));
    const priceBuffer = (max - min) * 0.05;
    max += priceBuffer;
    min -= priceBuffer;

    state.openTrades.forEach(trade => {
      max = Math.max(max, trade.entry, trade.stop, trade.target);
      min = Math.min(min, trade.entry, trade.stop, trade.target);
    });

    const scaleY = (height - 2 * padding) / (max - min);

    if (selectedLine) {
      e.preventDefault();
      const newPrice = ((height - (y + dragOffset) - padding) / scaleY) + min;
      selectedLine.trade[selectedLine.key] = parseFloat(newPrice.toFixed(2));
    } else if (isDragging) {
      const dx = clientX - lastX;
      offsetX += dx / 5;
      offsetX = Math.max(0, Math.min(offsetX, 200));
      lastX = clientX;
    }
  }

  canvas.addEventListener("mousedown", handleDown);
  canvas.addEventListener("touchstart", handleDown);
  canvas.addEventListener("mousemove", handleMove);
  canvas.addEventListener("touchmove", handleMove, { passive: false });
  canvas.addEventListener("mouseup", handleUpLeave);
  canvas.addEventListener("touchend", handleUpLeave);
  canvas.addEventListener("mouseleave", handleUpLeave);
  canvas.addEventListener("touchcancel", handleUpLeave); // 🔵 Support touchcancel

  function draw(state) {
    if (!canvas || !ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    const labelMargin = 60;

    ctx.clearRect(0, 0, width, height);

    const viewCount = Math.floor(60 / scaleX);
    const start = Math.max(0, state.candles.length - viewCount - Math.floor(offsetX));
    const candles = state.candles.slice(start, start + viewCount);
    if (candles.length < 2) return;

    let max = Math.max(...candles.map(c => c.high));
    let min = Math.min(...candles.map(c => c.low));
    const priceBuffer = (max - min) * 0.05;
    max += priceBuffer;
    min -= priceBuffer;

    state.openTrades.forEach(trade => {
      max = Math.max(max, trade.entry, trade.stop, trade.target);
      min = Math.min(min, trade.entry, trade.stop, trade.target);
    });

    const scaleY = (height - 2 * padding) / (max - min);
    const candleWidth = (width - labelMargin) / candles.length;

    // Grid
    ctx.strokeStyle = "#333";
    ctx.fillStyle = "#888";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const y = padding + ((height - 2 * padding) * i / steps);
      const price = max - ((max - min) * i / steps);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.fillText(price.toFixed(2), width - 4, y);
    }

    // Candles
    candles.forEach((c, i) => {
      const x = i * candleWidth;
      const openY = height - (c.open - min) * scaleY - padding;
      const closeY = height - (c.close - min) * scaleY - padding;
      const highY = height - (c.high - min) * scaleY - padding;
      const lowY = height - (c.low - min) * scaleY - padding;

      const isBullish = c.close >= c.open;
      ctx.strokeStyle = isBullish ? "#089a81" : "#f33645";
      ctx.fillStyle = isBullish ? "#089a81" : "#f33645";

      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      const bodyTop = isBullish ? closeY : openY;
      const bodyHeight = Math.max(1, Math.abs(openY - closeY));
      ctx.fillRect(x + 1, bodyTop, candleWidth - 2, bodyHeight);
    });

    // Trade Lines
    state.openTrades.forEach(trade => {
      const drawLine = (price, color, label, key) => {
        const y = height - (price - min) * scaleY - padding;

        ctx.strokeStyle = (selectedLine && selectedLine.trade === trade && selectedLine.key === key)
          ? "#ff0" // Highlight if being dragged
          : color;

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        let dollar = '';
        if (label === 'SL' || label === 'TP') {
          const delta = price - trade.entry;
          const isProfit = label === 'TP' ? 1 : -1;
          const pnl = delta * trade.contractValue * trade.qty * isProfit;
          const sign = pnl >= 0 ? '+' : '';
          dollar = ` → ${sign}$${pnl.toFixed(2)}`;
        }

        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${label} ${price.toFixed(2)}${dollar}`, 8, y - 4);
      };

      drawLine(trade.entry, trade.type === 'buy' ? '#0f0' : '#f00', 'Entry');
      drawLine(trade.stop, '#888', 'SL', 'stop');
      drawLine(trade.target, '#888', 'TP', 'target');
    });

    // Live Price Box
    const liveY = height - (state.currentPrice - min) * scaleY - padding;
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(width - labelMargin, liveY - 10, 55, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0ff";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(state.currentPrice.toFixed(2), width - labelMargin + 27.5, liveY);
  }

  return { draw };
})();

// === TRADES MODULE ===
const Trades = (() => {
  function showTradeMessage(msg) {
    const el = document.getElementById("tradeMessage");
    if (el) {
      el.textContent = msg;
      setTimeout(() => { el.textContent = ""; }, 3000);
    }
  }

  function placeFreeModeTrade(type, state, lot, entry) {
    const contract = state.contract === 'micro' ? 2.0 : 20.0;
    const margin = state.contract === 'micro' ? 500 : 10000;
    const requiredMargin = lot * margin;
    const availableMargin = state.balance - state.marginUsed;
  
    if (requiredMargin > availableMargin) {
      showTradeMessage(`❌ Not enough margin: Need $${requiredMargin}, Have $${availableMargin}`);
      return;
    }
  
    const trade = {
      type,
      qty: lot,
      entry,
      stop: type === 'buy' ? entry - state.stopLoss : entry + state.stopLoss,
      target: type === 'buy' ? entry + state.takeProfit : entry - state.takeProfit,
      entryTime: Date.now(),
      contractValue: contract,
      marginRequired: requiredMargin
    };
  
    state.openTrades.push(trade);
    state.marginUsed += requiredMargin;
    showTradeMessage(`✅ Placed ${type} (Free Mode)`);
  }

  function place(type, state) {
    const entry = state.currentPrice;
    const lot = state.lotSize;
    const config = Phases[state.phase] || null;
    const totalLots = state.openTrades.reduce((sum, t) => sum + t.qty, 0) + lot;
    
    // === ⛑️ If fully trained, allow unlimited lots ===
    if (!config && Core.state.isFullyTrained) {
      return placeFreeModeTrade(type, state, lot, entry);
    }
    
    if (totalLots > config.maxLots) {
      showTradeMessage(`❌ Max lot size exceeded: Limit is ${config.maxLots}, Attempted ${totalLots}`);
      return;
    }

    // 🧠 Explanation:
    // If MNQ moves from 14,000.00 to 14,001.00, you earn/lose $2 per contract.
    // If NQ moves from 14,000.00 to 14,001.00, you earn/lose $20 per contract.

    const contract = state.contract === 'micro' ? 2.0 : 20.0;
    const margin = state.contract === 'micro' ? 500 : 10000;

    const opposing = state.openTrades.find(t => t.type !== type);
    const sameSide = state.openTrades.find(t => t.type === type);

    const availableMargin = state.balance - state.marginUsed;

    // === 1. Reduce or Reverse Existing Opposing Position ===
    if (opposing) {
      let remaining = lot;
      for (let i = 0; i < state.openTrades.length && remaining > 0; i++) {
        const trade = state.openTrades[i];
        if (trade.type !== type) {
          const closeQty = Math.min(remaining, trade.qty);
          const pnl = (type === 'buy'
            ? (entry - trade.entry)
            : (trade.entry - entry)) * closeQty * trade.contractValue;

          state.trades.push({
            ...trade,
            exit: entry,
            pnl,
            qty: closeQty,
            duration: Date.now() - trade.entryTime,
            exitReason: 'Reduced',
            time: new Date().toLocaleTimeString()
          });

          trade.qty -= closeQty;
          state.marginUsed -= closeQty * margin;
          state.balance += pnl;
          remaining -= closeQty;
        }
      }

      // Remove empty trades
      state.openTrades = state.openTrades.filter(t => t.qty > 0);

      // If leftover, treat as new entry (flipping position)
      if (remaining > 0) {
        const requiredMargin = remaining * margin;
        if (requiredMargin > (state.balance - state.marginUsed)) {
          showTradeMessage(`❌ Not enough margin: Need $${requiredMargin}, Have $${availableMargin}`);
          return;
        }

        const newTrade = {
          type,
          qty: remaining,
          entry,
          stop: type === 'buy' ? entry - state.stopLoss : entry + state.stopLoss,
          target: type === 'buy' ? entry + state.takeProfit : entry - state.takeProfit,
          entryTime: Date.now(),
          contractValue: contract,
          marginRequired: requiredMargin
        };

        state.openTrades.push(newTrade);
        state.marginUsed += requiredMargin;
      }

      return;
    }

    // === 2. Add to Same-Side Position ===
    if (sameSide) {
      const additionalMargin = lot * margin;
      if (additionalMargin > availableMargin) {
        showTradeMessage(`❌ Not enough margin to scale in: Need $${additionalMargin}, Have $${availableMargin}`);
        return;
      }

      const totalQty = sameSide.qty + lot;
      sameSide.entry = ((sameSide.entry * sameSide.qty) + (entry * lot)) / totalQty;
      sameSide.qty = totalQty;
      sameSide.stop = type === 'buy'
        ? sameSide.entry - state.stopLoss
        : sameSide.entry + state.stopLoss;
      sameSide.target = type === 'buy'
        ? sameSide.entry + state.takeProfit
        : sameSide.entry - state.takeProfit;
      sameSide.marginRequired += additionalMargin;
      state.marginUsed += additionalMargin;
      return;
    }

    // === 3. New Trade (First Entry) ===
    const requiredMargin = lot * margin;
    if (requiredMargin > availableMargin) {
      showTradeMessage(`❌ Not enough margin: Need $${requiredMargin}, Have $${availableMargin}`);
      return;
    }

    const trade = {
      type,
      qty: lot,
      entry,
      stop: type === 'buy' ? entry - state.stopLoss : entry + state.stopLoss,
      target: type === 'buy' ? entry + state.takeProfit : entry - state.takeProfit,
      entryTime: Date.now(),
      contractValue: contract,
      marginRequired: requiredMargin
    };

    state.openTrades.push(trade);
    state.marginUsed += requiredMargin;
  }

  function evaluate(state) {
    const now = Date.now();
    state.openTrades = state.openTrades.filter(trade => {
      const current = state.currentPrice;
      const hitTP = trade.type === 'buy' ? current >= trade.target : current <= trade.target;
      const hitSL = trade.type === 'buy' ? current <= trade.stop : current >= trade.stop;

      if (hitTP || hitSL) {
        const exit = current;
        const pnl = (trade.type === 'buy'
          ? (exit - trade.entry)
          : (trade.entry - exit)) * trade.qty * trade.contractValue;

        state.trades.push({
          ...trade,
          exit,
          pnl,
          duration: now - trade.entryTime,
          exitReason: hitTP ? 'TP' : 'SL',
          time: new Date().toLocaleTimeString()
        });

        state.marginUsed -= trade.marginRequired;
        state.balance += pnl;
        return false;
      }

      return true;
    });
  }

  return { place, evaluate };
})();

// === STATS + UI MODULE ===
const Stats = (() => {
  let lastTradeCount = 0;

  function updateIfChanged(id, newValue) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== newValue) {
      el.textContent = newValue;
    }
  }

  function updateTierUI() {
    const ch = Core.state.challenge;
    const tiers = ["25K", "50K", "100K", "150K", "300K", "500K", "1M"];
    const index = tiers.indexOf(ch.level);
    const next = tiers[index + 1];

    const tierProgress = ((index + 1) / tiers.length) * 100;
    document.getElementById("tier-progress").style.width = `${tierProgress}%`;
    updateIfChanged("tier-progress-text", `${index + 1}/${tiers.length}`);

    const hint = next
      ? `Unlocks $${next} Challenge with higher limits`
      : `All challenges completed`;
    updateIfChanged("next-tier-hint", hint);

    const desc = next
      ? `Complete ${tiers.filter(t => t === ch.level).length}x $${ch.level} Challenges`
      : `All challenges completed`;
    const descEl = document.querySelector(".trading-card .text-sm.mb-1");
    if (descEl && descEl.textContent !== desc) {
      descEl.textContent = desc;
    }
  }

  function update(state) {
    const ch = state.challenge;

    const profit = state.balance - ch.startingBalance;
    const phaseProgress = Math.min(100, (profit / ch.profitTarget) * 100);

    const tiers = ["25K", "50K", "100K", "150K", "300K", "500K", "1M"];
    const index = tiers.indexOf(ch.level);
    const tierProgress = (index / tiers.length) * 100;

    document.querySelector(".progress-fill").style.width = `${phaseProgress}%`;
    updateIfChanged("tier-progress", `${tierProgress}%`);
    updateIfChanged("tier-progress-text", `${index + 1}/${tiers.length}`);
    updateIfChanged("account-tier", `$${ch.level} Challenge`);
    updateIfChanged("account-phase", `Phase ${ch.phase}/2`);
    document.querySelector(".bg-purple-600 span").textContent = ch.phase;

    updateIfChanged("challenge-title", Core.state.isFullyTrained
      ? "🎉 Free Mode (No Restrictions)"
      : "Current Challenge");

    if (Core.state.isFullyTrained) {
      updateIfChanged("profit-target", `🎯 Training complete`);
      updateIfChanged("total-loss", `∞`);
      updateIfChanged("max-lots", `∞`);
    } else {
      const phase = Phases[Core.state.phase];
      updateIfChanged("profit-target", `$${ch.profitTarget.toLocaleString()}`);
      updateIfChanged("total-loss", `$${ch.maxTotalLoss.toLocaleString()}`);
      updateIfChanged("max-lots", `${phase.maxLots}`);
    }

    updateTierUI();

    updateIfChanged("current-profit", `$${profit.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`);

    const openPNL = state.openTrades.reduce((acc, trade) => {
      const delta = trade.type === 'buy'
        ? (state.currentPrice - trade.entry)
        : (trade.entry - state.currentPrice);
      return acc + (delta * trade.qty * trade.contractValue);
    }, 0);

    updateIfChanged("open-pnl", `$${openPNL.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`);

    updateIfChanged("balance", `$${state.balance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`);

    updateIfChanged("lotSizeDisplay", Core.state.lotSize.toString());

    updateIfChanged("marginUsed", `$${state.marginUsed.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`);

    updateIfChanged("availableMargin", `$${(state.balance - state.marginUsed).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`);

    const wins = state.trades.filter(t => t.pnl > 0);
    const total = state.trades.length;
    const winRate = total ? ((wins.length / total) * 100).toFixed(1) + '%' : '0%';

    updateIfChanged("totalTrades", total.toString());
    updateIfChanged("winlossratio", winRate);

    // Only update trade history table if trade count changed
    if (total !== lastTradeCount) {
      lastTradeCount = total;
      const historyEl = document.getElementById("history").querySelector("tbody");
      historyEl.innerHTML = state.trades.map(t => `
        <tr>
          <td>${t.time}</td>
          <td>${t.type}</td>
          <td>${t.qty}</td>
          <td>${t.entry.toFixed(2)}</td>
          <td>${t.exit.toFixed(2)}</td>
          <td style="color:${t.pnl >= 0 ? 'limegreen' : 'red'}">${t.pnl.toFixed(2)}</td>
          <td>${(t.duration / 1000).toFixed(1)}s</td>
          <td>${t.exitReason || 'Manual'}</td>
        </tr>
      `).reverse().join("");
    }
  }

  return { update };
})();

function adjustLotSize(delta) {
  const config = Phases[Core.state.phase];
  const newSize = Core.state.lotSize + delta;

  if (Core.state.isFullyTrained) {
    if (!config) return; // No phase config = end of training, skip challenge logic
  }

  if (newSize < 1) {
    alert("❌ Lot size can't be less than 1");
    return;
  }

  if (newSize > config.maxLots) {
    alert(`❌ Lot size can't exceed max allowed: ${config.maxLots}`);
    return;
  }

  Core.state.lotSize = newSize;
  document.getElementById("lotSizeDisplay").textContent = newSize;

  // Sync radio buttons
  document.querySelectorAll('input[name="lot"]').forEach(radio => {
    radio.checked = parseInt(radio.value) === newSize;
  });
}

// === INPUT EVENT HANDLERS ===
document.querySelectorAll('input[name="contract"]').forEach(radio => {
  radio.addEventListener('change', () => {
    Core.state.contract = radio.value;
  });
});
document.querySelectorAll('input[name="lot"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const selected = parseInt(radio.value);
    const maxAllowed = Phases[Core.state.phase].maxLots;

    if (selected > maxAllowed) {
      // Revert the change and notify the user
      radio.checked = false;
      alert(`❌ Max allowed lot size: ${maxAllowed}`);
      
      // Optionally reset to a valid value (like 1)
      Core.state.lotSize = Math.min(Core.state.lotSize, maxAllowed);
      document.getElementById("lotSizeDisplay").textContent = Core.state.lotSize;

      // Uncheck all radios
      document.querySelectorAll('input[name="lot"]').forEach(r => r.checked = false);

      // Re-check current valid lot size if matching one exists
      document.querySelectorAll('input[name="lot"]').forEach(r => {
        if (parseInt(r.value) === Core.state.lotSize) r.checked = true;
      });
    } else {
      // Accept the new size
      Core.state.lotSize = selected;
      document.getElementById("lotSizeDisplay").textContent = selected;
    }
  });
});

document.getElementById("stopLossAmount").addEventListener('input', (e) => {
  Core.state.stopLoss = parseFloat(e.target.value);
});
document.getElementById("takeProfitAmount").addEventListener('input', (e) => {
  Core.state.takeProfit = parseFloat(e.target.value);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "+" || e.key === "=") adjustLotSize(1);
  if (e.key === "-" || e.key === "_") adjustLotSize(-1);
  if (e.key.toLowerCase() === "b") Trades.place("buy", Core.state);
  if (e.key.toLowerCase() === "s") Trades.place("sell", Core.state);
  if (e.key.toLowerCase() === "x") {
    document.getElementById("close").click();
  }

  // hotkey for pass / fail test
  // if (e.shiftKey && e.key.toLowerCase() === "h") {
  //   const config = Phases[Core.state.phase];
  //   Core.state.balance = config.startBalance + parseInt(config.target / 1.05);
  //   Stats.update(Core.state);
  // }
  // if (e.shiftKey && e.key.toLowerCase() === "p") {
  //   const config = Phases[Core.state.phase];
  //   Core.state.balance = config.startBalance + config.target + 1;
  //   Stats.update(Core.state);
  // }
  // if (e.shiftKey && e.key.toLowerCase() === "f") {
  //   const config = Phases[Core.state.phase];
  //   Core.state.balance = config.startBalance - config.maxLoss - 1;
  //   Stats.update(Core.state);
  // }
});

// === BUTTON EVENT HANDLERS ===
document.getElementById("buy").addEventListener("click", () => {
  Trades.place("buy", Core.state);
});
document.getElementById("sell").addEventListener("click", () => {
  Trades.place("sell", Core.state);
});
document.getElementById("close").addEventListener("click", () => {
  const state = Core.state;
  const now = Date.now();

  state.openTrades.forEach(trade => {
    const current = state.currentPrice;
    const pnl = (trade.type === 'buy'
      ? (current - trade.entry)
      : (trade.entry - current)) * trade.qty * trade.contractValue;

    state.trades.push({
      ...trade,
      exit: current,
      pnl,
      duration: now - trade.entryTime,
      exitReason: 'Manual',
      time: new Date().toLocaleTimeString()
    });

    state.marginUsed -= trade.marginRequired;
    state.balance += pnl;
  });

  state.openTrades = [];
  Stats.update(state);
});

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("lotDecrease").addEventListener("click", () => adjustLotSize(-1));
  document.getElementById("lotIncrease").addEventListener("click", () => adjustLotSize(1));
  
  document.querySelector(`input[name="contract"][value="${Core.state.contract}"]`).checked = true;
  document.getElementById("lotSizeDisplay").textContent = Core.state.lotSize;
  document.querySelector(`input[name="lot"][value="${Core.state.lotSize}"]`).checked = true;
  document.getElementById("stopLossAmount").value = Core.state.stopLoss;
  document.getElementById("takeProfitAmount").value = Core.state.takeProfit;
});
