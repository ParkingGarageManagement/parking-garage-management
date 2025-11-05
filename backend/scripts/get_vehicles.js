(async()=>{
  try{
    const base='http://localhost:3001';
    let res = await fetch(base+'/api/users/login',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:'e2e@example.com', password:'Password1!'})
    });
    const body = await res.json(); const token = body.token;
    const vehiclesRes = await fetch(base+'/api/vehicles', { headers: { 'Authorization': 'Bearer ' + token } });
    const vehicles = await vehiclesRes.json();
    console.log('vehicles count', vehicles.length);
    vehicles.forEach(v => console.log({ licensePlate: v.licensePlate, status: v.status, totalFee: v.totalFee, currentFee: v.currentFee, slot: v.slot }));
  }catch(e){ console.error(e) }
})();
