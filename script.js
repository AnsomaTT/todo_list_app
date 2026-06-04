// Get and store important HTML elements so they can be used later in the script
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

let updateText
// Get saved todo data from localStorage
let todoData = JSON.parse(localStorage.getItem("todoData"))


// Detect when Enter key is pressed in the input field and automatically click the add/update button
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});

// Display all todo items from todoData on the webpage
// Add a line through style to completed items and show them in the list
ReadToDoItems();
function ReadToDoItems() {
    todoData.forEach((element) => {
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
 * CreateToDoData Function
 * 
 *
 * @param {} 
 * @returns {}
 */
function CreateToDoData() {
    //
    if (taskInput.value === "") {
        alert("Please Enter your todo text!");
        taskInput.focus();
    }

    //Create a new list item (li) and define its HTML content for the todo text and action buttons. Edit/Delete
    //Clicking the todo text marks the task as completed by toggling a line-through style
    let li = document.createElement("li");
    const todoItems = `<div ondblclick="CompleteTodoItems(this)">${taskInput.value}</div>
        <div>
            <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png"/>
        </div>`;

    //Insert todo content into the new list item and display it in the list. Then reset the input for the next entry
    li.innerHTML = todoItems;
    taskList.appendChild(li);

    const taskText = taskInput.value;

    // If no todo data exists, create an empty list
    if (!todoData) {
        todoData = [];
    }
    let dataItem = {
        item: taskInput.value,
        isComplete: false
    };

    todoData.push(dataItem);

    taskInput.value = "";
    setLocalStorage();
}

/**
 * CompleteTodoItems Function
 * Toggles the completion state of a todo item on double-click.
 * Applies or removes strikethrough styling and shows/hides the edit button accordingly.
 *
 * @param {HTMLElement} e - The clicked todo element
 * @returns {void} - Nothing
 */
function CompleteTodoItems(e) {
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
    //todoData.forEach((element) => {
    //    if (e.parentElement.querySelector("div").innerText.trim() === element.item) {
    //        element.isComplete = true;
    //    }
    //});
}


function UpdateOnSelectionItems() {


    todoData.forEach(element => {
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

        todoData.forEach((element) => {
            if (element.item == deleteValue.trim()) {
                todoData.splice(element, 1);
            }
        });
        setLocalStorage();
    }
}

function setLocalStorage() {
    localStorage.setItem("todoData", JSON.stringify(todoData));
}