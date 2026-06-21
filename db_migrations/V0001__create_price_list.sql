CREATE TABLE IF NOT EXISTS price_list (
  key   VARCHAR(64)  PRIMARY KEY,
  value NUMERIC(12,4) NOT NULL
);

INSERT INTO price_list (key, value) VALUES
  ('proflist_m2',        650),
  ('shtaket_m',          120),
  ('post_60x60',         900),
  ('lag_m',              160),
  ('gate_mech_price',  45000),
  ('gate_auto_price',  65000),
  ('wicket_price',     12000),
  ('work_install_fence_m', 500),
  ('work_install_gate',   8000),
  ('work_install_wicket', 3000),
  ('margin_coeff',       1.5)
ON CONFLICT (key) DO NOTHING;
