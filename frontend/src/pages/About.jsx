import { motion } from 'framer-motion'
import { FaParking, FaMapMarkedAlt, FaCreditCard, FaMobile } from 'react-icons/fa'

const About = () => {
  const features = [
    {
      icon: <FaParking />,
      title: 'Smart Parking',
      description: 'Real-time monitoring and intelligent slot allocation system',
    },
    {
      icon: <FaMapMarkedAlt />,
      title: 'Interactive Map',
      description: 'Visual parking space management with live availability updates',
    },
    {
      icon: <FaCreditCard />,
      title: 'Easy Payments',
      description: 'Secure and convenient payment processing system',
    },
    {
      icon: <FaMobile />,
      title: 'Mobile Friendly',
      description: 'Access your parking information on any device',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">About Us</h1>

      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-400 leading-relaxed">
          We are dedicated to revolutionizing parking management through smart
          technology. Our system provides an efficient, user-friendly solution
          for both parking operators and users, making parking hassle-free and
          organized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card flex items-start space-x-4"
          >
            <div className="text-primary text-3xl p-2 bg-primary/10 rounded-lg">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <p className="text-gray-400 leading-relaxed">
          Our team consists of passionate developers, designers, and parking
          industry experts working together to create the best parking
          management solution. We constantly strive to improve and innovate,
          ensuring our system meets the evolving needs of modern parking
          facilities.
        </p>
      </div>
    </motion.div>
  )
}

export default About