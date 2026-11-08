const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-count");
const allCount = document.querySelector("#all-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
const message = document.querySelector("#message");
const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortSelect = document.querySelector("#sort-select");
const taskPriority = document.querySelector("#task-priority");

const savedTasks = localStorage.getItem("tasks");

let currentFilter = "all";

const tasks = savedTasks ? JSON.parse(savedTasks) : [];

let nextTaskId = tasks.length > 0
    ? Math.max(0,...tasks.map(task =>Number(task.id) || 0)) + 1 : 1;

    tasks.forEach(function (task) {
        if (!Number.isInteger(task.id) || task.id <= 0) {
            task.id = nextTaskId++;
        }
    });

    saveTasks();
    
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

function renderTasks() {

    const filteredTasks = tasks.filter(function (task){
       
        const matchesSearch = task.title.toLowerCase()
        .includes(searchInput.value.toLowerCase());

        if (currentFilter === "completed") {
            return matchesSearch && task.completed;
        }

        if(currentFilter === "active") {
            return matchesSearch && !task.completed;
        }

        return matchesSearch;
    });

    const priorityRank = {
        high: 3, 
        medium: 2, 
        low: 1
    };

    const sortedTasks = [...filteredTasks];

    if(sortSelect.value === "newest") {
        sortedTasks.sort(function (a,b){
            return b.id - a.id;
        });
    } else if (sortSelect.value === "oldest") {
        sortedTasks.sort(function(a,b){
            return a.id - b.id;
        });}
        else if (sortSelect.value === "priority") {
        sortedTasks.sort(function (a, b){
        return priorityRank[b.priority] - priorityRank[a.priority]
        });
        }
    

    taskList.replaceChildren();

    for (let i = 0; i < sortedTasks.length; i++) {

        const task = sortedTasks[i];

        const listItem = document.createElement("li");
        const taskText = document.createElement("span");
        const priorityText = document.createElement("span");
        
        
        
        
        const completeButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        const editButton = document.createElement("button");

        taskText.textContent = task.title;

        priorityText.textContent = "Priority: " + task.priority;


        completeButton.textContent = task.completed ? "Undo" :"Complete";
        completeButton.type = "button";

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        

        editButton.textContent = "Edit";
        editButton.type = "button";

        if(task.priority === "high"){
            priorityText.classList.add("high");
        } else if (task.priority === "medium") {
            priorityText.classList.add("medium");
        } else {
            priorityText.classList.add("low");
        }


        completeButton.addEventListener("click", function (){
            task.completed = !task.completed;

            saveTasks();
            updateTaskCount();
            renderTasks();
        });

        deleteButton.addEventListener("click", function () {
            const originalIndex = tasks.findIndex(function (item) {
                return item.id === task.id;
            });

            tasks.splice(originalIndex, 1);

            saveTasks();
            updateTaskCount();
            renderTasks();
        });

        editButton.addEventListener("click", function (){
            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = task.title;

            const prioritySelect = document.createElement("select");

            const lowOption = document.createElement("option");
            lowOption.value = "low";
            lowOption.textContent ="Low";

            const mediumOption = document.createElement("option");
            mediumOption.value = "medium";
            mediumOption.textContent = "Medium";

            const highOption = document.createElement("option");
            highOption.value = "high";
            highOption.textContent = "High";

            prioritySelect.append(lowOption, mediumOption, highOption);

            prioritySelect.value = task.priority;

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.type = "button";

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.type = "button";

            saveButton.addEventListener("click", function () {
                const updatedTask = editInput.value.trim();

                if (updatedTask === "") {
                    message.textContent = "Task cannot be empty.";
                    return;
                }

                task.title = updatedTask;
                task.priority = prioritySelect.value;

                saveTasks();
                renderTasks();
            });

            cancelButton.addEventListener("click", function () {
                renderTasks();
            });

            listItem.replaceChildren(editInput,prioritySelect, saveButton, cancelButton);
        });

        
        if(task.completed) {
            taskText.style.textDecoration = "line-through";
        }

        
        listItem.append(
            taskText,
            priorityText,
            completeButton,
            editButton,
            deleteButton);
        taskList.append(listItem);
    }
}

function updateTaskCount() {
    allCount.textContent = tasks.length;

    const activeTasks = tasks.filter(function (task){
        return !task.completed;
    });

    const completedTasks = tasks.filter(function (task){
        return task.completed;
    });

    activeCount.textContent = activeTasks.length;
    completedCount.textContent = completedTasks.length;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const task = taskInput.value.trim();

    if (task === "") {
        message.textContent = "Please enter a task.";
        return;
    }

    tasks.push({
        id: nextTaskId,
        title: task,
        completed: false,
        priority: taskPriority.value
    });

    nextTaskId++;

    saveTasks();

    taskInput.value = "";
    message.textContent = "Task added!";
    updateTaskCount();

    renderTasks();
    
});

searchInput.addEventListener("input", function () {
  renderTasks(); 
 });

 filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active-filter");
        });

        button.classList.add("active-filter");

        renderTasks();
    });
 });

 sortSelect.addEventListener("change", function (){
    renderTasks();
 })

 updateTaskCount();
 renderTasks();

 document.querySelector('[data-filter="all"]').classList.add("active-filter");


    


