import { redirectIfLoggedIn } from "./auth.js";
import { send } from "clientUtilities";

window.addEventListener("DOMContentLoaded", () => {

    redirectIfLoggedIn();

    const form = document.getElementById("signupForm") as HTMLFormElement | null;

    if (!form) {
        console.error("signupForm NOT FOUND — signup.js is running on the wrong page.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        const token = await send("signUp", username, password);

        if (!token) {
            alert("Signup failed");
            return;
        }

        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        window.location.href = "game.html";
    });
});
