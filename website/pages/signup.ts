import { send } from "clientUtilities";
import { redirectIfLoggedIn } from "./auth.js";

redirectIfLoggedIn();

document.getElementById("signUpBtn")!.onclick = async () => {
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const token = await send<string | null>("signUp", username, password);

  if (token === null) {
    alert("Username already exists");
    return;
  }

  // Save token so the user is considered logged in
  localStorage.setItem("token", token);

  // Redirect directly to the game page
  window.location.href = 'game.html';
};
