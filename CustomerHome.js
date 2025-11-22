import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import Cart from './Cart';
import Checkout from './Checkout';
import { fetchMenu } from '../api';

export default function CustomerHome(){
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMenu().then(setMenu).catch(()=>setMenu([]));
  }, []);

  function addToCart(item){
    const ex = cart.find(c=>c.menu_id===item.id);
    if(ex) setCart(cart.map(c=>c.menu_id===item.id?{...c,qty:c.qty+1}:c));
    else setCart([...cart,{menu_id:item.id,name:item.name,price:Number(item.price),qty:1}]);
  }
  function updateQty(menu_id,qty){ setCart(cart.map(c=>c.menu_id===menu_id?{...c,qty}:c)); }
  function clearCart(){ setCart([]); }

  return (
    <>
      <header>
        <div className="header-title">Ping Me Meals</div>
        <div><a href="/admin" style={{color:'#fff'}}>Admin</a></div>
      </header>

      <div className="container">
        <div className="grid">
          <div className="left">
            <div className="card">
              <Menu menu={menu} addToCart={addToCart} />
            </div>
          </div>
          <div className="right">
            <div className="card">
              <Cart cart={cart} updateQty={updateQty} />
              <Checkout cart={cart} clearCart={clearCart} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
