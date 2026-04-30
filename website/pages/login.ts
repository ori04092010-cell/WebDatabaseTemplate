import { send } from "clientUtilities";
import { redirectIfLoggedIn } from "./auth.js";

redirectIfLoggedIn();

document.getElementById("logInBtn")!.onclick = async () => {
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const token = await send<string | null>("logIn", username, password);

  if (token === null) {
    alert("Wrong username or password");
    return;
  }

  localStorage.setItem("token", token);
  window.location.href = "game.html";
};
