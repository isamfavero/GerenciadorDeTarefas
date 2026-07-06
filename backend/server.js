require("dotenv").config();

const express = require("express");
const cors = require("cors");
const tasksRouter = require("./routes/tasks");
const priorityRouter = require("./routes/priority");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/tasks", tasksRouter);
app.use("/api/priority", priorityRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API do Gerenciador de Tarefas no ar" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
