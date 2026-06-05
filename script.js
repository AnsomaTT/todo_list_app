
// ==========================================
// VARIABLES
// ==========================================

// Get and store important HTML elements so they can be used later in JavaScript
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

// Variable used to temporarily store updated task text
let updateText

// Get saved tasks from localStorage
let storedTasks = JSON.parse(localStorage.getItem("storedTasks"))
console.log("storedTasks ", storedTasks)

// ==========================================
// EVENT LISTENERS
// ==========================================

// Detect when Enter key is pressed in the input field and automatically click the add/update button
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});



// ==========================================
// INITIAL PAGE LOAD
// ==========================================

// Display all saved tasks when the page loads
ReadToDoItems();



// ==========================================
// FUNCTIONS
// ==========================================

// Display all todo items from storedTasks on the webpage
// Add a line through style to completed items and show them in the list
function ReadToDoItems() {
    storedTasks.forEach((element) => {
        let li = document.createElement("li");
        let style = "";

        // If this task is marked as completed in localStorage, display it crossed out in the UI
        if (element.isComplete) {
            style = "style='text-decoration: line-through'";
        }

        const todoItems = `<div ${style} ondblclick="CompleteToDoItems(this)">
            ${element.item}${style === ""
                ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" />'
                : ""
            }<img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" /></div>`;
        li.innerHTML = todoItems;
        taskList.appendChild(li);
    });
}

/**
 * Handles the Add Task button click
 * - Validates input
 * - Create new task + renders it in the UI + saves it to localStorage
 * - Clears the input field
 */
function OnAddTaskClick() {
    // Check if the task input field is empty
    // If it is, display an alert message and stop the function
    if (taskInput.value === "") {
        return alert("Please Enter your todo text!");
    }

    const taskText = taskInput.value;

    // Create a new task item (li) and define its HTML content for the task text and action buttons (Edit/Delete)
    // Clicking the task text marks the task as completed by toggling a line-through style
    let newTaskItem = createTaskElement(taskText)
    
    // Add the newTaskItem inside the taskList
    taskList.appendChild(newTaskItem);
  
    // Call the function to create and save the new task in the local storage
    saveNewTaskInLocalStorage(taskText)

    // Reset the input field so the user can type a new task
    taskInput.value = "";
}

/**
 * Creates a HTML element (li) for a task item
 * Including the task text and action buttons (edit/delete)
 *
 * @param {string} taskText - The text content of the task
 * @returns {HTMLElement} The created list item element
 */
function CreateTaskElement(taskText) {
    let newTaskItem = document.createElement("li");
    newTaskItem.innerHTML = `<div ondblclick="CompleteTask(this)">${taskText}</div>
        <div>
            <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png"/>
        </div>`;

    return newTaskItem;
}

/**
 * Creates a new task object and saves it to the storedTasks list
 * Then updates localStorage
 *
 * @param {string} taskText - The text of the new task
 */
function SaveNewTaskInLocalStorage(taskText){
    // Create a new task object for the local storage
    let newTaskData = {
        taskText: taskText,
        isComplete: false
    };

    // Add the new task to the stored tasks list
    storedTasks.push(newTaskData);

    // Save the current tasks list to localStorage
    setLocalStorage();
}

/**
 * CompleteTaskItems Function
 * Toggles the completion state of a todo item on double-click.
 * Applies or removes strikethrough styling and shows/hides the edit button accordingly.
 *
 * @param {HTMLElement} e - The clicked todo element
 */
function CompleteTask(e) {
    // Get the edit button inside the todo item container
    const editBtn = e.parentElement.querySelector("img.edit");

    // Change the status of the todo item
    if (e.isComplete == true) {
        e.isComplete = false
    } else {
        e.isComplete = true
    }

    // Applies or removes strikethrough styling and shows/hides the edit button accordingly.
    if (e.isComplete == true) {
        e.style.textDecoration = "none";
        if (editBtn) editBtn.style.display = "inline-block";
    } else {
        e.style.textDecoration = "line-through";
        if (editBtn) editBtn.style.display = "none";
    }

    // TODO: Save the current completion state of each task in localStorage
    //storedTasks.forEach((element) => {
    //    if (e.parentElement.querySelector("div").innerText.trim() === element.item) {
    //        element.isComplete = true;
    //    }
    //});
}


function UpdateOnSelectionItems() {


    storedTasks.forEach(element => {
        if (element.item == updateText.innerText.trim()) {
            element.item = taskInput.value;
        }
    });

    setLocalStorage();
    taskInput.value = "";
}


//Change the add button into an update button when editing a todo item
function UpdateToDoItems(e) {
    updateText = e.parentElement.parentElement.querySelector("div");

    taskInput.value = updateText.innerText;

    addTaskBtn.setAttribute("onclick", "UpdateOnSelectionItems()");
    addTaskBtn.setAttribute("src", "/images/refresh.png");
}

function DeleteToDoItems(e) {
    let deleteValue =
        e.parentElement.parentElement.querySelector("div").innerText;
    if (confirm(`Are you sure? Do you want to delete ${deleteValue}?`)) {
        e.parentElement.parentElement.parentElement.querySelector("li").remove();
        taskInput.focus();

        storedTasks.forEach((element) => {
            if (element.item == deleteValue.trim()) {
                storedTasks.splice(element, 1);
            }
        });
        setLocalStorage();
    }
}

function setLocalStorage() {
    localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
}