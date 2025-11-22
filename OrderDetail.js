import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminHeaders } from '../api';

export default function OrderDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [order,setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');

  async function load(){
    const res = await fetch((process.env.REACT_APP_API_URL || '') + `/admin/orders/${id}`, { headers: adminHeaders() });
    if(res.status === 401) { localStorage.removeItem('ADMIN_TOKEN'); return nav('/admin'); }
    const d = await res.json();
    setOrder(d.order);
    setItems(d.items || []);
    setStatus(d.order.status);
  }

  useEffect(()=>{ load() }, [id]);

  async function updateStatus(newStatus){
    const res = await fetch((process.env.REACT_APP_API_URL || '') + `/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    if(res.ok) { setStatus(newStatus); load(); } else alert('Failed');
  }

  if(!order) return <div style={{padding:20}}>Loading...</div>;

  return (
    <div style={{padding:20}}>
      <h2>Order #{order.id}</h2>
      <div><strong>Phone:</strong> {order.phone}</div>
      <div><strong>Address:</strong> {order.delivery_address}</div>
      <div><strong>Note:</strong> {order.note}</div>
      <div><strong>Status:</strong> {status}</div>

      <h3>Items</h3>
      <ul>{items.map(it => <li key={it.id}>{it.name} — qty {it.qty} — ₹{it.price}</li>)}</ul>

      <div style={{marginTop:12}} className="admin-actions">
        <button className="button" onClick={()=>updateStatus('confirmed')}>Confirm</button>
        <button className="button" onClick={()=>updateStatus('preparing')}>Start Preparing</button>
        <button className="button" onClick={()=>updateStatus('out_for_delivery')}>Out For Delivery</button>
        <button className="button" onClick={()=>updateStatus('delivered')}>Delivered</button>
        <button className="button" onClick={()=>updateStatus('cancelled')}>Cancel</button>
      </div>
    </div>
)
