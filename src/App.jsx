import { useState, useEffect } from "react";
import axios from "axios";
import FormCriarTarefa from "./components/FormCriarTarefa";
import ItemTarefa from "./components/ItemTarefa";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarTarefas();
  }, []);

  const buscarTarefas = async () => {
    try {
      setCarregando(true);
      const response = await api.get("/tarefas");
      console.log("Tarefas carregadas:", response.data);
      setTarefas(Array.isArray(response.data) ? response.data : []);
      setErro(null);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setErro(error.message);
      setTarefas([]);
    } finally {
      setCarregando(false);
    }
    // ❌ REMOVA ESTAS 3 LINHAS (tarefa não existe aqui):
    // console.log("Tarefa recebida:", tarefa);
    // console.log("CreatedAt:", tarefa.createdAt);
    // console.log("Tipo de createdAt:", typeof tarefa.createdAt);
  };

  const handleTarefaCriada = (novaTarefa) => {
    setTarefas([...tarefas, novaTarefa]);
  };

  const handleTarefaAtualizada = (tarefaAtualizada) => {
    setTarefas(
      tarefas.map((t) =>
        t._id === tarefaAtualizada._id ? tarefaAtualizada : t,
      ),
    );
  };

  const handleTarefaDeletada = (idTarefa) => {
    setTarefas(tarefas.filter((t) => t._id !== idTarefa));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Gerenciador de Tarefas
          </h1>
          <p className="text-slate-600">
            Crie e acompanhe suas tarefas de forma organizada
          </p>
        </div>

        <FormCriarTarefa onTarefaCriada={handleTarefaCriada} />

        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Tarefas ({Array.isArray(tarefas) ? tarefas.length : 0})
          </h2>

          {carregando ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 mt-4">Carregando tarefas...</p>
            </div>
          ) : erro ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <strong>Erro:</strong> {erro}
            </div>
          ) : !tarefas || tarefas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center border border-slate-200">
              <p className="text-slate-500 text-lg">
                Nenhuma tarefa criada ainda
              </p>
              <p className="text-slate-400 mt-2">
                Crie sua primeira tarefa usando o formulário acima
              </p>
            </div>
          ) : (
            <div>
              {tarefas.map((tarefa) => (
                <ItemTarefa
                  key={tarefa._id}
                  tarefa={tarefa}
                  onTarefaAtualizada={handleTarefaAtualizada}
                  onTarefaDeletada={handleTarefaDeletada}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}