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
  Search,
  Megaphone
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Récupération des données du backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/notifications", {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();
                
                // API Platform renvoie soit un tableau direct, soit un objet avec 'hydra:member'
                const fetchedData = data['hydra:member'] || data;
                setNotifications(fetchedData);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération :", error);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    // 2. Filtrage dynamique basé sur le message
    const filteredNotifications = notifications.filter((notif) =>
        notif.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Composant réutilisable pour chaque icône
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
                            <IconWithTooltip icon={Lightbulb} label="Conseiller financier IA" onClick={() => navigate('/conseils-ia')} />
                            <IconWithTooltip icon={TrendingUp} label="Statistiques" onClick={() => navigate('/statistiques')} />
                            <IconWithTooltip icon={Bell} label="Notifications" active onClick={() => navigate('/notifications')} />
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
                                <h2 className="text-3xl font-bold text-[#4A001B]">Notifications</h2>
                                <button onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">
                                    Déconnexion
                                    <LogOut size={18} />
                                </button>
                                <img src={user} alt="user" className="w-12 h-auto rounded-full" />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col gap-8">
                            {/* Barre de recherche */}
                            <div className="relative group w-full max-w-[500px]">
                                <input
                                    type="text"
                                    placeholder="Rechercher une notification..."
                                    className="bg-[#0F172A] text-white px-16 py-3 h-15 rounded-[20px] w-full outline-none focus:ring-2 focus:ring-orange-400 transition-all text-center"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-[66px] top-1/2 -translate-y-1/2 text-white pointer-events-none" size={20} />
                            </div>

                            {/* Liste des notifications dynamique */}
                            <div className="bg-white rounded-[40px] border border-gray-300 shadow-md flex flex-col gap-4 p-6 max-w-[1520px] min-h-[600px] overflow-y-auto">
                                {loading ? (
                                    <p className="text-center text-gray-500 mt-10">Chargement des notifications...</p>
                                ) : filteredNotifications.length > 0 ? (
                                    filteredNotifications.map((item) => (
                                        <div key={item.id} className="border border-gray-300 rounded-[30px] bg-white shadow-md flex justify-center flex-col py-6 w-full shrink-0">
                                            <div className="flex items-center gap-4 relative left-8">
                                                <Megaphone size={24} className="text-green-400" />
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    Alerte Système
                                                </h3>
                                            </div>
                                            <p className="text-gray-700 text-[24px] font-medium pl-14 relative left-18 mt-2">
                                                {item.message}
                                            </p>
                                            <span className="text-gray-400 text-[18px] font-medium pl-14 relative left-18">
                                                {new Date(item.dateEnvoi).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 mt-10">Aucune notification trouvée.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}