const express = require("express");
const router = express.Router();
const controller = require("../controllers/tasksController");

// GET /api/tasks -> lista todas as tarefas (com filtro opcional ?status=)
router.get("/", controller.listTasks);

// POST /api/tasks -> cadastra uma nova tarefa
router.post("/", controller.createTask);

// PATCH /api/tasks/:id -> altera status (ou outros campos) de uma tarefa
router.patch("/:id", controller.updateTask);

// DELETE /api/tasks/:id -> remove uma tarefa
router.delete("/:id", controller.deleteTask);

module.exports = router;
