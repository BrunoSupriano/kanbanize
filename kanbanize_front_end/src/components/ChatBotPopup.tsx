"use client";

import React, { useState, useEffect, useRef } from "react";

const respostasFake = [
  "Interessante! Me conte mais sobre isso 🤔",
  "Entendido! Vou anotar essa informação 📘",
  "Hmm... posso te ajudar a organizar melhor suas tarefas?",
  "Legal! Isso parece importante 👍",
  "Ok, estou aqui para ajudar 😄",
  "Isso parece um desafio interessante 🚀",
];

function gerarResposta(texto: string): string {
  const lower = texto.toLowerCase();

  if (lower.includes("oi") || lower.includes("olá")) return "Oi! 😄 Como posso te ajudar hoje?";
  if (lower.includes("tarefa") && lower.includes("nova")) return "Quer que eu crie uma nova tarefa para você? ✏️";
  if (lower.includes("ajuda")) return "Claro! Posso te ajudar a gerenciar tarefas, prioridades ou status.";
  if (lower.includes("obrigado") || lower.includes("valeu")) return "De nada! Sempre pronto pra ajudar 😁";
  if (lower.includes("status")) return "Você pode alterar o status de uma tarefa diretamente no seu Kanban!";
  if (lower.includes("prioridade")) return "As prioridades disponíveis são: baixa, média, alta e urgente 🚦";

  return respostasFake[Math.floor(Math.random() * respostasFake.length)];
}

const ChatBotPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! 👋 Sou seu assistente virtual. Como posso ajudar?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Refs
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const botSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    botSound.current = new Audio("/sounds/pop.mp3");
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    if (inputRef.current) inputRef.current.focus();
  }, [messages, typing]);

  const simulateBotResponse = (userText: string) => {
    setTyping(true);

    setTimeout(() => {
      const resposta = gerarResposta(userText);
      setMessages((prev) => [...prev, { from: "bot", text: resposta }]);
      setTyping(false);

      if (botSound.current) {
        botSound.current.currentTime = 0;
        botSound.current.play().catch(() => {});
      }
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim() || typing) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    simulateBotResponse(input);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-[#1C2B40] border border-[#2E3C4F] rounded-2xl shadow-xl p-3 flex flex-col z-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#F1F5F9] font-semibold">Assistente Virtual</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-[#94A3B8] hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] text-sm ${
                  msg.from === "bot"
                    ? "bg-[#0F1C2E] text-[#F1F5F9]"
                    : "bg-[#00C49A] text-white ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Animação de digitação */}
            {typing && (
              <div className="flex items-center gap-1 text-[#94A3B8] mt-2">
                <div className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs ml-2 italic">Digitando...</span>
              </div>
            )}

            {/* Âncora de rolagem */}
            <div ref={chatEndRef}></div>
          </div>

          {/* Campo de entrada */}
          <div className="flex">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !typing && handleSend()}
              placeholder={typing ? "Aguarde..." : "Digite aqui..."}
              disabled={typing}
              className={`flex-1 rounded-l-xl p-2 bg-[#0F1C2E] text-[#F1F5F9] border border-[#2E3C4F] outline-none transition-all duration-300 ${
                typing ? "opacity-60 cursor-not-allowed animate-pulse border-[#00C49A]" : ""
              }`}
            />
            <button
              onClick={handleSend}
              disabled={typing}
              className={`px-4 rounded-r-xl transition duration-200 ${
                typing
                  ? "bg-[#2E3C4F] text-[#94A3B8] cursor-not-allowed"
                  : "bg-[#00C49A] text-white hover:opacity-90"
              }`}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-[#00C49A] text-white text-2xl shadow-lg hover:scale-105 transition"
        title="Abrir ChatBot"
      >
        💬
      </button>
    </>
  );
};

export default ChatBotPopup;
