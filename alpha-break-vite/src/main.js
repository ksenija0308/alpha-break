import { PrivyClient } from "@privy-io/privy-browser";

const appId = "cmcq8c05t01jnl20llwg6do8y";
const privy = new PrivyClient({ appId });

document.querySelector("#app").innerHTML = `
  <div style="text-align:center; margin-top: 50px;">
    <h1>Your Alpha Lion</h1>
    <img src="/lion.jpg" alt="Lion" style="max-width:300px; border-radius:12px;" />
    <br/><br/>
    <button id="mintBtn" style="padding:10px 20px; background-color:goldenrod; border:none; border-radius:8px; color:white; font-size:16px; cursor:pointer;">
      Mint with Privy Wallet
    </button>
  </div>
`;

document.getElementById("mintBtn").onclick = async () => {
  await privy.login();
  alert("Minting initiated (replace with real logic)!");
};
