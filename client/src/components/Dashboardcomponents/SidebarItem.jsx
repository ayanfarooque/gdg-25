import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ name, icon: Icon, color, path, onClick, isOpen }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
      onClick={onClick || (() => navigate(path))}
    >
      <Icon size={20} style={{ color: color, minWidth: "20px" }} />
      <AnimatePresence>
        {isOpen && (
          <motion.span
            className="ml-4 whitespace-nowrap"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SidebarItem;
