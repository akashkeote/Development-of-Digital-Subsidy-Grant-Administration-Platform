import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Footer } from '../components/Footer';
import { CheckCircle, Search, ArrowRight, GraduationCap, Home as HomeIcon, MapPin, Building2, Leaf, ShieldCheck, HeartPulse, FileText, ChevronRight, Activity, Users, Database, Compass, Sun, Sprout, Landmark } from 'lucide-react';
import { motion } from 'motion/react';

const ministers = [
  { name: "Narendra Modi", role: "Prime Minister", image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/The_official_portrait_of_Shri_Narendra_Modi%2C_the_Prime_Minister_of_the_Republic_of_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled" },
  { name: "Rajnath Singh", role: "Minister of Defence", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Shri_Rajnath_Singh%2C_in_New_Delhi_on_May_09%2C_2023_%28cropped%29.jpg/500px-Shri_Rajnath_Singh%2C_in_New_Delhi_on_May_09%2C_2023_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Amit Shah", role: "Minister of Home Affairs", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Shri_Amit_Shah_in_Raigad.jpg/500px-Shri_Amit_Shah_in_Raigad.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Nitin Gadkari", role: "Minister of Road Transport", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nitin_Jairam_Gadkari.jpg/500px-Nitin_Jairam_Gadkari.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Jagat Prakash Nadda", role: "Minister of Health", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Jagat_Prakash_Nadda_2023.jpg/500px-Jagat_Prakash_Nadda_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Shivraj Singh Chouhan", role: "Minister of Agriculture", image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Shivraj_Singh_Chouhan_2025.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled" },
  { name: "Nirmala Sitharaman", role: "Minister of Finance", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Am_11._April_2025_empfing_Au%C3%9Fenministerin_Beate_Meinl-Reisinger_die_indische_Finanzministerin_Nirmala_Sitharaman_in_Wien_%2854445397025%29_%28cropped%29.jpg/500px-Am_11._April_2025_empfing_Au%C3%9Fenministerin_Beate_Meinl-Reisinger_die_indische_Finanzministerin_Nirmala_Sitharaman_in_Wien_%2854445397025%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "S. Jaishankar", role: "Minister of External Affairs", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/The_official_portrait_of_External_Minister_Subrahmanyam_Jaishankar.jpg/500px-The_official_portrait_of_External_Minister_Subrahmanyam_Jaishankar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Manohar Lal Khattar", role: "Minister of Power", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Manohar_Lal%2C_Minister_of_Power.jpg/500px-Manohar_Lal%2C_Minister_of_Power.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Ashwini Vaishnaw", role: "Minister of Railways", image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Ashwini_Vaishnaw_cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled" },
  { name: "Pralhad Joshi", role: "Minister of Education", image: "https://powerline.net.in/wp-content/uploads/2025/03/PL-54.jpg" },
];

const chiefMinisters = [
  { name: "N. Chandrababu Naidu", state: "Andhra Pradesh", image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/The_portrait_of_CM_Shri_Nara_Chandrababu_Naidu.jpg" },
  { name: "Pema Khandu", state: "Arunachal Pradesh", image: "https://images.bhaskarassets.com/web2images/1884/2025/12/03/honble-cm-shri-pema-khandu-ji-visited-the-people_1764716413.jpg" },
  { name: "Himanta Biswa Sarma", state: "Assam", image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Himanta_Biswa_Sarma_in_2025.jpg" },
  { name: "Samrat Choudhary", state: "Bihar", image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Samrat_Chaudhary_in_Rajgir.jpg" },
  { name: "Vishnu Deo Sai", state: "Chhattisgarh", image: "https://joharcg.com/wp-content/uploads/2024/07/Vishnu-Deo-sai.png" },
  { name: "Pramod Sawant", state: "Goa", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pramod_Sawant_at_the_inauguration_of_the_Chhatrapati_Shivaji_Maharaj_Chair_in_Goa_University_%28cropped%29.jpg/330px-Pramod_Sawant_at_the_inauguration_of_the_Chhatrapati_Shivaji_Maharaj_Chair_in_Goa_University_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Bhupendrabhai Patel", state: "Gujarat", image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Bhupendra_Patel_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled" },
  { name: "Nayab Singh Saini", state: "Haryana", image: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Nayab_Singh_Saini_October_2024.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled" },
  { name: "Sukhvinder Singh Sukhu", state: "Himachal Pradesh", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sukhvinder_Singh_Sukhu.jpg/330px-Sukhvinder_Singh_Sukhu.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Hemant Soren", state: "Jharkhand", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Hemant_Soren_01.jpg/330px-Hemant_Soren_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "D. K. Shivakumar", state: "Karnataka", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Dkshivakumar.png/330px-Dkshivakumar.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Pinarayi Vijayan", state: "Kerala", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Chief_Minister_Pinarayi_Vijayan_2023.jpg/330px-Chief_Minister_Pinarayi_Vijayan_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Mohan Yadav", state: "Madhya Pradesh", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Mohan_Yadav%2C_Chief_Minister_of_Madhya_Pradesh.jpg/330px-Mohan_Yadav%2C_Chief_Minister_of_Madhya_Pradesh.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Devendra Fadnavis", state: "Maharashtra", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Shri_Devendra_Gangadharrao_Fadnavis.jpg/330px-Shri_Devendra_Gangadharrao_Fadnavis.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "N. Biren Singh", state: "Manipur", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/The_Chief_Minister_of_Manipur%2C_Shri_Biren_Singh_calling_on_the_Vice_President%2C_Shri_M._Venkaiah_Naidu%2C_in_New_Delhi_on_September_06%2C_2017_%28cropped%29.jpg/330px-The_Chief_Minister_of_Manipur%2C_Shri_Biren_Singh_calling_on_the_Vice_President%2C_Shri_M._Venkaiah_Naidu%2C_in_New_Delhi_on_September_06%2C_2017_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Conrad Sangma", state: "Meghalaya", image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Conrad_Sangma_%28cropped%29.jpg" },
  { name: "Lalduhoma", state: "Mizoram", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lalduhoma.jpg/330px-Lalduhoma.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Neiphiu Rio", state: "Nagaland", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Neiphiu_Rio.jpg/330px-Neiphiu_Rio.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Mohan Charan Majhi", state: "Odisha", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Shri_Mohan_Charan_Majhi.jpg/330px-Shri_Mohan_Charan_Majhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Bhagwant Mann", state: "Punjab", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Bhagwant_Mann_2026.jpg/330px-Bhagwant_Mann_2026.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Bhajan Lal Sharma", state: "Rajasthan", image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Bhajan_Lal_Sharma_and_deputies_meets_VP_of_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled" },
  { name: "Prem Singh Tamang", state: "Sikkim", image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Prem_Singh_Tamang%2C_Chief_Minister_of_Sikkim.jpg" },
  { name: "C. Joseph Vijay", state: "Tamil Nadu", image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/JosephVijay.jpg" },
  { name: "A. Revanth Reddy", state: "Telangana", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Portrait_of_Telangana_CM_Revanth_Reddy.png/330px-Portrait_of_Telangana_CM_Revanth_Reddy.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Manik Saha", state: "Tripura", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Dr._Manik_Saha.jpg/330px-Dr._Manik_Saha.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Yogi Adityanath", state: "Uttar Pradesh", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yogiji_in_2023.jpg/330px-Yogiji_in_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Pushkar Singh Dhami", state: "Uttarakhand", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Pushkar_Singh_Dhami%2C_Chief_Minister_of_Uttarakhand.jpg/330px-Pushkar_Singh_Dhami%2C_Chief_Minister_of_Uttarakhand.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "Suvendu Adhikari", state: "West Bengal", image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Suvendu_Adhikari_May_2026_%28cropped%29.jpg" },
  { name: "Rekha Gupta", state: "Delhi", image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chief_Minister_of_Delhi%2C_Smt._Rekha_Gupta.jpg" },
  { name: "Omar Abdullah", state: "Jammu and Kashmir", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Omar_Abdullah%2C_Chief_Minister_of_Jammu_%26_Kashmir.jpg/330px-Omar_Abdullah%2C_Chief_Minister_of_Jammu_%26_Kashmir.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
  { name: "N. Rangaswamy", state: "Puducherry", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/N._Rangaswamy_%28cropped%29.jpg/330px-N._Rangaswamy_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
];

export const LandingPage: React.FC = () => {
  const { schemes, stats } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Explore All', icon: <Compass size={28} strokeWidth={2} />, color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/25', bg: 'bg-blue-50' },
    { id: 'agriculture', label: 'Agriculture', icon: <Sprout size={28} strokeWidth={2} />, color: 'from-emerald-500 to-green-500', shadow: 'shadow-emerald-500/25', bg: 'bg-emerald-50' },
    { id: 'education', label: 'Education', icon: <GraduationCap size={28} strokeWidth={2} />, color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/25', bg: 'bg-orange-50' },
    { id: 'energy', label: 'Green Energy', icon: <Sun size={28} strokeWidth={2} />, color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/25', bg: 'bg-yellow-50' },
    { id: 'housing', label: 'Housing', icon: <HomeIcon size={28} strokeWidth={2} />, color: 'from-rose-400 to-red-500', shadow: 'shadow-rose-500/25', bg: 'bg-rose-50' },
    { id: 'healthcare', label: 'Healthcare', icon: <HeartPulse size={28} strokeWidth={2} />, color: 'from-fuchsia-500 to-purple-500', shadow: 'shadow-fuchsia-500/25', bg: 'bg-fuchsia-50' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/schemes?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === 'all') navigate('/schemes');
    else navigate(`/schemes?category=${catId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden" id="landing_page_root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); }
        .glass-dark { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .perspective-container { perspective: 1200px; }
        .card-3d { transform-style: preserve-3d; transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        .card-3d:hover { transform: rotateY(8deg) rotateX(5deg) translateY(-10px) translateZ(20px); }
        .btn-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out; box-shadow: 0 4px 0 #3730a3, 0 8px 15px rgba(79,70,229,0.3); }
        .btn-3d:active { transform: translateY(4px); box-shadow: 0 0px 0 #3730a3, 0 4px 8px rgba(79,70,229,0.3); }
        .gradient-text { background: linear-gradient(135deg, #4F46E5, #7C3AED); -webkit-background-clip: text; color: transparent; }
        .gradient-text-shimmer { background: linear-gradient(90deg, #4F46E5, #9333EA, #4F46E5); background-size: 200% auto; -webkit-background-clip: text; color: transparent; animation: shimmer 3s linear infinite; }
        @keyframes shimmer { to { background-position: 200% center; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 9s ease-in-out infinite reverse; }
        .animate-float-delay { animation: float 7s ease-in-out infinite 2s; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-pulse-glow { animation: pulseGlow 2.5s infinite alternate; }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 10px rgba(79,70,229,0.2); } 100% { box-shadow: 0 0 25px rgba(79,70,229,0.6); } }
        .mesh-bg { background-color: #f8fafc; background-image: radial-gradient(at 10% 20%, rgba(79,70,229,0.08) 0px, transparent 50%), radial-gradient(at 90% 10%, rgba(124,58,237,0.08) 0px, transparent 50%), radial-gradient(at 50% 80%, rgba(56,189,248,0.08) 0px, transparent 50%); }
        
        /* 3D Indian Flag */
        .flag-container {
          perspective: 800px;
          display: inline-flex;
          align-items: flex-start;
        }
        .flag-pole {
          width: 4px;
          height: 120px;
          background: linear-gradient(180deg, #d4d4d4 0%, #a8a29e 100%);
          border-radius: 2px;
          flex-shrink: 0;
          box-shadow: 1px 0 4px rgba(0,0,0,0.15);
          position: relative;
        }
        .flag-pole::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #C0A000, #FFD700);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255,215,0,0.4);
        }
        .flag {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: flagWave 4s ease-in-out infinite;
          transform-origin: left center;
          box-shadow: 2px 2px 15px rgba(0,0,0,0.15);
        }
        .flag-saffron {
          flex: 1;
          background: linear-gradient(90deg, #FF9933 0%, #FF8C1A 60%, #FF9933 100%);
        }
        .flag-white {
          flex: 1;
          background: linear-gradient(90deg, #FFFFFF 0%, #f8f8f8 60%, #FFFFFF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .center-emblem {
          width: 90px;
          height: 90px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><circle r="46" fill="none" stroke="%23000080" stroke-width="6"/><circle r="9" fill="%23000080"/><g fill="%23000080"><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(0)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(15)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(30)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(45)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(60)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(75)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(90)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(105)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(120)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(135)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(150)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(165)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(180)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(195)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(210)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(225)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(240)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(255)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(270)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(285)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(300)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(315)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(330)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(345)"/></g><g fill="%23000080"><circle cx="0" cy="-40" r="1.5" transform="rotate(7.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(22.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(37.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(52.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(67.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(82.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(97.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(112.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(127.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(142.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(157.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(172.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(187.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(202.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(217.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(232.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(247.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(262.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(277.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(292.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(307.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(322.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(337.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(352.5)"/></g></svg>');
          background-size: cover;
          animation: chakraSpin 10s linear infinite;
        }
        .flag-green {
          flex: 1;
          background: linear-gradient(90deg, #138808 0%, #0F7A05 60%, #138808 100%);
        }
        @keyframes flagWave {
          0%, 100% { transform: perspective(800px) rotateY(0deg) skewY(0deg); }
          25% { transform: perspective(800px) rotateY(8deg) skewY(2deg); }
          75% { transform: perspective(800px) rotateY(-4deg) skewY(-1deg); }
        }
        }
        
        /* Pure CSS 3D Monument */
        .monument-container {
          perspective: 1400px;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .monument-base {
          position: relative;
          width: 360px;
          height: 360px;
          transform-style: preserve-3d;
          animation: spinBase 24s linear infinite;
        }
        @keyframes spinBase {
          0% { transform: rotateX(65deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateZ(360deg); }
        }
        .monument-floor {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.3);
          border: 4px solid rgba(255,255,255,0.8);
          box-shadow: 0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 30px rgba(255,255,255,0.6);
          border-radius: 30px;
          backdrop-filter: blur(8px);
        }
        .pillar {
          position: absolute;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ffffff, #f1f5f9);
          border: 2px solid #e2e8f0;
          transform-style: preserve-3d;
          border-radius: 12px;
        }
        .pillar-1 { top: 30px; left: 30px; transform: translateZ(80px); }
        .pillar-2 { top: 30px; right: 30px; transform: translateZ(120px); }
        .pillar-3 { bottom: 30px; left: 30px; transform: translateZ(100px); }
        .pillar-4 { bottom: 30px; right: 30px; transform: translateZ(140px); }
        
        .pillar-3d {
          box-shadow: 
            -1px 1px 0 #cbd5e1, -2px 2px 0 #cbd5e1, -3px 3px 0 #cbd5e1, -4px 4px 0 #cbd5e1, -5px 5px 0 #cbd5e1,
            -6px 6px 0 #cbd5e1, -7px 7px 0 #cbd5e1, -8px 8px 0 #cbd5e1, -9px 9px 0 #cbd5e1, -10px 10px 0 #cbd5e1,
            -11px 11px 0 #94a3b8, -12px 12px 0 #94a3b8, -13px 13px 0 #94a3b8, -14px 14px 0 #94a3b8, -15px 15px 0 #94a3b8,
            -16px 16px 0 #94a3b8, -17px 17px 0 #94a3b8, -18px 18px 0 #94a3b8, -19px 19px 0 #94a3b8, -20px 20px 0 #94a3b8,
            -21px 21px 25px rgba(0,0,0,0.3);
        }
        
        .hologram-wrapper {
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          transform-style: preserve-3d;
          animation: counterSpinHolo 24s linear infinite;
        }
        @keyframes counterSpinHolo {
          0% { transform: rotateX(-90deg) rotateY(0deg); }
          100% { transform: rotateX(-90deg) rotateY(-360deg); }
        }
        .hologram {
          position: absolute;
          top: -50px; left: -50px;
          width: 100px; height: 100px;
          background: rgba(255,255,255,0.7);
          border: 2px solid rgba(59, 130, 246, 0.6);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(59, 130, 246, 0.4);
          animation: floatBounce 3s ease-in-out infinite alternate;
          color: #2563eb;
        }
        .hologram-1 { animation-delay: 0s; color: #16a34a; border-color: rgba(22, 163, 74, 0.6); box-shadow: 0 0 30px rgba(22, 163, 74, 0.6), inset 0 0 20px rgba(22, 163, 74, 0.4); }
        .hologram-2 { animation-delay: 0.5s; color: #9333ea; border-color: rgba(147, 51, 234, 0.6); box-shadow: 0 0 30px rgba(147, 51, 234, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.4); }
        .hologram-3 { animation-delay: 1s; color: #ea580c; border-color: rgba(234, 88, 12, 0.6); box-shadow: 0 0 30px rgba(234, 88, 12, 0.6), inset 0 0 20px rgba(234, 88, 12, 0.4); }
        .hologram-4 { animation-delay: 1.5s; color: #2563eb; }
        .pillar-5 { top: 50%; left: 50%; margin-top: -40px; margin-left: -40px; transform: translateZ(180px); }
        .hologram-5 { animation-delay: 2s; color: #f59e0b; border-color: rgba(245, 158, 11, 0.6); box-shadow: 0 0 30px rgba(245, 158, 11, 0.6), inset 0 0 20px rgba(245, 158, 11, 0.4); }
        
        @keyframes scrollVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 10px)); }
        }
        .marquee-vertical {
          animation: scrollVertical 40s linear infinite;
        }
        .marquee-container:hover .marquee-vertical {
          animation-play-state: paused;
        }

        @keyframes scrollHorizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); }
        }
        @keyframes scrollHorizontalReverse {
          0% { transform: translateX(calc(-50% - 10px)); }
          100% { transform: translateX(0); }
        }
        .marquee-horizontal {
          animation: scrollHorizontal 50s linear infinite;
        }
        .marquee-horizontal-reverse {
          animation: scrollHorizontalReverse 50s linear infinite;
        }
        .marquee-container-h:hover .marquee-horizontal,
        .marquee-container-h:hover .marquee-horizontal-reverse {
          animation-play-state: paused;
        }
        
        @keyframes floatBounce {
          0% { transform: translateY(-30px); }
          100% { transform: translateY(-60px); }
        }
      `}</style>
      
      {/* 3D Glass Navbar (Floating Pill) */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <header className="w-full max-w-7xl relative pointer-events-auto">
          <div className="absolute inset-0 overflow-hidden shadow-lg border border-white/60 pointer-events-none rounded-full">
            <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-90" />
          </div>
          
          <div className="glass w-full px-6 py-3 flex items-center justify-between mt-1 relative z-10 rounded-full">
            <div className="flex items-center gap-3 group cursor-pointer outline-none" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-blue-500 text-blue-500 flex items-center justify-center transition-transform duration-300 shadow-sm group-hover:scale-105">
                <Landmark size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-heading font-extrabold text-blue-600 tracking-tight leading-none">DigiGrant</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/schemes" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Browse Subsidies</Link>
              <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">How it Works</Link>
              <div className="w-px h-5 bg-slate-200"></div>
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Sign In</Link>
              <Link to="/register" className="btn-3d text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full">Get Started</Link>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-28 lg:pt-52 lg:pb-36 px-6 mesh-bg min-h-screen flex items-center">
        {/* Massive 3D Background Flag */}
        <div className="absolute right-0 top-1/3 -translate-y-1/3 z-10 transform scale-[1.2] lg:scale-[1.3] -rotate-6 hidden md:block perspective-container pointer-events-none">
          <div className="flag-container relative" style={{ transform: 'rotateY(-20deg) rotateX(10deg)' }}>
            <div className="flag-pole relative z-20" style={{height: '600px', width: '8px', background: 'linear-gradient(180deg, #a8a29e, #78716c)'}}></div>
            <div className="flag relative z-10" style={{width: '600px', height: '400px', borderRadius: '0 8px 8px 0'}}>
              <div className="flag-saffron"></div>
              <div className="flag-white">
                <div className="center-emblem" style={{width: '90px', height: '90px', borderRadius: '50%', border: 'none'}}></div>
              </div>
              <div className="flag-green"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px] animate-float z-0 pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-violet-400/20 rounded-full blur-[100px] animate-float-slow z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left perspective-container">
            <motion.div 
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-blue-100/60 animate-pulse-glow"
            >
              <span className="text-lg">🇮🇳</span>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-heading">Digital India Initiative 2026</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              Empowering Citizens Through <br />
              <span className="text-blue-600">
                Digital Welfare.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              DigiGrant is the next-generation 3D platform to effortlessly discover grants, verify documents instantly, and receive DBT assistance securely.
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              onSubmit={handleSearch} 
              className="max-w-xl mx-auto lg:mx-0 glass p-2.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_10px_40px_rgba(79,70,229,0.1)] flex flex-col sm:flex-row gap-3 transform-gpu"
            >
              <div className="relative flex-1 flex items-center px-4">
                <Search className="text-blue-400 shrink-0" size={22} />
                <input 
                  type="text" 
                  placeholder="Search 'Housing' or 'Agriculture'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-700 placeholder-slate-400 font-medium h-12 focus:outline-none focus:ring-0 ml-3"
                />
              </div>
              <button 
                type="submit" 
                className="btn-3d bg-gradient-to-r from-blue-600 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-heading tracking-wide"
              >
                Search <ArrowRight size={18} />
              </button>
            </motion.form>
          </div>

          <div className="lg:col-span-5 relative hidden md:block h-[500px]">
            {/* Empty space on the right, since the flag and avatars are now absolutely positioned on the screen right */}
          </div>
        </div>
      </section>

      {/* Visionary Leaders Graphic Section */}
      <section className="relative py-32 bg-slate-50 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center perspective-container">
          
          <div className="text-center max-w-3xl mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4 tracking-tight"
            >
              Honoring Our <span className="text-blue-600">Visionaries.</span>
            </motion.h2>
            <p className="text-lg md:text-xl text-slate-600 font-medium">
              Guided by the principles of our great leaders, education reformers, peacemakers, and warriors.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 20, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 10, rotateY: -10 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full max-w-5xl rounded-[2.5rem] bg-white p-4 shadow-[0_20px_50px_rgba(8,112,184,0.15)] border border-white relative group animate-float-slow"
          >
            {/* Inner 3D border effect */}
            <div 
              className="absolute inset-0 rounded-[2.5rem] border-4 border-white/50 pointer-events-none z-20"
              style={{ transform: 'translateZ(20px)' }}
            ></div>
            
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-50 flex justify-center">
              <img 
                src="/indian_leaders_v2.jpg" 
                alt="Visionary Leaders of India: Gandhiji, Nehru, APJ Kalam, Shivaji, Dr. Ambedkar" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none mix-blend-multiply"></div>
            </div>
            
            {/* 3D floating badge */}
            <div 
              className="absolute -bottom-8 -right-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-2xl border-2 border-white/20 z-30"
              style={{ transform: 'translateZ(50px) rotateY(-5deg)' }}
            >
              <p className="font-heading font-bold text-xl tracking-wide">Digital India 2026</p>
              <p className="text-sm text-blue-100 font-medium mt-1">Built for the people.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Central Ministers Marquee Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4 tracking-tight">
            Union Council of Ministers
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            The central leadership driving the nation's growth and development.
          </p>
        </div>
        
        <div className="w-full overflow-hidden marquee-container-h relative z-10 py-4">
          <div className="marquee-horizontal flex gap-6 px-3" style={{ width: 'max-content' }}>
            {[...ministers, ...ministers, ...ministers].map((minister, idx) => (
              <div 
                key={idx} 
                className="w-80 shrink-0 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:border-blue-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden shadow-md border-2 border-slate-50 relative group-hover:scale-105 transition-transform">
                    {minister.image ? (
                      <img src={minister.image} alt={minister.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-700 flex items-center justify-center font-heading font-bold text-xl">
                        {minister.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-base mb-0.5 group-hover:text-blue-600 transition-colors">{minister.name}</h4>
                    <p className="text-xs font-medium text-slate-500 line-clamp-2">{minister.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chief Ministers Marquee Section */}
      <section className="relative py-16 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 tracking-tight">Leadership Across the States</h3>
          <p className="text-slate-500 font-medium mt-2">Chief Ministers of Indian States and Union Territories</p>
        </div>
        
        <div className="relative w-full overflow-hidden marquee-container-h flex flex-col gap-6">
          {/* Fade masks for horizontal marquee */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-40 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-40 pointer-events-none"></div>
          
          {/* Row 1 (Leftward) */}
          <div className="marquee-horizontal flex gap-6 w-max pl-6">
            {[...chiefMinisters.slice(0, 16), ...chiefMinisters.slice(0, 16)].map((cm, idx) => (
              <div 
                key={`r1-${idx}`} 
                className="w-80 shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-inner border border-orange-200 bg-white group-hover:scale-105 transition-transform">
                    {cm.image ? (
                      <>
                        <img 
                          src={cm.image} 
                          alt={cm.name} 
                          className="w-full h-full object-cover object-top" 
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = 'none';
                            const fallback = img.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }} 
                        />
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 items-center justify-center font-heading font-bold text-lg" style={{ display: 'none' }}>
                          {cm.name.charAt(0)}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 flex items-center justify-center font-heading font-bold text-lg">
                        {cm.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-[15px] leading-tight mb-0.5">{cm.name}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cm.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 (Rightward) */}
          <div className="marquee-horizontal-reverse flex gap-6 w-max pl-6">
            {[...chiefMinisters.slice(16), ...chiefMinisters.slice(16)].map((cm, idx) => (
              <div 
                key={`r2-${idx}`} 
                className="w-80 shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-inner border border-green-200 bg-white group-hover:scale-105 transition-transform">
                    {cm.image ? (
                      <>
                        <img 
                          src={cm.image} 
                          alt={cm.name} 
                          className="w-full h-full object-cover object-top" 
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = 'none';
                            const fallback = img.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }} 
                        />
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-50 text-green-700 items-center justify-center font-heading font-bold text-lg" style={{ display: 'none' }}>
                          {cm.name.charAt(0)}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-50 text-green-700 flex items-center justify-center font-heading font-bold text-lg">
                        {cm.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-[15px] leading-tight mb-0.5">{cm.name}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cm.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Light Stats Section */}
      <section className="relative py-24 overflow-hidden bg-white border-t border-b border-slate-100">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-violet-100/40 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Disbursed (₹Cr)', value: `₹${(stats.totalDisbursedAmount / 10000000).toFixed(1)}` },
            { label: 'Citizens Reached', value: stats.totalRegisteredCitizens.toLocaleString() },
            { label: 'Active Schemes', value: stats.totalSchemesActive },
            { label: 'Applications', value: stats.totalApplicationsReceived.toLocaleString() }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.1)] transition-shadow duration-300 relative group"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-4xl md:text-5xl font-heading font-extrabold text-slate-800 mb-3">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pillars of India 3D CSS Monument Section */}
      <section className="relative py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-center lg:text-left space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-blue-100/60"
            >
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-heading">The Pillars of India</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 leading-tight"
            >
              Built for every <span className="text-blue-600">Citizen.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
            >
              Honoring our <strong>visionary scientists</strong>, our <strong>great warriors</strong>, our <strong>hardworking farmers</strong>, our tireless <strong>education reformers</strong>, and every civilian. A digital future engineered purely for the people.
            </motion.p>
          </div>

          <div className="monument-container w-full">
            <div className="monument-base">
              <div className="monument-floor"></div>
              
              {/* Farmer Pillar */}
              <div className="pillar pillar-1 pillar-3d">
                <div className="hologram-wrapper">
                  <div className="hologram hologram-1">
                    <div className="flex flex-col items-center justify-center">
                      <Sprout size={36} strokeWidth={1.5} />
                      <span className="text-[9px] font-bold uppercase mt-1 tracking-wider">Farmers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scientist / APJ Kalam Pillar */}
              <div className="pillar pillar-2 pillar-3d">
                <div className="hologram-wrapper">
                  <div className="hologram hologram-2">
                    <div className="flex flex-col items-center justify-center">
                      <HeartPulse size={36} strokeWidth={1.5} />
                      <span className="text-[9px] font-bold uppercase mt-1 tracking-wider">Scientists</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Peacemaker / Gandhi Pillar */}
              <div className="pillar pillar-3 pillar-3d">
                <div className="hologram-wrapper">
                  <div className="hologram hologram-3">
                    <div className="flex flex-col items-center justify-center">
                      <HomeIcon size={36} strokeWidth={1.5} />
                      <span className="text-[9px] font-bold uppercase mt-1 tracking-wider">Peace</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warrior Pillar */}
              <div className="pillar pillar-4 pillar-3d">
                <div className="hologram-wrapper">
                  <div className="hologram hologram-4">
                    <div className="flex flex-col items-center justify-center">
                      <ShieldCheck size={36} strokeWidth={1.5} />
                      <span className="text-[9px] font-bold uppercase mt-1 tracking-wider">Warriors</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Reformer Pillar (Center) */}
              <div className="pillar pillar-5 pillar-3d">
                <div className="hologram-wrapper">
                  <div className="hologram hologram-5">
                    <div className="flex flex-col items-center justify-center text-center">
                      <GraduationCap size={36} strokeWidth={1.5} />
                      <span className="text-[9px] font-bold uppercase mt-1 tracking-wider leading-none">Education<br/>Reformers</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </section>

      {/* 3D Category Icons Selector */}
      <section className="relative py-32 bg-slate-50 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              Explore by Category
            </motion.h2>
            <p className="text-lg text-slate-500 font-medium">Immersive discovery of subsidies tailored to modern Indian life and enterprise.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 perspective-container">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="card-3d group relative flex flex-col items-center justify-center p-8 bg-white hover:bg-slate-50/80 rounded-[2rem] cursor-pointer border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Colorful Glow Background on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${cat.color} transition-opacity duration-500 rounded-[2rem]`}></div>
                
                {/* The Floating Icon Block */}
                <div className={`relative z-10 w-20 h-20 rounded-3xl ${cat.bg} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-2xl ${cat.shadow}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="text-slate-600 group-hover:text-slate-900 transition-colors duration-300">
                    {cat.icon}
                  </div>
                </div>
                
                {/* Modern Typography */}
                <span className="relative z-10 text-[15px] font-heading font-bold text-slate-600 group-hover:text-slate-900 transition-colors duration-300">{cat.label}</span>
                
                {/* Subtle bottom border accent */}
                <div className={`absolute bottom-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${cat.color} transition-opacity duration-500 transform origin-left scale-x-0 group-hover:scale-x-100`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest font-heading mb-8">Powered by Government of India Digital Infrastructure</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {['Digital India', 'Aadhaar', 'UPI', 'NIC', 'gov.in', 'myGov'].map((badge, i) => (
              <span key={i} className="text-lg md:text-xl font-heading font-extrabold text-slate-800 tracking-tight">{badge}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
