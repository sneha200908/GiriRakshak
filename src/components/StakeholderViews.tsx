import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Truck, 
  Users, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Home, 
  HeartHandshake
} from 'lucide-react';
import { StakeholderRole, LocationZone, EarlyWarningAlert, InfrastructureItem } from '../types';

interface StakeholderViewsProps {
  currentRole: StakeholderRole;
  onSelectRole: (role: StakeholderRole) => void;
  zones: LocationZone[];
  alerts: EarlyWarningAlert[];
  infrastructure: InfrastructureItem[];
}

export const StakeholderViews: React.FC<StakeholderViewsProps> = ({
  currentRole,
  onSelectRole,
  zones,
  alerts,
  infrastructure
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('East Khasi Hills');
  const [evacOrderIssued, setEvacOrderIssued] = useState<boolean>(false);

  const roles: { id: StakeholderRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'SDMA / NDMA', 
      label: 'State Disaster Management (SDMA)', 
      icon: <Building2 className="w-4 h-4" />, 
      desc: 'Regional resource allocation, inter-state coordination, and strategic policy' 
    },
    { 
      id: 'District Administration', 
      label: 'District Magistrate / DEOC', 
      icon: <UserCheck className="w-4 h-4" />, 
      desc: 'District administrative orders, road closure decrees, and local evacuations' 
    },
    { 
      id: 'Emergency Responders', 
      label: 'NDRF / SDRF Responders', 
      icon: <Truck className="w-4 h-4" />, 
      desc: 'Operational battalion readiness, staging camps, and heavy rescue equipment' 
    },
    { 
      id: 'Citizen & Community', 
      label: 'Citizen & Community View', 
      icon: <Users className="w-4 h-4" />, 
      desc: 'Simplified safety advisories, active evacuation shelters, and helplines' 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Role Switcher */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a183d] to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Tailored Disaster Management Interfaces
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Stakeholder Operational Views
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Switch between command hierarchies to access customized dashboards tuned specifically for state policymakers, district magistrates, first responders, or citizens.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between space-y-1 ${
                currentRole === r.id
                  ? 'bg-cyan-950/80 border-cyan-500 shadow-lg shadow-cyan-950/50 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className={currentRole === r.id ? 'text-cyan-400' : 'text-slate-400'}>
                  {r.icon}
                </span>
                <span className="truncate">{r.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {r.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: SDMA View */}
      {currentRole === 'SDMA / NDMA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">State-wide High Hazard Zones</div>
              <div className="text-2xl font-black font-mono text-red-400 mt-1">4 of 8 Zones</div>
              <div className="text-[10px] text-slate-500">Meghalaya, Assam, Sikkim, Nagaland</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Disaster Response Fund Allocation</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">₹42.5 Cr</div>
              <div className="text-[10px] text-slate-500">SDRF pre-authorized for monsoon</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Inter-State Lifelines Vulnerable</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">3 Arteries</div>
              <div className="text-[10px] text-slate-500">NH-6, NH-29, Lumding-Badarpur</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Inter-Agency Co-ordination</div>
              <div className="text-2xl font-black font-mono text-cyan-300 mt-1">All 8 DEOCs</div>
              <div className="text-[10px] text-slate-500">Connected via National CAP Node</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>State Disaster Management Authority Regional Strategy Board</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-200">
              <div className="font-bold text-cyan-300 text-sm">Strategic Directives for Next 48 Hours:</div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                  <span><strong>Border Roads Organisation (BRO) Interlock:</strong> Project Pushpak & Project Setuk deployed with bulldozers at Km 118-142 on NH-6.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                  <span><strong>Indian Air Force (IAF) Eastern Air Command:</strong> Helicopter search & rescue assets stationed on standby at Shillong & Guwahati airfields.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                  <span><strong>Civil Supplies & Petroleum Buffer:</strong> Barak Valley & Tripura buffer stocks elevated to 21-day fuel reserve in anticipation of highway severance.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: District Magistrate View */}
      {currentRole === 'District Administration' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-amber-500/30">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                DEOC Command Authority: Section 30/34 DM Act 2005
              </span>
              <h3 className="text-xl font-bold text-white">District Magistrate Operations Console</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Active District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none"
              >
                <option value="East Khasi Hills">East Khasi Hills (Shillong / Sohra)</option>
                <option value="Dima Hasao">Dima Hasao (Haflong)</option>
                <option value="East Sikkim">East Sikkim (Gangtok)</option>
                <option value="Kohima">Kohima (Nagaland)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Executive Traffic & Lifeline Restriction Orders</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">NH-6 Night Movement Restriction</div>
                    <div className="text-[11px] text-slate-400">Prohibit commercial trucks between 20:00 - 05:00</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                    ORDER ENFORCED
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">School & Hillside Institution Closure</div>
                    <div className="text-[11px] text-slate-400">Precautionary suspension of classes in Sohra sub-division</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    DECREED
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Precautionary Evacuation Protocol</span>
              </h4>
              <p className="text-xs text-slate-300">
                AI model predicts active slip risk along Sohra lower slope habitations (approx. 2,400 residents in direct hazard envelope).
              </p>
              <button
                onClick={() => setEvacOrderIssued(!evacOrderIssued)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  evacOrderIssued
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                }`}
              >
                {evacOrderIssued ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Evacuation Order Issued & Disseminated to Police</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Ratify Stage-1 Precautionary Evacuation Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Emergency Responders / NDRF View */}
      {currentRole === 'Emergency Responders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Active Responders Deployed</div>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">4 Battalions</div>
              <div className="text-[10px] text-slate-500">1st Bn (Patgaon) & 12th Bn (Itanagar)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Heavy Clearance Equipment</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">18 Earth-movers</div>
              <div className="text-[10px] text-slate-500">Excavators & hydraulic cutters staged</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Relief Shelters Prepared</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">26 Shelters</div>
              <div className="text-[10px] text-slate-500">Combined capacity: 8,500 evacuees</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              <span>NDRF Operational Staging & Tactical Readiness</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Unit / Team</th>
                    <th className="py-2.5 px-3">Staging Location</th>
                    <th className="py-2.5 px-3">Assigned Hazard Zone</th>
                    <th className="py-2.5 px-3">Equipment Inventory</th>
                    <th className="py-2.5 px-3 text-right">Readiness State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white">NDRF Team Alpha (12th Bn)</td>
                    <td className="py-3 px-3 text-slate-300">Mawkdok Base Camp, Sohra Road</td>
                    <td className="py-3 px-3 text-cyan-400 font-medium">Sohra Escarpment (NH-6)</td>
                    <td className="py-3 px-3 text-slate-300">Hydraulic spreaders, Life detectors, UAVs</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        15-Min Response Ready
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white">NDRF Team Bravo (1st Bn)</td>
                    <td className="py-3 px-3 text-slate-300">Silchar Sub-Station</td>
                    <td className="py-3 px-3 text-cyan-400 font-medium">Haflong Railway Cut</td>
                    <td className="py-3 px-3 text-slate-300">Track clearance gear, Inflatable boats</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        Standby
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Citizen & Public View */}
      {currentRole === 'Citizen & Community' && (
        <div className="space-y-6">
          {/* Hero Safety Notice */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/50 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Public Safety Advisory • Meghalaya & Assam Hilly Regions</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Landslide Red Alert in Effect for East Khasi Hills & Haflong
            </h3>
            <p className="text-xs text-slate-200 max-w-3xl leading-relaxed">
              Heavy continuous rain has weakened mountain slopes. If you observe soil cracking, bulging foundations, tilting utility poles, or sudden muddy stream surges, immediately move to designated government relief shelters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Safe Shelters */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Designated Safe Shelters</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-white">Sohra Higher Secondary School Ground</div>
                  <div className="text-[11px] text-slate-400">Capacity: 450 persons • Medical camp active</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-white">Haflong Community Hall Complex</div>
                  <div className="text-[11px] text-slate-400">Capacity: 600 persons • Drinking water & food relief</div>
                </div>
              </div>
            </div>

            {/* Emergency Helplines */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>Emergency Helplines (Toll-Free)</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">District Disaster Helpline:</span>
                  <span className="font-bold text-cyan-400 text-sm">1077</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">NDRF Control Room:</span>
                  <span className="font-bold text-cyan-400 text-sm">011-24363260</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Ambulance Emergency:</span>
                  <span className="font-bold text-cyan-400 text-sm">108</span>
                </div>
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Life-Safety Actions</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Keep emergency backpack with water, flashlight & battery radio.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Avoid driving on hillside roads during nighttime downpours.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Do not stay near riverbeds or steep un-reinforced cliff faces.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
