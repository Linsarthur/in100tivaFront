import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export default function FormCriarTarefa({ onTarefaCriada }) {
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoStatus, setNovoStatus] = useState("a fazer");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    if (!novoTitulo.trim()) {
      setMensagem({
        tipo: "erro",
        texto: "Por favor, digite um título para a tarefa",
      });
      return;
    }

    try {
      setEnviando(true);
      setMensagem(null);

      const response = await api.post("/tarefas", {
        titulo: novoTitulo,
        descricao: novaDescricao,
        status: novoStatus,
      });

      console.log("Tarefa criada:", response.data);

      // Chamar callback para atualizar a lista de tarefas
      if (onTarefaCriada) {
        onTarefaCriada(response.data.tarefa || response.data);
      }

      // Limpar formulário
      setNovoTitulo("");
      setNovaDescricao("");
      setNovoStatus("a fazer");

      setMensagem({
        tipo: "sucesso",
        texto: "✅ Tarefa criada com sucesso!",
      });

      // Remover mensagem após 3 segundos
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      setMensagem({
        tipo: "erro",
        texto: `❌ Erro ao criar tarefa: ${error.message}`,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Criar Nova Tarefa
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Título e Status em grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              placeholder="Ex: Estudar JavaScript"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={enviando}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={novoStatus}
              onChange={(e) => setNovoStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={enviando}
            >
              <option value="a fazer">A fazer</option>
              <option value="em progresso">Em progresso</option>
              <option value="concluído">Concluído</option>
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descrição (opcional)
          </label>
          <textarea
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            placeholder="Adicione detalhes sobre a tarefa..."
            rows="3"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={enviando}
          />
        </div>

        {/* Mensagens */}
        {mensagem && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              mensagem.tipo === "sucesso"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        {/* Botão */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
          >
            {enviando ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                Criando...
              </>
            ) : (
              <>
                <span>+</span>
                Criar Tarefa
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}