import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export default function ItemTarefa({
  tarefa,
  onTarefaAtualizada,
  onTarefaDeletada,
}) {
  console.log("Tarefa completa:", tarefa);
  console.log("CreatedAt valor:", tarefa.createdAt);
  console.log("Type createdAt:", typeof tarefa.createdAt);

  const [marcada, setMarcada] = useState(
    tarefa.status === "concluído" ? true : false,
  );
  const [editando, setEditando] = useState(false);
  const [editTitulo, setEditTitulo] = useState(tarefa.titulo);
  const [editDescricao, setEditDescricao] = useState(tarefa.descricao || "");
  const [editStatus, setEditStatus] = useState(tarefa.status);
  const [carregando, setCarregando] = useState(false);

  const formatarData = (data) => {
    console.log("Tentando formatar:", data); // Debug

    if (!data) {
      console.warn("Data é vazia/null");
      return "Sem data";
    }

    try {
      // Tenta criar um Date object
      const dataObj = new Date(data);

      console.log("Data object:", dataObj);
      console.log("Timestamp válido?", dataObj.getTime());

      // Verifica se é válida
      if (isNaN(dataObj.getTime())) {
        console.error("Data inválida - NaN");
        return "Data inválida";
      }

      const resultado = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      console.log("Data formatada:", resultado);
      return resultado;
    } catch (error) {
      console.error("Erro ao formatar:", error);
      return "Erro na data";
    }
  };

  const getCorStatus = (status) => {
    const cores = {
      "a fazer": "bg-red-100 text-red-800",
      "em progresso": "bg-yellow-100 text-yellow-800",
      concluído: "bg-green-100 text-green-800",
    };
    return cores[status] || "bg-gray-100 text-gray-800";
  };

  // Marcar/desmarcar como concluído
  const handleCheckbox = async (e) => {
    const novoStatus = e.target.checked ? "concluído" : "a fazer";
    setMarcada(e.target.checked);

    try {
      setCarregando(true);
      const response = await api.put(`/tarefas/${tarefa._id}`, {
        status: novoStatus,
      });

      if (onTarefaAtualizada) {
        onTarefaAtualizada(response.data);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setMarcada(!e.target.checked); // Reverter em caso de erro
      alert("Erro ao atualizar tarefa");
    } finally {
      setCarregando(false);
    }
  };

  // Deletar tarefa
  const handleDeletar = async () => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        setCarregando(true);
        await api.delete(`/tarefas/${tarefa._id}`);

        if (onTarefaDeletada) {
          onTarefaDeletada(tarefa._id);
        }
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        alert("Erro ao deletar tarefa");
      } finally {
        setCarregando(false);
      }
    }
  };

  // Salvar edição
  const handleSalvarEdicao = async () => {
    if (!editTitulo.trim()) {
      alert("O título não pode estar vazio");
      return;
    }

    try {
      setCarregando(true);
      const response = await api.put(`/tarefas/${tarefa._id}`, {
        titulo: editTitulo,
        descricao: editDescricao,
        status: editStatus,
      });

      if (onTarefaAtualizada) {
        onTarefaAtualizada(response.data);
      }

      setEditando(false);
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
      alert("Erro ao editar tarefa");
    } finally {
      setCarregando(false);
    }
  };

  // Se está editando
  if (editando) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={editTitulo}
              onChange={(e) => setEditTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={carregando}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição
            </label>
            <textarea
              value={editDescricao}
              onChange={(e) => setEditDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              disabled={carregando}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={carregando}
            >
              <option value="a fazer">A fazer</option>
              <option value="em progresso">Em progresso</option>
              <option value="concluído">Concluído</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSalvarEdicao}
              disabled={carregando}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              {carregando ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={() => setEditando(false)}
              disabled={carregando}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exibir tarefa
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-slate-200 p-4 mb-4 flex items-start gap-4 transition ${
        marcada ? "opacity-70" : ""
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={marcada}
        onChange={handleCheckbox}
        disabled={carregando}
        className="w-5 h-5 mt-1 cursor-pointer flex-shrink-0"
      />

      {/* Conteúdo */}
      <div className="flex-1">
        <h3
          className={`text-lg font-semibold mb-2 ${
            marcada ? "text-slate-500 line-through" : "text-slate-900"
          }`}
        >
          {tarefa.titulo}
        </h3>

        {tarefa.descricao && (
          <p className="text-slate-600 text-sm mb-3">{tarefa.descricao}</p>
        )}

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getCorStatus(tarefa.status)}`}
          >
            {tarefa.status}
          </span>
       
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => setEditando(true)}
          disabled={carregando}
          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          title="Editar"
        >
          ✏️
        </button>
        <button
          onClick={handleDeletar}
          disabled={carregando}
          className="p-2 border border-slate-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
          title="Deletar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
