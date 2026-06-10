
// ==========================================
// VARIABLES
// ==========================================

// Get and store important HTML elements so they can be used later in JavaScript
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const AlertMessage = document.getElementById("AlertMessage");

// Variable used to temporarily store the element that is going to be edited
let storedTaskTextElement = null

// Get saved tasks from localStorage
let storedTasks = GetLocalStorageTasksValue()



// ==========================================
// EVENT LISTENERS
// ==========================================

// Detect when Enter key is pressed in the input field and automatically click the add/update button
taskInput.addEventListener("keypress", function (keyboardEvent) {
    SetAlertMessage("");

    if (keyboardEvent.key === "Enter") {
        SetAlertMessage("Task item created succesfully.")
        // Call the function set to the addTaskBtn (Add or Edit task)
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
        return SetAlertMessage("Please Enter your task text!");
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
            <img class="edit task-controls" onclick="UpdateTask(this)" src="images/pencil.png" />
            <img class="delete task-controls" onclick="DeleteTask(this)" src="images/delete.png"/>
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
 * @param {HTMLElement} taskTextElement - The task text element
 */
function CompleteTask(taskTextElement) {
    console.log("taskElement", taskTextElement)
    // Search the task to complete by his text from the local storage list tasks
    correspondingTask = SearchTaskFromStoredTasks(taskTextElement.innerText)

    // Switch the status of the task
    if (correspondingTask.isComplete == true) {
        correspondingTask.isComplete = false
    } else {
        correspondingTask.isComplete = true
    }

    // Applies or removes strike through styling and shows/hides the edit button accordingly
    ApplyTaskCompletionUI(taskTextElement, correspondingTask.isComplete)

    // Save the current tasks list to localStorage
    SetLocalStorageTasksValue();
    console.log("storedTasks after complete", storedTasks)
}

/**
 * Updates the task UI based on its completion state
 * Applies strikethrough styling and toggles the edit button
 *
 * @param {HTMLElement} taskTextElement - The task text element
 * @param {boolean} isComplete - Whether the task is completed
 */
function ApplyTaskCompletionUI(taskTextElement, isComplete) {
    // Get the edit button inside the task element
    const editBtn = taskTextElement.parentElement.querySelector("img.edit");

    // Applies or removes strike through styling and shows/hides the edit button
    if (isComplete == false) {
        taskTextElement.style.textDecoration = "none";
        editBtn.style.display = "inline-block";
    } else {
        taskTextElement.style.textDecoration = "line-through";
        editBtn.style.display = "none";
    }

    console.log("editBtn after applis style", editBtn)
}

/**
 * Updates the text content of a selected task
 * Searches through the stored tasks, then updates the matching task
 * Saves the changes to Local Storage
 */
function EditTaskText() {
    // Search the task from the copy of the local storage
    taskToEdit = SearchTaskFromStoredTasks(storedTaskTextElement.innerText);
    // Change the text of the object task for the local storage
    taskToEdit.taskText = taskInput.value
    // Save the current tasks list to localStorage
    SetLocalStorageTasksValue();

    // Send the edited text from the input to the task text element that is beeing edited
    storedTaskTextElement.innerText = taskInput.value
    // Clears the input field
    taskInput.value = "";

    // Change the function that is called when you click on the button
    addTaskBtn.setAttribute("onclick", `OnAddTaskClick()`);
    // Change the picture of the add button to plus picture
    addTaskBtn.setAttribute("src", "/images/plus.png");
}

/**
 * Allows a task to be edited
 * Displays the selected task text in the input field
 * Then changes the button to update the task when clicked
 *
 * @param {HTMLElement} editButtonElement - The editButton element
 */
function UpdateTask(editButtonElement) {
    // Search the div that contains the text of the task
    const textElement = editButtonElement.parentElement.parentElement.querySelector(".task-text");
    // Put the text of the task that is going to be edited inside the input
    taskInput.value = textElement.innerText;

    // Save the task text element in a global variable for later use
    storedTaskTextElement = textElement;

    // Change the function that is called when you click on the button
    addTaskBtn.setAttribute("onclick", `EditTaskText()`);
    // Change the picture of the add button to refresh picture
    addTaskBtn.setAttribute("src", "/images/refresh.png");
}

/**
 * Deletes a selected task
 * Removes the task from the page, then updates the stored task list
 * Saves the changes to Local Storage after confirmation
 *
 * @param {HTMLElement} deleteButtonElement - The deleteButtonElement element
 */
function DeleteTask(deleteButtonElement) {
    // Search the whole line that contain all the element of the task
    const elementToDelete = deleteButtonElement.parentElement.parentElement;

    // Search the text of the task that we want to delete
    const textTaskToDelete = elementToDelete.querySelector(".task-text").innerText;

    // Display a message asking if the user is sure to delete the task
    if (confirm(`Are you sure? Do you want to delete ${textTaskToDelete}?`)) {
        // Filter the copy of the local storage to remove the task to delete
        storedTasks = storedTasks.filter(
            task => task.taskText !== textTaskToDelete
        );

        // Save the current tasks list to localStorage
        SetLocalStorageTasksValue();

        // Remove the task from the UI
        elementToDelete.remove();
    }
}

/**
 * Search the task object from the local storage copy that match the text of a given task text element
 * Return the task object found
 *
 * @param {string} taskText - The text of the task to search in the list
 * @returns {taskObject} - The saved task from the local storage copy
 */
function SearchTaskFromStoredTasks(taskText) {
    return storedTasks.find(savedTask => savedTask.taskText === taskText);
}


function SetAlertMessage(message) {
    AlertMessage.removeAttribute("class");
    AlertMessage.innerText = message;

    setTimeout(() => {
        AlertMessage.classList.add("toggleMe");
    }, 1000);
}