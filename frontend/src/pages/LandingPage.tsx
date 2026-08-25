import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Footer } from '../components/Footer';
import { BarChart, Target, Zap, CheckCircle, Search, ArrowRight, GraduationCap, Home as HomeIcon, MapPin, Building2, Leaf, ShieldCheck, HeartPulse, FileText, ChevronRight, Activity, Users, Database, Compass, Sun, Sprout, Landmark } from 'lucide-react';
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

const HologramCycler: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ministers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 md:w-64 z-30 pointer-events-none">
      <div className="relative w-full h-full animate-float">
        {/* Holographic glowing base shadow */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 h-6 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        
        <div className="relative w-full aspect-square flex items-center justify-center">
          {ministers.map((minister, idx) => {
            const isActive = currentIndex === idx;
            return (
              <div 
                key={idx}
                className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-all duration-1000
                  ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
              >
                {/* Premium Glassmorphism Circular Avatar */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-2 bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/80 bg-slate-100 shadow-inner">
                    <img 
                      src={minister.image} 
                      alt={minister.name} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  
                  {/* Glowing orbital rings for futuristic feel */}
                  <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-[-8px] rounded-full border-t-2 border-r-2 border-blue-500/40 animate-[spin_6s_linear_infinite_reverse]"></div>
                </div>
                
                {/* Floating Label */}
                <div className="absolute -bottom-10 w-[150%] text-center z-30 transition-transform duration-500 transform translate-y-0">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 px-5 border border-slate-200/80 shadow-[0_15px_35px_rgba(37,99,235,0.15)] inline-block relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-t border-l border-slate-200/80"></div>
                    <p className="text-slate-900 font-extrabold text-sm md:text-base tracking-wider uppercase relative z-10">{minister.name}</p>
                    <p className="text-blue-600 text-xs md:text-sm font-semibold mt-1 relative z-10">{minister.role || minister.state}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const LandingPage: React.FC = () => {

  // Scrollytelling Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const totalFrames = 480;

  // Preload frames
  useEffect(() => {
    const imgArray: HTMLImageElement[] = [];
    const drawInitial = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/anim-v2/frame_${i}.webp`;
      img.onload = () => {
        if (i === 0) drawInitial(img);
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (images.length === 0) return;
      const html = document.documentElement;
      const scrollTop = html.scrollTop;
      
      // We calculate progress relative to the 500vh container (approx 5 window heights)
      // Max scroll for the sticky section is 4 * innerHeight
      const maxScrollTop = window.innerHeight * 4;
      const scrollFraction = maxScrollTop > 0 ? (scrollTop / maxScrollTop) : 0;
      
      const frameIndex = Math.min(totalFrames - 1, Math.max(0, Math.floor(scrollFraction * totalFrames)));
      const img = images[frameIndex];
      
      if (img && img.complete) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      }

      let newSection = 0;
      if (scrollFraction < 0.20) newSection = 0;
      else if (scrollFraction < 0.45) newSection = 1;
      else if (scrollFraction < 0.70) newSection = 2;
      else if (scrollFraction < 0.90) newSection = 3;
      else newSection = 4;

      if (newSection !== activeSectionRef.current) {
        activeSectionRef.current = newSection;
        setActiveSection(newSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [images]);
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
              <Link to="/v2" className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors mr-2">Try V2 Beta</Link>
                <Link to="/register" className="btn-3d text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full">Get Started</Link>
            </div>
          </div>
        </header>
      </div>

      
      {/* Scrollytelling Hero Section (Replacing old Hero) */}
      <section className="relative h-[500vh] bg-[#050505] text-white selection:bg-[#0050FF] selection:text-white">
        
        {/* Sticky Canvas Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-[#050505]">
          <canvas ref={canvasRef} className="w-full h-full object-cover transform-gpu origin-center" />
          <div className="absolute inset-0 bg-black/50 pointer-events-none backdrop-blur-[2px]" />

          {/* Robust Storytelling Text Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence mode="wait">
              
              {activeSection === 0 && (
                <motion.div 
                  key="hero"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                >
                  <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
                      <Zap className="w-4 h-4" /> The Future of Subsidy Delivery
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                      Transparent. Secure. <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
                        Instant Disbursement.
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                      Experience the next generation of government grant distribution. Powered by real-time DBT, automated KYC, and multi-tier verification.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeSection === 1 && (
                <motion.div 
                  key="f1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-6 w-full md:w-1/3"
                >
                  <div className="flex flex-col">
                    <Target className="w-12 h-12 text-blue-400 mb-6 drop-shadow-lg" />
                    <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                      Precision Targeting
                    </h3>
                    <p className="text-xl text-slate-200 leading-relaxed drop-shadow-md font-medium">
                      AI-driven beneficiary matching ensures funds reach the exact intended citizens without leakage. Aadhaar-linked KYC guarantees absolute accuracy.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeSection === 2 && (
                <motion.div 
                  key="f2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 right-0 md:right-[10%] flex flex-col justify-center px-6 w-full md:w-1/3 text-left"
                >
                  <div className="flex flex-col">
                    <BarChart className="w-12 h-12 text-emerald-400 mb-6 drop-shadow-lg" />
                    <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                      Real-time Analytics
                    </h3>
                    <p className="text-xl text-slate-200 leading-relaxed drop-shadow-md font-medium">
                      Live dashboards for all nodal officers to track disbursement metrics, ledger history, and fund utilization instantly across districts.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeSection === 3 && (
                <motion.div 
                  key="f3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-6 w-full md:w-1/3"
                >
                  <div className="flex flex-col">
                    <FileText className="w-12 h-12 text-purple-400 mb-6 drop-shadow-lg" />
                    <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                      Paperless Pipeline
                    </h3>
                    <p className="text-xl text-slate-200 leading-relaxed drop-shadow-md font-medium">
                      100% digital verification pipeline. Middlemen and delays fade away as transactions are processed end-to-end via our secure portal.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeSection === 4 && (
                <motion.div 
                  key="cta"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                >
                  <div className="max-w-4xl flex flex-col items-center pointer-events-auto">
                    <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-white mb-6 drop-shadow-xl leading-[1.1]">
                      Track everything. <br/> <span className="text-white/50">Lose nothing.</span>
                    </h2>
                    <p className="text-2xl text-blue-200 mb-10 max-w-2xl mx-auto drop-shadow-lg font-medium">
                      Designed for governance, crafted for citizens. Join the digital revolution in subsidy distribution today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => navigate('/login')}
                        className="px-10 py-4 bg-white text-[#050505] rounded-full font-bold text-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] font-heading"
                      >
                        Access Dashboard
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
            </AnimatePresence>
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
        </div>

        {/* Full-bleed massive image container */}
        <div className="w-full relative flex justify-center perspective-container px-0 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-[100vw] lg:max-w-7xl relative group animate-float-slow"
            style={{ mixBlendMode: 'multiply' }}
          >
            <div className="relative flex justify-center w-full">
              <img 
                src="/indian_leaders_v2.jpg" 
                alt="Visionary Leaders of India: Gandhiji, Nehru, APJ Kalam, Shivaji, Dr. Ambedkar" 
                className="w-full lg:w-[110%] h-auto object-cover md:object-contain"
              />
            </div>
            
            {/* 3D floating badge */}
            <div 
              className="absolute bottom-10 right-4 lg:right-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-2xl border-2 border-white/20 pointer-events-none"
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
        <div className="max-w-7xl mx-auto px-6 relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
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

          <div className="relative w-full aspect-square md:aspect-video perspective-container flex items-center justify-center mt-12 lg:mt-0">
            {/* 3D Isometric Base Floor */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 60, rotateZ: -30, y: 50 }}
              whileInView={{ opacity: 1, rotateX: 60, rotateZ: -45, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-[85%] h-[85%] max-h-[500px] bg-white/40 border-2 border-white/80 rounded-[3rem] shadow-[0_40px_80px_rgba(37,99,235,0.1)] backdrop-blur-sm"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Floor Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 rounded-[3rem]"></div>
              
              {/* Center Hologram Emitter */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
            </motion.div>

            <HologramCycler />
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
                className="card-3d group relative flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] cursor-pointer border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Colorful Glow Background on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${cat.color} transition-all duration-500`}></div>
                
                {/* The Floating Icon Block */}
                <div className={`relative z-10 w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-500`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} rounded-[2rem] opacity-5 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  {/* Subtle inner shadow for 3D depth */}
                  <div className="absolute inset-0 rounded-[2rem] border border-white/50 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] pointer-events-none"></div>
                  <div className={`text-slate-600 group-hover:text-slate-900 transition-colors duration-300 relative z-20`}>
                    {cat.icon}
                  </div>
                </div>
                
                {/* Modern Typography */}
                <span className="relative z-10 text-lg font-heading font-extrabold text-slate-700 group-hover:text-white transition-colors duration-300 tracking-wide">{cat.label}</span>
                
                {/* Glossy reflection highlight */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
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



