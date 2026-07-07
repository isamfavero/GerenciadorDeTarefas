// o armazenamento funciona via localStorage (no navegador). Aqui fica um placeholder simples em memória para o back-end não ficar vazio.

let tasks = [];

function listTasks(req, res) {
  const { status, search } = req.query;
  let result = tasks;

  if (status) {
    result = result.filter((t) => t.status === status);
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        (t.description || "").toLowerCase().includes(term)
    );
  }

  res.json(result);
}

function createTask(req, res) {
  const { title, description, dueDate, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: "O campo 'title' é obrigatório." });
  }

  const task = {
    id: Date.now().toString(),
    title,
    description: description || "",
    dueDate: dueDate || null,
    status: status || "pendente",
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
}

function updateTask(req, res) {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  Object.assign(task, req.body);
  res.json(task);
}

function deleteTask(req, res) {
  const { id } = req.params;
  const exists = tasks.some((t) => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
}

module.exports = { listTasks, createTask, updateTask, deleteTask };
