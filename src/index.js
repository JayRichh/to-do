import { eachDayOfInterval, formatDistance, subDays } from "date-fns";
import { initPage } from "./dom.js";

// Buttons
initPage();

class application {
  constructor() {
    this.projects = [];
  }

  init() {
    this.loadFromStorage();
    this.render();
    this.bindEvents();
    this.taskButtonDisable();
  }

  loadFromStorage() {
    // If there are projects in storage & the project list is not empty
    if (localStorage.getItem("projects") && this.projects.length < 1) {
      const projects = JSON.parse(localStorage.getItem("projects"));
      this.projects = projects;

      // update the project selection
      project.updateProjects();
      todo.updateTasks();
    }
  }

  render() {
    console.log("render");
    todo.updateTasks();
    project.displayProjects();
    const modal = new taskModal();
    // draw the graph
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
    if (projectDivs.length > 0 && projectDivs !== undefined) {
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

  static editProject(target) {
    const projectDiv = target.parentElement.parentElement.parentElement;
    const projectIndex = project.projectIndex(projectDiv);
    const project = app.projects[projectIndex];
    project.editingProject = true;
    projectDiv.innerHTML = `
      <input type="text" class="project-edit-input" value="${project.name}">
      <div class="project-buttons">
        <a href="#"><i class="fa-solid fa-check project-edit"></i></a>
        <a href="#"><i class="fa-solid fa-trash project-delete"></i></a>
      </div>
    `;
    document.addEventListener("click", (e) => {
      console.log(e.target.classList[2]);
      switch (e.target.classList[2]) {
        case "project-edit":
          project.editProjectConfirm(e.target);
          break;
        case "project-delete":
          project.editProjectCancel(e.target);
          break;
        default:
          break;
      }
    });
  }

  static editProjectConfirm(target) {
    const projectDiv = target.parentElement.parentElement.parentElement;
    const projectIndex = projectDiv.querySelector("h2").dataset.index;
    console.log(projectIndex);
    const projectArr = app.projects;
    for (let i = 0; i < app.projectListLength; i++) {
      if (app.projects[i].index == projectIndex) {
        app.projects[i].editingProject = false;
        app.projects[i].name = projectDiv.querySelector(
          ".project-edit-input"
        ).value;
        project.updateProjects();
      }
    }
  }

  static editProjectCancel(target) {
    const projectDiv = target.parentElement.parentElement.parentElement;
    const projectIndex = projectDiv.querySelector("h2").dataset.index;
    const projectArr = app.projects;
    for (let i = 0; i < app.projectListLength; i++) {
      if (app.projects[i].index == projectIndex) {
        app.projects[i].editingProject = false;
        project.updateProjects();
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

    return [title, dueDate, priority]; // return an array of the inputs
  }

  static addNewTask() {
    const newTask = new todo();
    const taskInputs = newTask.taskInputs; // get the inputs from the taskInputs getter
    newTask.title = taskInputs[0];
    newTask.dueDate = taskInputs[1];
    newTask.priority = taskInputs[2];
    newTask.description = " ";

    let selectedProject = project.currentProject();
    // destructuring the selected project object to get the tasks array
    const selectedProjectTasks = project.projectTasks(selectedProject);
    // push the new task to the tasks array
    selectedProjectTasks.push(newTask);
    // update the tasks
    todo.updateTasks();
  }

  static deleteTask(target) {
    const taskDiv = target.parentElement.parentElement.parentElement;
    const taskIndex = taskDiv.querySelector("h2").dataset.index;
    const taskArr = project.currentProject().tasks;
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
        taskArr[i].editing = true;

        // get the task inputs
        const todo = taskArr[i];
        const title = todo.title;
        const description = todo.description;
        const dueDate = todo.dueDate;
        const priority = todo.priority;

        // open the taskModal
        taskModal.toggle();

        // set the taskModal inputs to the task values
        document.getElementById("title").value = title;
        document.getElementById("description").value = description;
        document.getElementById("due-date").value = dueDate;
        document.getElementById("priority").value = priority;

        // event listen for the save button
        document
          .querySelector(".new-task-button")
          .addEventListener("click", () => {
            this.saveTask(target);
          });
      }
    }
  }

  static saveTask(target) {
    const taskDiv = target.parentElement.parentElement.parentElement;
    const taskIndex = taskDiv.querySelector("h2").dataset.index;
    const taskArr = project.currentProject().tasks;
    for (let i = 0; i < taskArr.length; i++) {
      if (taskArr[i].index == taskIndex) {
        taskArr[i].editing = false;

        // get the task inputs
        const todo = taskArr[i];
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const dueDate = document.getElementById("due-date").value;
        const priority = document.getElementById("priority").value;

        // Check that the right task is being edited
        if (taskArr[i].index == taskIndex) {
          // set the task values to the task inputs
          taskArr[i].title = title;
          taskArr[i].description = description;
          taskArr[i].dueDate = dueDate;
          taskArr[i].priority = priority;
        }
        // update the task

        // close the taskModal
        taskModal.close();

        // update the tasks
        this.updateTasks();
      }
    }
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
    // destroy graph then draw graph
    todo.destroyGraph();
    todo.drawGraph();
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
  static destroyGraph() {
    // get the canvas element, then clear it before drawing graph
    const ctx = document.getElementById("myChart");
    ctx?.remove();

    const canvas = document.createElement("canvas");
    canvas.id = "myChart";
    canvas.height = "200";
    canvas.width = "350";
    const graphContainer = document.querySelector(".chart-container");
    graphContainer.appendChild(canvas);
  }
  // method to draw graph from the number of tasks in the current project and graph them against due dates
  static drawGraph() {
    console.log("drawing graph");

    const ctx = document.getElementById("myChart").getContext("2d");

    const selectedProject = project.currentProject();
    const selectedProjectTasks = project.projectTasks(selectedProject);

    const taskDates = [];
    const taskCount = [];

    // if selectedProjectTasks is not empty or undefined
    if (selectedProjectTasks !== undefined && selectedProjectTasks.length > 0) {
      // loop through the tasks and push the due date into the taskDates array
      for (let i = 0; i < selectedProjectTasks.length; i++) {
        const task = selectedProjectTasks[i];
        const taskDate = new Date(task.dueDate).toDateString();
        taskDates.push(taskDate);
      }
    } else {
      // if there are no tasks, return and don't draw the graph
      return;
    }

    const uniqueDates = [...new Set(taskDates)];

    for (let i = 0; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      let count = 0;
      for (let j = 0; j < taskDates.length; j++) {
        if (date === taskDates[j]) {
          count++;
        }
      }
      taskCount.push(count);
    }

    // if there are no tasks, don't draw graph
    if (taskCount.length === 0) {
      return;
    } else {
      const myChart = new Chart(ctx, {
        // add title 
        type: "line",
        data: {
          labels: uniqueDates,
          datasets: [
            {
              label: "Tasks",
              data: taskCount,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
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

class storage extends application {
  get projects() {
    return JSON.parse(localStorage.getItem("projects"));
  }
  static saveProjects() {
    const localStorage = window.localStorage;
    //copy instance of the app.projects array
    const projects = [...app.projects];
    console.log(projects);
    // Check if array is empty
    if (projects.length === 0) {
      setTimeout(() => {
        console.log("No projects to save");
      }, 2000);
      localStorage.removeItem("projects");
    } else {
      // if not empty, save to local storage
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }
}

const app = new application();
app.init();

// handle localstorage on page unload
window.addEventListener("beforeunload", () => {
  storage.saveProjects();
});
