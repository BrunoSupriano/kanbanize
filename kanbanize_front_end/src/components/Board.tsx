"use client";

import React, { useState, useEffect } from "react";
import { Column } from "./Column";
import TaskModal from "./TaskModal";
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface Task {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  status?: string;
  priority?: "baixa" | "média" | "alta" | "urgente";
}

export const Board: React.FC<{ isFormVisible: boolean; onCloseForm: () => void; }> = ({ isFormVisible, onCloseForm }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    status: "todo",
    priority: "baixa" as Task["priority"],
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [modalTask, setModalTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3001/task");
      if (!res.ok) throw new Error("Erro ao buscar tarefas");
      const data = await res.json();
      const parsedTasks: Task[] = data.content.map((task: any) => ({
        id: String(task.id),
        title: task.titulo,
        description: task.descricao,
        date: task.data_vencimento?.split("T")[0] || "",
        status: task.situacao,
        priority: task.prioridade,
      }));
      setTasks(parsedTasks);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title: form.title,
      description: form.description || "-",
      date: form.date,
      priority: form.priority,
      status: form.status,
      idUser: 1,
    };
    try {
      const res = await fetch("http://localhost:3001/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        await fetchTasks();
      } else {
        console.error("Erro ao salvar tarefa:", await res.text());
      }
    } catch (err) {
      console.error("Erro de rede ao salvar tarefa:", err);
    }
    setForm({ title: "", description: "", date: "", status: "todo", priority: "baixa" });
    setEditingTaskId(null);
    onCloseForm();
  };
  
  const handleDrop = async (taskId: string, newStatus: string) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    const updateData = {
      title: taskToUpdate.title,
      description: taskToUpdate.description || "-",
      date: taskToUpdate.date,
      priority: taskToUpdate.priority,
      status: newStatus,
    };

    try {
      const res = await fetch(`http://localhost:3001/task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        await fetchTasks();
      } else {
        console.error("Erro ao mover tarefa:", await res.text());
      }
    } catch (err) {
      console.error("Erro de rede ao mover tarefa:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/task/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchTasks();
      } else {
        console.error("Erro ao excluir tarefa:", await res.text());
      }
    } catch (err) {
      console.error("Erro de rede ao excluir tarefa:", err);
    }
  };

  const handleSaveTask = async (updatedTask: Task) => {
    const updateData = {
      title: updatedTask.title,
      description: updatedTask.description || "-",
      date: updatedTask.date,
      priority: updatedTask.priority,
      status: updatedTask.status,
    };

    try {
      const res = await fetch(`http://localhost:3001/task/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        await fetchTasks();
        setModalTask(null); // Fecha o modal
      } else {
        console.error("Erro ao editar tarefa:", await res.text());
      }
    } catch (err) {
      console.error("Erro de rede ao editar tarefa:", err);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setModalTask(task);
    }
  };

  return (
    <>
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onCloseForm}>
          <form 
            onSubmit={handleSubmit} 
            onClick={(e) => e.stopPropagation()} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-xl border border-white/20 p-8 shadow-2xl rounded-2xl w-[400px] z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nova Tarefa</h2>
              <button type="button" onClick={onCloseForm} className="text-gray-500 hover:text-gray-800 transition-colors">
                  <XMarkIcon className="h-7 w-7" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Título da tarefa"
                value={form.title}
                onChange={handleInputChange}
                required
                className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <textarea
                name="description"
                placeholder="Adicione uma descrição..."
                value={form.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleInputChange}
                required
                className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="todo">A Fazer</option>
                <option value="in-progress">Em Progresso</option>
                <option value="done">Concluído</option>
              </select>
              <select
                name="priority"
                value={form.priority}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-700/50"
            >
              {editingTaskId ? "Salvar Alterações" : "Adicionar Tarefa"}
            </button>
          </form>
        </div>
      )}

      {modalTask && (
        <TaskModal
          task={modalTask}
          onClose={() => setModalTask(null)}
          onSave={handleSaveTask}
        />
      )}

      <div className="flex justify-center space-x-4 mt-4">
        <Column
          title="A Fazer"
          status="todo"
          color="bg-blue-100 border border-blue-200"
          tasks={tasks.filter((task) => task.status === "todo")}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
        <Column
          title="Em Progresso"
          status="in-progress"
          color="bg-blue-100 border border-blue-200"
          tasks={tasks.filter((task) => task.status === "in-progress")}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
        <Column
          title="Concluído"
          status="done"
          color="bg-blue-100 border border-blue-200"
          tasks={tasks.filter((task) => task.status === "done")}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
      </div>
    </>
  );
};
