import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogOut, Plus, LayoutDashboard, CreditCard, ArrowRightLeft, BarChart2, Search, ScanSearch, Lightbulb, TrendingUp, Bell, Trash2, Pencil as EditIcon, ChevronDown } from "lucide-react";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    //CHARGEMENT DES DONNÉES DEPUIS L'API
    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            try {
                const response = await fetch('http://localhost:8000/api/transactions', {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();
                // Gestion du format Hydra de API Platform ou tableau simple
                const list = Array.isArray(data) ? data : data['hydra:member'] || [];
                setTransactions(list);
            } catch (error) {
                console.error("Erreur de chargement des transactions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [navigate]);

    //FONCTION DE SUPPRESSION RÉELLE
    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette transaction ?")) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/api/transactions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setTransactions(transactions.filter(t => t.id !== id));
            } else {
                alert("Erreur lors de la suppression.");
            }
        } catch (error) {
            alert("Erreur réseau");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleAjouterTransaction = () => {
        navigate('/ajouter-transaction');
    };

    //UTILITAIRE DE FORMATAGE
    const getTransactionStyles = (type) => {
        switch (type?.toLowerCase()) {
            case 'depot':
                return { color: "text-green-600", bgDate: "bg-green-50", prefix: "+" };
            case 'retrait':
                return { color: "text-red-500", bgDate: "bg-red-50", prefix: "-" };
            case 'transfert':
                return { color: "text-cyan-600", bgDate: "bg-cyan-50", prefix: "-" };
            default:
                return { color: "text-gray-600", bgDate: "bg-gray-50", prefix: "" };
        }
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
                {/* SIDEBAR */}
                <aside className="w-20 h-220 bg-[#4A001B] rounded-[40px] flex flex-col items-center py-10 shadow-2xl shrink-0 overflow-visible">
                    <div className="flex flex-col items-center justify-between h-full">
                        <div className="flex flex-col items-center gap-8">
                            <div className="mb-2"><img src={logo2} alt="Logo2" className="w-10 h-10 object-contain" /></div>
                            <IconWithTooltip icon={LayoutDashboard} label="Menu" onClick={() => navigate('/dashboard')} />
                            <IconWithTooltip icon={CreditCard} label="Compte" onClick={() => navigate('/mes-cartes')} />
                            <IconWithTooltip icon={ArrowRightLeft} label="Transactions" active onClick={() => navigate('/transaction')} />
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
                                <h2 className="text-3xl font-bold text-[#4A001B]">Mes transactions</h2>
                                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">
                                    Déconnexion <LogOut size={18} />
                                </button>
                                <img src={user} alt="user" className="w-12 h-auto rounded-full"/>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            placeholder="Rechercher une catégorie..." 
                                            className="bg-[#0F172A] text-white pl-6 pr-12 py-3 h-15 rounded-[20px] w-100 outline-none focus:ring-2 focus:ring-orange-400 transition-all text-center"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search className="absolute right-14 top-1/2 -translate-y-1/2 text-white" size={20} />
                                    </div>

                                    <div className="relative">
                                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-[#0F172A] text-white rounded-[20px] h-15 w-40 flex items-center gap-9 hover:bg-slate-800 transition-colors">
                                            <span className="text-m leading-tight relative left-8">Filtrer par</span>
                                            <ChevronDown size={20} className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        {isFilterOpen && (
                                            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden text-[#0F172A]">
                                                {["Date", "Catégorie", "Type"].map((opt) => (
                                                    <div key={opt} className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0 transition-colors">{opt}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button className="bg-[#0F172A] text-white justify-center rounded-[20px] flex items-center gap-4 h-15 w-50 hover:scale-95 transition-transform shadow-lg" onClick={handleAjouterTransaction}>
                                    <Plus size={25}/> <span className="text-m leading-tight">Ajouter</span>
                                </button>
                            </div>

                            <div className="overflow-hidden border border-gray-200 rounded-[30px] bg-white shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#7A9AB5] text-[#0F172A] h-12">
                                            <th className="py-8 px-6 font-medium border-r border-gray-400/30 text-center">Date</th>
                                            <th className="py-8 px-6 font-medium border-r border-gray-400/30 text-center">Type</th>
                                            <th className="py-8 px-6 font-medium border-r border-gray-400/30 text-center">Catégorie</th>
                                            <th className="py-8 px-6 font-medium border-r border-gray-400/30 text-center">Montant</th>
                                            <th className="py-8 px-6 font-medium border-r border-gray-400/30 text-center">Compte</th>
                                            <th className="py-8 px-6 font-medium text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="6" className="py-10 text-center">Chargement...</td></tr>
                                        ) : (
                                            transactions
                                            .filter(t => t.categorieTransaction?.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((t) => {
                                                const styles = getTransactionStyles(t.typeTransaction);
                                                return (
                                                    <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                                                        <td className="py-8 px-6 text-center border-r border-gray-200">
                                                            <span className={`${styles.bgDate} ${styles.color} px-4 py-1 rounded-full text-sm font-medium`}>
                                                                {new Date(t.dateTransaction).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        </td>
                                                        <td className={`py-4 px-6 text-center border-r border-gray-200 font-medium ${styles.color}`}>
                                                            {t.typeTransaction}
                                                        </td>
                                                        <td className={`py-4 px-6 text-center border-r border-gray-200 font-medium ${styles.color}`}>
                                                            {t.categorieTransaction}
                                                        </td>
                                                        <td className={`py-4 px-6 text-center border-r border-gray-200 font-bold ${styles.color}`}>
                                                            {styles.prefix} {t.montantTransaction.toLocaleString()} Ar
                                                        </td>
                                                        <td className={`py-4 px-6 text-center border-r border-gray-200 font-medium ${styles.color}`}>
                                                            {t.compte?.nomCompte || "N/A"}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex justify-center gap-15">
                                                                <button className="text-[#4A001B] hover:scale-110 transition-transform">
                                                                    <EditIcon size={22} className="stroke-[2.5px]" />
                                                                </button>
                                                                <button onClick={() => handleDelete(t.id)} className="text-[#4A001B] hover:scale-110 transition-transform">
                                                                    <Trash2 size={22} className="stroke-[2.5px]" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}