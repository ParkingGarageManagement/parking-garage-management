import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      info: 'support@parksmart.co.in',
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      info: '+91 98765 43210',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      info: 'Block A, Connaught Place, New Delhi, 110001',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card text-center"
          >
            <div className="text-primary text-3xl mb-4">{item.icon}</div>
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.info}</p>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Message Subject"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="input-field min-h-[150px]"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

export default Contact