"use client";

import React, { useState, useEffect } from "react";
import { Column } from "./Column";
import TaskModal from "./TaskModal";
import { XMarkIcon } from '@heroicons/react/24/outline'; // Ícone para fechar

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
    } catch (err) { // CORREÇÃO APLICADA AQUI
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
        setModalTask(null);
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
        <form onSubmit={handleSubmit} className="absolute top-20 right-4 bg-white p-6 shadow-xl rounded-lg w-80 z-50 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Nova Tarefa</h2>
            <button type="button" onClick={onCloseForm} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleInputChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <textarea
            name="description"
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="todo">A Fazer</option>
            <option value="in-progress">Em Progresso</option>
            <option value="done">Concluído</option>
          </select>
          <select
            name="priority"
            value={form.priority}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            {editingTaskId ? "Salvar Alterações" : "Adicionar Tarefa"}
          </button>
        </form>
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
          color="bg-orange-100"
          tasks={tasks.filter((task) => task.status === "todo")}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
        <Column
          title="Em Progresso"
          status="in-progress"
          color="bg-yellow-100"
          tasks={tasks.filter((task) => task.status === "in-progress")}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
        <Column
          title="Concluído"
          status="done"
          color="bg-green-100"
          tasks={tasks.filter((task) => task.status === "done")}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
      </div>
    </>
  );
};
