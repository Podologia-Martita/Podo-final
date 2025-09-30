-- Crear extensión UUID
create extension if not exists "pgcrypto";

-- Profesionales
insert into professionals (id,name,email) values
('11111111-1111-1111-1111-111111111111','Marta Santibáñez','marta@podologiamartita.cl'),
('22222222-2222-2222-2222-222222222222','Patricio Miranda','patricio@podologiamartita.cl'),
('33333333-3333-3333-3333-333333333333','Marcelo Miranda','marcelo@podologiamartita.cl'),
('44444444-4444-4444-4444-444444444444','Carla Lepin','carla@podologiamartita.cl');

-- Servicios
insert into services (id,professional_id,name,price,duration_minutes) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','Podología',18000,45),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','11111111-1111-1111-1111-111111111111','Reflexología',18000,45),
('cccccccc-cccc-cccc-cccc-cccccccccccc','22222222-2222-2222-2222-222222222222','Podología',18000,45),
('dddddddd-dddd-dddd-dddd-dddddddddddd','33333333-3333-3333-3333-333333333333','Podología',18000,45),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','44444444-4444-4444-4444-444444444444','Podología',18000,45);

