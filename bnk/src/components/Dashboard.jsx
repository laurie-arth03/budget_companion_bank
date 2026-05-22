import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogOut, Sparkles, LayoutDashboard, CreditCard, ArrowRightLeft, Wallet, BarChart2, ScanSearch, Lightbulb, TrendingUp, Bell } from "lucide-react";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import card from '../assets/card.png';
import { Link, useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
    const navigate = useNavigate();
    
    // États pour les données dynamiques
    const [showBalance, setShowBalance] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. RÉCUPÉRATION DES DONNÉES (Fix Error 401)
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            try {
                const headers = { 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` 
                };

                const [resAcc, resTrans] = await Promise.all([
                    fetch('http://localhost:8000/api/comptes', { headers }),
                    fetch('http://localhost:8000/api/transactions', { headers })
                ]);

                if (resAcc.status === 401 || resTrans.status === 401) {
                    navigate('/login');
                    return;
                }

                const dataAcc = await resAcc.json();
                const dataTrans = await resTrans.json();

                setAccounts(Array.isArray(dataAcc) ? dataAcc : dataAcc['hydra:member'] || []);
                setTransactions(Array.isArray(dataTrans) ? dataTrans : dataTrans['hydra:member'] || []);
                setLoading(false);
            } catch (error) {
                console.error("Erreur:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    // 2. CALCULS DYNAMIQUES
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.solde || 0), 0);
    
    const revenus = transactions
        .filter(t => t.typeTransaction === 'depot')
        .reduce((sum, t) => sum + t.montantTransaction, 0);

    const depenses = transactions
        .filter(t => t.typeTransaction !== 'depot')
        .reduce((sum, t) => sum + t.montantTransaction, 0);

    const epargne = revenus - depenses;

    // Préparation des données pour le PieChart
    const categoryTotals = transactions
        .filter(t => t.typeTransaction !== 'depot')
        .reduce((acc, t) => {
            const cat = t.categorieTransaction || "Autres";
            acc[cat] = (acc[cat] || 0) + t.montantTransaction;
            return acc;
        }, {});

    const pieData = Object.keys(categoryTotals).map((name, index) => ({
        name,
        value: categoryTotals[name],
        color: ["#7C0023", "#F59E0B", "#0F172A", "#3E0014", "#86EFAC"][index % 5]
    }));

    // Préparation des données pour l'AreaChart (30 derniers points)
    const areaData = transactions.slice(-30).map((t, i) => ({
        day: i,
        value: t.montantTransaction
    }));

    const formatCurrency = (val) => new Intl.NumberFormat('fr-FR').format(val) + " MGA";
    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

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

    if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;

    return (
        <div className="h-screen bg-[#F5F5F5] flex items-center justify-center">
            <div className="flex gap-8 w-full max-w-480 h-[90vh]">
                
                {/* SIDEBAR */}
                <aside className="w-20 h-220 bg-[#4A001B] rounded-[40px] flex flex-col items-center py-10 shadow-2xl shrink-0 overflow-visible">
                    <div className="flex flex-col items-center justify-between h-full">
                        <div className="flex flex-col items-center gap-8">
                            <div className="mb-2"><img src={logo2} alt="Logo2" className="w-10 h-10 object-contain" /></div>
                            <IconWithTooltip icon={LayoutDashboard} label="Menu" active onClick={() => navigate('/dashboard')} />
                            <IconWithTooltip icon={CreditCard} label="Compte" onClick={() => navigate('/mes-cartes')} />
                            <IconWithTooltip icon={ArrowRightLeft} label="Transactions" onClick={() => navigate('/transaction')} />
                            <IconWithTooltip icon={BarChart2} label="Analyse financière" onClick={() => navigate('/analyse-financiere')} />
                            <IconWithTooltip icon={ScanSearch} label="Détecter anomalies" onClick={() => navigate('/detecter-anomalie')} />
                            <IconWithTooltip icon={Lightbulb} label="Conseiller financier IA" onClick={() => navigate('/conseils-ia')} />
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
                                <p className="font-semibold">Transact Liquid Smartly</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <h2 className="text-3xl font-bold text-[#4A001B]">Tableau de bord</h2>
                                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">
                                    Déconnexion <LogOut size={18} />
                                </button>
                                <img src={user} alt="user" className="w-12 h-auto rounded-full"/>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex gap-10">
                            {/* LEFT */}
                            <div className="flex flex-col gap-6 w-88">
                                <Link to="/mes-cartes" className=" p-5 hover:scale-95 transition-transform">
                                   <div className="relative inline-block group">
                                        <div className="absolute inset-1.5 bg-[#0F172A] rounded-[1.5rem] translate-x-3 -translate-y-2 " aria-hidden="true"></div>
                                        <img src={card} alt="Carte de crédit" className="relative z-10 w-full max-w-[335px] h-auto block"/>
                                    </div>
                                </Link>

                                {/* RESUME DYNAMIQUE */}
                                <Link to="/statistiques" className="bg-[#0F172A] text-white rounded-3xl p-8 shadow-lg h-70 min-h-65 flex flex-col justify-center items-center hover:scale-95 transition-transform">
                                    <div className="w-full max-w-70 flex flex-col gap-8">
                                        <h3 className="text-center text-xl mb-4">Résumé financier</h3>
                                        <div className="flex flex-col gap-6 text-sm">
                                            <div className="flex justify-between text-lg"><span>Revenus:</span><span className="font-bold">{formatCurrency(revenus)}</span></div>
                                            <div className="flex justify-between text-lg"><span>Dépenses:</span><span className="font-bold">{formatCurrency(depenses)}</span></div>
                                            <div className="flex justify-between text-lg"><span>Épargne:</span><span className="font-bold text-green-400">{formatCurrency(epargne)}</span></div>
                                            <div className="flex justify-center gap-43 pt-2 border-t border-gray-700">
                                                <span className=" text-lg">Budget: </span>
                                                <span className={`font-bold ${epargne > 0 ? 'text-green-400' : 'text-red-400 text'}`}>
                                                    {epargne > 0 ? '+12%' : '-5%'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* AI DYNAMIQUE */}
                                <Link to="/conseils-ia" className="bg-[#4A001B] text-white rounded-3xl p-10 text-center h-50 shadow-lg min-h-40 flex flex-col justify-center items-center hover:scale-95 transition-transform">
                                    <div className="flex justify-center gap-2 text-orange-400 text-xl mb-2 font-bold"><Sparkles size={16} /> Message IA</div>
                                    <div className="flex justify-center w-60">
                                        <p className="text-lg">
                                            {depenses > revenus 
                                                ? "Attention, vos dépenses dépassent vos revenus. Pensez à limiter les sorties." 
                                                : "Excellent ! Votre épargne est en croissance ce mois-ci."}
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* RIGHT */}
                            <div className="flex flex-col gap-8 flex-1">
                                {/* SOLDE DYNAMIQUE */}
                                <div className="bg-[#0F172A] text-white rounded-[30px] px-8 py-5 flex justify-center gap-20 items-center h-45">
                                    <div className="flex items-center gap-20">
                                        <div><p className="text-lg">Solde</p><Wallet size={30} /></div>
                                        <h2 className="text-3xl font-semibold w-[280px]">
                                            {showBalance ? formatCurrency(totalBalance) : "••••••••••••"}
                                        </h2>
                                    </div>
                                    <div onClick={() => setShowBalance(!showBalance)} className="cursor-pointer">
                                        {showBalance ? <Eye size={60} /> : <EyeOff size={60} />}
                                    </div>
                                </div>

                                {/* AREA CHART DYNAMIQUE */}
                                <div className="bg-white rounded-3xl border p-5 h-64 min-h-[256px]">
                                    <h3 className="text-center text-xl mb-2 font-medium">Évolution du solde</h3>
                                    <div className="h-[180px] w-full">
                                        <ResponsiveContainer width="95%" height="95%">
                                            <AreaChart data={areaData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="day" hide />
                                                <YAxis tickFormatter={(v) => `${v/1000}k`} />
                                                <Tooltip formatter={(v) => formatCurrency(v)} />
                                                <Area type="linear" dataKey="value" stroke="#A5C5D9" fill="#A5C5D9" fillOpacity={0.5} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* PIE CHART DYNAMIQUE */}
                                <div className="bg-white rounded-3xl border p-5 flex h-64 min-h-[256px]">
                                    <div className="w-1/2">
                                        <h3 className="text-center text-xl font-medium">Répartition des dépenses</h3>
                                        <div className="h-[180px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={pieData} dataKey="value" outerRadius={70} innerRadius={30}>
                                                        {pieData.map((item, index) => (
                                                            <Cell key={index} fill={item.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(v) => formatCurrency(v)} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="w-1/2 flex flex-col justify-center gap-3 pl-6 overflow-y-auto">
                                        {pieData.length > 0 ? pieData.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-lg truncate">{item.name}</span>
                                            </div>
                                        )) : <p className="text-gray-400 text-lg">Aucune dépense</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}