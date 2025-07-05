// renderer.js – Alpha Break (Oasis‑powered)
// --------------------------------------------------------------
// Runs in the Electron renderer process and:
// 1. Tracks user activity (mousemove, keydown, scroll)
// 2. Every 2 s sends idleSeconds + typingSpeed to the confidential
//    BreakAnalyzer contract on Oasis Sapphire Testnet.
// 3. If the contract returns true → shows the break popup.
// 4. Handles NFT mint UI when the user confirms the break.
// --------------------------------------------------------------

/* ───────────────────────────────────────────────────────────
   Imports & Thirdweb client (CommonJS style)
─────────────────────────────────────────────────────────── */
const { shell } = require("electron");
const {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  simulateTransaction,
} = require("thirdweb");
const { defineChain } = require("thirdweb/chains");

// 🔐 Thirdweb client → Oasis Sapphire Testnet (chain 23295)
const client = createThirdwebClient({
  // secretKey is safe to expose in desktop apps; no CORS risk.
  secretKey:
    "wvNjchV4gG8Fucd3kl_DcsZF2IA3afgzWzdsyLoiMrYAoDY0Gqo9ttvxCzGRYFZEmpzXj2ugAcsKUbPhgdS8Ag",
});

const contract = getContract({
  client,
  chain: defineChain(23295), // Oasis Sapphire Testnet
  address: "0x572BfD81298DFabFB5927c0C99d701a57d6b17c8", // BreakAnalyzer
});

// Helper: call the confidential contract
async function checkWithOasis(idleSeconds, typingSpeed) {
  try {
    const tx = await prepareContractCall({
      contract,
      method: "shouldPromptBreak",
      params: [idleSeconds, typingSpeed],
    });

    // simulateTransaction = free, no wallet popup (pure fn)
    const result = await simulateTransaction({ transaction: tx });
    console.log("🧠 Oasis result:", result);
    return result === true;
  } catch (err) {
    console.error("Oasis call failed:", err);
    // Fallback: never nag user if privacy call fails
    return false;
  }
}

/* ───────────────────────────────────────────────────────────
   State variables
─────────────────────────────────────────────────────────── */
let popupShown = false;
let lastActivity = Date.now();
let lastScroll = Date.now();
let speedWindow = [];
let currentLionNumber = null;

/* ───────────────────────────────────────────────────────────
   DOM ready
─────────────────────────────────────────────────────────── */
window.onload = () => {
  // Button hooks
  document.getElementById("yesBtn").onclick = () => confirmBreak(true);
  document.getElementById("noBtn").onclick = () => confirmBreak(false);
  document.getElementById("mintBtn").onclick = () => mintLion();
  document.getElementById("cancelBtn").onclick = () => cancelMint();

  // Activity listeners
  document.addEventListener("mousemove", updateActivity);
  document.addEventListener("keydown", () => {
    updateActivity();
    speedWindow.push(Date.now());
  });
  document.addEventListener("scroll", () => {
    lastScroll = Date.now();
    popupShown = false;
  });

  // Periodic behaviour check (start after 10 s)
  setTimeout(() => {
    setInterval(async () => {
      const now = Date.now();
      const idleMs = now - lastActivity;
      const scrollIdleMs = now - lastScroll;
      const typingSpeed = speedWindow.filter((ts) => ts > now - 60000).length; // keystrokes/min

      // Convert to seconds for contract
      const idleSeconds = Math.floor(Math.max(idleMs, scrollIdleMs) / 1000);

      const shouldPopup = await checkWithOasis(idleSeconds, typingSpeed);

      if (shouldPopup && !popupShown) {
        document.getElementById("popup").style.display = "block";
        popupShown = true;
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("bring-to-front");
      }
    }, 2000);
  }, 10000);
};

function updateActivity() {
  lastActivity = Date.now();
  popupShown = false;
}

/* ───────────────────────────────────────────────────────────
   Popup flow & NFT mint UI
─────────────────────────────────────────────────────────── */
function confirmBreak(didTakeBreak) {
  if (didTakeBreak) {
    currentLionNumber = Math.floor(Math.random() * 20) + 1;
    const imagePath = `assets/lions/lion${currentLionNumber}.jpg`;
    document.getElementById("rewardImage").src = imagePath;
    document.getElementById("rewardImage").style.display = "block";
    document.getElementById("mintButtons").style.display = "block";
    document.getElementById("popupText").textContent = "This is your Alpha Lion 🦁";
    document.getElementById("yesBtn").style.display = "none";
    document.getElementById("noBtn").style.display = "none";
  } else {
    alert("Okay, maybe later 💼");
    closePopup();
  }
}

function mintLion() {
  const lion = currentLionNumber || 1;
  const filePath = `http://localhost:3000/mint.html?lion=${lion}`;
  shell.openExternal(filePath);
}

function cancelMint() {
  alert("No worries, maybe next time! 💼");
  closePopup();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("rewardImage").style.display = "none";
  document.getElementById("mintButtons").style.display = "none";
  document.getElementById("popupText").textContent = "Take a break, my dear 💖";
  document.getElementById("yesBtn").style.display = "inline-block";
  document.getElementById("noBtn").style.display = "inline-block";
  popupShown = false;
  lastActivity = Date.now();
  lastScroll = Date.now();
  speedWindow = [];
}
