import React from 'react';
export default function Cart({cart=[],updateQty}){
  const total = cart.reduce((s,c)=>s + c.price * c.qty, 0);
  return (
    <div>
      <h3>Cart</h3>
      {cart.length===0 && <div>Your cart is empty</div>}
      {cart.map(c=>(
        <div className="cart-item" key={c.menu_id}>
          <div>{c.name} x {c.qty}</div>
          <div>
            <button onClick={()=>updateQty(c.menu_id, Math.max(1, c.qty - 1))}>-</button>
            <button onClick={()=>updateQty(c.menu_id, c.qty + 1)}>+</button>
          </div>
        </div>
      ))}
      <div style={{marginTop:8,fontWeight:700}}>Total: ₹{total}</div>
    </div>
  )
}
