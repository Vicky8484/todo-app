const changeBtn = document.querySelector("#changeBtn");
const body = document.querySelector("body");
const storedTheme = localStorage.getItem("thisTheme");

const initialTheme = storedTheme || "light";
body.dataset.theme = initialTheme;
updateButtonText(initialTheme);

changeBtn.addEventListener("click", switchTheme);

function switchTheme(){
    const theme = body.dataset.theme === "light" ? "dark" : "light";

    body.dataset.theme = theme;
    localStorage.setItem("thisTheme", theme);
    updateButtonText(theme);
}

function updateButtonText(theme){
    changeBtn.textContent = theme === "dark" ? "light mode" : "dark mode";
}