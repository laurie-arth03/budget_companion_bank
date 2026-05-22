import React, { useState } from 'react';
import './Signup.css'; 
import illustration from '../assets/singin1.png';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Envoi des identifiants au serveur pour authentification JWT
      const response = await fetch('http://127.0.0.1:8000/api/login_check', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          username: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        
        // 2. Stockage du token JWT
        localStorage.setItem('token', data.token);

        if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }

        // 3. Redirection
        navigate('/dashboard'); 
      } else {
        // ÉCHEC : Mauvais identifiants
        setError(data.message || "E-mail ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Erreur : Impossible de contacter le serveur d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="left-panel">
        <div className="content-left">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-image" />
            <div className="logo-text">
              <h1>TLS Bank</h1>
              <p>Transact Liquid Smartly</p>
            </div>
          </div>
          <div className="illustration-wrapper">
            <img src={illustration} alt="Illustration" />
          </div>
        </div>
        <div className="footer-left">
          <a href="#terms" className="terms-link">Conditions générales d'utilisation</a>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-wrapper">
          <h2 className="form-title">Connexion</h2>
          
          {error && (
            <div style={{ 
              color: 'white', 
              backgroundColor: '#e74c3c', 
              padding: '10px', 
              borderRadius: '5px', 
              textAlign: 'center', 
              marginBottom: '15px',
              fontSize: '14px' 
            }}>
              {error}
            </div>
          )}

          <form className="signup-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>E-mail</label>
              <input 
                type="email" 
                name="email"
                required
                value={loginData.email}
                placeholder="Saisissez votre e-mail" 
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <div className="password-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={loginData.password}
                  placeholder="Saisissez votre mot de passe" 
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>

            <a href="#forgot" className="forgot-password">
                Mot de passe oublié ?
            </a>
          </form>
        </div>
        <div className="footer-right2">
          <span>Pas encore de compte ?</span>
          <button className="btn-login" onClick={() => navigate('/signup')}>
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;