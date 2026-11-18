-- Ejecutar con psql -U postgres -f sql/create-roles-and-databases.sql
-- DEMOSTRACIÓN LOCAL: cambie las contraseñas antes de usar en red.
CREATE ROLE entradas_auth LOGIN PASSWORD 'CAMBIAR_auth_LOCAL';

CREATE DATABASE auth_db OWNER entradas_auth;

CREATE ROLE entradas_events LOGIN PASSWORD 'CAMBIAR_events_LOCAL';

CREATE DATABASE events_db OWNER entradas_events;

CREATE ROLE entradas_orders LOGIN PASSWORD 'CAMBIAR_orders_LOCAL';

CREATE DATABASE orders_db OWNER entradas_orders;

CREATE ROLE entradas_payments LOGIN PASSWORD 'CAMBIAR_payments_LOCAL';

CREATE DATABASE payments_db OWNER entradas_payments;

CREATE ROLE entradas_tickets LOGIN PASSWORD 'CAMBIAR_tickets_LOCAL';

CREATE DATABASE tickets_db OWNER entradas_tickets;

CREATE ROLE entradas_checkin LOGIN PASSWORD 'CAMBIAR_checkin_LOCAL';

CREATE DATABASE checkin_db OWNER entradas_checkin;