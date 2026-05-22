import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage'; 

import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Compte from './components/Compte';
import AjouterCompte from './components/AjouterCompte';
import Transaction from './components/Transaction';
import AjouterTransaction from './components/AjouterTransaction';
import AnalyseFinanciere from './components/AnalyseFinanciere';
import DetecterAnomalie from './components/DetecterAnomalie';
import ConseillerFinancier from './components/ConseillerFinancier';
import Statistiques from './components/Statistique';
import Notifications from './components/Notification';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mes-cartes" element={<Compte />} />
        <Route path="/ajouter-compte" element={<AjouterCompte />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/ajouter-transaction" element={<AjouterTransaction/>} />
        <Route path="/analyse-financiere" element={<AnalyseFinanciere/>} />
        <Route path="/detecter-anomalie" element={<DetecterAnomalie/>} />
        <Route path="/statistiques" element={<Statistiques />} />
        <Route path="/conseils-ia" element={<ConseillerFinancier />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;