import { eachDayOfInterval, formatDistance, subDays } from "date-fns";
import { initPage } from "./dom.js";

// Buttons
initPage();

class application {
  constructor() {
    this.projects = [];
  }

  init() {
    this.render();
    this.bindEvents();
    this.taskButtonDisable();
  }

  render() {
    console.log("render");
    todo.updateTasks();
    project.displayProjects();
    const modal = new taskModal();
  }

  get projectForStorage() {
    return this.projects;
  }
  set projectsFromStorage(projects) {
    this.projects = projects;
  }

  addProject(project) {
    this.projects.push(project);
  }

  bindEvents() {
    // Global click event capture and display class inner text
    document.addEventListener("click", (e) => {
      console.log(e.target.className);
      switch (e.target.className) {
        case "add-task":
          todo.addNewTask();
          break;
        // case "add-task-form": // Task Tip Text Init
        //   todo.handleTaskTip();
        //   break;
        case "close": // Close modal button
          taskModal.toggle();
          break;
        case "fa-solid fa-trash project-delete": // Project Delete
          project.deleteProject(e.target);
          break;
        case "fa-solid fa-edit project-edit": // Project Edit
          project.editProject(e.target);
          break;
        case "new-project-button": // Project Add
          project.newProject();
          break;
        case "new-project": // Project Selection
          project.selectProject(e.target);
          break;
        case "fa-solid fa-trash task-delete": // Task Delete
          todo.deleteTask(e.target);
          break;
        case "fa-solid fa-edit task-edit": // Task Edit
          taskModal.toggle();
          todo.editTask(e.target);
          break;
        case "fa-solid fa-check-circle task-complete": // Task Complete
          todo.completeTask(e.target);
          break;
        default:
          break;
      }
    });
    const filterButtons = document.querySelectorAll(".filter");
    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        console.log(e.target.dataset.index);
        switch (
          e.target.dataset.index // click handle for the filter buttons filter value
        ) {
          case "all":
            todo.filterTasks("all");
            break;
          case "today":
            todo.filterTasks("today");
            break;
          case "week":
            todo.filterTasks("week");
            break;
          case "important":
            todo.filterTasks("important");
            break;
          case "completed":
            todo.filterTasks("completed");
            break;
          default:
            break;
        }
      });
    });
  }

  get taskButtonStatus() {
    const taskButton = document.querySelector(".add-task");
    return taskButton.classList.contains("disabled");
  }

  get projectListLength() {
    return this.projects.length;
  }

  get selectedProject() {
    const projectDivs = document.querySelectorAll(".new-project");
    const selectedDiv = Array.from(projectDivs).find((div) =>
      div.classList.contains("selected")
    );
    return selectedDiv;
  }

  get selectedProjectTasks() {
    const selectedProject = this.selectedProject;
    const projectIndex = selectedProject.dataset.index;
    const selectedProjectTasks = this.projects[projectIndex].tasks;
    return selectedProjectTasks;
  }

  get filterButtonInnerContent() {
    const filterButtons = document.querySelectorAll(".filter");
    const selectedFilterButton = Array.from(filterButtons).find((button) =>
      button.classList.contains("selected")
    );
    return selectedFilterButton.textContent;
  }

  taskButtonDisable() {
    const taskButton = document.querySelector(".add-task");
    if (this.projects.length === 0) {
      taskButton.classList.add("disabled");
    } else if (this.projects.length > 0 && this.taskButtonStatus) {
      taskButton.classList.remove("disabled");
    }
  }
}

class project extends application {
  constructor() {
    super();
    this.name = `Project ${app.projects.length + 1}`;
    this.index = app.projects.length;
    this.editing = false;
    this.selected = false;
    this.tasks = [];
  }

  set editingProject(i) {
    this.editing = i;
  }
  set selectedProject(i) {
    this.selected = i;
  }

  static projectTasks(project) {
    if (project !== undefined) {
      return project.tasks;
    }
  }

  static currentProject() {
    const projectDivs = document.querySelectorAll(".new-project");
    if (projectDivs.length > 0) {
      const selectedDiv = Array.from(projectDivs).find((div) =>
        div.classList.contains("selected")
      );
      const projectIndex = selectedDiv.querySelector("h2").dataset.index;
      const projectArr = app.projects;
      for (let i = 0; i < app.projectListLength; i++) {
        if (app.projects[i].index == projectIndex) {
          return app.projects[i];
        }
      }
    } else {
      return undefined;
    }
  }

  static newProject() {
    const newProject = new project();
    newProject.tasks = [];
    app.projects.push(newProject);
    console.log(app.projects);
    project.updateProjects();
    app.taskButtonDisable();
    todo.updateTasks();
    return newProject;
  }

  static updateProjects() {
    project.updateProjectCount();
    project.displayProjects();
    project.defaultSelection();
    todo.updateTasks();
  }

  static updateProjectCount() {
    const projectCountText = document.querySelector(".project-text");
    projectCountText.textContent = `Projects (${app.projects.length})`;
  }

  static displayProjects() {
    const projectContainer = document.querySelector(".project-list");
    projectContainer.innerHTML = "";
    for (const project of app.projects) {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("new-project");
      projectDiv.innerHTML = `
          <h2 data-index="${project.index}" class="new-project"># ${project.name}</h2>
          <div class="project-buttons">
            <a href="#"><i class="fa-solid fa-edit project-edit"></i></a>
            <a href="#"><i class="fa-solid fa-trash project-delete"></i></a>
          </div>
        `;
      if (project.selected) {
        projectDiv.classList.add("selected");
      }
      projectContainer.appendChild(projectDiv);
    }
  }

  static defaultSelection() {
    // if no project is selected or if there is only 1 project, select the first one, add the selected class and toggle its selected property
    const projectDivs = document.querySelectorAll(".new-project");
    if (projectDivs.length > 0) {
      const selectedDiv = Array.from(projectDivs).find((div) =>
        div.classList.contains("selected")
      );
      if (selectedDiv === undefined || projectDivs.length === 1) {
        projectDivs[0].classList.add("selected");
        app.projects[0].selectedProject = true;
      }
    }
  }

  static deleteProject(target) {
    const projectDiv = target.parentElement.parentElement.parentElement;
    const projectIndex = projectDiv.querySelector("h2").dataset.index;
    const projectArr = app.projects;
    for (let i = 0; i < app.projectListLength; i++) {
      if (app.projects[i].index == projectIndex) {
        // if the project index matches the index of the project in the array, remove it
        projectArr.splice(i, 1);
        projectDiv.remove();
        project.updateProjects();
      }
    }
    app.taskButtonDisable();
    todo.updateTasks();
  }

  static selectProject(target) {
    const projectDiv = target;
    const projectIndex = projectDiv.querySelector("h2").dataset.index;
    console.log(projectIndex);
    const projectArr = app.projects;
    for (let i = 0; i < app.projectListLength; i++) {
      if (app.projects[i].index == projectIndex) {
        projectArr[i].selected = true;
        projectDiv.classList.add("selected");
      } else {
        projectArr[i].selected = false;
        projectDiv.classList.remove("selected");
      }
    }
    project.updateProjects();
  }
}

class todo extends project {
  constructor(title, description, dueDate, priority, notes) {
    super();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.editing = false;
    this.index = project.currentProject().tasks.length;
    this.isComplete = false;
  }
  get isEditing() {
    return this.editing;
  }
  set isEditing(value) {
    this.editing = value;
  }
  get taskInputs() {
    let title = document.getElementById("task-title").value;
    let dueDate = document.getElementById("task-due-date").value;
    let prioritySelect = document.getElementById("task-priority");
    let priority = prioritySelect.options[prioritySelect.selectedIndex].value;

    let formattedDate = new Date(dueDate);

    // set default values
    if (title === "") {
      title = `Task ${project.currentProject().tasks.length + 1}`;
    }
    if (dueDate === "") {
      dueDate = "No due date";
    }

    console.log(title, dueDate, priority);
    return [title, dueDate, priority]; // return an array of the inputs
  }

  static addNewTask() {
    const newTask = new todo();
    const taskInputs = newTask.taskInputs; // get the inputs from the taskInputs getter
    newTask.title = taskInputs[0];
    newTask.dueDate = taskInputs[1];
    newTask.priority = taskInputs[2];
    newTask.description = " ";

    console.log({ newTask } + " to add");

    let selectedProject = project.currentProject();
    console.log(selectedProject);
    // destructuring the selected project object to get the tasks array
    const selectedProjectTasks = project.projectTasks(selectedProject);
    // push the new task to the tasks array
    selectedProjectTasks.push(newTask);
    // update the tasks
    todo.updateTasks();
  }

  static deleteTask(target) {
    const taskDiv = target.parentElement.parentElement.parentElement;
    console.log(taskDiv);
    const taskIndex = taskDiv.querySelector("h2").dataset.index;
    const taskArr = project.currentProject().tasks;
    console.log(taskArr);
    console.log(taskIndex);
    for (let i = 0; i < taskArr.length; i++) {
      if (taskArr[i].index == taskIndex) {
        // if the task index matches the index of the task in the array, remove it
        taskArr.splice(i, 1);
        taskDiv.remove();
        todo.updateTasks();
      }
    }
  }

  static editTask(target) {
    const taskDiv = target.parentElement.parentElement.parentElement;
    const taskIndex = taskDiv.querySelector("h2").dataset.index;
    const taskArr = project.currentProject().tasks;
    for (let i = 0; i < taskArr.length; i++) { 
      if (taskArr[i].index == taskIndex) {
        taskArr[i].isEditing = true;
        todo.updateTasks();
      }
    }
    // get task that is being edited
    const task = taskArr.find((task) => task.index == taskIndex);
    // set the values of the inputs to the values of the task
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("due-date").value = task.dueDate;
    document.getElementById("priority").value = task.priority;

    const saveButton = document.querySelector(".new-task-button");
    let saveText = "Save";
    saveButton.textContent = saveText;

    // add event listener to save button
    saveButton.addEventListener("click", () => {
      task.title = document.getElementById("title").value;
      task.description = document.getElementById("description").value;
      task.dueDate = document.getElementById("due-date").value;
      task.priority = document.getElementById("priority").value;
      task.isEditing = false;
      todo.updateTasks();
      // remove the event listener after it's been used
      saveButton.removeEventListener("click", () => {});
      taskModal.close();
    });
  }

  static filterTasks(filter) {
    const taskDivs = document.querySelectorAll(".todo");
    // get the tasks array from the current project
    const currentProject = project.currentProject();
    const taskArr = currentProject?.tasks;

    // Clear the selected filter from all the buttons
    const filterButtons = document.querySelectorAll(".filter");
    filterButtons.forEach((button) => {
      button.classList.remove("selected");
    });

    const newDate = new Date();
    const checkToday = newDate.toDateString();
    const checkWeek = newDate.setDate(newDate.getDate() + 7);
    const weekString = new Date(checkWeek).toDateString();

    const currentFilterText = document.querySelector(".current-filter");

    if (taskDivs.length > 0) {
      switch (
        filter // switch statement for the header
      ) {
        case "all":
          currentFilterText.innerHTML = `<i class="fa-regular fa-calendar"></i> All`;
          break;
        case "today":
          currentFilterText.innerHTML = `<i class="fa-solid fa-calendar-day"></i> Today`;
          break;
        case "week":
          currentFilterText.innerHTML = `<i class="fa-solid fa-calendar-week"></i> This Week`;
          break;
        case "important":
          currentFilterText.innerHTML = `<i class="fa-regular fa-calendar-xmark"></i> Important`;
          break;
        case "completed":
          currentFilterText.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Completed`;
          break;
      }
      switch (
        filter // switch statement for the tasks
      ) {
        case "all":
          filterButtons[0].classList.add("selected");
          taskDivs.forEach((task) => {
            task.style.display = "flex";
          });
          break;
        case "today":
          filterButtons[1].classList.add("selected");
          taskDivs.forEach((task) => {
            task.style.display = "none";
          });
          taskArr.forEach((task) => {
            const taskDate = new Date(task.dueDate);
            const taskDateString = taskDate.toDateString();
            taskDateString === checkToday
              ? (taskDivs[task.index].style.display = "flex")
              : (taskDivs[task.index].style.display = "none");
          });

          break;
        case "week":
          filterButtons[2].classList.add("selected");
          taskDivs.forEach((task) => {
            task.style.display = "none";
          });
          taskArr.forEach((task) => {
            const taskDate = new Date(task.dueDate);
            const taskDateString = taskDate.toDateString();
            if (taskDateString <= weekString) {
              taskDivs[task.index].style.display = "flex";
            } else {
              taskDivs[task.index].style.display = "none";
            }
          });
          break;
        case "important":
          filterButtons[3].classList.add("selected");
          taskDivs.forEach((task) => {
            task.style.display = "none";
          });
          taskArr.forEach((task) => {
            console.log(task.priority);
            if (task.priority === "High") {
              taskDivs[task.index].style.display = "flex";
            } else {
              taskDivs[task.index].style.display = "none";
            }
          });
          break;
        case "completed":
          filterButtons[4].classList.add("selected");
          taskDivs.forEach((task) => {
            task.style.display = "none";
          });
          taskArr.forEach((task) => {
            if (task.isComplete === true) {
              taskDivs[task.index].style.display = "flex";
            } else {
              taskDivs[task.index].style.display = "none";
            }
          });
          break;
        default:
          break;
      }
    } else {
      const allFilters = document.querySelectorAll(".filter");
      allFilters.forEach((filter) => {
        filter.classList.remove("selected");
      });
      allFilters[0].classList.add("selected");
    }
  }

  static setDefaultAllFilter() {
    const allFilters = document.querySelectorAll(".filter");
    allFilters.forEach((filter) => {
      filter.classList.remove("selected");
    });
    allFilters[0].classList.add("selected");
  }

  static updateTaskComplete() {
    // Loop through all the task divs, check if isComplete is true and add the completed class to the div
    const taskDivs = document.querySelectorAll(".todo");
    for (const taskDiv of taskDivs) {
      const taskIndex = taskDiv.querySelector("h2").dataset.index;
      const taskArr = project.currentProject().tasks;
      for (let i = 0; i < taskArr.length; i++) {
        if (taskArr[i].index == taskIndex) {
          if (taskArr[i].isComplete) {
            taskDiv.classList.add("completed");
          } else {
            taskDiv.classList.remove("completed");
          }
        }
      }
    }
  }

  static completeTask(target) {
    const taskDiv = target.parentElement.parentElement.parentElement;
    console.log(taskDiv);
    const taskIndex = taskDiv.querySelector("h2").dataset.index;
    const taskArr = project.currentProject().tasks;
    for (let i = 0; i < taskArr.length; i++) {
      if (taskArr[i].index == taskIndex) {
        // if the task index matches the index of the task in the array, toggle its isComplete property
        taskArr[i].isComplete = !taskArr[i].isComplete;
      }
    }
    todo.updateTasks();
  }

  static updateTasks() {
    todo.updateTaskCount();
    todo.clearInputs();
    todo.updateTaskMessage();
    todo.displayTasks();
    todo.updateTaskComplete();
    todo.setDefaultAllFilter();
  }

  static updateTaskCount() {
    const taskCountText = document.querySelector(".task-display");
    const selectedProject = project.currentProject();
    if (selectedProject !== undefined) {
      const selectedProjectTasks = project.projectTasks(selectedProject);
      taskCountText.textContent = `Tasks (${selectedProjectTasks.length})`;
    }
  }

  static clearInputs() {
    const form = document.querySelector(".add-task-form");
    form.reset();
  }

  static updateTaskMessage() {
    const taskContainer = document.querySelector(".todos");
    const selectedProject = project.currentProject();
    if (selectedProject !== undefined) {
      // if there is a selected project
      const selectedProjectTasks = project.projectTasks(selectedProject);
      console.log(selectedProjectTasks.length);
      if (selectedProjectTasks.length === 0) {
        // if there are no tasks in the selected project
        console.log(selectedProjectTasks.length);
        taskContainer.innerHTML = `<p class="no-tasks">No tasks for this project <br><br> Add a task above</p>`;
      } else {
        return; // if there are tasks, return and don't display the message
      }
    } else {
      taskContainer.innerHTML = `<p class="no-tasks">No Projects to display<br><br>To get started, please create a project in the left column</p>`;
    }
  }

  static displayTasks() {
    const taskContainer = document.querySelector(".todos");
    const selectedProject = project.currentProject();

    if (selectedProject !== undefined && selectedProject.tasks.length > 0) {
      const selectedProjectTasks = project.projectTasks(selectedProject);
      taskContainer.innerHTML = "";
      for (let i = 0; i < selectedProjectTasks.length; i++) {
        const task = selectedProjectTasks[i];
        const taskStatus = task.isComplete ? "Completed" : "In Progress";
        const taskReformat = new Date(task.dueDate).toDateString();
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("todo");
        taskDiv.innerHTML = `
          <h2 data-index="${task.index}">${task.title}</h2> 
          <p class="task-description">${task.description}</p>

          <div class="todo-body">
            <div>
              <p class="todo-due-date"><span class="sub-heading">Due:</span>     ${taskReformat}</p>
              <p class="due-when"></p> 
            </div>
            <p class="todo-priority"><span class="sub-heading">Priority:</span>     ${task.priority}</p>
            <p class="todo-status"><span class="sub-heading">Status:</span>     ${taskStatus}</p>
          </div>
          <div class="todo-buttons">
            <a href="#"><i class="fa-solid fa-edit task-edit"></i></a>
            <a href="#"><i class="fa-solid fa-trash task-delete"></i></a>
            <a href="#"><i class="fa-solid fa-check-circle task-complete"></i></a>
          </div>
        `;
        taskContainer.appendChild(taskDiv);
      }
    }
  }
}

class taskModal extends application {
  constructor() {
    super();
    this.modal = this.renderModal();
  }
  renderModal() {
    const content = document.querySelector("#content");
    const taskModal = document.createElement("div");
    taskModal.classList.add("task-modal");
    // loop through tasks to get the one with isEditing set to true
    const taskArr = project.currentProject()
      ? project.currentProject().tasks
      : [];
    let task;
    for (let i = 0; i < taskArr.length; i++) {
      if (taskArr[i].isEditing) {
        task = taskArr[i];
      }
    }

    // const titleInput = task.title;
    // const descriptionInput = task.description;
    // const dueDateInput = task.dueDate;
    // const priorityInput = task.priority;

    taskModal.innerHTML = `
      <div class="task-modal-content">
        <span class="close">&times;</span>
        <form id="new-task" onsubmit="return false">
          <label for="title">Title</label>
          <input type="text" id="title" name="title" placeholder="Title" value="">
          <label for="description">Description</label>
          <textarea id="description" name="description" placeholder="Description"></textarea>
          <label for="due-date">Due Date</label>
          <input type="date" name="due-date" id="due-date" placeholder="Due Date" value="">
          <label for="priority">Priority</label>
          <select name="priority" id="priority">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button class="new-task-button" type="submit">Add</button>
        </form>
      </div>
    `;
    content.appendChild(taskModal);
  }
  static toggle() {
    console.log("toggle");
    taskModal.hasActiveClass ? taskModal.close() : taskModal.open();
  }
  static get hasActiveClass() {
    const taskModal = document.querySelector(".task-modal");
    return taskModal.classList.contains("active");
  }
  static open() {
    const taskModal = document.querySelector(".task-modal");
    taskModal.classList.add("active");
  }
  static close() {
    const taskModal = document.querySelector(".task-modal");
    taskModal.classList.remove("active");
  }
}

const app = new application();
app.init();
