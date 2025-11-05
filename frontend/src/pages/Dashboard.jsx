import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCar, FaParking, FaClock, FaTimes, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'
import { vehicleAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useSlots } from '../hooks/useSlots'
import { useSlotStats } from '../hooks/useSlotStats'

const Dashboard = () => {
  const { user, addVehicle: addVehicleCtx, exitVehicle: exitVehicleCtx } = useAuth()
  const { slots, loading: slotsLoading, error: slotsError, refreshSlots } = useSlots()
  const { stats: slotStats, loading: statsLoading, error: statsError } = useSlotStats()

  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showConfirmExit, setShowConfirmExit] = useState(false)
  const [filters, setFilters] = useState({ status: 'all', search: '' })
  const [availableSlots, setAvailableSlots] = useState([])
  const [newVehicle, setNewVehicle] = useState({ licensePlate: '', vehicleType: 'car', slotId: '' })


  useEffect(() => { 
    fetchVehicles();
  }, [])

  useEffect(() => {
    if (!Array.isArray(slots)) {
      console.error('Slots is not an array:', slots);
      setAvailableSlots([]);
      return;
    }
    
    // Update available slots whenever slots array changes
    const available = slots.filter(slot => !slot.isOccupied)
      .sort((a, b) => a.slotNumber.localeCompare(b.slotNumber));
    setAvailableSlots(available);

    if (slotsError) {
      showMessage(slotsError, true);
    }
  }, [slots, slotsError])

  const showMessage = (message, isError = false) => {
    if (isError) { setError(message); setSuccess('') } else { setSuccess(message); setError('') }
    setTimeout(() => { setError(''); setSuccess('') }, 5000)
  }

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const vehiclesRes = await vehicleAPI.getVehicles();
      const vehiclesData = vehiclesRes.data || vehiclesRes;
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
    } catch (e) {
      console.error('Vehicle fetch error:', e);
      showMessage('Failed to load vehicles', true);
    } finally {
      setLoading(false);
    }
  }

  const handleAddVehicle = async (e) => { 
    e.preventDefault(); 
    setActionLoading(true); 
    try { 
      // Build payload expected by backend: use 'slot' (slot id) not 'slotId'
      const payload = {
        licensePlate: newVehicle.licensePlate,
        vehicleType: newVehicle.vehicleType,
        slot: newVehicle.slotId,
      };

      const res = await addVehicleCtx(payload); 
      if (res.success) { 
        showMessage('Vehicle added'); 
        setShowAddVehicle(false); 
        setNewVehicle({ licensePlate: '', vehicleType: 'car', slotId: '' }); 
        await Promise.all([fetchVehicles(), refreshSlots()]); 
      } else showMessage(res.error||'Failed', true) 
    } catch (err) { 
      console.error('Add vehicle error:', err);
      showMessage('Failed', true) 
    } finally { 
      setActionLoading(false) 
    } 
  }

  const handleExitVehicle = async () => { 
    if (!selectedVehicle) return; 
    setActionLoading(true); 
    try { 
      const res = await exitVehicleCtx(selectedVehicle._id); 
      if (res.success) { 
        showMessage('Vehicle exited'); 
        setShowConfirmExit(false); 
        setSelectedVehicle(null); 
        await Promise.all([fetchVehicles(), refreshSlots()]); 
      } else showMessage(res.error||'Failed', true) 
    } catch { 
      showMessage('Failed', true) 
    } finally { 
      setActionLoading(false) 
    } 
  }

  const filteredVehicles = vehicles.filter(v => (filters.status==='all'||v.status===filters.status) && (!filters.search||v.licensePlate.toLowerCase().includes(filters.search.toLowerCase())))
  const calculateDuration = (entry, exit) => { const s = new Date(entry); const e = exit?new Date(exit):new Date(); const h = Math.ceil((e-s)/(1000*60*60)); return h===1?'1 hour':`${h} hours` }

  const AnimatedCounter = ({value})=>{ const [c,setC]=useState(0); useEffect(()=>{ let i=0; const end=Number(value)||0; if(end===0){setC(0);return} const dur=800; const step=Math.max(Math.floor(dur/end),20); const t=setInterval(()=>{ i++; setC(i); if(i>=end) clearInterval(t)},step); return ()=>clearInterval(t) },[value]); return <span className="text-2xl font-bold">{c}</span> }
  const StatCard = ({title,value,icon:Icon,color})=> (<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="card bg-gray-800 flex items-center space-x-4"><div className={`p-4 rounded-lg ${color}`}><Icon className="text-2xl"/></div><div><h3 className="text-gray-400">{title}</h3><p className="text-2xl font-bold"><AnimatedCounter value={value} /></p></div></motion.div>)

  if (loading && !vehicles.length) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-gray-400">Welcome back, {user?.name}</p></div>
      <AnimatePresence>{error && <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center"><FaExclamationCircle className="mr-2"/>{error}</motion.div>}{success && <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="bg-green-500/10 text-green-500 p-4 rounded-lg flex items-center"><FaCheckCircle className="mr-2"/>{success}</motion.div>}</AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Slots" value={slotStats.total} icon={FaParking} color="bg-blue-500/20 text-blue-500"/>
          <StatCard title="Occupied Slots" value={slotStats.occupied} icon={FaCar} color="bg-red-500/20 text-red-500"/>
          <StatCard title="Available Slots" value={slotStats.available} icon={FaClock} color="bg-green-500/20 text-green-500"/>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(slotStats.floorStats || {}).map(([floor, stats]) => (
            <motion.div key={floor} initial={{opacity:0}} animate={{opacity:1}} className="card bg-gray-800">
              <h3 className="text-lg font-bold mb-2">Floor {floor}</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">Total</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400">Occupied</p>
                  <p className="text-xl font-bold">{stats.occupied}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400">Available</p>
                  <p className="text-xl font-bold">{stats.available}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div><h2 className="text-xl font-bold">Vehicle Management</h2><p className="text-gray-400 text-sm">Manage parking entries and exits</p></div>
          <div className="flex flex-col md:flex-row gap-4"><div className="flex gap-2"><input type="text" placeholder="Search license plate..." className="input-field" value={filters.search} onChange={(e)=>setFilters({...filters,search:e.target.value})}/><select className="input-field" value={filters.status} onChange={(e)=>setFilters({...filters,status:e.target.value})}><option value="all">All Status</option><option value="parked">Parked</option><option value="exited">Exited</option></select></div><button className="btn btn-primary" onClick={()=>setShowAddVehicle(true)} disabled={actionLoading}>Add Vehicle</button></div>
        </div>

  <div className="overflow-x-auto"><table className="w-full"><thead className="text-left"><tr className="border-b border-gray-700"><th className="py-3">License Plate</th><th className="py-3">Slot</th><th className="py-3">Duration</th><th className="py-3">Status</th><th className="py-3">Fee</th><th className="py-3">Actions</th></tr></thead><tbody>{filteredVehicles.map(vehicle=> (<motion.tr key={vehicle._id} initial={{opacity:0}} animate={{opacity:1}} className="border-b border-gray-700"><td className="py-3">{vehicle.licensePlate}</td><td className="py-3">{vehicle.slot?.slotNumber||'-'}</td><td className="py-3">{calculateDuration(vehicle.entryTime,vehicle.exitTime)}</td><td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${vehicle.status==='parked'?'bg-green-500/20 text-green-500':'bg-gray-500/20 text-gray-500'}`}>{vehicle.status}</span></td><td className="py-3">₹{((vehicle.currentFee ?? vehicle.totalFee) || 0).toFixed(2)}</td><td className="py-3">{vehicle.status==='parked'&& (<button className="btn btn-outline text-sm" onClick={()=>{setSelectedVehicle(vehicle); setShowConfirmExit(true);}} disabled={actionLoading}>Exit Vehicle</button>)}</td></motion.tr>))}{filteredVehicles.length===0&&(<tr><td colSpan="6" className="py-8 text-center text-gray-400">No vehicles found</td></tr>)}</tbody></table></div>
      </div>

      <AnimatePresence>{showAddVehicle && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}} className="bg-gray-800 rounded-lg p-6 max-w-lg w-full"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Add New Vehicle</h3><button onClick={()=>setShowAddVehicle(false)} className="text-gray-400 hover:text-white"><FaTimes/></button></div><form onSubmit={handleAddVehicle} className="space-y-4"><div><label className="block text-gray-400 mb-2">License Plate</label><input type="text" value={newVehicle.licensePlate} onChange={(e)=>setNewVehicle({...newVehicle,licensePlate:e.target.value.toUpperCase()})} className="input-field" required placeholder="e.g., KA01AB1234"/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">                  <div>
                    <label className="block text-gray-400 mb-2">Vehicle Type</label>
                    <select 
                      value={newVehicle.vehicleType} 
                      onChange={(e) => setNewVehicle({
                        ...newVehicle,
                        vehicleType: e.target.value,
                        slotId: '' // Reset slot when vehicle type changes
                      })} 
                      className="input-field"
                    >
                      <option value="">Select type</option>
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Parking Slot</label>
                    <select 
                      value={newVehicle.slotId} 
                      onChange={(e) => setNewVehicle({...newVehicle, slotId: e.target.value})} 
                      className="input-field" 
                      required
                      disabled={!newVehicle.vehicleType} // Disable if no vehicle type selected
                    >
                      <option value="">Select a slot</option>
                      {availableSlots.map(s => (
                        <option 
                          key={s._id} 
                          value={s._id}
                        >
                          {`Floor ${s.floor} - Slot ${s.slotNumber} (${s.type}) - ₹${s.hourlyRate}/hour`}
                        </option>
                      ))}
                      {availableSlots.length === 0 && (
                        <option value="" disabled>No slots available</option>
                      )}
                    </select>
                    {newVehicle.vehicleType && !newVehicle.slotId && (
                      <p className="text-xs text-gray-400 mt-1">
                        {availableSlots.length === 0 
                          ? 'No slots available at the moment'
                          : `${availableSlots.length} slots available`
                        }
                      </p>
                    )}
                  </div></div><div className="flex space-x-4"><button type="submit" className="btn btn-primary" disabled={actionLoading}>{actionLoading?(<div className="w-6 h-6 border-t-2 border-b-2 border-current rounded-full animate-spin"/>):'Add Vehicle'}</button><button type="button" className="btn btn-outline" onClick={()=>setShowAddVehicle(false)} disabled={actionLoading}>Cancel</button></div></form></motion.div></motion.div>)}</AnimatePresence>

      <AnimatePresence>{showConfirmExit&&selectedVehicle && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"><motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-gray-800 rounded-lg p-6 max-w-md w-full"><h3 className="text-xl font-bold mb-4">Confirm Vehicle Exit</h3><p className="text-gray-400 mb-4">Are you sure you want to exit vehicle {selectedVehicle.licensePlate}? This action cannot be undone.</p><div className="flex space-x-4"><button className="btn btn-primary" onClick={handleExitVehicle} disabled={actionLoading}>{actionLoading?(<div className="w-6 h-6 border-t-2 border-b-2 border-current rounded-full animate-spin"/>):'Confirm Exit'}</button><button className="btn btn-outline" onClick={()=>{setShowConfirmExit(false); setSelectedVehicle(null);}} disabled={actionLoading}>Cancel</button></div></motion.div></motion.div>)}</AnimatePresence>
    </motion.div>
  )
}

export default Dashboard
