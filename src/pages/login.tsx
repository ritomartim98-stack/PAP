import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Lock } from 'lucide-react';
import { apiUrl } from '../lib/api';

export default function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Preencha todos os campos.');
    }

    try {
      setLoading(true);

      const res = await fetch(apiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Erro no login');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', String(data.userId));
      localStorage.setItem('clientId', String(data.clientId || ''));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin();
      onNavigate('home');

    } catch (err) {
      setError('Erro ao ligar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* container mais controlado */}
      <div className="w-full max-w-xs sm:max-w-sm">

        <Card className="p-5 rounded-xl shadow-md">

          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Entrar</CardTitle>
            <p className="text-xs text-gray-500">Entre na sua conta</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">

              <div>
                <Label className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    className="pl-10 h-9 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    className="pl-10 h-9 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center">{error}</p>
              )}

              <Button className="w-full h-9 text-sm" disabled={loading}>
                {loading ? 'A entrar...' : 'Entrar'}
              </Button>
            </form>

            <p className="text-center text-xs mt-4">
              Não tem conta?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-blue-600 hover:underline"
              >
                Registar
              </button>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
