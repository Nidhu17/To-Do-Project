// GET HTML ELEMENTS
const addBtn = document.getElementById("add-btn");
const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const timeInput = document.getElementById("todo-time");
const list = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");
const searchInput = document.getElementById("search");

// TASK STATUS TYPES
const STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed"
};

// LOAD TASKS FROM LOCALSTORAGE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// CURRENT FILTER TYPE
let currentFilter = "all";

// SAVE TASKS TO LOCALSTORAGE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD NEW TASK
function addTask() {
  const text = input.value.trim();

  // EMPTY CHECK
  if (!text) return alert("Please enter a task!");

  // CREATE TASK OBJECT
  const task = {
    id: crypto.randomUUID(),
    text,
    date: dateInput.value,
    time: timeInput.value,
    status: STATUS.ACTIVE
  };

  // PUSH TASK
  tasks.push(task);

  // CLEAR INPUTS
  input.value = "";
  dateInput.value = "";
  timeInput.value = "";

  saveTasks();
  renderTasks();
}

// CHANGE FILTER TYPE
function setFilter(type) {
  currentFilter = type;
  renderTasks();
}

// DISPLAY TASKS
function renderTasks() {
  list.innerHTML = "";

  const search = (searchInput.value || "").toLowerCase();

  // FILTER LOGIC
  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.text.toLowerCase().includes(search);

    const matchFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && task.status === STATUS.ACTIVE) ||
      (currentFilter === "completed" && task.status === STATUS.COMPLETED);

    return matchSearch && matchFilter;
  });

  // NO TASKS MESSAGE
  if (filteredTasks.length === 0) {
    list.innerHTML = `<p style="color:white;text-align:center;">No tasks found</p>`;
    return;
  }

  // CREATE TASK ELEMENTS
  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    // IF COMPLETED
    if (task.status === STATUS.COMPLETED) {
      li.classList.add("completed");
    }

    // TASK HTML
    li.innerHTML = `
      <input type="checkbox" ${task.status === STATUS.COMPLETED ? "checked" : ""}>

      <div>
        <span>${task.text}</span><br>
        <small>${task.date || ""} ${task.time || ""}</small>
      </div>

      <button class="edit">✏️</button>
      <button class="delete">❌</button>
    `;

    // TOGGLE COMPLETE
    li.querySelector("input").addEventListener("change", (e) => {
      task.status = e.target.checked ? STATUS.COMPLETED : STATUS.ACTIVE;
      saveTasks();
      renderTasks();
    });

    // EDIT TASK
    li.querySelector(".edit").addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText) {
        task.text = newText;
        saveTasks();
        renderTasks();
      }
    });

    // DELETE TASK
    li.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    list.appendChild(li);
  });
}

// EVENTS
addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", renderTasks);

// CLEAR ALL TASKS
clearBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

// INITIAL LOAD
renderTasks();