"use client";

import { Board } from "../../components/Board";
import ChatBotPopup from "../../components/ChatBotPopup";
import NotificationModal from "@/components/NotificationModal";

export default function KanbanPage() {
  return (
    <div className="p-4 relative">
      {/* Painel principal do Kanban */}
      <Board />

      {/* Chatbot flutuante */}
      <ChatBotPopup />

      {/* Notificações */}
      <NotificationModal />
    </div>
  );
}
