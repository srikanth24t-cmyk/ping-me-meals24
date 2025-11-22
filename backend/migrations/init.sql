CREATE TABLE IF NOT EXISTS menu (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(8,2) NOT NULL,
  category text,
  is_active boolean default true
);

CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  customer_name text,
  phone text,
  delivery_address text,
  note text,
  status text,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id serial PRIMARY KEY,
  order_id integer REFERENCES orders(id) ON DELETE CASCADE,
  menu_id integer REFERENCES menu(id),
  qty integer default 1
);

INSERT INTO menu (name, description, price, category) VALUES
('Veg Thali','Homestyle veg thali with rice, sambar, curry',120.00,'Thali'),
('Chicken Biryani','Hyderabadi style chicken biryani',220.00,'Biryani'),
('Chapati Box','2 chapatis + curry',80.00,'Tiffin')
ON CONFLICT DO NOTHING;
