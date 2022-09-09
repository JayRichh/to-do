import { formatDistance, subDays } from "date-fns";
import { initPage } from "./dom.js";

initPage(); // Load the initial page

const addButton = document.querySelector(".add-task");
const closeModal = document.querySelector(".close");
const taskModal = document.querySelector(".task-modal"); 
const todos = document.querySelector(".todos");
const newTaskForm = document.querySelector("#new-task");
const addTaskButton = document.querySelector(".new-task-button");

class toDo {
  constructor(title, description, dueDate, priority, notes) {
    this.title = title;
    this.description = description;
    this.dueDate = toDo.convertInpiutDateToPST(new Date(dueDate));
    this.priority = priority;
    this.notes = notes;
    this.editing = false;
    this.today = toDo.convertTimeToPST();
  }

  static tasks = [];

  static get isEditing() {
    return this.editing;
  }

  static convertTimeToPST() {
    const date = new Date(); // Get the current date
    const utc = date.getTime() + date.getTimezoneOffset() * 60000; // Get the UTC time
    const pst = new Date(utc + 3600000 * -7); // Convert the UTC time to PST
    return pst; // Return the PST time
  }

  static convertInpiutDateToPST(date) {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000; // Get the UTC time
    const pst = new Date(utc + 3600000 * -7); // Convert the UTC time to PST
    return pst; // Return the PST time
  }

  static convertTimeBackToViewFormat(date) {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000; // Get the UTC time
    const pst = new Date(utc + 3600000 * 7); // Convert the UTC time to PST
    return pst; // Return the PST time
  }

  static displayToDoList() {
    todos.innerHTML = "";
    if (this.tasks?.length > 0) {
      this.tasks.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>${formatDistance(task.dueDate, task.today, { addSuffix: true })}</p>
        <h4>Priority: ${task.priority}</h4>
        <h4>Notes:</h4>
        <p>${task.notes}</p>
        <div class="buttons">
         <button class="edit">Edit</button>
         <button class="delete">Delete</button>
        </div>
      `;
        todos.appendChild(taskDiv);
      });
      toDo.bindTaskEvents();
      toDo.saveToStorage();
    } else {
      todos.innerHTML = "<p class='no-task'>No tasks to display</p>";
    }
    toDo.editing = false;
  }

  static addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;
    const notes = document.getElementById("notes").value;
    const task = new toDo(
      title,
      description,
      dueDate,
      priority,
      notes
    );
    this.tasks.push(task);
    this.displayToDoList();
  }

  static get getTasks() {
    return this.tasks;
  }

  static deleteTask(task) {
    const index = this.getIndexOfTask(task);
    const taskDiv = document.querySelectorAll(".task")[index]; // Get the task div
    taskDiv.classList.add("delete-animation"); // Add the animation class
    setTimeout(() => {
      this.tasks.splice(index, 1); // Remove the task from the array
      this.displayToDoList(); // Update the list
    }, 750);
  }

  static editFormChanges() {
    if (toDo.isEditing === true) {
      addTaskButton.textContent = "Save";
    } else {
      addTaskButton.textContent = "Add";
    }
  }

  static getAllToDoTasks() {
    // Get all the tasks in the DOM
    return document.querySelectorAll(".task");
  }

  static getIndexOfTask(task) {
    // Get the index of the task in the array of tasks
    const tasks = Array.from(this.getAllToDoTasks());
    return tasks.indexOf(task);
  }

  // Match the task in the array with the task in the DOM
  static matchTask(task) {
    const index = this.getIndexOfTask(task);
    return this.tasks[index];
  }

  static handleAddTaskClick(task) {
    // Handle the click event on the add task button
    if (toDo.isEditing === false) {
      e.preventDefault();
      taskToEdit.title = title.value;
      taskToEdit.description = description.value;
      taskToEdit.dueDate = toDo.convertInpiutDateToPST(new Date(dueDate.value));
      taskToEdit.priority = priority.value;
      taskToEdit.notes = notes.value;

      // Remove the task from the array
      this.tasks.splice(index, 1);

      toDo.editing = false;
      toDo.editFormChanges();
    } else {
      toDo.editTask(task);
    }
  }

  static editTask(task) {
    console.log("editing" + this.editing);
    this.toggleModal();
    this.editFormChanges();

    const index = this.getIndexOfTask(task);
    console.log(index + "index");

    const taskToEdit = this.tasks[index];
    console.log(taskToEdit + "task to edit");

    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const dueDate = document.querySelector("#due-date");
    const priority = document.querySelector("#priority");
    const notes = document.querySelector("#notes");

    title.value = taskToEdit.title;
    description.value = taskToEdit.description;
    dueDate.value = taskToEdit.dueDate.toISOString().split("T")[0];
    priority.value = taskToEdit.priority;
    notes.value = taskToEdit.notes;

    addTaskButton.addEventListener("click", (e) => {
      this.handleAddTaskClick(task);
    });
  }

  static toggleModal() {
    taskModal.classList.toggle("active");
    if (!this.editing === false && taskModal.classList.contains("active")) {
      document.querySelector(".new-task-button").textContent = "Add";
    }
  }

  static renderTitleInput() {
    const titleInput = document.getElementById("add-task-title");
    const formInput = document.getElementById("title");
    if (titleInput.value !== "" && formInput !== null) {
      formInput.value = titleInput.value;
    }
  }

  static bindTaskEvents() {
    const tasks = this.getAllToDoTasks();
    tasks.forEach((task) => {
      // Edit and Delete buttons
      const deleteButton = task.querySelector(".delete");
      const editButton = task.querySelector(".edit");
      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.deleteTask(task);
      });
      editButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.editing = true;
        this.editTask(task);
      });
    });
  }

  static bindGlobalEvents() {
    addButton.addEventListener("click", (e) => {
      e.preventDefault();
      toDo.renderTitleInput();
      toDo.toggleModal();
    });

    closeModal.addEventListener("click", (e) => {
      e.preventDefault();
      newTaskForm.reset();
      toDo.toggleModal();
    });

    addTaskButton.addEventListener("click", (e) => {
      if (toDo.editing !== true) {
        e.preventDefault();
        toDo.addTask();
        toDo.toggleModal();
      }
    });
  }

  static init() {
    this.bindGlobalEvents();
    this.displayToDoList();
    toDo.tasks = [];
  }

  static saveToStorage() {
    if (this.tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    } else {
      localStorage.removeItem("tasks");
    }
  }

  static handleLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === "tasks") {
        console.log("tasks found");
        const tasks = JSON.parse(localStorage.getItem(key));
        this.tasks = tasks;
      }
    }
  }

  static getTask() {
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const dueDate = document.querySelector("#due-date").value;
    const priority = document.querySelector("#priority").value;
    const notes = document.querySelector("#notes").value;
    const task = {
      title,
      description,
      dueDate,
      priority,
      notes,
    };
    return task;
  }
}

toDo.init();