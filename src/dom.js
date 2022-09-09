import "date-fns";

export function initPage() {
  var content = document.getElementById("content");
  console.log("ayy");

  const date = new Date();

  const getDateYYYYMMDD = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  content.innerHTML = `
    <header>
      <a href="#" class="logo">
        <img src="/to-do/resources/logo.svg" alt="logo" />
      </a>
      <h1>To Do.</h1>
      <a href="#" class="github">
        <img src="/to-do/resources/github.svg" alt="github" />
      </a>
    </header>
    <main>
    <h2>Filter</h2>
      <div class="filter-container">
        <button data-index="all" class="filter"><i class="fa-regular fa-calendar"></i> All</button>
        <button data-index="today" class="filter"><i class="fa-solid fa-calendar-day"></i> Today</button>
        <button data-index="week" class="filter"><i class="fa-solid fa-calendar-week"></i> This Week</button>
        <button data-index="important" class="filter"><i class="fa-regular fa-calendar-xmark"></i> Important</button>
        <button data-index="completed" class="filter"><i class="fa-regular fa-calendar-check"></i> Completed</button>
      </div>
      <div class="project-container">
        <h2 class="project-text">Projects</h2>
        <button class="new-project-button">+</button>
        <div class="project-list">          
        </div>
      </div>
      <div class="todo-container">
        <div class="todo-header">
          <h1 class="current-filter"><i class="fa-regular fa-calendar"></i>  All</h1>
        </div>
        <form class="add-task-form">
          <label for="title" class="task-display">Tasks (0)</label>
          
          <input type="text" id="task-title" name="title" class="title-text" placeholder="Task Title">
          <div>
            <span class="input-tip">DUE DATE</span>
            <input type="date" id="task-due-date" name="due-date" class="due-date" value="${getDateYYYYMMDD}">
          </div>
          <div>
            <span class="input-tip">PRIORITY</span>
            <select name="priority" id="task-priority">
              <option class="priority-option" value="Low">Low</option>
              <option class="priority-option" value="Medium">Medium</option>
              <option class="priority-option" value="High">High</option>
            </select>
          </div>
          <button class="add-task" type="button">+</button>
        </form>
        <div class="todos">
        </div>
      </div>
    </main>
    <footer>
      <p>Created by Jayden</p>
    </footer>
    `;

}
