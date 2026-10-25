import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'teal', trend }) => {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      iconBg: 'bg-teal-600',
      border: 'border-teal-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconBg: 'bg-blue-600',
      border: 'border-blue-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      iconBg: 'bg-amber-600',
      border: 'border-amber-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      iconBg: 'bg-purple-600',
      border: 'border-purple-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-600',
      border: 'border-emerald-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      iconBg: 'bg-rose-600',
      border: 'border-rose-100',
    },
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div className={`p-5 rounded-2xl bg-white border ${scheme.border} shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${scheme.iconBg} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${scheme.bg}`}></div>
    </div>
  );
};

export default StatCard;
