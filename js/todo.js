"use strict";

const savedTasks = localStorage.getItem("tasks"); // Hent den gemte tekst fra localStorage, hvis der findes nogen opgaver

// Lav teksten om fra JSON til et array af opgave-objekter
// Hvis der ikke er gemt noget endnu, starter vi med et tomt array
const taskArr = savedTasks ? JSON.parse(savedTasks) : []; //JSON.parse analyserer JSON-tekst og omdanner det til JS-værdi (fx variablen savedTasks, som vi gør til et array)

// Find de HTML-elementer, som JavaScript skal arbejde med
const createBtn = document.querySelector(".createBtn");
const taskInput = document.querySelector(".taskText");
const taskList = document.querySelector(".taskList");
const doneList = document.querySelector(".doneList");
const deleteAllBtn = document.querySelector("#clearBtn");
const showNumber = document.querySelector("#showNumber");
const showNumber2 = document.querySelector("#showNumber2");

// Gemmer hele opgavelisten i browserens localStorage
// JSON.stringify laver JavaScript-arrayet om til tekst, så det kan gemmes
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(taskArr));
}

// Når brugeren klikker på knappen, skal createTask-funktionen køre
createBtn.addEventListener("click", createTask);

// Kalder clear-knappen og siger at deleteAll funktionen skal køre, når man trykker den
deleteAllBtn.addEventListener("click", deleteAll);

// Opretter en ny opgave ud fra det, brugeren har skrevet i inputfeltet
function createTask(){
    // Et objekt samler alle oplysninger om én opgave
    const taskObject = {
        taskTxt: taskInput.value, // Selve teksten på opgaven
        taskDone: false, // Nye opgaver er ikke færdige endnu
        taskDate: "", // Tilføjer en dato til hver ny opgave, som starter tom
        id: self.crypto.randomUUID(), // Et unikt id til opgaven
    }

    // Tilføj den nye opgave til arrayet med alle opgaver.
    taskArr.push(taskObject);

    // Tøm inputfeltet, efter opgaven er blevet oprettet.
    taskInput.value = "";

    // Gem ændringen og tegn listen på ny, så den nye opgave vises.
    saveTasks();
    console.log(taskArr);
    renderList();
}

// Opdaterer tællerne (hvor mange opgaver/udførte opgaver der er)
function updateNumbers() {
    const totalTasks = taskArr.length; //antal opgaver i alt
    const completedTasks = taskArr.filter((task) => task.taskDone).length; //finder kun opgaver, hvor taskDone er true

    showNumber.textContent = totalTasks;
    showNumber2.textContent = completedTasks;
}

// Viser alle opgaver fra taskArr på siden.
function renderList(){
    updateNumbers(); // viser antal af opgaver/ udførte opgaver i h1'erne
    // Ryd begge lister til at starte med, så opgaver ikke bliver vist flere gange
    taskList.innerHTML = "";
    doneList.innerHTML = "";

    // Gå gennem hver opgave og opret et HTML-li-element til den
    taskArr.forEach((task) => {
        const li = document.createElement("li");

        // Opret en checkbox og tekst for opgaven
        // Hvis taskDone er true, får checkboxen attributten "checked"
       li.innerHTML = `
    <label class="customCheckbox">
    <input type="checkbox" ${task.taskDone ? "checked" : ""}>
    <span></span>
</label>

    <article class="liFlex">
        <p>${task.taskTxt}</p>

        <span class="taskDate">
            ${task.taskDate || ""}
        </span>

        <button class="calendarBtn" type="button">🗓️</button>
        <button class="delete" type="button">🗑️</button>

        <input
            class="dateInput"
            type="date"
            value="${task.taskDate || ""}"
        >
    </article>`;
    
    // Find checkboxen, knappen og datofeltet inde i det nye li-element
    const checkBox = li.querySelector('[type="checkbox"]');
    const calBtn = li.querySelector(".calendarBtn");
    const dateInput = li.querySelector(".dateInput");
    const dateDisplay = li.querySelector(".taskDate");

    //Åbner kalenderen, når der trykkes på knappen
    calBtn.addEventListener("click", () => {
    dateInput.showPicker();

    //Gemmer den valgte dato
    dateInput.addEventListener("change", () => {
    task.taskDate = dateInput.value;
    dateDisplay.textContent = task.taskDate;

    saveTasks();
});
});

        // Reager, når brugeren klikker på checkboxen
        checkBox.addEventListener("click", (e) => {
            // Stop checkboxens normale browserhandling
            // Derefter håndterer vi selv statusændringen nedenfor
            e.preventDefault();

            // Skift mellem færdig og ikke færdig
            task.taskDone = !task.taskDone;

            // Gem den nye status og tegn listen på ny
            saveTasks();
            renderList();
        });

        // Tilføj det færdige li-element til opgavelisten på siden
        // Kald funktion moveTask som rykker opgaven og li-elementet (hvis afkrydset)
        moveTask(task, li);
    
    // Kalder slet-knappen og siger at deleteTask funktionen skal køre for opgaven, når man trykker slet
    const deleteBtn = li.querySelector(".delete");
    deleteBtn.addEventListener("click", () => deleteTask(task));

    });
}

function moveTask(task, li){
    // Hvis taskDone er true, flyttes opgaven til .doneList
    // Ellers flyttes den til .taskList
    const targetList = task.taskDone ? doneList : taskList;
    targetList.appendChild(li);
}

function deleteTask(task){
    // Find placeringen af den opgave, som brugeren trykkede på
    const taskIndex = taskArr.findIndex((item) => item.id === task.id);

    // Fortsæt kun, hvis opgaven blev fundet i arrayet
    if (taskIndex !== -1) {
        // Fjern opgaven fra taskArr
        taskArr.splice(taskIndex, 1);

        saveTasks();
        renderList();
    }
}

function deleteAll(){
    // Fjern alle opgaver fra taskArr
    taskArr.splice(0, taskArr.length);

    // Gem den tomme liste i localStorage og opdater siden
    saveTasks();
    renderList();
}

// Kør renderList med det samme, når JavaScript-filen indlæses,
// så tidligere gemte opgaver bliver vist på siden
renderList();
