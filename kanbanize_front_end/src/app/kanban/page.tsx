// page.tsx
"use client";

import { useState } from "react";
import { Board } from "../../components/Board";
import ChatBotPopup from "../../components/ChatBotPopup";
import NotificationModal from "@/components/NotificationModal";
import Header from "@/components/Header"; 

export default function KanbanPage() {
  const [isFormVisible, setFormVisible] = useState(false);
  
  const [activeModal, setActiveModal] = useState<'chat' | 'notification' | null>(null);

  const handleToggleForm = () => {
    setFormVisible(prev => !prev);
  };

  const handleToggleChat = () => {
    setActiveModal(prev => (prev === 'chat' ? null : 'chat'));
  };

  const handleToggleNotifications = () => {
    setActiveModal(prev => (prev === 'notification' ? null : 'notification'));
  };

  return (
    <> 
      <Header onAddTaskClick={handleToggleForm} />

      <div className="p-4 relative">
        <Board 
          isFormVisible={isFormVisible} 
          onCloseForm={handleToggleForm}
        />

        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-3">
          <ChatBotPopup 
            isOpen={activeModal === 'chat'} 
            onToggle={handleToggleChat} 
          />
          <NotificationModal 
            isOpen={activeModal === 'notification'} 
            onToggle={handleToggleNotifications} 
          />
        </div>
      </div>
    </>
  );
}
