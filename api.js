const API = process.env.REACT_APP_API_URL || '';
export async function fetchMenu() { const res = await fetch(API + '/menu'); return res.json(); }
export async function createOrder(p) { const res = await fetch(API + '/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }); return res.json(); }
export function adminHeaders() { const token = localStorage.getItem('ADMIN_TOKEN') || ''; return { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }; }
