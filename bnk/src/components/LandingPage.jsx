import React from 'react';
import { Link } from 'react-router-dom';

//IMPORT DES IMAGES
import ManageMoneyImg from '../assets/Manage money-amico 1.png';
import AlluraUIImg from '../assets/Allura UI Windows.png';
import CroodsChartImg from '../assets/Croods Chart.png';
import LogoIcon from '../assets/Group 2.png';
import BankNameImg from '../assets/Group 14.png';
import Wallet from '../assets/wallet-filled.png';
import WalletIcon from '../assets/wallet-filled.png';
import ClockIcon from '../assets/chart-pie-filled.png';
import InfoIcon from '../assets/shield-error-filled.png';
import LightbulbIcon from '../assets/lightbulb-filled.png';
import ChartIcon from '../assets/chart-analytics.png';

const LandingPage = () => {
  
  return (
    <div className="h-[3000px] bg-white font-sans text-[#333] overflow-x-hidden">
      
      {/*NAVBAR*/}
      <nav className="bg-[#0b1120] text-white px-6 md:px-20 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md h-25">
        {/* Logo et Nom de la banque */}
        <div className="flex items-center gap-4 relative left-[60px]">
          <img src={LogoIcon} alt="Logo" className="h-8 w-auto" />
          <img src={BankNameImg} alt="TLS Bank" className="h-10 w-auto" />
        </div>
        
        {/* Liens centraux */}
        <div className="hidden md:flex gap-20 text-sm font-medium relative left-85">
          <Link to="/" className="text-emerald-400 border-b-2 border-emerald-400 pb-1">Accueil</Link>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Fonctionnalités</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Sécurité</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">À Propos</a>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4 relative right-[60px]">
          <Link to="/login" className="px-5 py-2 h-8 w-30 flex justify-center items-center bg-white text-[#0b1120] rounded-xl text-xs font-extrabold hover:bg-gray-200 transition uppercase">
            Se Connecter
          </Link>
          <Link to="/signup" className="px-5 py-2 h-8 w-30 flex justify-center items-center bg-white text-[#0b1120] rounded-xl text-xs font-extrabold hover:bg-gray-200 transition uppercase">
            S'Inscrire
          </Link>
        </div>
      </nav>

      {/*HERO SECTION*/}
      <section className=" mx-auto px-6 md:px-20 py-16 md:py-24 flex flex-col md:flex-row ">
        <div className="md:w-full relative left-[160px] top-14">
          <h1 className=" md:text-[82px] font-black text-[#3b0909] leading-[1.6] mb-6">
            Gérez Votre Argent Plus
          </h1>
          <h1 className=" md:text-7xl font-black text-[#3b0909] leading-[1.1] mb-6">
            Intelligemment avec l'IA
          </h1>
          <p className="text-black  font-bold text-[25px] mb-10 max-w-[500px] leading-relaxed relative top-8">
            AI Budget Companion Bank vous aide à suivre, analyser et optimiser vos finances grâce à des aperçus intelligents et des données en temps réel.
          </p>
          <Link to="/signup" className="h-10 w-30 flex justify-center items-center bg-[#99ffb1] text-[15px] text-[#0a4d1c] font-black rounded-xl shadow-lg  relative top-16 hover:shadow-xl hover:-translate-y-1 transition-all">
            Commencer
          </Link>
          <div className="mt-10 flex gap-8 text-[15px] font-bold text-[#3b0909] uppercase tracking-widest relative top-26">
            <span>Pas de frais cachés</span>
            <span>•</span>
            <span>Sécurisé</span>
            <span>•</span>
            <span>Propulsé par l'IA</span>
          </div>
        </div>
        <div className="w-full">
          <img src={ManageMoneyImg} alt="Illustration Finance" className="w-[600px] h-auto mx-auto relative left-35" />
        </div>
      </section>

      {/*FEATURES SECTION */}
      <section id="features" className="bg-white py-24 px-6 mt-20 border-t border-gray-100 relative top-12 left-40">
        <div className="max-w-6xl mx-auto ">
          <h2 className="text-[34px] md:text-7xl font-bold text-[#3b0909] text-center leading-tight mb-32 relative left-40">
            Fonctionnalités Intelligentes pour des <br /> Finances Plus Intelligentes
          </h2>

          {/* Ligne de 3 cartes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-28 mb-28 relative top-10  left-60 h-60 justify-center text-center">
            <FeatureCard 
              icon={WalletIcon} 
              title="Gestion Budgétaire Intelligente" 
              desc="Organisez automatiquement vos revenus et dépenses grâce à une catégorisation basée sur l'IA."
            />
            <FeatureCard 
              icon={ClockIcon} 
              title="Analyse des Dépenses" 
              desc="Comprenez où va votre argent grâce à des aperçus clairs et des rapports visuels."
            />
            <FeatureCard 
              icon={InfoIcon} 
              title="Détection d'Anomalies" 
              desc="Recevez des alertes lorsque des transactions inhabituelles ou suspectes se produisent."
            />
          </div>

          {/* Ligne de 2 cartes centrées */}
          <div className="flex flex-col md:flex-row justify-center gap-x-12 gap-y-28  relative top-20 left-60 h-60">
            <div className="md:w-[32%]">
              <FeatureCard 
                icon={LightbulbIcon} 
                title="Conseils Financiers Personnalisés" 
                desc="Recevez des suggestions intelligentes pour améliorer vos habitudes financières."
              />
            </div>
            <div className="md:w-[32%]">
              <FeatureCard 
                icon={ChartIcon} 
                title="Statistiques Interactives" 
                desc="Visualisez votre croissance financière avec des graphiques et des tableaux de bord dynamiques."
              />
            </div>
          </div>
        </div>
      </section>

      {/*WHY CHOOSE SECTION*/}
      <section className="bg-white py-24 px-6 md:px-20">
        <div className="max-w-10xl mx-auto relative top-50">
          
          {/* TITRE : BIEN CENTRÉ EN HAUT COMME SUR L'IMAGE */}
          <h2 className="text-[34px] md:text-7xl font-bold text-[#3b0909] text-center mb-16 md:mb-24 leading-tight">
            Pourquoi Choisir AI Budget Companion ?
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 relative top-20">
            
            {/* GAUCHE : L'ILLUSTRATION */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <img 
                src={AlluraUIImg} 
                alt="Illustration" 
                className="w-full max-w-[400px] h-auto object-contain" 
              />
            </div>

            {/* DROITE : LA LISTE DES POINTS */}
            <div className="w-full md:w-1/2 flex flex-col gap-10">
              <WhyItem 
                num="1" 
                title="Meilleur Contrôle Financier" 
                desc="Maîtrisez votre budget à tout moment, où que vous soyez." 
              />
              <WhyItem 
                num="2" 
                title="Prévenez les Dépenses Excessives" 
                desc="Suivez et limitez les dépenses inutiles grâce à des alertes intelligentes." 
              />
              <WhyItem 
                num="3" 
                title="Coaching Financier par l'IA" 
                desc="Améliorez vos habitudes financières avec des conseils personnalisés." 
              />
            </div>

          </div>
        </div>
      </section>

      {/*CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-10 relative top-80 left-60">
        <div className="md:w-full">
          <h2 className="text-7xl font-black text-[#3b0909] mb-6 leading-tight">
            Commencez Votre Voyage Financier Intelligent Aujourd'hui
          </h2>
          <p className="text-[#fbbc05] font-black text-xl mb-10 w-100">
            Rejoignez des milliers d'utilisateurs qui gèrent leurs finances de manière intelligente.
          </p>
          <Link to="/signup" className="flex justify-center items-center h-15 w-50 px-12 py-4 bg-[#99ffb1] text-[#0a4d1c] font-black rounded-2xl relative top-5 shadow-lg hover:bg-[#82e69a] transition-all uppercase tracking-wider">
            Créer un Compte
          </Link>
        </div>
        <div className="md:w-1/2">
          <img src={CroodsChartImg} alt="Statistiques" className="w-full max-w-md ml-auto" />
        </div>
      </section>

      {/*FOOTER*/}
<footer className="bg-[#3b0909] text-white py-16 px-6 md:px-20 border-t border-white/10 relative top-[422px]">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
    
    {/* CÔTÉ GAUCHE : LOGO ET NOM */}
    <div className="flex flex-col relative left-60 top-15">
      <div className="flex items-center gap-4 mb-2">
        <img src={LogoIcon} alt="Logo" className="h-12 w-auto object-contain" />
        <h3 className="text-4xl font-bold tracking-tight">TLS Bank</h3>
      </div>
      <p className="text-xl font-medium mb-16 ml-1">Transact Liquid Smartly</p>
      
      {/* COPYRIGHT EN BAS À GAUCHE */}
      <p className="text-[13px] text-gray-300 font-light relative top-13">
        © 2026 AI Budget Companion Bank
      </p>
    </div>

    {/* CÔTÉ DROIT : LIENS AVEC CHEVRONS */}
    <div className="flex flex-col gap-2 text-[16px] h-60">
      <ul className="flex flex-col gap-2 relative top-8">
        <li className="flex items-center gap-3">
          <span className="text-white font-light text-xl opacity-80 font-serif">{">"}</span>
          <a href="#" className="hover:underline decoration-1 underline-offset-4">Mentions Légales</a>
        </li>
        <li className="flex items-center gap-3">
          <span className="text-white font-light text-xl opacity-80 font-serif">{">"}</span>
          <a href="#" className="hover:underline decoration-1 underline-offset-4">Politique de Confidentialité</a>
        </li>
        <li className="flex items-center gap-3">
          <span className="text-white font-light text-xl opacity-80 font-serif">{">"}</span>
          <a href="#" className="hover:underline decoration-1 underline-offset-4">Contact</a>
        </li>
        
        {/* SECTION SUIVEZ-NOUS */}
        <li className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-3">
            <span className="text-white font-light text-xl opacity-80 font-serif">{">"}</span>
            <span className="font-bold">Suivez-nous :</span>
          </div>
          <div className="pl-8 text-[17px]">
            <a href="#" className="hover:underline">Facebook</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:underline">LinkedIn</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:underline">Twitter</a>
          </div>
        </li>
      </ul>
    </div>

  </div>
</footer>
    </div>
  );
};

//SOUS-COMPOSANTS

const FeatureCard = ({ icon, title, desc }) => (
  <div className="relative border-2 border-[#3b0909] rounded-[25px] bg-white p-8 pt-16 text-center flex flex-col items-center h-full shadow-sm">
    
    {/* LE CARRÉ MARRON AVEC IMAGE DEDANS */}
    <div className="absolute -top-0 left-0 w-14 h-14 bg-[#3b0909] rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
      <img src={icon} alt="icon" className="w-7 h-7 object-contain" />
    </div>

    {/* TEXTE DE LA CARTE */}
    <h3 className="text-[#0a1120] font-bold text-[25px] relative top-13 w-[75%]">
      {title}
    </h3>
    <p className="text-black text-[13px] leading-relaxed font-bold relative top-16  w-[76%]">
      {desc}
    </p>
  </div>
);


const WhyItem = ({ num, title, desc }) => (
  <div className="flex items-start gap-6">
    {/* CERCLE JAUNE AVEC CHIFFRE BLANC */}
    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#fbbc05] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
      {num}
    </div>
    
    {/* TEXTE À DROITE */}
    <div className="flex flex-col pt-1">
      <h4 className="font-bold text-[#fbbc05] text-[22px] leading-tight mb-1 w-[85%]">
        {title}
      </h4>
      <p className="text-black text-[15px] font-bold leading-relaxed w-[75%]">
        {desc}
      </p>
    </div>
  </div>
);


export default LandingPage;