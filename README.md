# 📱 Frontend - Documentação

**Stack:** React + Vite + Tailwind + Axios  
**Deploy:** Vercel  
**URL:** `https://in100tiva-front.vercel.app/`

---

## 📁 Estrutura

```
src/
├── components/
│   ├── FormCriarTarefa.jsx
│   └── ItemTarefa.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🧩 Componentes

### App.jsx
```javascript
- Estado: tarefas[], carregando, erro
- Busca tarefas ao montar
- Passa callbacks para criar, atualizar, deletar
```

### FormCriarTarefa.jsx
```javascript
- Formulário para criar tarefa
- Campos: titulo (obrigatório), descricao, status
- POST /tarefas
```

### ItemTarefa.jsx
```javascript
- Card individual da tarefa
- Checkbox: marcar/desmarcar como concluído
- Editar: PUT /tarefas/:id
- Deletar: DELETE /tarefas/:id
```

---

## 🚀 Instalação

```bash
npm install
npm run dev
# http://localhost:5173
```

---

## 🔐 Variáveis

**.env**
```
VITE_API_URL=http://localhost:3000
```

**Em Vercel:**
```
VITE_API_URL=https://in100tivaback.onrender.com
```

---

## 🛠️ Usar a API

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL
});
```

---

## 🏗️ Build e Deploy

```bash
# Build local
npm run build

# Deploy Vercel
git push origin main
# Vercel faz deploy automaticamente
```

---

## 🎨 Tailwind Classes

- `bg-white` - Fundo branco
- `rounded-lg` - Bordas arredondadas
- `shadow-md` - Sombra
- `text-slate-900` - Texto escuro
- `hover:shadow-lg` - Hover

---

## 🐛 Erros Comuns

**CORS error:**
- Verifique se backend tem CORS habilitado
- Verifique URL do backend em `.env`

**Data inválida:**
- Verifique se `createdAt` vem da API

**Cannot find module:**
- `npm install`

---

**Versão:** 1.0.0 | **Status:** Produção ✅