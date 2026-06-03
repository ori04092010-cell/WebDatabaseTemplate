import { send } from "clientUtilities";

const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
const confirmInput = document.getElementById("confirmInput") as HTMLInputElement;
const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
const errorDiv = document.getElementById("errorDiv") as HTMLDivElement;

submitButton.onclick = async () => {
  if (passwordInput.value !== confirmInput.value) {
    errorDiv.innerText = "Passwords do not match.";
    return;
  }

  const token = await send<string | null>(
    "signUp",
    usernameInput.value,
    passwordInput.value
  );

  if (token == null) {
    errorDiv.innerText = "A user with this username already exists.";
    return;
  }

  localStorage.setItem("token", token);
  location.href = "game.html";
};
