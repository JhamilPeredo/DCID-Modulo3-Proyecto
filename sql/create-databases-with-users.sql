-- Ejecutar con psql -U postgres -f sql/create-databases-with-users.sql
-- Reemplazar las contraseñas DEMO_... antes de utilizar este archivo.
CREATE ROLE auth_user LOGIN PASSWORD 'CAMBIAR_AUTH_PASSWORD';

CREATE DATABASE auth_db OWNER auth_user;

CREATE ROLE events_user LOGIN PASSWORD 'CAMBIAR_EVENTS_PASSWORD';

CREATE DATABASE events_db OWNER events_user;

CREATE ROLE orders_user LOGIN PASSWORD 'CAMBIAR_ORDERS_PASSWORD';

CREATE DATABASE orders_db OWNER orders_user;

CREATE ROLE payments_user LOGIN PASSWORD 'CAMBIAR_PAYMENTS_PASSWORD';

CREATE DATABASE payments_db OWNER payments_user;

CREATE ROLE tickets_user LOGIN PASSWORD 'CAMBIAR_TICKETS_PASSWORD';

CREATE DATABASE tickets_db OWNER tickets_user;

CREATE ROLE checkin_user LOGIN PASSWORD 'CAMBIAR_CHECKIN_PASSWORD';

CREATE DATABASE checkin_db OWNER checkin_user;