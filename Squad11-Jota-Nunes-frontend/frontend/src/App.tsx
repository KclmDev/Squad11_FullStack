// src/App.tsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/custom.css';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se já está logado ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simulação de autenticação - substitir pela API real futuramente
    console.log('Tentativa de login com:', email, password);
    
    // Credenciais de exemplo para teste
    const validCredentials = [
      { email: 'atendente@jnunes.com', password: 'atendente123' },
      { email: 'gerente@jnunes.com', password: 'gerente123' },
      { email: 'superAdmin@jnunes.com', password: 'superadmin123' }
    ];

    const isValid = validCredentials.some(cred => 
      cred.email === email && cred.password === password
    );

    if (isValid) {
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'simulated-token-12345');
      localStorage.setItem('userEmail', email);
      console.log('Login bem-sucedido!');
    } else {
      alert('Credenciais inválidas. Use: admin@jnunes.com / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    console.log('Usuário deslogado');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;