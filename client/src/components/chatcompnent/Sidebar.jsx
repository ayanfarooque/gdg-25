import React from 'react';
import { Home, MessageCircle, Settings, Package, Grid } from 'lucide-react';

const icons = [Home, MessageCircle, Settings, Package, Grid];

const Sidebar = () => {
  return (
    <div className="w-16 background: #31C4CA;
 p-4 flex flex-col items-center gap-4 rounded-r-2xl shadow-md">
      {icons.map((Icon, index) => (
        <Icon key={index} className="w-6 h-6 text-white cursor-pointer hover:text-black" />
      ))}
    </div>
  );
};

export default Sidebar;