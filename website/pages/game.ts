import { send } from "clientUtilities";
import { create } from "componentUtilities";

const content = document.getElementById("content") as HTMLDivElement;
const token = localStorage.getItem("token");
const buyCursorBtn = document.getElementById("buyCursorBtn") as HTMLButtonElement;
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
    "getGameState",
    token
  );

  if (!state) {
    content.innerHTML = `<p>Invalid token. Please log in again.</p>`;
    return;
  }

  let cookies = state.cookies;
  let cursors = state.cursors;

  content.append(
    create("h2", { innerText: "Cookie Smasher" }),
    create("p", { innerText: "Cookies: " },
      create("span", { id: "cookies", innerText: String(cookies) })
    ),
    create("p", { innerText: "Cursors: " },
      create("span", { id: "cursors", innerText: String(cursors) })
    ),
    create("p", { innerText: "Cookies per second: " },
      create("span", { id: "cps", innerText: String(cursors) })
    ),
    create("button", { id: "clickBtn", innerText: "Smash Cookie" }),
    create("button", { id: "buyCursorBtn", innerText: String("Buy Cursor (" + String(Math.round(1.04 ** cursors)) + ")") }),
    create("button", { id: "LogOutBtn", innerText: "Log Out" }),
    create("p", { id: "msg" })
  );

  const cookiesSpan = document.getElementById("cookies")!;
  const cursorsSpan = document.getElementById("cursors")!;
  const cpsSpan = document.getElementById("cps")!;
  const msg = document.getElementById("msg")!;

  document.getElementById("clickBtn")!.onclick = async () => {
    cookies++;
    cookiesSpan.textContent = cookies.toString();
    await save();
  };

  document.getElementById("LogOutBtn")!.onclick = async () => {
    cookiesSpan.textContent = cookies.toString();
    location.href = "index.html"
  }

  document.getElementById("buyCursorBtn")!.onclick = async () => {
    if (cookies >= Math.round(1.04 ** cursors)) {
      cookies -= Math.round(1.04 ** cursors);
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
    await send("saveGameState", token, cookies, cursors);
  }
}
