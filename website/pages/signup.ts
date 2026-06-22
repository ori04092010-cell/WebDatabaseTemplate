import { send } from "clientUtilities";

const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
const confirmInput = document.getElementById("confirmInput") as HTMLInputElement;
const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
const errorDiv = document.getElementById("errorDiv") as HTMLDivElement;
const signUpReturn = document.getElementById("signUpReturn") as HTMLButtonElement;

submitButton.onclick = async function (): Promise<void> {

  if (usernameInput.value === "") {
    errorDiv.innerText = "Username cannot be empty";
    return;
  }

  if (passwordInput.value === "" || confirmInput.value === "") {
    errorDiv.innerText = "Please enter a password.";
    return;
  }
  else if (passwordInput.value !== confirmInput.value) {
    errorDiv.innerText = "Passwords do not match.";
    return;
  }
  else if (passwordInput.value !== "" && passwordInput.value == confirmInput.value) {
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
  }
};

signUpReturn.onclick = async () => {

  console.log("function is running")
  location.href = "index.html"
}