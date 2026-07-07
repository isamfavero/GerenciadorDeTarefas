# Gerenciador de Tarefas
Aplicação web de gerenciamento de tarefas com IA para sugestão de prioridades e integração com Google Agenda. Front-end em JS puro + back-end em Node.js.
---
# Estrutura de pastas
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   └── tasks.js
│   └── controllers/
│       └── tasksController.js
---
# Como rodar a aplicação
## de forma local:
Nota: caso opte por testar de forma local, é necessário criar uma pasta para o projeto e colocar as duas pastas diponíveis no repositório dentro da pasta do projeto. 
* Front-end: abra `frontend/index.html` no navegador, ou sirva com uma extensão como "Live Server".
* Back-end: é necessário iniciar o servidor Express do NodeJS para garantir o funcionamento da integração com a API Gemini. Crie um terminal no projeto e digite cada uma dessas linhas por vez: 
```cd backend```
```npm install```
```npm run start```

## de forma online: 
o projeto está hospedado no servidor da Vercel (front-end) e também hospedado no Render (back-end). Para acessar de forma online basta acessar ```https://gerenciador-de-tarefas-chi-khaki.vercel.app/```
---
IMPORTANTE: Ao conectar sua conta google aparecerá uma mensagem de aviso dizendo "O google não verificou esse projeto". clique em "avançado" e depois clique em "Acessar gerenciador-de-tarefas-chi-khaki.vercel.app" 
