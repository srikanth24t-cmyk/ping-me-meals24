import React from 'react';
export default function Menu({menu=[],addToCart}){
  if(!menu || menu.length===0) return <div>No menu available</div>;
  return (
    <div>
      <h3>Menu</h3>
      {menu.map(item=>(
        <div className="menu-item" key={item.id}>
          <div className="meta">
            <div><strong>{item.name}</strong></div>
            <div className="small" style={{color:'#666'}}>{item.description}</div>
            <div className="price">₹{item.price}</div>
          </div>
          <div>
            <button className="button" onClick={()=>addToCart(item)}>Add</button>
          </div>
        </div>
      ))}
    </div>
  )
}
