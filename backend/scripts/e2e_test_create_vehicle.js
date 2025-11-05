(async()=>{
  try {
    const base='http://localhost:3001';

    // Try login
    let res = await fetch(base+'/api/users/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:'e2e@example.com',password:'Password1!'})
    });

    if (res.status !== 200) {
      console.log('Registering user...');
      res = await fetch(base+'/api/users',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:'E2E Tester', email:'e2e@example.com', password:'Password1!'})
      });
    }

    const body = await res.json();
    const token = body.token;
    console.log('token:', token);

    const slotsRes = await fetch(base+'/api/slots');
    const slotsJson = await slotsRes.json();
    console.log('slots count', slotsJson.length);
    const slotId = slotsJson[0]._id;
    console.log('slotId', slotId);

    const createRes = await fetch(base+'/api/vehicles',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({licensePlate:'E2E1234', vehicleType:'car', slot:slotId})
    });

    const created = await createRes.json();
    console.log('create status', createRes.status, created);

    // fetch parked vehicles
    const vehiclesRes = await fetch(base+'/api/vehicles', { headers: { 'Authorization': 'Bearer ' + token } });
    const vehicles = await vehiclesRes.json();
    console.log('vehicles length', vehicles.length);
    vehicles.forEach(v => console.log({ _id: v._id, licensePlate:v.licensePlate, slot: v.slot }));

  } catch (e) {
    console.error(e);
  }
})();
