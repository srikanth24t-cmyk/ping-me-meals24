import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerHome from './customer/CustomerHome';
import AdminLogin from './admin/Login';
import OrdersList from './admin/OrdersList';
import OrderDetail from './admin/OrderDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/orders" element={<OrdersList />} />
        <Route path="/admin/orders/:id" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
