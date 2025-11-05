(async()=>{
  try {
    const base='http://localhost:3001';
    // login
    let res = await fetch(base+'/api/users/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:'e2e@example.com',password:'Password1!'})
    });
    const body = await res.json();
    const token = body.token;
    console.log('token:', token);

    // get parked vehicles
    const vehiclesRes = await fetch(base+'/api/vehicles', { headers: { 'Authorization': 'Bearer ' + token } });
    const vehicles = await vehiclesRes.json();
    console.log('parked count', vehicles.length);
    if (vehicles.length === 0) {
      console.log('No parked vehicles to exit');
      return;
    }

    const vid = vehicles[0]._id;
    console.log('Exiting vehicle', vid);
    const exitRes = await fetch(base+`/api/vehicles/${vid}/exit`, { method:'PUT', headers: {'Authorization':'Bearer '+token } });
    const exitJson = await exitRes.json();
    console.log('exit status', exitRes.status, exitJson);

    // fetch history
    const historyRes = await fetch(base+'/api/history');
    const history = await historyRes.json();
    console.log('history count', history.data.length);
    console.log(history.data[0]);
  } catch(e) { console.error(e) }
})();
