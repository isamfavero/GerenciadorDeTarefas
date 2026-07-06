// ---------------------------------------------
// Configuração da API do Google Calendar
// ---------------------------------------------
// Troque os valores abaixo pelas suas próprias chaves,
// criadas no Google Cloud Console.
//
// API_KEY      -> em "APIs & Services" > "Credentials" > "API key"
// CLIENT_ID    -> em "APIs & Services" > "Credentials" > "OAuth client ID"
//                 (tipo "Web application")
//
// Importante: o CLIENT_ID precisa ter, em "Authorized JavaScript origins",
// o endereço onde este projeto está rodando
// (ex: http://localhost:5500 ou a URL da Vercel).

const GOOGLE_API_KEY = "AIzaSyBNBKxWMa8KMywGx85xpy1aRCe7oN1uMlA";
const GOOGLE_CLIENT_ID = "789289620406-pj8kfepoq2qrrc9o20r2j63nv47o0p55.apps.googleusercontent.com";

// Permissão que o app vai pedir para o usuário: criar eventos na agenda
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar.events";

// Endereço que descreve a API do Google Calendar (não precisa mudar)
const GOOGLE_DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// ---------------------------------------------
// Configuração do back-end (usado na sugestão de prioridade com IA)
// ---------------------------------------------
// Enquanto estiver testando no seu computador, deixe como está.
// Quando publicar o back-end no Render, troque pela URL que o Render te
// deu (algo como "https://seu-projeto.onrender.com"), sem barra no final.
const BACKEND_URL = "http://localhost:3000";
