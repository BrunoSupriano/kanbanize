"use client";

import { useState } from "react";
import { Board } from "../../components/Board";
import ChatBotPopup from "../../components/ChatBotPopup";
import NotificationModal from "@/components/NotificationModal";
import Header from "@/components/Header"; 

export default function KanbanPage() {
  const [isFormVisible, setFormVisible] = useState(false);

  const handleToggleForm = () => {
    setFormVisible(prev => !prev);
  };

  return (
    <> 
      <Header onAddTaskClick={handleToggleForm} />

      <div className="p-4 relative">
        <Board 
          isFormVisible={isFormVisible} 
          onCloseForm={handleToggleForm}
        />

        <ChatBotPopup />
        <NotificationModal />
      </div>
    </>
  );
}
