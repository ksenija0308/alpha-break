const { shell } = require("electron");

let popupShown = false;
let lastActivity = Date.now();
let lastScroll = Date.now();
let speedWindow = [];
let currentLionNumber = null;

window.onload = () => {
  document.getElementById("yesBtn").onclick = () => confirmBreak(true);
  document.getElementById("noBtn").onclick = () => confirmBreak(false);
  document.getElementById("mintBtn").onclick = () => mintLion();
  document.getElementById("cancelBtn").onclick = () => cancelMint();

  document.addEventListener("mousemove", updateActivity);
  document.addEventListener("keydown", () => {
    updateActivity();
    speedWindow.push(Date.now());
  });
  document.addEventListener("scroll", () => {
    lastScroll = Date.now();
    popupShown = false;
  });

  setTimeout(() => {
    setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivity;
      const scrollIdle = now - lastScroll;
      const typingSpeed = speedWindow.filter(ts => ts > now - 60000).length;

      if ((idleTime > 20000 && scrollIdle > 20000) || typingSpeed < 20) {
        if (!popupShown) {
          document.getElementById("popup").style.display = "block";
          popupShown = true;
          const { ipcRenderer } = require("electron");
          ipcRenderer.send("bring-to-front");
        }
      }
    }, 2000);
  }, 10000);
};

function updateActivity() {
  lastActivity = Date.now();
  popupShown = false;
}

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
  shell.openExternal(filePath); // Opens in user's default browser
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