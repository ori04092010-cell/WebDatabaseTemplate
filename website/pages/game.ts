import { send } from "../types.js";

const content = document.getElementById("content") as HTMLDivElement;
const token = localStorage.getItem("token");

if (!token) {
  content.innerHTML = `
    <p>You must log in to play.</p>
    <a href="login.html"><button>Go to Login</button></a>
  `;
} else {
  loadGame();
}

async function loadGame() {
  const state = await send<{ cookies: number; cursors: number } | null>(
    "/getGameState",
    { token }
  );

  if (!state) {
    content.innerHTML = `<p>Invalid token. Please log in again.</p>`;
    return;
  }

  let cookies = state.cookies;
  let cursors = state.cursors;

  content.innerHTML = `
    <h2>Cookie Smasher</h2>
    <p>Cookies: <span id="cookies">${cookies}</span></p>
    <p>Cursors: <span id="cursors">${cursors}</span></p>
    <p>Cookies per second: <span id="cps">${cursors}</span></p>

    <button id="clickBtn">Smash Cookie</button>
    <button id="buyCursorBtn">Buy Cursor (15 cookies)</button>

    <p id="msg"></p>
  `;

  const cookiesSpan = document.getElementById("cookies")!;
  const cursorsSpan = document.getElementById("cursors")!;
  const cpsSpan = document.getElementById("cps")!;
  const msg = document.getElementById("msg")!;

  document.getElementById("clickBtn")!.onclick = async () => {
    cookies++;
    cookiesSpan.textContent = cookies.toString();
    await save();
  };

  document.getElementById("buyCursorBtn")!.onclick = async () => {
    if (cookies >= 15) {
      cookies -= 15;
      cursors++;
      cookiesSpan.textContent = cookies.toString();
      cursorsSpan.textContent = cursors.toString();
      cpsSpan.textContent = cursors.toString();
      msg.textContent = "Cursor purchased!";
      msg.style.color = "green";
      await save();
    } else {
      msg.textContent = "Not enough cookies.";
      msg.style.color = "red";
    }
  };

  setInterval(async () => {
    cookies += cursors;
    cookiesSpan.textContent = cookies.toString();
    await save();
  }, 1000);

  async function save() {
    await send("/saveGameState", { token, cookies, cursors });
  }
}
