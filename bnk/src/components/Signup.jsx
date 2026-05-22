import React, { useState } from 'react';
import './Signup.css';
import illustration from '../assets/singin1.png';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    cin: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    // Séparation du nom et prénom pour correspondre à l'API
    const nameParts = formData.fullName.trim().split(' ');
    const prenom = nameParts[0] || '';
    const nom = nameParts.slice(1).join(' ') || 'Client';

    try {
      const response = await fetch('http://127.0.0.1:8000/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json',
        },
        body: JSON.stringify({
          "numCompte": "ACC-" + Math.floor(Math.random() * 900000), 
          "cin": formData.cin,
          "activite": "Client",
          "nomUtilisateur": nom,
          "prenomUtilisateur": prenom,
          "motDePasseUtilisateur": formData.password,
          "emailUtilisateur": formData.email,
          "telephoneUtilisateur": formData.phone,
          "adresseUtilisateur": "Non renseignée"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data['hydra:description'] || data.detail || "Erreur d'inscription");
      }

      alert("Inscription réussie !");
      navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* SECTION GAUCHE */}
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
          <a href="#terms" className="terms-link">Conditions d'utilisation</a>
        </div>
      </div>

      {/* SECTION DROITE */}
      <div className="right-panel">
        <div className="form-wrapper">
          <h2 className="form-title">S'inscrire</h2>
          
          {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>
                Nom et Prénoms 
                {formData.fullName === '' && <span className="required-star"> *</span>}
              </label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                placeholder="Entrer votre nom et prénoms" 
                onChange={handleChange}
                required
              />
            </div>

            {/* NOUVEAU CHAMP CIN */}
            <div className="input-group">
              <label>
                Numéro CIN 
                {formData.cin === '' && <span className="required-star"> *</span>}
              </label>
              <input 
                type="text" 
                name="cin"
                value={formData.cin}
                placeholder="Entrer votre numéro de CIN" 
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>
                Email 
                {formData.email === '' && <span className="required-star"> *</span>}
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                placeholder="Entrer votre email" 
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Numéro de téléphone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                placeholder="Entrer votre numéro de téléphone" 
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>
                Mot de passe 
                {formData.password === '' && <span className="required-star"> *</span>}
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                placeholder="Entrer votre mot de passe" 
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>
                Confirmer le mot de passe 
                {formData.confirmPassword === '' && <span className="required-star"> *</span>}
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="Entrer votre mot de passe" 
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? "Chargement..." : "S'inscrire"}
            </button>
          </form>
        </div>

        <div className="footer-right">
          <span>Déjà un compte ?</span>
          <button className="btn-login" onClick={() => navigate('/login')}>Se connecter</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;