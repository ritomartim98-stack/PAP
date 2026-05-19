import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User, Mail, Lock } from 'lucide-react';
import { apiUrl } from '../lib/api';

export default function RegisterPage({ onNavigate, onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      return setError('Preencha todos os campos.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Email inválido.');
    }

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem.');
    }

    if (password.length < 6) {
      return setError('Mínimo 6 caracteres.');
    }

    try {
      setLoading(true);

      const res = await fetch(apiUrl('/api/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Erro ao registar');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', String(data.userId));
      localStorage.setItem('clientId', String(data.clientId || ''));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));

      onRegister();
      onNavigate('home');

    } catch (err) {
      setError('Erro ao ligar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-sm sm:max-w-md mx-auto p-6 rounded-2xl shadow-lg">

        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Registar</CardTitle>
          <p className="text-sm text-gray-500">Crie a sua conta</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label>Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 h-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  className="pl-10 h-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  className="pl-10 h-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  className="pl-10 h-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <Button className="w-full h-10" disabled={loading}>
              {loading ? 'A registar...' : 'Registar'}
            </Button>
          </form>

          <p className="text-center text-xs mt-4">
            Já tem conta?{' '}
            <button onClick={() => onNavigate('login')} className="text-blue-600 hover:underline">
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
