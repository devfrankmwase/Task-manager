const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");

const tasks = [];

function renderTasks() {
    taskList.replaceChildren();

    for (const task of tasks) {
        const listItem = document.createElement("li");
        listItem.textContent = task; 
        taskList.append(listItem);
    }
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const task = taskInput.value.trim();

    if (task === "") {
        message.textContent = "Please enter a task.";
        return;
    }

    tasks.push(task);

    taskInput.value = "";
    message.textContent = "Task added!";

    renderTasks();
});