import React from 'react';
import { Home, MessageCircle, Settings, Package, Grid } from 'lucide-react';

const icons = [Home, MessageCircle, Settings, Package, Grid];

const Sidebar = () => {
  return (
    <div className="w-20 mt-8 mb-2 ml-3.5 h bg-[#E195AB] ;
 p-4 flex flex-col items-center gap-4 rounded-2xl shadow-md">
      {icons.map((Icon, index) => (
        <Icon key={index} className="w-6 h-6 m-8 text-white cursor-pointer hover:text-black" />
      ))}
    </div>
  );
};

export default Sidebar;