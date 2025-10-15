'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../components/Input';
import FormButton from '../../components/FormButton';

const Illustration = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-white p-10">
    <div className="w-4/5 h-auto mb-6">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#8B5CF6" d="M49.2,-64.1C62.8,-53.4,72.3,-37.9,76.5,-21C80.7,-4.1,79.6,14.2,71.7,29.1C63.8,44,49,55.5,33.3,64C17.6,72.5,1,78,-16.4,76.9C-33.8,75.8,-52.1,68.1,-63.3,54.7C-74.5,41.2,-78.6,22,-77.8,3.7C-77,-14.5,-71.3,-31.8,-60.5,-45.3C-49.7,-58.8,-33.8,-68.6,-18.2,-72.5C-2.7,-76.3,12.5,-74.8,25.8,-71.8C39.1,-68.8,49.2,-64.1,49.2,-64.1Z" transform="translate(100 100)" />
        </svg>
    </div>
    <h2 className="text-3xl font-bold mb-2">Kanbanize</h2>
    <p className="text-lg text-indigo-200 text-center">
      Organize suas tarefas e impulsione sua produtividade.
    </p>
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), senha: senha.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('usuario', JSON.stringify(data));
        router.push('/kanban');
      } else {
        setErro(data.erro || 'Email ou senha incorretos.');
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
        <Illustration />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold shadow-inner">
              K
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-gray-800">Bem-vindo(a) de volta!</h1>
          <p className="text-gray-500 mb-6">Faça login para continuar.</p>

          {erro && (
            <p className="text-red-500 text-sm mb-4 animate-pulse">{erro}</p>
          )}

          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            showToggle={true}
          />
          
          <div className="flex items-center justify-between mt-2 mb-4 text-sm text-gray-600">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" /> Lembrar-me
            </label>
            <Link href="/redefinir-senha" className="text-indigo-600 hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          <FormButton label="Entrar" loading={loading} />

          <p className="text-sm text-center mt-4 text-gray-600">
            Não tem conta?{' '}
            <Link href="/cadastro" className="font-semibold text-indigo-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
          
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button type="button" className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" /> GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
