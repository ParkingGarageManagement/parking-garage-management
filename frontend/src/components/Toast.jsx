import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Simple toast using Framer Motion
const Toast = ({ show, type = 'info', message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-lg text-sm ${
            type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
