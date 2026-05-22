import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import {
  LogOut, LayoutDashboard, CreditCard, Wallet, ArrowRightLeft,
  BarChart2, ScanSearch, Lightbulb, TrendingUp, Bell, Eye, EyeOff, Plus
} from "lucide-react";

export default function Compte() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CONFIGURATION DES COULEURS PAR TYPE ---
  const getAccountStyle = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("courant")) {
      return { color: "#86EFAC", label: "Compte Courant" }; // Vert
    }
    if (t.includes("epargne")) {
      return { color: "#BFDBFE", label: "Compte Épargne" }; // Bleu
    }
    return { color: "#F59E0B", label: "Compte Principal" }; // Orange
  };

  const fetchAccounts = async () => {
    const token = localStorage.getItem('token'); // Récupération du Token
    
    if (!token) {
        navigate('/login');
        return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/comptes', {
        headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // <--- INDISPENSABLE
        }
      });
      
      if (response.status === 401) {
          navigate('/login');
          return;
      }

      const data = await response.json();
      setAccounts(Array.isArray(data) ? data : data['hydra:member'] || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.solde || 0), 0);
  const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR').format(amount) + " MGA";
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('fr-FR') : "--/--/----";

  const handleLogout = () => {
      localStorage.clear();
      navigate('/login');
  };
  const handleAjouterCompte = () => navigate('/ajouter-compte'); // Ajustez selon votre route d'ajout

  const IconWithTooltip = ({ icon: Icon, label, active, onClick }) => (
    <div className="relative group flex items-center justify-center p-2 cursor-pointer" onClick={onClick}>
      <div className={`p-3 rounded-xl transition-colors ${active ? "bg-[#0F172A] text-white w-20 h-6 flex justify-center relative right-2" : "text-white"} group-hover:text-orange-400`}>
        <Icon size={20} />
      </div>
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap pointer-events-none z-50">
        {label}
      </span>
    </div>
  );

  return (
    <div className="h-screen bg-[#F5F5F5] flex items-center justify-center font-sans">
      <div className="flex gap-10 w-full max-w-480 h-[90vh]">
        
        <aside className="w-20 h-220 bg-[#4A001B] rounded-[40px] flex flex-col items-center py-10 shadow-2xl shrink-0 overflow-visible">
          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex flex-col items-center gap-8">
              <div className="mb-2"><img src={logo2} alt="Logo2" className="w-10 h-10 object-contain" /></div>
              <IconWithTooltip icon={LayoutDashboard} label="Menu" onClick={() => navigate('/dashboard')} />
              <IconWithTooltip icon={CreditCard} label="Compte" active onClick={() => navigate('/mes-cartes')} />
              <IconWithTooltip icon={ArrowRightLeft} label="Transactions" onClick={() => navigate('/transaction')} />
              <IconWithTooltip icon={BarChart2} label="Analyse financière" onClick={() => navigate('/analyse-financiere')} />
              <IconWithTooltip icon={ScanSearch} label="Détecter anomalies" onClick={() => navigate('/detecter-anomalie')} />
              <IconWithTooltip icon={Lightbulb} label="Conseiller financier IA" onClick={() => navigate('/conseils-ia')} />
              <IconWithTooltip icon={TrendingUp} label="Statistiques" onClick={() => navigate('/statistiques')} />
              <IconWithTooltip icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-360 flex flex-col gap-12">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#4A001B]">TLS Bank</h1>
                <p className="font-semibold">Transact Liquid Smartly</p>
              </div>
              <div className="flex items-center gap-6">
                <h2 className="text-3xl font-bold text-[#4A001B]">Mes comptes</h2>
                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">
                  Déconnexion <LogOut size={18} />
                </button>
                <img src={user} alt="user" className="w-12 h-auto rounded-full"/>
              </div>
            </div>

            <div className="flex gap-10 text-center items-end">
              <div className="bg-[#0F172A] text-white rounded-[30px] px-8 py-8 flex justify-center gap-40 items-center h-45 w-270">
                <div className="flex items-center gap-30">
                  <div><p className="text-lg">Solde Total</p><Wallet size={30} /></div>
                  <h2 className="text-3xl font-semibold w-[250px]">
                    {showBalance ? formatCurrency(totalBalance) : "**** MGA"}
                  </h2>
                </div>
                <div onClick={() => setShowBalance(!showBalance)} className="cursor-pointer">
                  {showBalance ? <Eye size={60} /> : <EyeOff size={60} />}
                </div>
              </div>
              <button onClick={handleAjouterCompte} className="bg-[#0F172A] text-white justify-center rounded-[20px] px-3 py-10 flex items-center gap-4 h-15 w-80 hover:scale-95 transition-transform shadow-lg">
                <Plus size={30}/><span className="text-xl leading-tight">Ajouter un compte</span>
              </button>
            </div>

            {/* LISTE DES COMPTES AVEC COULEURS DYNAMIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-10">
              {loading ? (
                <p>Chargement des comptes...</p>
              ) : accounts.length === 0 ? (
                <p className="text-xl text-gray-500">Aucun compte trouvé. Ajoutez-en un !</p>
              ) : (
                accounts.map((account) => {
                  const style = getAccountStyle(account.typeCompte);

                  return (
                    <div key={account.id} className="relative bg-white rounded-[30px] border-2 border-black p-10 gap-10 flex flex-col items-center justify-center shadow-sm min-h-[380px]">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: style.color }}></div>
                        {/* --- MODIFICATION ICI : Affiche le Nom du compte --- */}
                        <h3 className="text-2xl font-bold text-gray-800">
                            {account.nomCompte || style.label}
                        </h3>
                      </div>

                      <div className="flex flex-col gap-6 w-full max-w-[280px]">
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg text-gray-500">Type :</span>
                          <span className="text-2xl font-bold text-gray-900">{account.typeCompte}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg text-gray-500">Solde :</span>
                          <span className="text-2xl font-bold text-gray-900">{formatCurrency(account.solde)}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg text-gray-500">Ouvert le :</span>
                          <span className="text-2xl font-bold text-gray-900">{formatDate(account.dateCreation)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}