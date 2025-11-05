import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaCar } from 'react-icons/fa'
import images from '../assets/images'

const Home = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10,10,10,0.6), rgba(10,10,10,0.6)), url(${images.heroCars[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto w-full px-6 py-24 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <div className="text-primary text-6xl mb-6">
            <FaCar />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Smart Parking Garage
            <span className="text-primary"> Management System</span>
          </h1>
          <p className="text-gray-300 max-w-xl mb-6">
            Efficiently manage your parking spaces with real-time monitoring,
            automated payments, and smart allocation — tailored for urban India.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary text-lg px-6 py-3"
            style={{ backgroundColor: '#FFD700', color: '#0a0a0a' }}
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 hidden md:block"
        >
          <img
            src={images.heroCars[1]}
            alt="cars"
            className="rounded-lg shadow-xl"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home