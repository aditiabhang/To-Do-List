// Selecting the elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

// Naming the classes
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = 'lineThrough';

// Defining variables
let LIST, id;

// Get item from the local storage
let data = localStorage.getItem("TODO");

// Checking if data is not empty
if(data) {
    LIST = JSON.parse(data);
    // Set the id to the last item id in the list
    id = LIST.length;
    // Load the list to the UI
    loadList(LIST);
} else {
    // if data is empty
    LIST = [];
    id = 0;
}

// Creating a function to display the loaded to-do items to the user 
function loadList(array) {
    array.forEach(function(item) {
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

// Clearing the local storage
clear.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
})

// Displaying the date
const today = new Date();
const options = {weekday: "long", month: "short", day: "numeric"};
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

// Creating a function to add to-do item - addToDo()
function addToDo(toDo, id, done, trash) {

    if(trash) { 
        return;
    }

    const DONE = done ? CHECK : UNCHECK; 
    const LINE = done ? LINE_THROUGH : "";
    const item = `
                <li class="item">
                <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                <p class="text ${LINE}">${toDo}</p>
                <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
                `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}

// addToDo("Drink Water!")
// Add item when enter key is pressed
document.addEventListener("keyup", function(event) {
    if(event.key === "Enter") {
        const toDo = input.value;

        // if input is not empty
        if(toDo) {
            addToDo(toDo, id, false, false);

            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });

            // Add items to the local storage
            localStorage.setItem("TODO", JSON.stringify(LIST));

            id++;
        }
        input.value = "";
    }
});

// addToDo("Water", 1, true, false);

// Creating a function for to-do completion - completeToDo()
function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

// Creating a function to remove a to-do item - removeToDo()
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

// Targeting an item that are created dynamically
list.addEventListener("click", function(event) {
    // return the clicked item from inside the list
    const element = event.target;
    // Job is complete or removed
    const elementJob = element.attributes.job.value;

    if(elementJob == "complete") {
        completeToDo(element);
    } 
    else if(elementJob == "delete") {
        removeToDo(element);
    }

    // Add items to the local storage
    localStorage.setItem("TODO", JSON.stringify(LIST));
})