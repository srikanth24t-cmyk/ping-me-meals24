import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/menu')
      .then(r => r.json())
      .then(setMenu)
      .catch(err => console.error(err));
  }, []);

  function addToCart(item) {
    const ex = cart.find(c => c.menu_id === item.id);
    if (ex) setCart(cart.map(c => c.menu_id === item.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { menu_id: item.id, name: item.name, price: item.price, qty: 1 }]);
  }

  function updateQty(menu_id, qty) {
    setCart(cart.map(c => c.menu_id === menu_id ? { ...c, qty } : c));
  }

  function clearCart() { setCart([]); }

  return (
    <div className="app">
      <header>
        <h1>Ping Me Meals</h1>
      </header>
      <main>
        <div className="left">
          <Menu menu={menu} addToCart={addToCart} />
        </div>
        <div className="right">
          <Cart cart={cart} updateQty={updateQty} />
          <Checkout cart={cart} clearCart={clearCart} />
        </div>
      </main>
    </div>
  );
}

export default App;
