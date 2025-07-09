// 📁 src/components/common/Header.jsx
import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ currentRole }) => (
  <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
    <h1 className="font-semibold text-xl">{currentRole.toUpperCase()} Dashboard</h1>
    <div className="flex space-x-4 items-center">
      <Bell className="w-5 h-5 text-gray-500" />
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">U</div>
    </div>
  </header>
);

export default Header;