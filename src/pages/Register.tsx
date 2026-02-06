import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserPlus, User, Mail, Lock, Bike } from 'lucide-react';
import { motion } from 'motion/react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onRegister: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    // Mock registration logic - replace with actual API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful registration
      // Store user data (e.g., localStorage)
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      onRegister();
      onNavigate('home'); // Redirect to home page
    } catch (err) {
      setError('Erro ao registar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
        >
        <div className="flex items-center justify-center gap-3 mb-3">
        <Bike className="w-12 h-12 text-primary" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
        MotoOficina Premium
        </h1>
        </div>
        <p className="text-base text-muted-foreground">
        Serviços de Mecânica Especializada
        </p>
        </motion.div>


        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full flex justify-center"
        >
        <Card className="w-full max-w-3xl shadow-2xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
        <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <UserPlus className="h-7 w-7" />
        </div>
        <CardTitle className="text-3xl font-bold">Registar</CardTitle>
        <CardDescription className="text-base">
        Crie a sua conta para continuar.
        </CardDescription>
        </CardHeader>


        <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2 md:col-span-2">
        <Label htmlFor="name" className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        Nome
        </Label>
        <Input id="name" className="h-6 text-sm max-w-xs" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
        </div>


        <div className="space-y-2 md:col-span-2">
        <Label htmlFor="email" className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        Email
        </Label>
        <Input id="email" className="h-6 text-sm max-w-xs" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>


        <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        Senha
        </Label>
        <Input id="password" className="h-6 text-sm max-w-xs" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>


        <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        Confirmar Senha
        </Label>
        <Input id="confirmPassword" className="h-6 text-sm max-w-xs" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>


        {error && (
        <p className="md:col-span-2 text-red-500 text-sm text-center">{error}</p>
        )}


        <div className="md:col-span-2">
        <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
        {loading ? 'Registando...' : 'Registar'}
        </Button>
        </div>
        </form>


        <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Button variant="link" onClick={() => onNavigate('login')} className="p-0 h-auto font-semibold">
        Faça login
        </Button>
        </p>
        </div>
        </CardContent>
        </Card>
        </motion.div>


        <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 text-center text-sm text-muted-foreground"
        >
        <p>&copy; 2024 MotoOficina Premium. Todos os direitos reservados.</p>
        </motion.footer>
        </div>
);
};

export default RegisterPage;