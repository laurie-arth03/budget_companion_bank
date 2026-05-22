import React, { useState, useEffect } from "react";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import { useNavigate } from "react-router-dom";

import {
  LogOut,
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  BarChart2,
  ScanSearch,
  Lightbulb,
  TrendingUp,
  Bell,
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();

    // État initial du formulaire avec les nouveaux champs
    const initialFormState = {
        nomCompte: "",
        typeCompte: "Principal",
        solde: 0,
        date: new Date().toISOString().split('T')[0], 
        description: "",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [currentUser, setCurrentUser] = useState(null);

    // Charger l'utilisateur connecté au montage du composant
    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }, []);

    const handleCancel = () => {
        setFormData(initialFormState);
        navigate('/mes-cartes');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "solde" ? parseFloat(value) || 0 : value
        });
    };

    /**
     * Fonction de soumission synchronisé avec la BDD
     */
    const handleSubmit = async (e) => {
        if(e) e.preventDefault();

        const token = localStorage.getItem('token');
        // Récupération de l'ID dynamique de l'utilisateur connecté
        const userId = currentUser?.id || 5; 

        if (!token) {
            alert("Session expirée, veuillez vous reconnecter.");
            navigate('/login');
            return;
        }

        try {
            // Construction du payload incluant tous les attributs synchronisés
            const apiPayload = {
                nomCompte: formData.nomCompte,      
                description: formData.description,  
                solde: formData.solde,
                typeCompte: formData.typeCompte,
                client: `/api/clients/${userId}`    // Liaison avec l'ID utilisateur
            };

            const response = await fetch('http://localhost:8000/api/comptes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` // Sécurité JWT
                },
                body: JSON.stringify(apiPayload)
            });

            if (response.ok) {
                alert("Le compte '" + formData.nomCompte + "' a été ajouté avec succès !");
                setFormData(initialFormState);
                navigate('/mes-cartes'); 
            } else if (response.status === 401) {
                alert("Votre session a expiré. Redirection vers la connexion...");
                localStorage.clear();
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert("Erreur technique : " + (errorData.detail || "Vérifiez les données saisies."));
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Le serveur TLS Bank est actuellement injoignable.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
        
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
        <div className="h-screen bg-[#F5F5F5] flex items-center justify-center">
            <div className="flex gap-8 w-full max-w-480 h-[90vh]">
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
                                <p className="font-semibold">Bonjour, {currentUser?.prenomUtilisateur || 'Cher Client'}</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <h2 className="text-3xl font-bold text-[#4A001B]">Gestion de compte</h2>
                                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">
                                    Déconnexion <LogOut size={18} />
                                </button>
                                <img src={user} alt="user" className="w-12 h-auto rounded-full"/>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8 max-w-7xl relative left-17">
                            <form className="bg-white border border-black rounded-[40px] shadow-sm min-h-[668px] flex items-center flex-col justify-center p-10">
                                <h2 className="text-3xl font-bold text-center mb-20 text-black relative bottom-5">Nouveau compte bancaire</h2>
                                <div className="grid grid-cols-2 gap-x-24 gap-y-1 w-full max-w-5xl mx-auto">
                                    
                                    <div className="flex flex-col gap-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Nom personnalisé du compte</label>
                                            <input name="nomCompte" value={formData.nomCompte} onChange={handleChange} type="text" placeholder="Ex: Épargne Vacances" className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 focus:outline-none" required />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Type de compte</label>
                                            <div className="relative">
                                                <select name="typeCompte" value={formData.typeCompte} onChange={handleChange} className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 appearance-none focus:outline-none bg-white">
                                                    <option value="Principal">Compte Principal</option>
                                                    <option value="Courant">Compte Courant</option>
                                                    <option value="Epargne">Compte Épargne</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Dépôt initial (MGA)</label>
                                            <input name="solde" value={formData.solde} onChange={handleChange} type="number" className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 focus:outline-none" min="0" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Date d'ouverture</label>
                                            <input name="date" value={formData.date} onChange={handleChange} type="date" className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Note / Description</label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Détails du compte..." className="w-full h-[200px] text-xl text-center border border-black rounded-[25px] pt-12 focus:outline-none resize-none"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="pl-2 flex flex-row gap-4">
                                <button type="button" onClick={handleCancel} className="bg-[#4A001B] text-white justify-center rounded-[20px] px-3 py-10 flex items-center gap-4 h-15 w-50 hover:scale-95 transition-transform shadow-lg">
                                    <span className="text-xl">Annuler</span>
                                </button>   
                                <button type="button" onClick={handleSubmit} className="bg-[#0F172A] text-white justify-center rounded-[20px] px-3 py-10 flex items-center gap-4 h-15 w-50 hover:scale-95 transition-transform shadow-lg">
                                    <span className="text-xl">Créer le compte</span>
                                </button>    
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}