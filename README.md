### 🧘‍♀️ Alpha Break – Your Pragmatic Productivity Partner  
Alpha Break is a personalised AI-powered desktop dApp that helps you take smart breaks — just like a lion 🦁.  

---

### 🧠 What It Does  
- Monitors your typing speed and screen activity (mouse, scroll, keyboard)  
- Learns your personal productivity rhythm over time  
- When you're slowing down or zoning out, it gently prompts a break  
- If you confirm taking one, it rewards you with a random Alpha Lion NFT  
- All with privacy-first logic, using a confidential smart contract on **Oasis Sapphire**  

🔗 [Smart contract on Sourcify (verified)](https://repo.sourcify.dev/23295/0xE7C26A71423DB1D97D3d7D39cB803e89f05D61bb)

---

### 💡 Why It Matters  
Smart people don’t wait until total exhaustion to rest. They pause strategically — when energy drops into the *orange zone* — because pushing beyond that leads to bad decisions, wasted time, and eventual burnout.  

**Alpha Break is here to end toxic productivity culture.**  
It doesn’t nag you every 20 minutes like Pomodoro timers. It nudges you *only when your own behavior shows you're slipping*.  

⚡ It’s ultra-personalised.  
🛡️ It’s privacy-first.  
🎯 It’s designed to help you get more done — by knowing when to stop.  

---

### 🛠️ Built With  
- **Electron** – for the desktop app shell (Windows/macOS/Linux)  
- **Thirdweb** – to interact with smart contracts (including NFT minting)  
- **Oasis Sapphire Testnet** – for private, confidential logic in the smart contract  
- **Hardhat** – to write, compile, and deploy the Solidity contract  
- **Sourcify** – to verify and publish the smart contract  
- **JavaScript** – logic, local AI-ish heuristics  
- **HTML/CSS** – frontend popup UI  
- **Node.js** – backend scripting

---

### 🛸 Features In Action  
- 📉 Tracks slow typing, long idle gaps, low scroll activity  
- 🧠 Learns your baseline productivity over time  
- 🔐 Falls back to smart contract if local conditions are unclear  
- 💬 Shows a polite popup asking if you’ve taken a break  
- 🖼️ Rewards your rest with an Alpha Lion image  
- 🪙 Opens mint page for NFT claim  
- 🔇 All data stays local unless you explicitly mint  

---

### 📂 Folder Structure  
```
alpha-break/
├── assets/
│   └── lions/           # Lion reward images
├── index.html           # Frontend popup
├── main.js              # Electron main process
├── renderer.js          # Client-side logic (behavior, AI, Oasis call)
├── mint.html            # NFT minting trigger
├── smart-contract/      # Solidity + Hardhat config
└── README.md            # You're reading it!
```

---

### 🚀 How to Run Locally  
```bash
git clone https://github.com/ksenija0308/alpha-break.git
cd alpha-break
npm install
npm start
```

Then in a second terminal window (for mint page):  
```bash
npx serve
```

Visit: `http://localhost:3000/mint.html`

---

### 🔮 What’s Next  
- 💰 Enable real NFT minting on testnets (Base Sepolia live!)  
- 🔐 Add embedded wallet login with Privy  
- 🔒 Use **Oasis Sapphire confidential computing** to improve behavioral logic  
- 🎥 Submit < 3 min demo to ETHGlobal Cannes  
- 🧑‍💻 Show off how non-devs + AI can still ship amazing dApps  

---

### 🙌 Built with Love  
Made by **Ksenija** (a non-dev building during ETHGlobal Cannes 🏖️) + **ChatGPT**  
Powered by good UX, privacy-preserving smart contracts, and the belief that **rest is productive**.  


