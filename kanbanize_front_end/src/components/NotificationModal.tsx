// components/NotificationModal.tsx
import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';

interface Notification {
  id: number;
  title: string;
  message: string;
}

const notifications: Notification[] = [
  { id: 1, title: 'Lembrete de tarefa', message: 'Você tem uma tarefa pendente no quadro Kanban.' },
  { id: 2, title: 'Atualização', message: 'O status da tarefa "Revisar código" foi alterado.' },
];

const NotificationModal: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition"
        title="Notificações"
      >
        <FaBell className="text-gray-800" size={20} />
      </button>

      {open && (
        <div className="mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 border-b font-semibold text-gray-700">Notificações</div>
          <ul>
            {notifications.map((n) => (
              <li key={n.id} className="p-4 border-b hover:bg-gray-50">
                <div className="font-medium text-gray-800">{n.title}</div>
                <div className="text-sm text-gray-600">{n.message}</div>
              </li>
            ))}
            {notifications.length === 0 && (
              <li className="p-4 text-gray-500">Nenhuma notificação.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
