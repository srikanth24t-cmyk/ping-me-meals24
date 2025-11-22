export async function createOrder(payload) {
  const res = await fetch(process.env.REACT_APP_API_URL + '/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
