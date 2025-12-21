import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto mb-8"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
        <input
          type="text"
          placeholder="Buscar aplicativos..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input input-bordered w-full pl-12 bg-base-200/50 border-base-300 focus:border-primary focus:outline-none transition-all duration-200"
        />
      </div>
    </motion.div>
  );
}