"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  menuWidth?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  icon: LeadingIcon,
  className = "",
  menuWidth = "w-full",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative block w-full text-left ${className}`}>
      {/* Trigger button - Siêu nhạy, phản hồi tức thì */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 bg-[#0D1527] hover:bg-[#141C2E] border border-slate-700 hover:border-[#A3E635]/60 rounded-xl text-xs text-white font-medium shadow-xs focus:outline-none focus:ring-1 focus:ring-[#A3E635] cursor-pointer active:scale-[0.99] transition-transform ${
          isOpen ? "ring-1 ring-[#A3E635] border-[#A3E635] bg-[#141C2E]" : ""
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {LeadingIcon && <LeadingIcon className="w-4 h-4 text-slate-400 shrink-0" />}
          {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-[#A3E635] shrink-0" />}
          <span className="truncate text-slate-200 font-semibold">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-[#A3E635]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popover - Render ngay lập tức không bị delay */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 mt-1.5 ${menuWidth} min-w-[200px] bg-[#141C2E] border border-slate-700 rounded-xl shadow-2xl z-50 py-1`}
        >
          <div className="max-h-60 overflow-y-auto px-1 space-y-0.5 custom-scrollbar">
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-left cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#A3E635]/15 text-[#A3E635] font-bold border border-[#A3E635]/30"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {OptionIcon && <OptionIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#A3E635]" : "text-slate-400"}`} />}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#A3E635] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
