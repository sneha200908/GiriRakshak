import React, { useState } from 'react';
import { 
  BellRing, 
  Smartphone, 
  PhoneCall, 
  Volume2, 
  Radio, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Building2, 
  Users, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const NotificationSimulation: React.FC = () => {
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastProgress, setBroadcastProgress] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'as' | 'hi'>('en');

  const handleSimulateBroadcast = () => {
    setIsBroadcasting(true);
    setBroadcastProgress(0);
    setHasCompleted(false);

    const interval = setInterval(() => {
      setBroadcastProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBroadcasting(false);
          setHasCompleted(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const alertMessages = {
    en: {
      sms: "[GIRIRAKSHAK AI / NDMA] RED ALERT: High landslide probability at Sohra & NH-6 within next 4-6h due to 184mm extreme rain. Avoid hill slopes and NH-6 transit. Dial 1077 for DEOC helpline.",
      appTitle: "CRITICAL LANDSLIDE HAZARD WARNING",
      appBody: "Sohra Escarpment & NH-6 Lifeline: Geotechnical pore pressure threshold exceeded (89%). High risk of slope failure.",
      ivr: "This is an urgent disaster warning from the State Disaster Management Authority. Sensor networks have detected severe slope instability in Sohra and adjacent hill cuttings. Please move away from vulnerable downhill buildings immediately.",
      siren: "SIREN ACTIVATED: 120dB acoustic wave broadcasted across 8 hazard towers along NH-6 Sonapur to Lumshnong."
    },
    as: {
      sms: "[গিৰিৰক্ষক AI / SDMA] সতৰ্কবাণী: প্ৰচণ্ড বৰষুণৰ বাবে ছোহৰা আৰু NH-6 অংশত ভূমিস্খলনৰ সম্ভাৱনা অতি বেছি। পাহাৰীয়া এলেকাত সাৱধানে থাকক। জৰুৰীকালীন সহায়ৰ বাবে ১০৭৭ নম্বৰত যোগাযোগ কৰক।",
      appTitle: "অতি জৰুৰী ভূমিস্খলন সতৰ্কবাণী",
      appBody: "ছোহৰা আৰু পাহাৰীয়া অঞ্চল: প্ৰবল বৰষুণৰ ফলত মাটি খহি পৰাৰ আশংকাজনক পৰিস্থিতি।",
      ivr: "ৰাজ্যিক দুৰ্যোগ ব্যৱস্থাপনা প্ৰাধিকৰণৰ তৰফৰ পৰা এক জৰুৰী সতৰ্কবাণী। ছোহৰা অঞ্চলত ভূমিস্খলনৰ আশংকা অতি বৃদ্ধি পাইছে। সকলো নাগৰিকক সুৰক্ষিত স্থানলৈ যাবলৈ আহ্বান জনোৱা হৈছে।",
      siren: "চাইৰেন সতৰ্কবাণী সক্ৰিয় কৰা হৈছে।"
    },
    hi: {
      sms: "[गिरिरक्षक AI / SDMA] लाल चेतावनी: अत्यधिक बारिश के कारण सोहरा और NH-6 क्षेत्र में भूस्खलन की भारी संभावना है। पहाड़ी ढलानों से दूर रहें। सहायता हेतु 1077 डायल करें।",
      appTitle: "अति गंभीर भूस्खलन चेतावनी",
      appBody: "सोहरा एवं NH-6: मिट्टी में अत्यधिक नमी एवं ढलान खिसकने का गंभीर खतरा।",
      ivr: "यह राज्य आपदा प्रबंधन प्राधिकरण की ओर से आपातकालीन चेतावनी है। सोहरा क्षेत्र में भूस्खलन का भारी खतरा बना हुआ है। कृपया सुरक्षित स्थानों पर जाएं।",
      siren: "आपातकालीन हूटर एवं सायरन सक्रिय किया गया।"
    }
  };

  const currentMsg = alertMessages[selectedLanguage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1c0d29] to-slate-900 border border-purple-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
              Multi-Channel Dissemination Gateway
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Common Alerting Protocol (CAP-India) Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Emergency Warning Broadcast & Notification Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Experience how early warnings triggered by GiriRakshak AI are formatted, translated into regional dialects, and dispatched synchronously via SMS, push banners, IVR phone calls, and acoustic sirens.
          </p>
        </div>

        {/* Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            id="simulate-warning-broadcast-btn"
            disabled={isBroadcasting}
            onClick={handleSimulateBroadcast}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs shadow-xl transition-all ${
              isBroadcasting
                ? 'bg-amber-600 text-white cursor-wait'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/60 hover:scale-105'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isBroadcasting ? `Broadcasting (${broadcastProgress}%)...` : 'Simulate Warning Broadcast'}</span>
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-400" />
          <span>Select Dissemination Language:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              selectedLanguage === 'en' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLanguage('as')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              selectedLanguage === 'as' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            অসমীয়া (Assamese)
          </button>
          <button
            onClick={() => setSelectedLanguage('hi')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              selectedLanguage === 'hi' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>

      {/* Broadcast Delivery Confirmation Log */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Multi-Agency Dispatch Verification & Audit Trail</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Target Hazard Zone: Sohra Escarpment (ALT-2026-001)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                broadcastProgress >= 25 || hasCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {broadcastProgress >= 25 || hasCompleted ? 'DELIVERED (0.4s)' : 'STANDBY'}
              </span>
            </div>
            <div className="font-bold text-white">State SDMA Gateway</div>
            <div className="text-slate-400 text-[11px]">Sent to State Disaster Management Authority command desk</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                broadcastProgress >= 50 || hasCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {broadcastProgress >= 50 || hasCompleted ? 'ACKNOWLEDGED (1.2s)' : 'STANDBY'}
              </span>
            </div>
            <div className="font-bold text-white">District DEOC Control</div>
            <div className="text-slate-400 text-[11px]">Sent to District Emergency Operations Centre (East Khasi Hills)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                broadcastProgress >= 75 || hasCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {broadcastProgress >= 75 || hasCompleted ? 'BROADCAST (2.1s)' : 'STANDBY'}
              </span>
            </div>
            <div className="font-bold text-white">Community Responders</div>
            <div className="text-slate-400 text-[11px]">Disseminated to 1,420 registered community village heads & Aapda Mitras</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Volume2 className="w-4 h-4 text-red-400" />
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                broadcastProgress >= 100 || hasCompleted ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-slate-800 text-slate-500'
              }`}>
                {broadcastProgress >= 100 || hasCompleted ? 'SIREN ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <div className="font-bold text-white">Acoustic Siren Network</div>
            <div className="text-slate-400 text-[11px]">Broadcast via emergency highway siren network & CAP cell towers</div>
          </div>
        </div>
      </div>

      {/* Visual Previews of 4 Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Channel 1: SMS Alert */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Smartphone className="w-4 h-4" />
                SMS Cell Broadcast
              </span>
              <span className="text-[10px] font-mono text-slate-400">Sender: VM-NDMA</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed space-y-1">
              <div className="text-[10px] text-slate-500">Today 14:32 • Carrier Network</div>
              <p>{currentMsg.sms}</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            *Transmitted via Telecom Service Providers (Airtel, Jio, BSNL) over Cell Broadcast System.
          </div>
        </div>

        {/* Channel 2: Mobile App Push */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <BellRing className="w-4 h-4" />
                Citizen App Notification
              </span>
              <span className="text-[10px] font-mono text-slate-400">Lockscreen Banner</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-red-500/40 text-xs text-slate-200 space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-[10px] text-red-400 font-bold">
                <span>GiriRakshak AI • NOW</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <div className="font-bold text-white text-xs">{currentMsg.appTitle}</div>
              <p className="text-[11px] text-slate-300">{currentMsg.appBody}</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            *High-priority push alert bypassing silent profile on registered citizens' phones.
          </div>
        </div>

        {/* Channel 3: Automated Voice Call (IVR) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <PhoneCall className="w-4 h-4" />
                Automated IVR Call
              </span>
              <span className="text-[10px] font-mono text-slate-400">SIP Outdialer</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Audio Stream Active (8 kHz PSTN)</span>
              </div>
              <p className="text-[11px] text-slate-300 italic">
                "{currentMsg.ivr}"
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            *Automated robocall outbound cascade targeting rural landlines & basic 2G handsets.
          </div>
        </div>

        {/* Channel 4: Public Siren */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-red-400">
                <Radio className="w-4 h-4" />
                Public Hillside Siren
              </span>
              <span className="text-[10px] font-mono text-slate-400">Acoustic Tower #04</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-red-500/40 text-xs text-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Acoustic Output: 120 dB</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {currentMsg.siren}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            *Direct solar-powered RTU activation installed on high-risk road curves and settlements.
          </div>
        </div>
      </div>
    </div>
  );
};
