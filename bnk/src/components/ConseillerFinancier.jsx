import React, { useState, useEffect } from "react";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import { useNavigate } from "react-router-dom";
import {
    LogOut, LayoutDashboard, CreditCard, ArrowRightLeft,
    BarChart2, ScanSearch, Lightbulb, TrendingUp, Bell
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();

    // --- ÉTAT DES DONNÉES ---
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- RÉCUPÉRATION BACKEND ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accRes, transRes] = await Promise.all([
                    fetch("http://localhost:8000/api/comptes"),
                    fetch("http://localhost:8000/api/transactions")
                ]);
                const accData = await accRes.json();
                const transData = await transRes.json();

                setAccounts(accData['hydra:member'] || accData || []);
                setTransactions(transData['hydra:member'] || transData || []);
                setLoading(false);
            } catch (error) {
                console.error("Erreur TLS Bank API:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- LOGIQUE DE CALCUL (PARE-BRISE IA) ---
    const parseMGA = (val) => {
        if (!val) return 0;
        // Extrait uniquement les chiffres)
        const digits = String(val).replace(/\D/g, '');
        return parseInt(digits, 10) || 0;
    };

    const formatMGA = (num) => new Intl.NumberFormat('fr-MG').format(num) + " MGA";

    // Calculs dynamiques
    const soldeTotal = accounts.reduce((sum, a) => sum + parseMGA(a.solde), 0);
    
    // Analyse des dépenses par catégorie
    const stats = transactions.reduce((acc, t) => {
        const amt = parseMGA(t.montantTransaction);
        const cat = t.categorieTransaction || "Autres";
        const type = String(t.typeTransaction).toLowerCase();

        if (type.includes('retrait') || type.includes('transfert')) {
            acc.byCat[cat] = (acc.byCat[cat] || 0) + amt;
            if (cat.toLowerCase().includes('nourriture')) acc.foodTotal += amt;
        }
        return acc;
    }, { byCat: {}, foodTotal: 0 });

    const topCat = Object.keys(stats.byCat).reduce((a, b) => stats.byCat[a] > stats.byCat[b] ? a : b, "Loisirs");
    const suggestionEpargne = Math.round(soldeTotal * 0.1);
    const economieAlim = Math.round(stats.foodTotal * 0.15);

    // --- GESTIONNAIRES DE BOUTONS ---
    const handleLogout = () => navigate('/login');
    
    const toggleAutoSave = () => {
        alert(`TLS Bank : Activation de l'épargne automatique de ${formatMGA(suggestionEpargne)}.`);
    };

    const handleAdjustBudget = () => {
        navigate('/statistiques'); 
    };

    const IconWithTooltip = ({ icon: Icon, label, active, onClick }) => {
        return (
            <div className="relative group flex items-center justify-center p-2 cursor-pointer" onClick={onClick}>
                <div className={`p-3 rounded-3xl transition-colors ${active ? "bg-[#0F172A] text-white w-20 h-6 flex justify-center relative right-2" : "text-white"} group-hover:text-orange-400`}>
                    <Icon size={20} />
                </div>
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap pointer-events-none z-50">
                    {label}
                </span>
            </div>
        );
    };

    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-[#4A001B]">Cerveau IA en cours de synchronisation...</div>;

    return (
        <div className="h-screen bg-[#F5F5F5] flex items-center justify-center">
            <div className="flex gap-8 w-full max-w-480 h-[90vh]">
                
                {/* SIDEBAR */}
                <aside className="w-20 h-220 bg-[#4A001B] rounded-[40px] flex flex-col items-center py-10 shadow-2xl shrink-0 overflow-visible">
                    <div className="flex flex-col items-center justify-between h-full">
                        <div className="flex flex-col items-center gap-8">
                            <div className="mb-2">
                                <img src={logo2} alt="Logo2" className="w-10 h-10 object-contain" />
                            </div>
                            <IconWithTooltip icon={LayoutDashboard} label="Menu" onClick={() => navigate('/dashboard')} />
                            <IconWithTooltip icon={CreditCard} label="Compte" onClick={() => navigate('/mes-cartes')} />
                            <IconWithTooltip icon={ArrowRightLeft} label="Transactions" onClick={() => navigate('/transaction')} />
                            <IconWithTooltip icon={BarChart2} label="Analyse financière" onClick={() => navigate('/analyse-financiere')} />
                            <IconWithTooltip icon={ScanSearch} label="Détecter anomalies" onClick={() => navigate('/detecter-anomalie')} />
                            <IconWithTooltip icon={Lightbulb} label="Conseiller financier IA" active onClick={() => navigate('/conseils-ia')} />
                            <IconWithTooltip icon={TrendingUp} label="Statistiques" onClick={() => navigate('/statistiques')} />
                            <IconWithTooltip icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />                
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-360 flex flex-col gap-12">

                        {/* TOP */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-bold text-[#4A001B]">TLS Bank</h1>
                                <p className="font-semibold tracking-widest text-xs uppercase text-gray-400">Transact Liquid Smartly</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <h2 className="text-3xl font-bold text-[#4A001B]">Conseiller financier IA</h2>
                                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">
                                    Déconnexion <LogOut size={18} />
                                </button>
                                <img src={user} alt="user" className="w-12 h-12 rounded-full border-2 border-[#4A001B]"/>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col lg:flex-row gap-10 max-w-full">
                            
                            <div className="flex flex-col gap-6">
                                
                                {/* CARD 1: ÉPARGNE */}
                                <div className="bg-white border border-gray-200 rounded-[35px] flex flex-col justify-center w-[900px] h-[350px] shadow-sm">
                                    <div className="flex gap-4">
                                        <div className="p-1 rounded-full text-green-600 relative left-8">
                                            <Lightbulb size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-2xl font-bold text-black relative left-8">Augmentez votre épargne</h3>
                                            <p className="text-xl text-gray-800 leading-relaxed max-w-[95%] relative left-8">
                                                Solde global : <span className="font-bold">{formatMGA(soldeTotal)}</span>. <br />
                                                Suggestion IA : mettre de côté <span className="font-semibold text-green-600">{formatMGA(suggestionEpargne)}</span> automatiquement.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-3 mt-4 w-full max-w-[400px] relative left-18">
                                        <button onClick={toggleAutoSave} className="bg-[#B9C9D6] hover:bg-[#a7b9c9] text-black font-medium h-15 rounded-xl text-xl transition-colors shadow-sm">
                                            Activer l'épargne automatique
                                        </button>
                                        <button onClick={() => alert("Changer le montant...")} className="bg-[#92EFA9] hover:bg-[#7ded97] text-black font-medium h-15 rounded-xl text-xl transition-colors shadow-sm">
                                            Modifier le montant
                                        </button>
                                    </div>
                                </div>

                                {/* CARD 2: ALIMENTAIRE */}
                                <div className="bg-white border border-gray-200 rounded-[35px] justify-center w-[900px] h-[350px] flex flex-col gap-4 shadow-sm">
                                    <div className="flex gap-4" >
                                        <div className="p-1 rounded-full text-green-600  relative left-8">
                                            <Lightbulb size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-2xl font-bold text-black relative left-8">Réduisez vos dépenses</h3>
                                            <p className="text-xl text-gray-800 leading-relaxed max-w-[95%] relative left-8">
                                                Dépenses alimentation : <span className="font-bold text-red-500">{formatMGA(stats.foodTotal)}</span>. <br />
                                                Une réduction de 15% vous ferait économiser <span className="font-semibold text-blue-600">{formatMGA(economieAlim)}</span>.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-3 mt-4 w-full max-w-[400px] relative left-18">
                                        <button onClick={handleAdjustBudget} className="bg-[#B9C9D6] hover:bg-[#a7b9c9] text-black font-medium h-15 rounded-xl text-xl transition-colors shadow-sm">
                                            Ajuster mon budget
                                        </button>
                                        <button onClick={() => navigate('/transaction')} className="bg-[#92EFA9] hover:bg-[#7ded97] text-black font-medium h-15 rounded-xl text-xl transition-colors shadow-sm">
                                            Voir les détails
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* COLONNE DROITE - APERÇU RAPIDE */}
                            <div className="w-[520px] flex flex-col">
                                <div className="bg-white border border-gray-200 rounded-[35px] h-[300px] flex flex-col justify-center shadow-sm gap-3">
                                    <div className="flex items-center gap-3 relative bottom-7">
                                        <div className="text-black relative left-8">
                                            <ScanSearch size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold relative left-8">Radar Financier</h3>
                                    </div>

                                    <ul className="max-w-[85%] gap-2 flex flex-col relative left-8 bottom-7">
                                        <li className="flex items-start gap-3">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-black"></span>
                                            <p className="text-xl">
                                                Top dépenses : <span className="font-medium text-gray-700">{topCat}</span>
                                            </p>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-black"></span>
                                            <p className="text-xl">
                                                Liquidités : <span className="font-medium text-green-600">{formatMGA(soldeTotal)}</span>
                                            </p>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-black"></span>
                                            <p className="text-xl">
                                                Risque découvert : <span className="font-medium text-red-500">{soldeTotal < 50000 ? "Élevé" : "Faible"}</span>
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}