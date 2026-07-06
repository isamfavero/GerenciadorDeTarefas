// ---------------------------------------------
// Sugestão de prioridade das tarefas usando IA (Gemini)
// ---------------------------------------------

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Modelo "flash" é o mais indicado para uso gratuito: rápido e com
// uma cota diária generosa para projetos pequenos.
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function suggestPriorities(req, res) {
  const { tasks } = req.body;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error:
        "GEMINI_API_KEY não configurada. Crie o arquivo backend/.env com sua chave (veja .env.example).",
    });
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: "Envie uma lista de tarefas." });
  }

  // Monta um texto simples com as tarefas, para a IA entender o contexto
  const listaDeTarefas = tasks
    .map(function (task) {
      return (
        "- id: " +
        task.id +
        " | título: " +
        task.title +
        " | descrição: " +
        (task.description || "sem descrição") +
        " | prazo: " +
        (task.dueDate || "sem prazo")
      );
    })
    .join("\n");

  const hoje = new Date().toISOString().slice(0, 10);

  const prompt =
    "Você é um assistente que ajuda a priorizar tarefas de um gerenciador de tarefas.\n" +
    "Hoje é " +
    hoje +
    ".\n\n" +
    "Analise a lista de tarefas abaixo e sugira uma prioridade para cada uma: " +
    '"alta", "media" ou "baixa".\n' +
    "Considere o prazo (tarefas com prazo mais próximo ou atrasadas são mais urgentes) " +
    "e também o conteúdo da tarefa (título e descrição).\n\n" +
    "Tarefas:\n" +
    listaDeTarefas +
    "\n\n" +
    "Responda APENAS com um JSON no formato abaixo, sem nenhum texto antes ou depois:\n" +
    '[{ "id": "id-da-tarefa", "priority": "alta" }]';

  try {
    const response = await fetch(GEMINI_URL + "?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    const textoResposta =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
        ? data.candidates[0].content.parts[0].text
        : "";

    const textoLimpo = textoResposta.replace(/```json|```/g, "").trim();

    const prioridades = JSON.parse(textoLimpo);

    res.json(prioridades);
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    res
      .status(500)
      .json({ error: "Não foi possível gerar as sugestões de prioridade." });
  }
}

module.exports = { suggestPriorities };
