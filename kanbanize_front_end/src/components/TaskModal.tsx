"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Task } from './Board'; 

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTask); 
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-xl border border-white/20 p-8 shadow-2xl rounded-2xl w-[400px] z-50"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Editar Tarefa</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título da tarefa"
            value={editedTask.title || ''}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <textarea
            name="description"
            placeholder="Adicione uma descrição..."
            value={editedTask.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <input
            type="date"
            name="date"
            value={editedTask.date || ''}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <select
            name="status"
            value={editedTask.status || 'todo'}
            onChange={handleInputChange}
            className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="todo">A Fazer</option>
            <option value="in-progress">Em Progresso</option>
            <option value="done">Concluído</option>
          </select>
          <select
            name="priority"
            value={editedTask.priority || 'baixa'}
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
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default TaskModal;
