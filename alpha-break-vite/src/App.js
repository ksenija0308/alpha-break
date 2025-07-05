import React from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";

const LionImage = () => {
  const query = new URLSearchParams(window.location.search);
  const lion = query.get("lion") || "1";
  return (
    <img src={`/src/assets/lions/lion${lion}.jpg`} alt="Alpha Lion" />
  );
};

const MintButton = () => {
  const { login, ready, authenticated } = usePrivy();

  const handleMint = async () => {
    if (!authenticated) {
      await login();
    }
    alert("Mint function triggered! 🚀"); // You can replace with actual minting logic
  };

  return (
    <button onClick={handleMint} disabled={!ready}>
      Mint with Privy Wallet
    </button>
  );
};

const App = () => (
  <PrivyProvider appId="cmcq8c05t01jnl20llwg6do8y">
    <h1>Your Alpha Lion</h1>
    <LionImage />
    <MintButton />
  </PrivyProvider>
);

export default App;
