import { redirectIfLoggedOut } from "./auth.js";
import { send } from "clientUtilities";

window.addEventListener("DOMContentLoaded", () => {

    redirectIfLoggedOut();

    const cookieImg = document.getElementById("cookieImg") as HTMLImageElement | null;
    const cookieCount = document.getElementById("cookieCount") as HTMLElement | null;
    const cpsDisplay = document.getElementById("cps") as HTMLElement | null;
    const buyCursor = document.getElementById("buyCursor") as HTMLButtonElement | null;
    const cursorCountDisplay = document.getElementById("cursorCountDisplay") as HTMLElement | null;
    const usernameSpan = document.getElementById("username") as HTMLElement | null;
    const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement | null;

    if (!cookieImg || !cookieCount || !cpsDisplay || !buyCursor || !cursorCountDisplay || !usernameSpan || !logoutBtn) {
        console.error("Missing game elements");
        return;
    }

    const username = localStorage.getItem("username") || "Player";
    const token = localStorage.getItem("token") || "";
    usernameSpan.textContent = username;

    let cookies = 0;
    let cookiesPerSecond = 0;
    let cursorCost = 10;

    function updateUI() {
        cookieCount.textContent = `Cookies: ${cookies}`;
        cpsDisplay.textContent = `Cookies per second: ${cookiesPerSecond}`;
        buyCursor.textContent = `Buy Cursor (${cursorCost} cookies)`;
        cursorCountDisplay.textContent = `Cursors: ${cookiesPerSecond}`;
    }

    async function loadGame() {
        const user = await send("getUser", token);
        if (!user) return;

        cookies = user.Cookies || 0;
        cookiesPerSecond = user.Cursors || 0;
        cursorCost = Math.floor(10 * Math.pow(1.2, cookiesPerSecond));

        updateUI();
    }

    async function saveGame() {
        await send("saveGame", token, cookies, cookiesPerSecond, 0);
    }

    cookieImg.addEventListener("click", () => {
        cookies++;
        updateUI();
        saveGame();
    });

    buyCursor.addEventListener("click", () => {
        if (cookies >= cursorCost) {
            cookies -= cursorCost;
            cookiesPerSecond++;
            cursorCost = Math.floor(10 * Math.pow(1.2, cookiesPerSecond));
            updateUI();
            saveGame();
        }
    });

    setInterval(() => {
        cookies += cookiesPerSecond;
        updateUI();
        saveGame();
    }, 1000);

    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });

    loadGame();
});
