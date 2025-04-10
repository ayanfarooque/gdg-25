import React from 'react';
import { Bell, User, Cog } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex justify-end bg-teal-300 p-4 gap-4 rounded-bl-2xl shadow-md">
      {[Bell, User, Cog].map((Icon, index) => (
        <Icon key={index} className="w-6 h-6 text-white cursor-pointer hover:text-black" />
      ))}
    </div>
  );
};

export default Header;