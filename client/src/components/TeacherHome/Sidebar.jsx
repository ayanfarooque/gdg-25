import { Home, BookOpen, Calendar, MessageCircle } from "react-feather";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col gap-4 bg-[#E195AB] p-4 w-20">
      <button 
        className={`p-4 rounded-lg ${location.pathname === '/' ? 'bg-[#bb7186]' : 'hover:bg-[#bb7186]'}`}
        onClick={() => navigate('/teacher-home')}
      >
        <Home className="w-6 h-6" />
      </button>

      <button 
        className={`p-4 rounded-lg ${location.pathname === '/chat-page' ? 'bg-[#bb7186]' : 'hover:bg-[#bb7186]'}`}
        onClick={() => navigate('/teachers-Community')}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <button 
        className={`p-4 rounded-lg ${location.pathname === '/Assignment' ? 'bg-[#bb7186]' : 'hover:bg-[#bb7186]'}`}
        onClick={() => navigate('/teacher-Assignment')}
      >
        <BookOpen className="w-6 h-6" />
      </button>

      <button 
        className={`p-4 rounded-lg ${location.pathname === '/Resources' ? 'bg-bg-[#bb7186]' : 'hover:bg-[#bb7186]'}`}
        
      >
        <Calendar className="w-6 h-6" />
      </button>
    </aside>
  );
}

export default Sidebar;
