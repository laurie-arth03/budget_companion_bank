import React, { useState, useEffect } from "react";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import { useNavigate } from "react-router-dom";
import walletIcon from '../assets/ion_wallet.png';
import alertIcon from '../assets/tabler_alert-triangle-filled.png';
import piggyIcon from '../assets/streamline-plump_piggy-bank-solid.png';
import gaugeIcon from '../assets/fluent_gauge-24-filled.png';

import { 
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

import {
  LogOut, LayoutDashboard, CreditCard, ArrowRightLeft, 
  BarChart2, ScanSearch, Lightbulb, TrendingUp, Bell
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ÉTATS POUR LES STATS CALCULÉES ---
    const [stats, setStats] = useState({
        moyenne: 0,
        max: 0,
        tauxEpargne: 12, // Valeur exemple ou récupérée du client
        score: 78
    });

    const [chartData, setChartData] = useState({
        pie: [],
        area: [],
        bar: []
    });

    // --- CHARGEMENT ET CALCULS ---
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
                
                processData(list);
            } catch (error) {
                console.error("Erreur stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const processData = (list) => {
        const depenses = list.filter(t => t.typeTransaction !== 'depot');
        
        // 1. Calcul des Cards
        const total = depenses.reduce((acc, t) => acc + t.montantTransaction, 0);
        const moyenne = depenses.length > 0 ? total / depenses.length : 0;
        const max = Math.max(...depenses.map(t => t.montantTransaction), 0);

        setStats(prev => ({ ...prev, moyenne, max }));

        // 2. Calcul du Pie Chart (Répartition par catégories)
        const categories = { 'Logement': 0, 'Transport': 0, 'Nourriture': 0, 'Loisirs': 0, 'Autres': 0 };
        depenses.forEach(t => {
            if (categories[t.categorieTransaction] !== undefined) {
                categories[t.categorieTransaction] += t.montantTransaction;
            } else {
                categories['Autres'] += t.montantTransaction;
            }
        });

        const pieFormatted = Object.keys(categories).map(key => ({ name: key, value: categories[key] }));
        setChartData(prev => ({ ...prev, pie: pieFormatted }));

        // 3. Simulation Area Chart (Tendances par date simplifiée)
        const areaFormatted = list.slice(-10).map((t, index) => ({
            x: index,
            y: t.montantTransaction / 1000 // On divise pour l'échelle du graph
        }));
        setChartData(prev => ({ ...prev, area: areaFormatted }));
    };

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

    const IconWithTooltip = ({ icon: Icon, label, active, onClick }) => (
        <div className="relative group flex items-center justify-center p-2 cursor-pointer" onClick={onClick}>
            <div className={`p-3 rounded-3xl transition-colors ${active ? "bg-[#0F172A] text-white w-20 h-6 flex justify-center relative right-2" : "text-white"} group-hover:text-orange-400`}>
                <Icon size={20} />
            </div>
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 translate-x-2 group-hover:opacity-100 transition-all z-50">
                {label}
            </span>
        </div>
    );

    const COLORS = ['#6D071A', '#F59E0B', '#0F172A', '#4A001B', '#86EFAC'];

    return (
        <div className="h-screen bg-[#F5F5F5] flex items-center justify-center">
            <div className="flex gap-8 w-full max-w-480 h-[90vh]">
                {/* SIDEBAR */}
                <aside className="w-20 h-220 bg-[#4A001B] rounded-[40px] flex flex-col items-center py-10 shadow-2xl shrink-0 overflow-visible">
                    <div className="flex flex-col items-center gap-8">
                        <div className="mb-2"><img src={logo2} alt="Logo" className="w-10 h-10 object-contain" /></div>
                        <IconWithTooltip icon={LayoutDashboard} label="Menu" onClick={() => navigate('/dashboard')} />
                        <IconWithTooltip icon={CreditCard} label="Compte" onClick={() => navigate('/mes-cartes')} />
                        <IconWithTooltip icon={ArrowRightLeft} label="Transactions" onClick={() => navigate('/transaction')} />
                        <IconWithTooltip icon={BarChart2} label="Analyse financière" onClick={() => navigate('/analyse-financiere')} />
                        <IconWithTooltip icon={ScanSearch} label="Détecter anomalies" onClick={() => navigate('/detecter-anomalie')} />
                        <IconWithTooltip icon={Lightbulb} label="Conseiller IA" onClick={() => navigate('/conseils-ia')} />
                        <IconWithTooltip icon={TrendingUp} label="Statistiques" active onClick={() => navigate('/statistiques')} />
                        <IconWithTooltip icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-360 flex flex-col gap-12">
                        {/* TOPBAR */}
                        <div className="flex justify-between items-center mb-8">
                            <div><h1 className="text-4xl font-bold text-[#4A001B]">TLS Bank</h1><p className="font-semibold">Transact Liquid Smartly</p></div>
                            <div className="flex items-center gap-6">
                                <h2 className="text-3xl font-bold text-[#4A001B]">Statistiques</h2>
                                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center shadow-lg">
                                    Déconnexion <LogOut size={18} />
                                </button>
                                <img src={user} alt="user" className="w-12 h-12 rounded-full"/>
                            </div>
                        </div>

                        {/* TOP CARDS ROW */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-40">
                            <div className="bg-white p-6 rounded-[25px] text-center border shadow-lg flex flex-col justify-center">
                                <div className="flex items-center gap-4 px-4">
                                    <img src={walletIcon} alt="W" className="w-8 h-8"/>
                                    <span className="text-2xl text-black font-medium">Dépense moyenne</span>
                                </div>
                                <h3 className="text-3xl text-[#739AB9] font-medium relative top-5">MGA {Math.round(stats.moyenne).toLocaleString()}</h3>
                            </div>

                            <div className="bg-white p-6 rounded-[25px] text-center border shadow-lg flex flex-col justify-center">
                                <div className="flex items-center gap-4 px-4">
                                    <img src={alertIcon} alt="A" className="w-8 h-8"/>
                                    <span className="text-2xl text-black font-medium">Dépense max</span>
                                </div>
                                <h3 className="text-3xl text-[#7A002B] font-medium relative top-5">MGA {stats.max.toLocaleString()}</h3>
                            </div>

                            <div className="bg-white p-6 rounded-[25px] text-center border shadow-lg flex flex-col justify-center">
                                <div className="flex items-center gap-4 px-4">
                                    <img src={piggyIcon} alt="P" className="w-8 h-8"/>
                                    <span className="text-2xl text-black font-medium">Taux d'épargne</span>
                                </div>
                                <h3 className="text-3xl text-[#13562B] font-medium relative top-5">+ {stats.tauxEpargne}%</h3>
                            </div>

                            <div className="bg-white p-6 rounded-[25px] text-center border shadow-lg flex flex-col justify-center">
                                <div className="flex items-center gap-4 px-4">
                                    <img src={gaugeIcon} alt="G" className="w-8 h-8"/>
                                    <span className="text-2xl text-black font-medium">Score financier</span>
                                </div>
                                <h3 className="text-3xl text-[#0F172A] font-medium relative top-5">{stats.score} / 100</h3>
                            </div>
                        </div>

                        {/* MAIN GRAPHS AREA */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                            {/* 1. DONUT CHART DYNAMIQUE */}
                            <div className="bg-white p-4 rounded-[35px] shadow-sm border flex items-center h-60">
                                <div className="w-1/2 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData.pie} innerRadius="30%" outerRadius="80%" dataKey="value">
                                                {chartData.pie.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 flex flex-col gap-2 pl-4">
                                    {['Logement', 'Transport', 'Nourriture', 'Loisirs', 'Autres'].map((label, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                            <span className="text-sm font-medium text-gray-600">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. TREND CHART (AREA) DYNAMIQUE */}
                            <div className="bg-white p-5 rounded-[35px] shadow-sm border h-60 flex items-center">
                                <ResponsiveContainer width="90%" height="90%">
                                    <AreaChart data={chartData.area}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#F0F0F0" />
                                        <XAxis dataKey="x" axisLine={false} tick={{fontSize: 10}} />
                                        <YAxis axisLine={false} tick={{fontSize: 10}} />
                                        <Tooltip />
                                        <Area type="linear" dataKey="y" stroke="#A5C5D9" fill="#A5C5D9" fillOpacity={0.4} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* 3. BAR CHART REPARTITION */}
                            <div className="bg-white p-6 rounded-[35px] shadow-sm border h-60 flex items-center">
                                <ResponsiveContainer width="90%" height="90%">
                                    <BarChart data={[{ name: 'Répartition', v1: 580, v2: 540, v3: 390, v4: 460, v5: 330 }]}>
                                        <XAxis dataKey="name" hide />
                                        <YAxis domain={[0, 600]} />
                                        <Bar dataKey="v1" fill="#6D071A" barSize={60} />
                                        <Bar dataKey="v2" fill="#0F172A" barSize={60} />
                                        <Bar dataKey="v3" fill="#4A001B" barSize={60} />
                                        <Bar dataKey="v4" fill="#F59E0B" barSize={60} />
                                        <Bar dataKey="v5" fill="#86EFAC" barSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* 4. BAR CHART COMPARAISON */}
                            <div className="bg-white p-6 rounded-[35px] shadow-sm border h-60 flex items-center">
                                <ResponsiveContainer width="90%" height="90%">
                                    <BarChart data={[{ name: 'Comparaison', v1: 680, v2: 340 }]}>
                                        <XAxis dataKey="name" hide />
                                        <YAxis domain={[0, 800]} />
                                        <Bar dataKey="v1" fill="#0F172A" barSize={120} />
                                        <Bar dataKey="v2" fill="#4A001B" barSize={120} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}