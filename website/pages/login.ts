import { send } from "../types.js";

const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
const errorDiv = document.getElementById("errorDiv") as HTMLDivElement;

submitButton.onclick = async () => {
  const token = await send<string | null>(
    "logIn",
    usernameInput.value,
    passwordInput.value
  );

  if (token == null) {
    errorDiv.innerText = "Invalid username or password.";
    return;
  }

  localStorage.setItem("token", token);
  location.href = "index.html";
};
