// ---------------------------------------------
// Gerenciador de Tarefas - lógica do front-end
// Armazenamento: localStorage do navegador
// ---------------------------------------------

const STORAGE_KEY = "tasks";

const form = document.getElementById("task-form");
const listEl = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const template = document.getElementById("task-item-template");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");
const aiPriorityBtn = document.getElementById("ai-priority-btn");
const aiPriorityStatus = document.getElementById("ai-priority-status");

let currentFilter = "todas";
let currentSearch = "";

// ---------- persistência (localStorage) ----------

function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------- crud ----------

function addTask({ title, description, dueDate, status }) {
  const tasks = getTasks();
  tasks.push({
    id: crypto.randomUUID(),
    title,
    description,
    dueDate,
    status, // "pendente" | "concluida"
    createdAt: new Date().toISOString(),
  });
  saveTasks(tasks);
}

function updateTaskStatus(id, status) {
  const tasks = getTasks().map((task) =>
    task.id === id ? { ...task, status } : task
  );
  saveTasks(tasks);
}

function updateTaskPriority(id, priority) {
  const tasks = getTasks().map((task) =>
    task.id === id ? { ...task, aiPriority: priority } : task
  );
  saveTasks(tasks);
}

function updateTaskDetails(id, { title, description, dueDate }) {
  const tasks = getTasks().map((task) =>
    task.id === id ? { ...task, title, description, dueDate } : task
  );
  saveTasks(tasks);
}

function deleteTask(id) {
  const tasks = getTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
}

// ---------- renderização ----------

function render() {
  const tasks = getTasks();

  let filtered =
    currentFilter === "todas"
      ? tasks
      : tasks.filter((task) => task.status === currentFilter);

  if (currentSearch) {
    const term = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.description || "").toLowerCase().includes(term)
    );
  }

  listEl.innerHTML = "";

  if (!filtered.length) {
    emptyState.style.display = "block";
    emptyState.textContent = currentSearch
      ? "Nenhuma tarefa encontrada para essa pesquisa."
      : "Nenhuma tarefa cadastrada ainda.";
  } else {
    emptyState.style.display = "none";
  }

  filtered
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .forEach((task) => renderTaskItem(task));
}

function renderTaskItem(task) {
  const node = template.content.firstElementChild.cloneNode(true);

  node.dataset.id = task.id;
  node.classList.toggle("completed", task.status === "concluida");

  const checkbox = node.querySelector(".task-status-checkbox");
  checkbox.checked = task.status === "concluida";
  checkbox.addEventListener("change", () => {
    updateTaskStatus(task.id, checkbox.checked ? "concluida" : "pendente");
    render();
  });

  node.querySelector(".task-title").textContent = task.title;

  // descrição só ocupa espaço na tela quando existe (para a prioridade "subir" e ficar logo abaixo do título quando não há descrição)
  const descriptionEl = node.querySelector(".task-description");
  if (task.description) {
    descriptionEl.textContent = task.description;
    descriptionEl.classList.remove("hidden");
  } else {
    descriptionEl.textContent = "";
    descriptionEl.classList.add("hidden");
  }

  const dueDateEl = node.querySelector(".task-due-date");
  if (task.dueDate) {
    dueDateEl.textContent = `Prazo: ${formatDate(task.dueDate)}`;
  } else {
    dueDateEl.textContent = "";
  }

  // prioridade sempre aparece ao lado do prazo. Se não houver descrição, essa linha (prazo + prioridade) já fica logo abaixo do título.
  const priorityEl = node.querySelector(".task-priority-badge");
  priorityEl.className = "task-priority-badge";
  if (task.aiPriority) {
    priorityEl.textContent = "Prioridade: " + task.aiPriority;
    priorityEl.classList.add("priority-" + task.aiPriority);
  } else {
    priorityEl.textContent = "";
  }

  // some com a linha inteira (prazo + prioridade) se não houver nada pra mostrar
  const metaEl = node.querySelector(".task-meta");
  if (!task.dueDate && !task.aiPriority) {
    metaEl.classList.add("hidden");
  } else {
    metaEl.classList.remove("hidden");
  }

  // ---------- edição da tarefa ----------
  const viewEl = node.querySelector(".task-view");
  const editEl = node.querySelector(".task-edit");
  const editTitleInput = node.querySelector(".edit-title");
  const editDescriptionInput = node.querySelector(".edit-description");
  const editDueDateInput = node.querySelector(".edit-due-date");

  const btnEdit = node.querySelector(".btn-edit");
  const btnSave = node.querySelector(".btn-save");
  const btnCancel = node.querySelector(".btn-cancel");

  btnEdit.addEventListener("click", () => {
    // preenche o formulário de edição com os valores atuais da tarefa
    editTitleInput.value = task.title;
    editDescriptionInput.value = task.description || "";
    editDueDateInput.value = task.dueDate || "";

    viewEl.classList.add("hidden");
    editEl.classList.remove("hidden");
    btnEdit.classList.add("hidden");
    btnSave.classList.remove("hidden");
    btnCancel.classList.remove("hidden");
  });

  btnCancel.addEventListener("click", () => {
    // descarta qualquer alteração e volta pro modo de visualização
    render();
  });

  btnSave.addEventListener("click", () => {
    const novoTitulo = editTitleInput.value.trim();

    if (!novoTitulo) {
      alert("O título não pode ficar vazio.");
      return;
    }

    updateTaskDetails(task.id, {
      title: novoTitulo,
      description: editDescriptionInput.value.trim(),
      dueDate: editDueDateInput.value,
    });

    render();
  });

  node.querySelector(".btn-google-add").addEventListener("click", () => {
    addTaskToGoogleCalendar(task);
  });

  node.querySelector(".btn-delete").addEventListener("click", () => {
    deleteTask(task.id);
    render();
  });

  listEl.appendChild(node);
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function isOverdue(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(isoDate) < today;
}

// ---------- eventos ----------

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  addTask({
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    dueDate: formData.get("dueDate"),
    status: "pendente",
  });

  form.reset();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    render();
  });
});

searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value.trim();
  render();
});

// pede à IA (back-end) uma sugestão de prioridade para as tarefas pendentes
aiPriorityBtn.addEventListener("click", () => {
  const tasks = getTasks().filter((task) => task.status === "pendente");

  if (tasks.length === 0) {
    aiPriorityStatus.textContent = "Não há tarefas pendentes para priorizar.";
    return;
  }

  aiPriorityStatus.textContent =
    "Pensando... (pode levar até 1 minuto na primeira vez, o servidor às vezes precisa \"acordar\")";
  aiPriorityBtn.disabled = true;

  fetch(`${BACKEND_URL}/api/priority`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks }),
  })
    .then((response) => response.json())
    .then((sugestoes) => {
      if (sugestoes.error) {
        throw new Error(sugestoes.error);
      }

      sugestoes.forEach((sugestao) => {
        updateTaskPriority(sugestao.id, sugestao.priority);
      });

      aiPriorityStatus.textContent = "Prioridades sugeridas com sucesso!";
      render();
    })
    .catch((error) => {
      console.error("Erro ao buscar sugestão de prioridade:", error);
      aiPriorityStatus.textContent =
        "Não foi possível gerar as sugestões. O back-end está rodando?";
    })
    .finally(() => {
      aiPriorityBtn.disabled = false;
    });
});

// ---------- Inicialização ----------

render();
