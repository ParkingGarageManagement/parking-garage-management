import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCreditCard, FaClock, FaParking } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Payment = () => {
  const location = useLocation()
  const { makePayment } = useAuth()
  const vehicle = location.state?.vehicle || null

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  // fee calculation (duration-based or random fallback)
  const calculateFee = () => {
    if (vehicle) {
      const hours = Math.ceil((new Date(vehicle.exitTime || Date.now()) - new Date(vehicle.entryTime)) / (1000*60*60))
      if (hours < 1) return 10
      if (hours >=1 && hours <=3) return 20
      return 50
    }
    // fallback random realistic fee 10-50
    return Math.floor(Math.random() * 41) + 10
  }

  const fee = calculateFee()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Call backend to create payment — requires vehicleId when available
    (async () => {
      try {
        const payload = {
          vehicleId: vehicle?._id,
          amount: fee,
          paymentMethod: 'credit_card',
        }
        const res = await makePayment(payload)
        if (res.success) {
          // show success (simple alert for now)
          alert('Payment successful')
        } else {
          alert('Payment failed: ' + res.error)
        }
      } catch (err) {
        console.error(err)
        alert('Payment error')
      }
    })()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Parking Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <FaParking className="text-primary text-xl" />
            <div>
              <p className="text-gray-400">Slot</p>
              <p className="font-bold">A1</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaClock className="text-primary text-xl" />
            <div>
              <p className="text-gray-400">Duration</p>
              <p className="font-bold">2 hours</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaCreditCard className="text-primary text-xl" />
            <div>
              <p className="text-gray-400">Total Fee</p>
              <p className="font-bold">₹{fee.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Card Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="input-field"
              maxLength="19"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="John Doe"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Expiry Date</label>
              <input
                type="text"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="input-field"
                maxLength="5"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                className="input-field"
                maxLength="3"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Pay ₹{fee.toFixed(2)}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default Payment