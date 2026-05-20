import { redirectIfLoggedIn } from "./auth.js";
import { send } from "clientUtilities";

redirectIfLoggedIn();

const form = document.getElementById("signup-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const token = await send("signUp", username, password);

    if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        window.location.href = "game.html";
    } else {
        alert("Signup failed");
    }
});
