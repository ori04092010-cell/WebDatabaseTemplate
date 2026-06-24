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
if (!token) {
  document.body.prepend(`
    <p>You must log in to play.</p>
    <a href="login.html"><button>Go to Login</button></a>
  `);
} else {
  loadGame();
}

async function loadGame() {
  const state = await send<{ cookies: number; cursors: number; multiplier: number; } | null>(
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
  let MultiplierCost = 100 * Math.pow(5, multiplier - 1);
  let CursorCost = Math.floor(10 * Math.pow(1.5, cursors))
  UpdateUi();
  clickButton.onclick = async () => {
    cookies += multiplier;
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
    MultiplierCost = 100 * Math.pow(5, multiplier - 1);
    CursorCost = Math.floor(10 * Math.pow(1.5, cursors));
    cookiesSpan.textContent = cookies.toString();
    cursorsSpan.textContent = cursors.toString();
    cpsSpan.textContent = String(multiplier * cursors);
    multiplierSpan.textContent = String(multiplier)
    BuymultiplierButton.textContent = String(`Buy Multiplier: ${MultiplierCost}`)
    buyCursorButton.textContent = String(`Buy Cursor: ${CursorCost}`)


  }
  buyCursorButton.onclick = async () => {
    CursorCost = Math.floor(10 * Math.pow(1.5, cursors));
    if (cookies >= CursorCost) {
      cookies -= CursorCost;
      cursors++;
      UpdateUi();
      messageP.style.color = "green";
      messageP.textContent = "Cursor purchased!";
      await save();
    } else {
      messageP.textContent = "Not enough cookies.";
      messageP.style.color = "red";
    }
  };
  BuymultiplierButton.onclick = async () => {
    MultiplierCost = 100 * Math.pow(5, multiplier - 1);
    console.log(MultiplierCost)
    if (cookies >= MultiplierCost) {
      cookies -= Math.floor(MultiplierCost);
      multiplier++;
      UpdateUi()
      messageP.style.color = "green";
      messageP.textContent = "Cursor purchased!";
      await save()
    } else {
      messageP.textContent = "Not enough cookies.";
      messageP.style.color = "red";
    }

  }


  setInterval(async () => {
    cookies += cursors * multiplier;
    cookiesSpan.textContent = cookies.toString();
    await save();
  }, 1000);

  async function save() {
    await send("saveGameState", token, cookies, cursors, multiplier);
  }
}
