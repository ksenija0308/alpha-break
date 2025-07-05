# 🧘‍♀️ Alpha Break – Your Pragmatic Productivity Partner

**Alpha Break** is a consumer dApp that helps you take smart breaks — just like a lion 🦁.

### 🧠 What it does

- Monitors user typing speed and screen activity (mouse movement, scroll)
- When signs of inactivity or slowed productivity appear, it gently nudges the user with a pop-up
- If the user confirms taking a break, they're rewarded with a randomly selected **Alpha Lion NFT image** (minting feature coming soon)

### 📈 Why it matters

Scientific studies consistently show that:

- Regular breaks enhance productivity
- Burnout is best prevented *before* exhaustion sets in (think: rest at "battery orange," not "battery red")
- Smart work, not long hours, delivers better outcomes

Alpha Break combats toxic productivity culture by rewarding *strategic* rest. Unlike rigid Pomodoro timers, it adapts break prompts to your energy flow — not every 20 minutes, but whenever your activity patterns signal the need.

### 📆 Built at ETHGlobal Cannes 2025

This app is being built as part of the ETHGlobal hackathon with:

- [Electron](https://www.electronjs.org/) for a cross-platform desktop interface
- Rule-based AI-inspired heuristics to detect fatigue (custom logic based on user behavior)
- Randomized lion images as reward placeholders (from local `assets/lions` folder)
- Future integrations: NFT minting, Privy embedded wallets, Oasis confidential computing

### 📁 Folder structure

```
alpha-break/
├── assets/
│   └── lions/           # Lion reward images
├── index.html           # Frontend UI
├── main.js              # Electron backend logic
├── package.json         # App config and scripts
└── README.md            # You're reading it!
```

### 🔮 How to run locally

1. Clone the repo:
   ```bash
   git clone https://github.com/ksenija0308/alpha-break.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```

### 🌱 What's next

- 💰 Mint real NFTs on Ethereum-compatible testnets
- 🔐 Add login and wallet connection via [Privy](https://docs.privy.io)
- 🔒 Integrate confidential data handling via [Oasis Sapphire](https://docs.oasis.io/build/sapphire/)
- 🎥 Create a demo video (< 3 mins) for ETHGlobal submission

---

Built by **Ksenija** (a non-dev!) + ChatGPT 💖 For ETHGlobal Cannes 2025 ✨

