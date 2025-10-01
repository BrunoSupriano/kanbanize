'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../components/Input';
import FormButton from '../../components/FormButton';
import ErrorMessage from '../../components/ErrorMessage';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-full max-w-md text-center"
      >
        {/* Avatar simbólico */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold shadow">
            👤
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-blue-600">Login</h1>

        {erro && (
          <p className="text-red-500 text-sm mb-4 animate-pulse">{erro}</p>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          showToggle={true}
        />

        {/* Lembrar-me + esqueceu a senha */}
        <div className="flex items-center justify-between mt-2 mb-4 text-sm text-gray-600">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Lembrar-me
          </label>
          <Link href="/redefinir-senha" className="text-blue-600 hover:underline">
            Esqueci minha senha
        </Link>
        </div>

        {loading ? (
          <button
            disabled
            className="bg-blue-600 text-white px-4 py-2 rounded opacity-60 cursor-not-allowed flex items-center justify-center gap-2 w-full"
          >
            <i className="fas fa-spinner fa-spin"></i> Entrando...
          </button>
        ) : (
          <FormButton label="Entrar" />
        )}

        <p className="text-sm text-center mt-4 text-blue-600">
          Não tem conta?{' '}
          <Link href="/cadastro" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>

        {/* Login social */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 transition">
            <i className="fab fa-google text-red-500"></i> Google
          </button>
          <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 transition">
            <i className="fab fa-github"></i> GitHub
          </button>
        </div>
      </form>
    </div>
  );
}
