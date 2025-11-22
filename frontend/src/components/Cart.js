import React from 'react';

export default function Cart({ cart, updateQty }) {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.length === 0 && <div>Your cart is empty</div>}
      {cart.map(c => (
        <div key={c.menu_id} className="cart-item">
          <div>{c.name} x {c.qty}</div>
          <div>
            <button onClick={() => updateQty(c.menu_id, Math.max(1, c.qty - 1))}>-</button>
            <button onClick={() => updateQty(c.menu_id, c.qty + 1)}>+</button>
          </div>
        </div>
      ))}
      <div className="total">Total: ₹{total}</div>
    </div>
  );
}
