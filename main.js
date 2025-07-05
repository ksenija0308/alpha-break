// main.js
console.log("🚀 Electron main.js starting up...");
const { app, BrowserWindow, ipcMain } = require("electron");
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { ethers } = require("ethers"); // Optional: useful for future wallet logic

let win;

/* ───────────────────────────────────────────────────────────
   1. CREATE THE ELECTRON WINDOW
─────────────────────────────────────────────────────────── */
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
  nodeIntegration: true,
  contextIsolation: false, // this is essential for Electron + module access
  enableRemoteModule: true,
},

  });

  win.loadFile("index.html");
  win.webContents.openDevTools(); // comment this out if you don’t want DevTools
}

app.whenReady().then(createWindow);

/* ───────────────────────────────────────────────────────────
   2. POP-UP FOCUSER (used by renderer)
─────────────────────────────────────────────────────────── */
ipcMain.on("bring-to-front", () => {
  if (!win) return;
  win.show();
  win.setAlwaysOnTop(true);
  win.focus();
  setTimeout(() => win.setAlwaysOnTop(false), 3000);
});

/* ───────────────────────────────────────────────────────────
   3. THIRDWEB INITIALIZATION
─────────────────────────────────────────────────────────── */
console.log("🔄 Initializing Thirdweb SDK...");

const { StaticJsonRpcProvider } = require("@ethersproject/providers");

const provider = new StaticJsonRpcProvider("https://base-sepolia-rpc.publicnode.com");

const sdk = new ThirdwebSDK(provider, {
  clientId: "5d8e28e9e3b331b914b54be503698686",
});

const contractAddress = "0xF8A8D39A72A00Ccf44790843C053a6fd94Bf56a5";
let contract;

(async () => {
  try {
    console.log("🔍 Attempting to load contract...");
    contract = await sdk.getContract(contractAddress, "nft-drop");
    console.log("✅ Thirdweb contract loaded");
  } catch (err) {
    console.error("❌ Failed to load contract:", err);
  }
})();

/* ───────────────────────────────────────────────────────────
   4. MINT HANDLER (called from renderer via ipcRenderer.invoke)
─────────────────────────────────────────────────────────── */
ipcMain.handle("mint-nft", async (_event, lionNumber) => {
  if (!contract) return { success: false, error: "Contract not ready yet." };

  try {
    const metadata = {
      name: `Alpha Lion ${lionNumber}`,
      description: `This is Lion #${lionNumber} from Alpha Break.`,
      image: `ipfs://QmWtXjsMyRi3ALNMhHbBH6AqSFwMs8oC41cvQwehr4uUbz/${lionNumber}.jpg`,
    };

    // 👇 If Drop is pre-lazy-minted via Thirdweb's batch upload, this will mint 1 for free
    const tx = await contract.claim(1);
    console.log("🎉 Mint tx hash:", tx.receipt.transactionHash);

    return { success: true, tx };
  } catch (err) {
    console.error("Mint error:", err);
    return { success: false, error: err.message };
  }
});