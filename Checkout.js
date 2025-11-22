import React, { useState } from 'react';
import { createOrder } from '../api';

export default function Checkout({cart,clearCart}){
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [addr,setAddr]=useState('');
  const [loading,setLoading]=useState(false);

  async function placeOrder(){
    if(!phone || cart.length===0) return alert('Enter phone and add items');
    setLoading(true);
    const payload = { name, phone, items: cart.map(c=>({menu_id:c.menu_id,qty:c.qty})), delivery_addr: addr, note: '' };
    try{
      const res = await createOrder(payload);
      setLoading(false);
      if(res && res.orderId){
        const waText = encodeURIComponent('CONFIRM ' + res.orderId);
        window.location.href = `https://wa.me/${phone}?text=${waText}`;
        clearCart();
      } else {
        alert('Order failed');
      }
    }catch(e){ setLoading(false); alert('Network error') }
  }

  return (
    <div style={{marginTop:12}}>
      <h3>Checkout</h3>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Phone (e.g. 919876543210)" value={phone} onChange={e=>setPhone(e.target.value)} />
      <input placeholder="Delivery address" value={addr} onChange={e=>setAddr(e.target.value)} />
      <button className="button" onClick={placeOrder} disabled={loading}>{loading? 'Placing...' : 'Place Order'}</button>
    </div>
  )
}
