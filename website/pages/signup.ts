import { send } from "clientUtilities";

const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const signupBtn = document.getElementById("signupBtn")!;

signupBtn.addEventListener("click", async () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (!username || !password) {
    alert("Please enter a username and password");
    return;
  }

  const result = await send<any>("signup", { username, password });

  if (!result || !result.token) {
    alert("Signup failed");
    return;
  }

  localStorage.setItem("token", result.token);

  window.location.href = "game.html";
});
