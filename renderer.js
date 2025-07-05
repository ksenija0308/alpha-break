// renderer.js – Alpha Break (Oasis-powered & personalised)
// --------------------------------------------------------------
// 1. Tracks user activity (mousemove, keydown, scroll)
// 2. Learns the user’s own “normal” typing speed locally
// 3. Every 2 s decides if a break popup is needed
//    • personalised threshold  → fast local check
//    • confidential contract   → fallback / extra privacy
// 4. Handles NFT mint UI when the user confirms the break
// --------------------------------------------------------------

/* ───────────────────────────────────────────────────────────
   Imports & Thirdweb client
─────────────────────────────────────────────────────────── */
const { shell } = require("electron");
const {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  simulateTransaction,
} = require("thirdweb");
const { defineChain } = require("thirdweb/chains");

/* ───────────────────────────────────────────────────────────
   Contract setup (ABI + address)          ▲▲ changed ▲▲
─────────────────────────────────────────────────────────── */
const BreakAnalyzerABI = [
  {
    inputs: [
      { internalType: "uint256", name: "idleSeconds", type: "uint256" },
      { internalType: "uint256", name: "typingSpeed", type: "uint256" },
    ],
    name: "shouldPromptBreak",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
];

const CONTRACT_ADDRESS = "0xE7C26A71423DB1D97D3d7D39cB803e89f05D61bb"; // verified

// 🔐 Thirdweb client → Oasis Sapphire Testnet (chain 23295)
const client = createThirdwebClient({
  secretKey:
    "wvNjchV4gG8Fucd3kl_DcsZF2IA3afgzWzdsyLoiMrYAoDY0Gqo9ttvxCzGRYFZEmpzXj2ugAcsKUbPhgdS8Ag",
});

const contract = getContract({
  client,
  chain: defineChain(23295),
  address: CONTRACT_ADDRESS,
  abi: BreakAnalyzerABI,
});

/* ───────────────────────────────────────────────────────────
   Helper: call the confidential contract
─────────────────────────────────────────────────────────── */
async function checkWithOasis(idleSeconds, typingSpeed) {
  try {
    const tx = await prepareContractCall({
      contract,
      method: "shouldPromptBreak",
      params: [idleSeconds, typingSpeed],
    });
    const result = await simulateTransaction({ transaction: tx });
    return result === true;
  } catch (err) {
    console.error("Oasis call failed:", err);
    return false; // never nag if privacy call fails
  }
}

/* ───────────────────────────────────────────────────────────
   Personal baseline tracker (tiny “AI”)
─────────────────────────────────────────────────────────── */
const DEFAULT_BASELINE = { speedAvg: 80, samples: 0 };
let baseline =
  JSON.parse(localStorage.getItem("ab_baseline") || "null") || DEFAULT_BASELINE;

function updateBaseline(typingSpeed) {
  baseline.samples += 1;
  baseline.speedAvg += (typingSpeed - baseline.speedAvg) / baseline.samples;
  localStorage.setItem("ab_baseline", JSON.stringify(baseline));
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
  // Buttons
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

  // Periodic behaviour check (start after 10 s)
  setTimeout(() => {
    setInterval(async () => {
      const now = Date.now();
      const idleMs = now - lastActivity;
      const scrollIdleMs = now - lastScroll;

      const typingSpeed = speedWindow.filter(
        (ts) => ts > now - 60_000,
      ).length; // keystrokes/min
      updateBaseline(typingSpeed); // 🧠 learn!

      const idleSeconds = Math.floor(Math.max(idleMs, scrollIdleMs) / 1000);

      /* --------  personalised trigger  -------- */
      const speedThreshold = baseline.speedAvg * 0.7; // 70 % of personal avg
      const localTrigger =
        (idleMs > 20_000 && scrollIdleMs > 20_000) ||
        typingSpeed < speedThreshold;

      /* --------  confidential contract fallback -------- */
      let shouldPopup = localTrigger;
      if (!localTrigger) {
        shouldPopup = await checkWithOasis(idleSeconds, typingSpeed);
      }

      if (shouldPopup && !popupShown) {
        document.getElementById("popup").style.display = "block";
        popupShown = true;
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("bring-to-front");
      }
    }, 2000);
  }, 10_000);
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
    document.getElementById("popupText").textContent =
      "This is your Alpha Lion 🦁";
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
