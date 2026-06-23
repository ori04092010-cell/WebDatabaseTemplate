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
    cookiesSpan.textContent = cookies.toString();
    cursorsSpan.textContent = cursors.toString();
    cpsSpan.textContent = String(multiplier * cursors);
    messageP.textContent = "Cursor purchased!";
    messageP.style.color = "green";
    multiplierSpan.textContent = multiplier.toString();
    BuymultiplierButton.textContent = String(`Buy Multiplier: ${MultiplierCost}`)
    console.log(MultiplierCost)


  }
  buyCursorButton.onclick = async () => {
    if (cookies >= Math.round(10 * Math.pow(1.5, cursors))) {
      cookies -= Math.round(10 * Math.pow(1.5, cursors));
      cursors++;
      UpdateUi();
      await save();
    } else {
      messageP.textContent = "Not enough cookies.";
      messageP.style.color = "red";
    }
  };
  BuymultiplierButton.onclick = async () => {
    MultiplierCost = 100 * Math.pow(5, multiplier - 1);
    if (cookies >= MultiplierCost) {
      cookies -= Math.floor(MultiplierCost);
      multiplier++;
      UpdateUi()
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
