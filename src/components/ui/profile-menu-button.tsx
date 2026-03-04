import React from "react";
import { ChevronRight } from "lucide-react";

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick: () => void;
}

export function MenuButton({ icon, label, badge, onClick }: MenuButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white p-5 rounded-2xl flex items-center justify-between border border-gray-50 hover:border-[#9C7C50]/30 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-400 group-hover:text-[#9C7C50] transition-colors">{icon}</div>
        <span className="text-sm font-bold text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="bg-[#9C7C50] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}