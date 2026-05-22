import React, { useState, useEffect } from "react";
import logo2 from '../assets/logo2.png';
import userImg from '../assets/user.jpg';
import { useNavigate } from "react-router-dom";
import {
  LogOut, LayoutDashboard, CreditCard, ArrowRightLeft, BarChart2,
  ScanSearch, Lightbulb, TrendingUp, Bell
} from "lucide-react";

export default function AnomalyDetection() {
    const navigate = useNavigate();
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + " MGA";

    // --- LOGIQUE DE DÉTECTION D'ANOMALIES ---
    const detectAnomalies = (transactions) => {
        const detected = [];
        const expenses = transactions.filter(t => t.typeTransaction?.toLowerCase() !== "depot");
        
        if (expenses.length === 0) return [];

        const avg = expenses.reduce((a, b) => a + b.montantTransaction, 0) / expenses.length;

        expenses.forEach(t => {
            // 1. Détection par rapport à la moyenne
            if (t.montantTransaction > avg * 2) {
                detected.push({
                    id: t.id,
                    title: "Dépense anormalement élevée",
                    description: `La transaction de ${formatCurrency(t.montantTransaction)} dans "${t.categorieTransaction}" dépasse largement votre moyenne habituelle (${formatCurrency(avg)}).`
                });
            }
            // 2. Détection par seuil fixe
            else if (t.montantTransaction > 1000000) {
                detected.push({
                    id: t.id,
                    title: "Alerte de sécurité",
                    description: `Une transaction importante de ${formatCurrency(t.montantTransaction)} a été effectuée sur votre compte.`
                });
            }
        });

        // 3. Comportement inhabituel
        const dates = transactions.map(t => new Date(t.dateTransaction).toLocaleDateString());
        const counts = {};
        dates.forEach(d => counts[d] = (counts[d] || 0) + 1);
        if (Object.values(counts).some(c => c > 3)) {
            detected.push({
                id: 'freq',
                title: "Comportement inhabituel",
                description: "Plusieurs transactions rapprochées ont été effectuées en peu de temps aujourd'hui."
            });
        }

        return detected;
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            try {
                const response = await fetch('http://localhost:8000/api/transactions', {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const data = await response.json();
                const list = Array.isArray(data) ? data : data['hydra:member'] || [];
                setAnomalies(detectAnomalies(list));
            } catch (e) {
                console.error("Erreur détection:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleIgnore = (id) => {
        setAnomalies(anomalies.filter(a => a.id !== id));
    };

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };
    const handleVerifier = () => { navigate('/transaction'); };

    const IconWithTooltip = ({ icon: Icon, label, active, onClick }) => (
        <div className="relative group flex items-center justify-center p-2 cursor-pointer" onClick={onClick}>
            <div className={`p-3 rounded-3xl transition-colors ${active ? "bg-[#0F172A] text-white w-20 h-6 flex justify-center relative right-2" : "text-white"} group-hover:text-orange-400`}>
                <Icon size={20} />
            </div>
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap pointer-events-none z-50">{label}</span>
        </div>
    );

    return (
        <div className="h-screen bg-[#F5F5F5] flex items-center justify-center font-sans">
            <div className="flex gap-8 w-full max-w-480 h-[90vh]">
                <aside className="w-20 h-220 bg-[#4A001B] rounded-[40px] flex flex-col items-center py-10 shadow-2xl shrink-0 overflow-visible">
                    <div className="flex flex-col items-center gap-8">
                        <div className="mb-2"><img src={logo2} alt="Logo2" className="w-10 h-10 object-contain" /></div>
                        <IconWithTooltip icon={LayoutDashboard} label="Menu" onClick={() => navigate('/dashboard')} />
                        <IconWithTooltip icon={CreditCard} label="Compte" onClick={() => navigate('/mes-cartes')} />
                        <IconWithTooltip icon={ArrowRightLeft} label="Transactions" onClick={() => navigate('/transaction')} />
                        <IconWithTooltip icon={BarChart2} label="Analyse financière" onClick={() => navigate('/analyse-financiere')} />
                        <IconWithTooltip icon={ScanSearch} label="Détecter anomalies" active onClick={() => navigate('/detecter-anomalie')} />
                        <IconWithTooltip icon={Lightbulb} label="Conseiller financier IA" onClick={() => navigate('/conseils-ia')} />
                        <IconWithTooltip icon={TrendingUp} label="Statistiques" onClick={() => navigate('/statistiques')} />
                        <IconWithTooltip icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />                 
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-360 flex flex-col gap-12">
                        <div className="flex justify-between items-center mb-8">
                            <div><h1 className="text-4xl font-bold text-[#4A001B]">TLS Bank</h1><p className="font-semibold">Transact Liquid Smartly</p></div>
                            <div className="flex items-center gap-6">
                                <h2 className="text-3xl font-bold text-[#4A001B]">Détection d’anomalies</h2>
                                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">Déconnexion <LogOut size={18} /></button>
                                <img src={userImg} alt="user" className="w-12 h-auto rounded-full"/>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-gray-300 shadow-md flex flex-col gap-4 max-w-[1520px] min-h-[750px] p-6 items-center overflow-y-auto">
                            {loading ? (
                                <p className="text-2xl text-gray-500 mt-40">Analyse de vos transactions en cours...</p>
                            ) : anomalies.length === 0 ? (
                                <div className="flex flex-col items-center mt-40 gap-4">
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 text-4xl font-bold">✓</span>
                                    </div>
                                    <p className="text-2xl text-gray-600 font-medium">Aucune anomalie détectée sur vos comptes.</p>
                                </div>
                            ) : (
                                anomalies.map((item, index) => (
                                    <div key={index} className="border border-gray-300 rounded-[30px] bg-white shadow-md flex justify-center flex-col gap-2 w-[92%] min-h-[160px] p-6 shrink-0 relative top-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full border-4 border-[#7A002B] flex items-center justify-center shrink-0">
                                                <span className="text-[#7A002B] font-bold text-[24px]">!</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                                        </div>
                                        
                                        <p className="text-gray-700 text-[22px] font-medium pl-14 relative left-8">
                                            {item.description}
                                        </p>

                                        <div className="flex gap-4 pl-14 mt-2 relative left-8">
                                            <button onClick={handleVerifier} className="bg-[#0F172A] text-white h-12 w-32 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors">
                                                Vérifier
                                            </button>
                                            <button 
                                                onClick={() => handleIgnore(item.id)}
                                                className="bg-[#86EFAC] text-[#064E3B] h-12 w-68 rounded-xl font-bold text-lg hover:bg-[#76e09c] transition-colors"
                                            >
                                                Marquer comme normale
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}     