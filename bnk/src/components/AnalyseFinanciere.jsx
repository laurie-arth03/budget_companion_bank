import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo2 from '../assets/logo2.png';
import user from '../assets/user.jpg';
import { useNavigate } from "react-router-dom";
import walletIcon from '../assets/ion_wallet.png';
import alertIcon from '../assets/tabler_alert-triangle-filled.png';
import piggyIcon from '../assets/streamline-plump_piggy-bank-solid.png'; // Ajuste le nom exact si besoin
import gaugeIcon from '../assets/fluent_gauge-24-filled.png';
import bot from '../assets/bot.png';

import {
  LogOut,
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  BarChart2,
  ScanSearch,
  Lightbulb,
  TrendingUp,
  Bell
} from "lucide-react";

export default function Dashboard() {
     const navigate = useNavigate();

      const handleLogout = () => {
            // On redirige vers /login
            navigate('/login');
        };
        

    // Par défaut, le solde est visible (true)
    const [showBalance, setShowBalance] = useState(true);
        const IconWithTooltip = ({ icon: Icon, label, active, onClick }) => {
        return (
            <div className="relative group flex items-center justify-center p-2 cursor-pointer" onClick={onClick}>
            {/* Icône */}
            <div
                className={`p-3 rounded-xl transition-colors
                ${active ? "bg-[#0F172A] text-white  w-20 h-6 flex justify-center relative right-2" : "text-white"}
                group-hover:text-orange-400`}
            >
                <Icon size={20} />
            </div>

            {/* Tooltip */}
                <span
                    className="absolute left-full top-1/2 -translate-y-1/2
                        ml-8
                        bg-black text-white text-xs px-2 py-1 rounded
                        opacity-0 translate-x-2
                        group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-200
                        whitespace-nowrap pointer-events-none z-50"
                    >
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

                {/* LOGO */}
                <div className="mb-2">
                    <img src={logo2} alt="Logo2" className="w-10 h-10 object-contain" />
                </div>

                {/* ICONES */}
                    <IconWithTooltip icon={LayoutDashboard} label="Menu" onClick={() => navigate('/dashboard')} />
                    <IconWithTooltip icon={CreditCard} label="Compte" onClick={() => navigate('/mes-cartes')} />
                    <IconWithTooltip icon={ArrowRightLeft} label="Transactions" onClick={() => navigate('/transaction')} />
                    <IconWithTooltip icon={BarChart2} label="Analyse financière" active onClick={() => navigate('/analyse-financiere')} />
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
                        <h1 className="text-4xl font-bold text-[#4A001B]">
                            TLS Bank
                        </h1>
                        <p className="font-semibold">
                            Transact Liquid Smartly
                        </p>
                        </div>

                        <div className="flex items-center gap-6">
                        <h2 className="text-3xl font-bold text-[#4A001B]">
                            Analyse financière    
                        </h2>

                        <button  onClick={handleLogout} className="bg-[#0F172A] text-white px-5 py-2 rounded-[25px] flex items-center gap-2 h-15 w-40 justify-center hover:scale-95 transition-transform shadow-lg">
                            Déconnexion
                            <LogOut size={18} />
                        </button>

                        <img src={user} alt="user" className="w-12 h-auto rounded-full"/>
                       
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col gap-8 max-w-[1500px]">
                    {/* cards*/}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-40">
                            {/* Dépense moyenne */}
                            <div className="bg-white p-6 rounded-[25px] text-center border border-gray-300 flex flex-col gap-4 shadow-lg">
                                <div className="flex items-center gap-6">
                                    <div className=" p-2 rounded-lg text-white relative left-10 top-8">
                                        <img src={walletIcon} alt="Wallet Icon" className="w-10 h-10"/>
                                    </div>
                                    <span className="text-black text-[22px] relative left-8 top-8">Dépense moyenne</span>
                                </div>
                                <h3 className="text-[37px] text-[#739AB9] text-center relative top-10">MGA 1 000 000</h3>
                            </div>

                            {/* Dépense max */}
                            <div className="bg-white text-center p-6 rounded-[25px] border border-gray-300 flex flex-col gap-2 shadow-lg">
                            <div className="flex items-center gap-6">
                                <div className=" rounded-lg text-white relative left-10 top-8">
                                    <img src={alertIcon} alt="Alert Icon" className="w-10 h-10"/>
                                </div>
                                <span className="text-black text-[22px] relative left-8 top-8">Dépense max</span>
                            </div>
                            <h3 className="text-[37px]  text-[#7A002B] text-center relative top-10">MGA 1 700 000</h3>
                            </div>

                            {/* Taux d'épargne */}
                            <div className="bg-white text-center p-6 rounded-[25px] shadow-lg border border-gray-300 flex flex-col gap-2">
                            <div className="flex items-center gap-6">
                                <div className=" p-2 rounded-lg text-white  relative left-10 top-8">
                                    <img src={piggyIcon} alt="Piggy Icon" className="w-10 h-10"/>
                                </div>
                                <span className="text-black text-[22px] relative left-8 top-8">Taux d'épargne</span>
                            </div>
                            <h3 className="text-[37px] text-[#13562B] text-center relative top-10" >+ 12%</h3>
                            </div>

                            {/* Score financier */}
                            <div className="bg-white text-center p-6 rounded-[25px] shadow-lg border border-gray-300 flex flex-col gap-2">
                                <div className="flex items-center gap-6">
                                    <div className=" p-2 rounded-lg text-white relative left-10 top-8">
                                        <img src={gaugeIcon} alt="Gauge Icon" className="w-10 h-10"/>
                                    </div>
                                    <span className="text-black text-[22px] relative left-8 top-8">Score financier</span>
                                </div>
                                <h3 className="text-[37px] text-[#0F172A] text-center relative top-10">78 / 100</h3>
                            </div>
                        </div>

                        {/* MAIN CONTENT AREA */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
                                
                                {/* colonne gauche: Stats et Box */}
                            <div className="lg:col-span-2 flex flex-col gap-8 max-w-[700px]">
                                 
                                  {/* Grille des blocs de couleur */}
                                <div className="flex h-55 border border-gray-300 shadow-lg rounded-[25px]">
                                    
                                    {/* Bloc Moyenne */}
                                    <div className="w-[230px] h-48 bg-[#7196B6] rounded-[25px] flex flex-col items-center justify-center relative top-3 left-5 gap-6">
                                        <span className="text-[28px] font-medium text-gray-900 mb-12">Moyenne</span>
                                        <span className="text-[24px] font-medium text-gray-900 leading-tight">
                                            MGA 1 000 000
                                        </span>
                                    </div>

                                    {/* Bloc Variance */}
                                    <div className="w-[230px] h-48 bg-[#91E9A6] rounded-[25px] flex flex-col items-center justify-center relative top-3 left-2 gap-6">
                                        <span className="text-[28px] font-medium text-gray-900 mb-12">Variance</span>
                                        <span className="text-[24px] font-medium text-gray-900 leading-tight">
                                            MGA 800 000
                                        </span>
                                    </div>

                                    {/* Bloc Écart-type */}
                                    <div className="w-[230px] h-48 bg-[#F5A11E] rounded-[25px] flex flex-col items-center justify-center relative top-3 right-3 gap-6">
                                        <span className="text-[28px] font-medium text-gray-900 mb-12">Écart-type</span>
                                        <span className="text-[24px] font-medium text-gray-900 leading-tight">
                                            MGA 400 000
                                        </span>
                                    </div>
                                    
                                </div>

                                {/* Blue Info Box */}
                                <div className="bg-[#BDCFDE] rounded-3xl p-10 h-55 shadow-lg min-h-40 flex flex-col justify-center items-center">
                                    <h3 className="text-[30px] font-medium text-gray-800 w-140 ">
                                    Votre dépense moyenne mensuelle est de MGA 1 000 000.
                                    </h3>
                                    <p className="text-[22px] text-gray-700 w-140">
                                    Vos dépenses restent globalement stables avec quelques variations ponctuelles.
                                    </p>
                                </div>
                            </div>

                            {/* colonne droite : AI Sidebar */}
                            <div className="bg-[#0F172A] text-white rounded-[25px] shadow-lg gap-8 w-[700px] h-[475px] relative right-[240px] flex flex-col px-14 py-12">
                            <div className=" gap-3 mb-4 flex flex-row relative left-10 top-5">
                                        <img src={bot} alt="Bot" className="w-10 h-10"/>
                                <h2 className="text-[22px] font-semibold">Aperçus IA</h2>
                            </div>
                            
                            <p className="text-[22px] leading-relaxed relative left-10 top-5">
                                Vos dépenses ont augmenté de 12 % ce mois-ci.
                            </p>

                            <ul className="flex flex-col gap-6 mt-4 text-[22px]">
                                <li className="flex gap-4 relative left-10 top-5 w-150" >
                                <div className="w-2 h-2 rounded-full border-2 border-green-400 shrink-0 relative top-4"></div>
                                <p className="text-gray-300">Vous dépensez davantage le week-end, surtout en alimentation.</p>
                                </li>
                                <li className="flex gap-4 relative left-10 top-5 w-150">
                                <div className="w-2 h-2 rounded-full border-2 border-green-400 shrink-0 relative top-4"></div>
                                <p className="text-gray-300">Une dépense inhabituelle a été détectée dans la catégorie transport.</p>
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