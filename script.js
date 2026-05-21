//Get and store important HTML elements so they can be used later in the app
const todoValue = document.getElementById("todoText"),
    listItems = document.getElementById("list-items"),
    addUpdateClick = document.getElementById("AddUpdateClick");
let updateText


// Detect when Enter key is pressed in the input field and automatically click the add/update button
todoValue.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addUpdateClick.click();
    }
});

// Create a new todo item and check first if the input field is empty
function CreateToDoData() {
    //
    if (todoValue.value === "") {
        alert("Please Enter your todo text!");
        todoValue.focus();
    }

    //Create a new list item (li) and define its HTML content for the todo text and action buttons. Edit/Delete
    //Clicking the todo text marks the task as completed by toggling a line-through style
    let li = document.createElement("li");
    const todoItems = `
        <div onclick="CompleteTodoItems(this)">
            ${todoValue.value}
        </div>
        <div>
            <img class="edit todo-controls" onclick="UpdateToDItems(this)" src="images/pencil.png" />
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png"/>
        </div>`;

    //Insert todo content into the new list item and display it in the list. Then reset the input for the next entry
    li.innerHTML = todoItems;
    listItems.appendChild(li);
    todoValue.value = "";
}
//Adds and removes a line through the todo text when clicked
function CompleteTodoItems(e) {
    if (e.style.textDecoration === "line-through") {
        e.style.textDecoration = "none";
    } else {
        e.style.textDecoration = "line-through";
    }

}


function UpdateOnSelectionItems() {
    updateText.innerText = todoValue.value;

    todoValue.value = "";

    addUpdateClick.setAttribute("onclick", "CreateToDoData()");
    addUpdateClick.setAttribute("src", "/images/plus.png");
}


//Change the add button into an update button when editing a todo item
function UpdateToDItems(e) {
    updateText = e.parentElement.parentElement.querySelector("div");

    todoValue.value = updateText.innerText;

    addUpdateClick.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdateClick.setAttribute("src", "/images/refresh.png");
}

function DeleteToDoItems(e) {
    if (confirm("Are you sure? Do you want to delete this task!")) {

    }
}


