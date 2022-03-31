const bcrypt = require('bcryptjs');
const db = require('../dbServer');


module.exports = function drag(ev) {
    // allows task to be dragged
    ev.dataTransfer.setData("text", ev.target.id);
}  

module.exports = function allowDrop(ev) {
    ev.preventDefault();
}

module.exports = function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.currentTarget.appendChild(document.getElementById(data));
}

module.exports = function createTask(){
    var x = document.getElementById("inprogress");
    var y = document.getElementById("done");
    var z = document.getElementById("create-new-task-block");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "block";
        z.style.display = "none";
    } else {
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "flex";
    }
}

module.exports = function saveTask(){
    var todo = document.getElementById("todo");
    var taskName = document.getElementById("task-name").ariaValueMax;
    todo.innerHTML += `
    div(class="task" id="${taskName.toLowerCase().split(" ").join("")}" dragable="true" ondragstart="drag(event)")
    span${taskName}
    `
}

module.exports = function editTask(){
    var saveButton = document.getElementById("save-button");
    var editButton = document.getElementById("edit-button");
    if (saveButton.style.display === "none") {
        saveButton.style.display = "block";
        editButton.style.display = "none";
    } else{
        saveButton.style.display = "none"
        editButton.style.display = "block"
    }
}
