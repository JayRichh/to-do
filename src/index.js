import { formatDistance, subDays } from "date-fns";
import { initPage } from "./dom.js";

initPage(); // Load the initial page

const addButton = document.querySelector(".add-task");
const addTaskTitle = document.querySelector("#add-task-title");
const closeModal = document.querySelector(".close");
const taskModal = document.querySelector(".task-modal");
const todos = document.querySelector(".todos");
const newTaskForm = document.querySelector("#new-task");
const addTaskButton = document.querySelector(".new-task-button");

class toDo {
  constructor(title, description, dueDate, priority, notes) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.editing = false;
    this.today = new Date(); // Today's date for the date picker
  }

  tasks = [];
  // Check if storage is empty and if not, set the tasks array to the tasks in local storage

  get taskSerialize() {
    return JSON.stringify(this.tasks);
  }

  set taskStorage(tasks) {
    this.tasks = JSON.parse(tasks);
    this.displayToDoList();
  }


  displayToDoList() {
    todos.innerHTML = "";
    this.tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task");
      taskDiv.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <h4>Due Date: ${formatDistance(new Date(task.dueDate), this.today)}</h4>
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
    this.bindTaskEvents();

    localStorage.setItem("tasks", this.taskSerialize); // Save the tasks to local storage via the setter
  }

  addTask(task) {
    this.tasks.push(task);
    addTaskTitle.value = "";
  }

  deleteTask(task) {
    const index = this.getIndexOfTask(task); // Get the index of the task
    const taskDiv = document.querySelectorAll(".task")[index]; // Get the task div
    taskDiv.classList.add("delete-animation"); // Add the animation class
    setTimeout(() => {
      this.tasks.splice(index, 1); // Remove the task from the array
      this.displayToDoList(); // Update the list
    }, 750);
  }

  editFormChanges() {
    if (this.editing) {
      addTaskButton.textContent = "Save";
    } else {
      addTaskButton.textContent = "Add";
    }
  }

  getAllToDoTasks() {
    return document.querySelectorAll(".task");
  }

  getIndexOfTask(task) {
    const tasks = Array.from(this.getAllToDoTasks());
    return tasks.indexOf(task);
  }

  editTask(task) {
    this.toggleModal();
    this.editing = true;
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
    dueDate.value = taskToEdit.dueDate;
    priority.value = taskToEdit.priority;
    notes.value = taskToEdit.notes;

    addTaskButton.addEventListener("click", (e) => {
      this.editing = false;
      e.preventDefault();
      taskToEdit.title = title.value;
      taskToEdit.description = description.value;
      taskToEdit.dueDate = dueDate.value;
      taskToEdit.priority = priority.value;
      taskToEdit.notes = notes.value;
      this.displayToDoList();
      newTaskForm.reset();
      this.toggleModal();
    });
    this.displayToDoList();
  }

  toggleModal() {
    taskModal.classList.toggle("active");
    if (!this.editing === false && taskModal.classList.contains("active")) {
      document.querySelector(".new-task-button").textContent = "Add";
    }
  }

  renderTitleInput() {
    const titleInput = document.getElementById("add-task-title");
    const formInput = document.getElementById("title");
    if (titleInput.value !== "" && formInput !== null) {
      formInput.value = titleInput.value;
    }
  }

  bindTaskEvents() {
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
        const index = this.getIndexOfTask(e);
        this.editTask(task);
      });
    });
  }

  bindGlobalEvents() {
    addButton?.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderTitleInput();
      this.toggleModal();
      console.log("clicked");
    });

    closeModal?.addEventListener("click", (e) => {
      e.preventDefault();
      newTaskForm.reset();
      this.toggleModal();
    });

    newTaskForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const task = toDo.getTask();
      this.addTask(task);
      this.displayToDoList();
      newTaskForm.reset();
      this.toggleModal();
    });
  }

  static init() {
    const toDo = new this();
    toDo.displayToDoList();
    toDo.bindGlobalEvents();
    // Check if storage is empty and if not, set the tasks array to the tasks in local storage
    if (localStorage.getItem("tasks") !== null) { 
      toDo.taskStorage = localStorage.getItem("tasks"); // Set the tasks array to the tasks in local storage via the setter = 
    }
    return toDo;
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
// Initialize the app
toDo.init();
