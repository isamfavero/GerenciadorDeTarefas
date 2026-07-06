// ---------------------------------------------
// Integração com o Google Calendar
// ---------------------------------------------


// Variáveis que guardam o "estado" da integração com o Google
let googleClientReady = false; // true quando a API do Calendar terminou de carregar
let googleAuthReady = false; // true quando o login do Google terminou de carregar
let googleTokenClient = null; // objeto responsável por pedir o login ao usuário
let isConnectedToGoogle = false; // true depois que o usuário autoriza o app

const connectButton = document.getElementById("google-connect-btn");
const googleStatus = document.getElementById("google-status");

// Passo 1: carregar o "gapi.client", que é quem faz as chamadas para a API
function loadGapiClient() {
  gapi.load("client", function () {
    gapi.client
      .init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [GOOGLE_DISCOVERY_DOC],
      })
      .then(function () {
        googleClientReady = true;
      })
      .catch(function (error) {
        console.error("Erro ao carregar a API do Google Calendar:", error);
      });
  });
}

// Passo 2: preparar o login (OAuth) do Google
function loadGoogleAuth() {
  googleTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: GOOGLE_SCOPE,
    callback: function (response) {
      if (response.error) {
        console.error("Erro ao autorizar o Google Calendar:", response);
        return;
      }

      // Se chegou até aqui, o usuário autorizou o app
      isConnectedToGoogle = true;
      googleStatus.textContent = "Status: Conectado";
    },
  });

  googleAuthReady = true;
}

// Quando o usuário clica no botão "Conectar ao Google Calendar"
connectButton.addEventListener("click", function () {
  const aindaEstaCarregando = !googleClientReady || !googleAuthReady;

  if (aindaEstaCarregando) {
    alert(
      "O Google Agenda ainda está carregando. Aguarde alguns segundos e tente de novo."
    );
    return;
  }

  // Abre o pop-up de login/permissão do Google
  googleTokenClient.requestAccessToken();
});

// Passo 3: criar um evento na agenda a partir de uma tarefa
function addTaskToGoogleCalendar(task) {
  if (!isConnectedToGoogle) {
    alert("Conecte-se ao Google Agenda antes de adicionar a tarefa.");
    return;
  }

  if (!task.dueDate) {
    alert(
      "Essa tarefa não tem prazo definido. Adicione um prazo para poder enviar ao Calendar."
    );
    return;
  }

  const event = {
    summary: task.title,
    description: task.description || "",
    // "date" (sem hora) cria um evento de dia inteiro no dia do prazo
    start: { date: task.dueDate },
    end: { date: task.dueDate },
  };

  gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: event,
    })
    .then(function () {
      alert("Tarefa adicionada ao Google Agenda!");
    })
    .catch(function (error) {
      console.error("Erro ao criar evento no Google Calendar:", error);
      alert("Não foi possível adicionar a tarefa ao Google Agenda.");
    });
}

// Quando a página termina de carregar, prepara tudo do Google
window.addEventListener("load", function () {
  loadGapiClient();
  loadGoogleAuth();
});
