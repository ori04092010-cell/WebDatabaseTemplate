import { send } from "clientUtilities";

window.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm") as HTMLFormElement | null;
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        const token = await send("logIn", username, password);

        if (!token) {
            alert("Invalid username or password");
            return;
        }

        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        window.location.href = "game.html";
    });
});
