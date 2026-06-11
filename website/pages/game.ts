import { send } from "clientUtilities";
import { create, get } from "componentUtilities";

const cookiesSpan = get("span", "cookiesSpan");
const cursorsSpan = get("p", "cursorsSpan");
const cpsSpan = get("span", "cpsSpan");
const clickButton = get("img", "clickButton");
const buyCursorButton = get("button", "buyCursorButton");
const logOutButton = get("button", "LogOutButton");
const messageP = get("p", "messageP");
const multiplierSpan = get("span", "multiplierSpan")
const BuymultiplierButton = get("button", "buymultiplierButton")
const token = localStorage.getItem("token");
let MultiplierCost = 100;
if (!token) {
  document.body.prepend(`
    <p>You must log in to play.</p>
    <a href="login.html"><button>Go to Login</button></a>
  `);
} else {
  loadGame();
}

async function loadGame() {
  const state = await send<{ cookies: number; cursors: number; multiplier:number;} | null>(
    "getGameState",
    token
  );

  if (!state) {
    document.body.innerHTML = `<p>Invalid token. Please log in again.</p>`;
    return;
  }
  let multiplier = state.multiplier;
  let cookies = state.cookies;
  let cursors = state.cursors;
  UpdateUi();
  clickButton.onclick = async () => {
    cookies++;
    cookiesSpan.textContent = cookies.toString();
    await save();
    clickButton.style.filter = "drop-shadow(0 0 25px #ffd27f)";
    setTimeout(() => {
      clickButton.style.filter = "drop-shadow(0 0 15px #ffcc66)";
    }, 120);

  };

  logOutButton.onclick = async () => {
    cookiesSpan.textContent = cookies.toString();
    location.href = "index.html"
  }
  function UpdateUi() {
    console.log("hello");
    cookiesSpan.textContent = cookies.toString();
    cursorsSpan.textContent = cursors.toString();
    cpsSpan.textContent = cursors.toString();
    messageP.textContent = "Cursor purchased!";
    messageP.style.color = "green";
    buyCursorButton.innerText = `Buy Cursor (${Math.round(1.04 ** cursors)})`;
    multiplierSpan.textContent = multiplier.toString();

  }
  buyCursorButton.onclick = async () => {
    if (cookies >= Math.round(1.04 ** cursors)) {
      cookies -= Math.round(1.04 ** cursors);
      cursors++;
      UpdateUi();
      await save();
    } else {
      messageP.textContent = "Not enough cookies.";
      messageP.style.color = "red";
    }
  };
  BuymultiplierButton.onclick = async () => {
    if (cookies >= Math.round(2.5 * MultiplierCost)) {
      cookies -= Math.round(MultiplierCost*2);
      multiplier++;
      UpdateUi()
      await save()
      MultiplierCost = Math.round(2.5*MultiplierCost);
    } else {
      messageP.textContent = "Not enough cookies.";
      messageP.style.color = "red";
    }

  }


  setInterval(async () => {
    cookies += cursors;
    cookiesSpan.textContent = cookies.toString();
    await save();
  }, 1000);

  async function save() {
    await send("saveGameState", token, cookies, cursors,multiplier);
  }
}
