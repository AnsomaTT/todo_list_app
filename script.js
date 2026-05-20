//Get and store important HTML elements so they can be used later in the app
const todoValue = document.getElementById("todoText"),
    listItems = document.getElementById("list-items"),
    addUpdateClick = document.getElementById("AddUpdateClick");

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
    let li = document.createElement("li");
    const todoItems = `
    <div>${todoValue.value}</div>
    <div>
        <img class="edit todo-controls" src="images/pencil.png" />
        <img class="delete todo-controls" src="images/delete.png"/>
    </div>`;

    //Insert todo content into the new list item and display it in the list. Then reset the input for the next entry
    li.innerHTML = todoItems;
    listItems.appendChild(li);
    todoValue.value = "";
}