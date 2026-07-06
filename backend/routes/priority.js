const express = require("express");
const router = express.Router();
const controller = require("../controllers/priorityController");

// POST /api/priority -> recebe a lista de tarefas e devolve a prioridade
// sugerida (alta/media/baixa) para cada uma, usando a IA do Gemini.
router.post("/", controller.suggestPriorities);

module.exports = router;
