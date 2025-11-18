'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NotificationModal from '@/components/NotificationModal';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    router.push('/login'); 
  };

  const goToKanban = () => {
    router.push('/kanban');
  };

  const goToCalendario = () => {
    router.push('/calendario'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Bem-vindo(a)!
        </h1>
        <p className="text-gray-700 mb-6">
          Que bom ter você por aqui. Sua jornada começa agora!
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={goToKanban}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ir para o Kanban
          </button>

          <button
            onClick={goToCalendario} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Ir para o Calendário
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
