import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogOut, LayoutDashboard, CreditCard, ArrowRightLeft, BarChart2, ScanSearch, Lightbulb, TrendingUp, Bell } from "lucide-react";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "depot",
        montant: "",
        categorie: "Autres", // Modifié ici pour être valide dès le départ
        compteId: "",
        date: new Date().toISOString().split('T')[0],
        description: ""
    });

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            try {
                const response = await fetch('http://localhost:8000/api/comptes', {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const data = await response.json();
                const list = Array.isArray(data) ? data : data['hydra:member'] || [];
                setAccounts(list);
                if (list.length > 0) {
                    setFormData(prev => ({ ...prev, compteId: `/api/comptes/${list[0].id}` }));
                }
            } catch (error) { console.error("Erreur de chargement", error); }
        };
        fetchAccounts();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.montant || !formData.compteId) {
            alert("Veuillez remplir le montant et choisir un compte.");
            return;
        }
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    typeTransaction: formData.type,
                    montantTransaction: parseInt(formData.montant),
                    categorieTransaction: formData.categorie,
                    compte: formData.compteId,
                    description: formData.description
                })
            });
            if (response.ok) {
                alert("Transaction réussie !");
                navigate('/mes-cartes');
            } else {
                const errorData = await response.json();
                alert("Erreur : " + (errorData.detail || "Action impossible"));
            }
        } catch (error) { alert("Erreur réseau"); } finally { setLoading(false); }
    };

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

    return (
        <div className="h-screen bg-[#F5F5F5] flex items-center justify-center">
            <div className="flex gap-8 w-full max-w-480 h-[90vh]">
                <aside className="w-20 bg-[#4A001B] rounded-[40px] flex flex-col items-center py-10 shadow-2xl shrink-0 overflow-visible">
                    <div className="flex flex-col items-center gap-8">
                        <div className="mb-2"><img src={logo2} alt="Logo2" className="w-10 h-10 object-contain" /></div>
                        <IconWithTooltip icon={LayoutDashboard} label="Menu" onClick={() => navigate('/dashboard')} />
                        <IconWithTooltip icon={CreditCard} label="Compte" onClick={() => navigate('/mes-cartes')} />
                        <IconWithTooltip icon={ArrowRightLeft} label="Transactions" active onClick={() => navigate('/transaction')} />
                        <IconWithTooltip icon={BarChart2} label="Analyse financière" onClick={() => navigate('/analyse-financiere')} />
                        <IconWithTooltip icon={ScanSearch} label="Détecter anomalies" onClick={() => navigate('/detecter-anomalies')} />
                        <IconWithTooltip icon={Lightbulb} label="Conseils IA" onClick={() => navigate('/conseils-ia')} />
                        <IconWithTooltip icon={TrendingUp} label="Statistiques" onClick={() => navigate('/statistiques')} />
                        <IconWithTooltip icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />
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

                        <div className="flex flex-col gap-8 max-w-7xl relative left-17">
                            <div className="bg-white border border-black rounded-[40px] shadow-sm min-h-[668px] flex items-center flex-col justify-center">
                                <h2 className="text-3xl font-bold text-center mb-20 text-black relative bottom-5">Ajouter une transaction</h2>

                                <div className="grid grid-cols-2 gap-x-24 gap-y-1 w-full max-w-5xl mx-auto">
                                    <div className="flex flex-col gap-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Type</label>
                                            <div className="relative">
                                                <select name="type" value={formData.type} onChange={handleChange} className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 appearance-none focus:outline-none bg-white">
                                                    <option value="depot">Dépôt</option>
                                                    <option value="retrait">Retrait</option>
                                                    <option value="transfert">Transfert</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Montant</label>
                                            <input name="montant" value={formData.montant} onChange={handleChange} type="number" className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 focus:outline-none" />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Catégorie</label>
                                            <div className="relative">
                                                <select name="categorie" value={formData.categorie} onChange={handleChange} className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 appearance-none focus:outline-none bg-white">
                                                    <option value="Logement">Logement</option>
                                                    <option value="Transport">Transport</option>
                                                    <option value="Nourriture">Nourriture</option>
                                                    <option value="Loisirs">Loisirs</option>
                                                    <option value="Autres">Autres</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Compte</label>
                                            <div className="relative">
                                                <select name="compteId" value={formData.compteId} onChange={handleChange} className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 appearance-none focus:outline-none bg-white">
                                                    {accounts.map(acc => (
                                                        <option key={acc.id} value={`/api/comptes/${acc.id}`}>
                                                            {acc.nomCompte} ({acc.solde} MGA)
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Date</label>
                                            <input name="date" value={formData.date} onChange={handleChange} type="date" className="w-full h-14 text-2xl text-center border border-black rounded-[20px] px-6 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-2xl font-bold text-black ml-1">Description (facultatif)</label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full h-[200px] text-xl text-center border border-black rounded-[25px] pt-12 focus:outline-none resize-none"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pl-2 flex flex-row gap-4">
                                <button onClick={() => navigate('/mes-cartes')} className="bg-[#4A001B] text-white justify-center rounded-[20px] px-3 py-10 flex items-center gap-4 h-15 w-50 hover:scale-95 transition-transform shadow-lg">
                                    <span className="text-xl leading-tight">Annuler</span>
                                </button>   
                                <button onClick={handleSubmit} disabled={loading} className="bg-[#0F172A] text-white justify-center rounded-[20px] px-3 py-10 flex items-center gap-4 h-15 w-50 hover:scale-95 transition-transform shadow-lg">
                                    <span className="text-xl leading-tight">{loading ? "En cours..." : "Ajouter"}</span>
                                </button>    
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}