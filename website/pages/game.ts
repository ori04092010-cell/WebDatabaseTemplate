import { send } from "clientUtilities";
import { requireLogin } from "./auth.js";

requireLogin();

let cookies = 0;
let cookiesPerSecond = 0;
let cursorCost = 10;

const cookieBtn = document.getElementById("cookieBtn")!;
const cookieCount = document.getElementById("cookieCount")!;
const buyCursor = document.getElementById("buyCursor")!;
const cpsDisplay = document.getElementById("cps")!;
const welcome = document.getElementById("welcome")!;

// Load user info
async function loadUser() {
  const token = localStorage.getItem("token")!;
  const user = await send<any>("getUser", token);

  if (!user) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
    return;
  }

  welcome.textContent = `Welcome, ${user.username}`;
}

loadUser();

// Clicking the cookie
cookieBtn.addEventListener("click", () => {
  cookies++;
  updateUI();
});

// Buying a cursor
buyCursor.addEventListener("click", () => {
  if (cookies >= cursorCost) {
    cookies -= cursorCost;
    cookiesPerSecond++;
    cursorCost = Math.floor(cursorCost * 1.5);
    buyCursor.textContent = `Buy Cursor (${cursorCost} cookies)`;
    updateUI();
  }
});

// Update UI
function updateUI() {
  cookieCount.textContent = `Cookies: ${cookies}`;
  cpsDisplay.textContent = `Cookies per second: ${cookiesPerSecond}`;
}

// Auto-generate cookies
setInterval(() => {
  cookies += cookiesPerSecond;
  updateUI();
}, 1000);

// Logout
document.getElementById("logoutBtn")!.onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
};
