export function initPage() {
	var content = document.getElementById("content");
  console.log("ayy");

	content.innerHTML = `
	  <header>
	    <h1>To Do.</h1>
	  </header>
	  <main>
	    <form class="add-task-form">
        <label for="title">Add a new task below</label>
        <input type="text" id="add-task-title" name="title" placeholder="Title">
        <button class="add-task" type="button">Add Task</button>
	    </form>
	    <div class="todos">
	    </div>
	  </main>
    <footer>
      <p>Created by Jayden</p>
    </footer>
	`;

  const taskModal = document.createElement("div");

  taskModal.classList.add("task-modal");
  taskModal.innerHTML = `
    <div class="task-modal-content">
      <span class="close">&times;</span>
      <form id="new-task" onsubmit="return false">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" placeholder="Title">
        <label for="description">Description</label>
        <input type="text" name="description" id="description" placeholder="Description">
        <label for="due-date">Due Date</label>
        <input type="date" name="due-date" id="due-date" placeholder="Due Date" value="2022-12-30">
        <label for="priority">Priority</label>
        <select name="priority" id="priority">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <label for="notes">Notes</label>
        <input type="text" name="notes" id="notes" placeholder="Notes">
        <button class="new-task-button" type="submit">Add</button>
      </form>
    </div>
  `;
  content.appendChild(taskModal);
}