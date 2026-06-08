
// ==========================================
// VARIABLES
// ==========================================

// Get and store important HTML elements so they can be used later in JavaScript
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

// TODO
// Variable used to temporarily store updated task text
let updateText

// Get saved tasks from localStorage
let storedTasks = GetLocalStorageTasksValue()

// ==========================================
// EVENT LISTENERS
// ==========================================

// TODO
// Detect when Enter key is pressed in the input field and automatically click the add/update button
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});



// ==========================================
// INITIAL PAGE LOAD
// ==========================================

// Display all saved tasks from the local storage in the UI when the page loads
CreateTaskListUIFromLocalStorage();



// ==========================================
// FUNCTIONS
// ==========================================

/**
 * Returns the list of stored tasks from localStorage.
 * Returns an empty array if no tasks are found.
 *
 * @returns {List} List of task objects
 */
function GetLocalStorageTasksValue() {
    // Get the local storage data of the saved tasks
    let storedTasks = JSON.parse(localStorage.getItem("storedTasks"))

    // If the local storage doesnt contain any tasks, create an empty list
    if (storedTasks === null) {
        storedTasks = [];
    }

    console.log("storedTasks init", storedTasks)
    return storedTasks;
}

/**
 * Save the current value of the global variable "storedTasks" inside the local storage browser
 * Have to call this function everytime the global variable storedTasks change to have the local storage browser up to date
 */
function SetLocalStorageTasksValue() {
    localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
}

/**
 * Creating the list of task in the UI from the local storage
 */
function CreateTaskListUIFromLocalStorage() {
    // Going through each saved Task object in the local storage
    storedTasks.forEach((savedTask) => {
        // Create a new task item (li) with the task text from the saved task from the local storage
        const newTaskItem = CreateTaskElement(savedTask.taskText)

        // Add the newTaskItem inside the taskList
        taskList.appendChild(newTaskItem);

        // Apply the UI completion on the task element
        ApplyTaskCompletionUI(newTaskItem.querySelector(".task-text"), savedTask.isComplete);
    });
}

/**
 * Handles the Add Task button click
 * - Validates input
 * - Create new task + renders it in the UI + saves it to localStorage
 * - Clears the input field
 */
function OnAddTaskClick() {
    // Create a copy of the global variable "taskInput.value" to use it instead of using the global variable too much
    const taskText = taskInput.value;

    // Check if the task input field is empty
    // If it is, display an alert message and stop the function
    if (taskText === "") {
        return alert("Please Enter your todo text!");
    }

    // Create a new task item (li) and define its HTML content for the task text and action buttons (Edit/Delete)
    // Clicking the task text marks the task as completed by toggling a line-through style
    const newTaskItem = CreateTaskElement(taskText)

    // Add the newTaskItem inside the taskList
    taskList.appendChild(newTaskItem);

    // Call the function to create and save the new task in the local storage
    SaveNewTaskInLocalStorage(taskText)

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
    newTaskItem.innerHTML = `<div class="task-text" ondblclick="CompleteTask(this)">${taskText}</div>
        <div class="task-actions">
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
function SaveNewTaskInLocalStorage(taskText) {
    // Create a new task object for the local storage
    let newTaskData = {
        taskText: taskText,
        isComplete: false
    };

    // Add the new task to the stored tasks list
    storedTasks.push(newTaskData);

    // Save the current tasks list to localStorage
    SetLocalStorageTasksValue();

    console.log("storedTasks saved", storedTasks)
}

/**
 * Toggles the completion state of a task
 *
 * @param {HTMLElement} taskElement - The task element
 */
function CompleteTask(taskElement) {
    // Search the task to complete by his text from the local storage list tasks
    storedTasks.forEach((savedTask) => {
        if (taskElement.parentElement.querySelector("div").innerText.trim() === savedTask.taskText) {
            // Switch the status of the task
            if (savedTask.isComplete == true) {
                savedTask.isComplete = false
            } else {
                savedTask.isComplete = true
            }

            // Applies or removes strike through styling and shows/hides the edit button accordingly
            ApplyTaskCompletionUI(taskElement, savedTask.isComplete)
        }
    });

    // Save the current tasks list to localStorage
    SetLocalStorageTasksValue();
    console.log("storedTasks after complete", storedTasks)
}

/**
 * Updates the task UI based on its completion state
 * Applies strikethrough styling and toggles the edit button
 *
 * @param {HTMLElement} taskElement - The task element
 * @param {boolean} isComplete - Whether the task is completed
 */
function ApplyTaskCompletionUI(taskElement, isComplete) {
    // Get the edit button inside the task element
    const li = taskElement.closest("li");
    const editBtn = li.querySelector("img.edit");
    console.log("editBtn", editBtn)

    // Applies or removes strike through styling and shows/hides the edit button
    if (isComplete == false) {
        taskElement.style.textDecoration = "none";
        editBtn.style.display = "inline-block";
    } else {
        taskElement.style.textDecoration = "line-through";
        editBtn.style.display = "none";
    }

    console.log("editBtn after applis style", editBtn)
}

// TODO
function UpdateOnSelectionItems() {


    storedTasks.forEach(element => {
        if (element.item == updateText.innerText.trim()) {
            element.item = taskInput.value;
        }
    });

    SetLocalStorageTasksValue();
    taskInput.value = "";
}

// TODO
//Change the add button into an update button when editing a todo item
function UpdateToDoItems(e) {
    updateText = e.parentElement.parentElement.querySelector("div");

    taskInput.value = updateText.innerText;

    addTaskBtn.setAttribute("onclick", "UpdateOnSelectionItems()");
    addTaskBtn.setAttribute("src", "/images/refresh.png");
}

// TODO
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
        SetLocalStorageTasksValue();
    }
}