import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminHeaders } from '../api';

export default function OrdersList(){
  const [orders,setOrders] = useState([]);
  const [statusFilter,setStatusFilter] = useState('');
  const nav = useNavigate();

  async function load(){
    const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    const res = await fetch((process.env.REACT_APP_API_URL || '') + `/admin/orders${q}`, { headers: adminHeaders() });
    if(res.status === 401) { localStorage.removeItem('ADMIN_TOKEN'); return nav('/admin'); }
    const d = await res.json();
    setOrders(d);
  }

  useEffect(()=>{ load(); const id=setInterval(load,10000); return ()=>clearInterval(id) }, [statusFilter]);

  return (
    <div style={{padding:20}}>
      <h2>Orders</h2>
      <div style={{marginBottom:12}}>
        <label>Filter status: </label>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value=''>All</option>
          <option value='pending'>pending</option>
          <option value='confirmed'>confirmed</option>
          <option value='preparing'>preparing</option>
          <option value='out_for_delivery'>out_for_delivery</option>
          <option value='delivered'>delivered</option>
          <option value='cancelled'>cancelled</option>
        </select>
        <button onClick={load} style={{marginLeft:8}}>Refresh</button>
      </div>

      <table className="table">
        <thead><tr><th>ID</th><th>Phone</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>
          {orders.map(o=>(
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.phone}</td>
              <td>{o.status}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
              <td><Link to={`/admin/orders/${o.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
