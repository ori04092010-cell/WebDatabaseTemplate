const goSignUp = document.getElementById("goSignUp") as HTMLButtonElement;
const goLogIn = document.getElementById("goLogIn") as HTMLButtonElement;

goSignUp.addEventListener("click", () => {
  window.location.href = "signup.html";
});

goLogIn.addEventListener("click", () => {
  window.location.href = "login.html";
});
