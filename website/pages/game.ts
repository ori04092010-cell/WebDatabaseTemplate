import { redirectIfLoggedOut } from "./auth.js";

redirectIfLoggedOut();

// ELEMENTS
const cookieImg = document.getElementById("cookieImg") as HTMLImageElement;
const cookieCount = document.getElementById("cookieCount") as HTMLElement;
const cpsDisplay = document.getElementById("cps") as HTMLElement;
const buyCursor = document.getElementById("buyCursor") as HTMLButtonElement;
const cursorCountDisplay = document.getElementById("cursorCountDisplay") as HTMLElement;
const usernameSpan = document.getElementById("username") as HTMLElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

// USERNAME
usernameSpan.textContent = localStorage.getItem("username") || "Player";

// LOAD GAME
let cookies = Number(localStorage.getItem("cookies") || 0);
let cookiesPerSecond = Number(localStorage.getItem("cps") || 0);
let cursorCost = Number(localStorage.getItem("cursorCost") || 10);

// SAVE GAME
function saveGame() {
    localStorage.setItem("cookies", String(cookies));
    localStorage.setItem("cps", String(cookiesPerSecond));
    localStorage.setItem("cursorCost", String(cursorCost));
}

// UPDATE UI
function updateUI() {
    cookieCount.textContent = `Cookies: ${cookies}`;
    cpsDisplay.textContent = `Cookies per second: ${cookiesPerSecond}`;
    buyCursor.textContent = `Buy Cursor (${cursorCost} cookies)`;
    cursorCountDisplay.textContent = `Cursors: ${cookiesPerSecond}`;
}

// FLOATING TEXT
function createFloatingText(text: string) {
    const container = document.getElementById("floatingContainer")!;
    const rect = cookieImg.getBoundingClientRect();

    const elem = document.createElement("div");
    elem.className = "floating-text";
    elem.textContent = text;

    elem.style.left = rect.left + rect.width / 2 + (Math.random() * 80 - 40) + "px";
    elem.style.top = rect.top + rect.height / 2 + (Math.random() * 40 - 20) + "px";

    container.appendChild(elem);
    setTimeout(() => elem.remove(), 800);
}

// CLICK COOKIE
cookieImg.addEventListener("click", () => {
    cookies++;
    createFloatingText("+1");
    updateUI();
    saveGame();

    // CLICK ANIMATION
    cookieImg.classList.add("cookie-click");
    setTimeout(() => cookieImg.classList.remove("cookie-click"), 80);
});

// BUY CURSOR
buyCursor.addEventListener("click", () => {
    if (cookies >= cursorCost) {
        cookies -= cursorCost;
        cookiesPerSecond++;
        cursorCost = Math.floor(10 * Math.pow(1.05, cookiesPerSecond));
        updateUI();
        saveGame();
    }
});

// AUTO COOKIES
setInterval(() => {
    cookies += cookiesPerSecond;
    updateUI();
    saveGame();
}, 1000);

// LOGOUT
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
});
