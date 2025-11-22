import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin(){
  const [token,setToken] = useState('');
  const nav = useNavigate();

  function submit(e){
    e.preventDefault();
    if(!token) return alert('Enter admin token');
    localStorage.setItem('ADMIN_TOKEN', token);
    nav('/admin/orders');
  }

  return (
    <div style={{padding:20}}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Admin token" value={token} onChange={e=>setToken(e.target.value)} style={{width:320,padding:8}} />
        <div style={{marginTop:8}}>
          <button className="button" type="submit">Enter Admin</button>
        </div>
      </form>
      <p className="small" style={{color:'#666',marginTop:12}}>Use ADMIN_TOKEN set in Render environment for backend service.</p>
    </div>
  );
}
