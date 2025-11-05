import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { historyAPI } from '../services/api'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await historyAPI.getHistory()
        setHistory(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-3">Vehicle</th>
              <th className="py-3">Slot</th>
              <th className="py-3">Duration</th>
              <th className="py-3">Fee</th>
              <th className="py-3">Exit Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="py-8 text-center">Loading...</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center">No history found</td></tr>
            ) : (
              history.map((v) => (
                <tr key={v._id} className="border-b border-gray-700">
                  <td className="py-3">{v.licensePlate}</td>
                  <td className="py-3">{v.slot?.slotNumber || '-'}</td>
                  <td className="py-3">{v.exitTime ? Math.ceil((new Date(v.exitTime) - new Date(v.entryTime)) / (1000*60*60)) + ' hrs' : '-'}</td>
                  <td className="py-3">₹{(v.totalFee || 0).toFixed(2)}</td>
                  <td className="py-3">{v.exitTime ? new Date(v.exitTime).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default History
