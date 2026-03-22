const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function renderTasks() {
  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "done") return task.done;
    if (currentFilter === "pending") return !task.done;
    return true;
  });

  filteredTasks.forEach((task) => {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement("li");

    li.innerHTML = `
      <span onclick="toggleTask(${realIndex})" class="${task.done ? 'completed' : ''}">
        ${task.text}
      </span>

      <div class="actions">
        <button onclick="editTask(${realIndex})">Editar</button>
        <button onclick="deleteTask(${realIndex})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  const contador = document.getElementById("contador");
  if (contador) {
    const done = tasks.filter(t => t.done).length;
    contador.innerText = `Total: ${tasks.length} | Concluídas: ${done}`;
  }
}

function addTask() {
  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    done: false
  });

  input.value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const novoTexto = prompt("Editar tarefa:", tasks[index].text);

  if (novoTexto !== null && novoTexto.trim() !== "") {
    tasks[index].text = novoTexto;
    renderTasks();
  }
}

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function filterTasks(type, el) {
  currentFilter = type;

  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (el) el.classList.add("active");

  renderTasks();
}

function clearTasks() {
  const confirmar = confirm("Tem certeza que deseja apagar tudo?");
  
  if (confirmar) {
    tasks = [];
    localStorage.removeItem("tasks");
    renderTasks();
  }
}

renderTasks();