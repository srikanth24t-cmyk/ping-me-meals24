import React from 'react';

export default function Menu({ menu, addToCart }) {
  return (
    <div className="menu">
      <h2>Menu</h2>
      {menu.map(item => (
        <div key={item.id} className="menu-item">
          <div>
            <strong>{item.name}</strong>
            <div className="desc">{item.description}</div>
            <div className="price">₹{item.price}</div>
          </div>
          <div>
            <button onClick={() => addToCart(item)}>Add</button>
          </div>
        </div>
      ))}
    </div>
  );
}
