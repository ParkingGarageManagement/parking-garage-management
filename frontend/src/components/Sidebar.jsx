import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaParking, FaMap, FaCreditCard, FaInfoCircle, FaEnvelope, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: <FaHome />, text: 'Home' },
    { path: '/dashboard', icon: <FaParking />, text: 'Dashboard', protected: true },
    { path: '/map', icon: <FaMap />, text: 'Map View', protected: true },
    { path: '/history', icon: <FaParking />, text: 'History', protected: true },
    { path: '/feedback', icon: <FaEnvelope />, text: 'Feedback' , protected: false},
    { path: '/payment', icon: <FaCreditCard />, text: 'Payment', protected: true },
    { path: '/about', icon: <FaInfoCircle />, text: 'About' },
    { path: '/contact', icon: <FaEnvelope />, text: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="h-full">
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">ParkSmart</h1>
          <p className="text-gray-400 text-sm">Parking Management System</p>
        </div>
        
        <div className="flex-1">
          {navItems.map((item) => (
            (!item.protected || (item.protected && user)) && (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 mb-2
                  ${isActive ? 'bg-primary text-secondary' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </NavLink>
            )
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4 mt-4">
          {user ? (
            <>
              <div className="flex items-center px-4 py-3 text-gray-300 mb-2">
                <FaUser className="text-xl" />
                <span className="ml-3">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-800 w-full"
              >
                <FaSignOutAlt className="text-xl" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive ? 'bg-primary text-secondary' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              <FaUser className="text-xl" />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </motion.div>
    </nav>
  )
}

export default Sidebar