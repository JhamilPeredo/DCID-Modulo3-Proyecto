**La parte de notificaciones todavia ya esta funcionando** 
Solo tienen que instalarse el mailpit

# EntradasYa — Manual para ejecutar el sistema

**Versión de Node.js utilizada:** `v22.16.0` (Node 22).

## 1. Configurar PostgreSQL

Primero, abre **pgAdmin 4**. y crea 6 base de datos en pgAdmin: `auth_db`, `events_db`, `orders_db`, `payments_db`, `tickets_db` y `checkin_db`. Una vez creado las base de datos
 Entra a la base de datos `postgres`, que viene por defecto, haz clic derecho y selecciona **Query Tool**.

Pega y ejecuta lo siguiente:

```sql
CREATE ROLE auth_user LOGIN PASSWORD 'admin123';
CREATE ROLE events_user LOGIN PASSWORD 'admin123';
CREATE ROLE orders_user LOGIN PASSWORD 'admin123';
CREATE ROLE payments_user LOGIN PASSWORD 'admin123';
CREATE ROLE tickets_user LOGIN PASSWORD 'admin123';
CREATE ROLE checkin_user LOGIN PASSWORD 'admin123';

GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
GRANT ALL PRIVILEGES ON DATABASE events_db TO events_user;
GRANT ALL PRIVILEGES ON DATABASE orders_db TO orders_user;
GRANT ALL PRIVILEGES ON DATABASE payments_db TO payments_user;
GRANT ALL PRIVILEGES ON DATABASE tickets_db TO tickets_user;
GRANT ALL PRIVILEGES ON DATABASE checkin_db TO checkin_user;
```

Hacemos esto para que cada microservicio tenga su propio usuario y permisos para conectarse a su base de datos en PostgreSQL.

**Importante:** 
una vez creado las 6 base de datos y creado los usuarios de cada base de datos hay que darles permiso a los usuarios creados

dale clik derecho en el nombre de la base de datos y selecciona **Query Tool**. y pega el siguiente comando uno por cada base de datos 

| Base de datos  | Comando |

| `auth_db`     | GRANT USAGE, CREATE ON SCHEMA public TO auth_user; |

| `events_db`   | GRANT USAGE, CREATE ON SCHEMA public TO events_user; |

| `orders_db`   | GRANT USAGE, CREATE ON SCHEMA public TO orders_user; |

| `payments_db` | GRANT USAGE, CREATE ON SCHEMA public TO payments_user; |

| `tickets_db`  | GRANT USAGE, CREATE ON SCHEMA public TO tickets_user; |

| `checkin_db`  | GRANT USAGE, CREATE ON SCHEMA public TO checkin_user; |



## 2. Configurar los archivos `.env`

Cada microservicio tiene un archivo `.env.example` que sirve de referencia. Dentro de la carpeta de cada microservicio, crea un archivo llamado `.env` y configura sus variables, especialmente `DATABASE_URL`, usando el usuario, contraseña y base de datos correspondientes.

## 3. Iniciar los microservicios y el frontend

Abre **8 terminales** desde la carpeta principal del proyecto, una para cada servicio. Ejecuta los siguientes comandos en orden.

### Terminal 1 — Events
cd events
npm install
npm run db:init
npm start

### Terminal 2 — Auth
cd auth
npm install
npm run db:init
npm start

### Terminal 3 — Payments
cd payments
npm install
npm run db:init
npm start

### Terminal 4 — Orders
cd orders
npm install
npm run db:init
npm start

### Terminal 5 — Tickets
cd tickets
npm install
npm run db:init
npm start

### Terminal 6 — Notifications
cd notifications
npm install
npm start

### Terminal 7 — Checkin
cd checkin
npm install
npm run db:init
npm start

### Terminal 8 — Web
cd web
npm install
npm run dev

**Nota:** `npm install` y `npm run db:init` se utilizan para preparar el sistema. Cuando ya está instalado, normalmente basta con ejecutar `npm start` en cada backend y `npm run dev` en `web`.

## 4. Verificar el estado de los servicios

Abre las siguientes direcciones en el navegador:

- http://localhost:3000/health — Events
Respuesta esperada:
{"status":"ok","service":"events"}

- http://localhost:3001/health — Auth
Respuesta esperada:
{"status":"ok","service":"auth"}

- http://localhost:3002/health — Payments
Respuesta esperada:
{"status":"ok","service":"payments"}

- http://localhost:3003/health — Orders
Respuesta esperada:
{"status":"ok","service":"orders"}

- http://localhost:3004/health — Tickets
Respuesta esperada:
{"status":"ok","service":"tickets"}

- http://localhost:3005/health — Notifications
Respuesta esperada:
{"status":"ok","service":"notifications"}

- http://localhost:3006/health — Checkin
Respuesta esperada:
{"status":"ok","service":"checkin"}

Si todos devuelven `"status":"ok"`, significa que están activos y responden correctamente.

Para abrir la aplicación, entra a **http://localhost:5173/**.

## 5. Probar el sistema por roles

### 5.1. Organizador: crear y publicar un evento

1. Abre http://localhost:5173/.
2. Regístrate o inicia sesión con una cuenta de rol **organizador**.
3. Entra a **Organizador**.
4. En **Crear evento**, completa el nombre, fecha futura, lugar, imagen y descripción.
5. Haz clic en **Guardar borrador**.
6. En **Agregar sector**, selecciona el evento recién creado.
7. Añade uno o varios sectores con nombre, precio en bolivianos y cupo total.
8. Publica el evento desde el panel.
9. Comprueba que aparezca en la **Cartelera**.

**Ejemplo de prueba (ficticio):**

- **Evento:** DevSecOps Day FICCT – UAGRM 2026.
- **Fecha:** 18/12/2026 a las 09:00.
- **Lugar:** Auditorio de la FICCT, UAGRM, Santa Cruz de la Sierra, Bolivia.
- **Sectores:** Estudiantes UAGRM (Bs 20, 200 cupos), Público general (Bs 50, 100 cupos) y Workshop DevSecOps (Bs 100, 40 cupos).

### 5.2. Cliente: comprar entradas

1. Si estás conectado como organizador, pulsa **Salir**.
2. Registra una cuenta nueva con el rol **cliente** e inicia sesión.
3. Entra a **Cartelera** y selecciona un evento publicado.
4. Revisa la información del evento y sus **Sectores disponibles**.
5. En **Comprar entradas**, selecciona un sector y la cantidad de entradas (máximo 6).
6. Verifica el **Total estimado**.
7. En **Método de pago**, selecciona `CARD`.
8. Escribe `1111` en los últimos cuatro dígitos para simular un pago aprobado.
9. Pulsa **Confirmar compra** y revisa el estado de la orden.
10. Si se aprueba, comprueba que disminuyan los cupos y consulta las entradas o el PDF/QR si están disponibles en la interfaz.

**Ejemplo:** dos entradas del sector Estudiantes UAGRM a Bs 20 cada una dan un total de **Bs 40**.

**Para probar un pago rechazado:** repite el proceso, pero escribe `0000` en los últimos cuatro dígitos. El sistema debe indicar el rechazo y no generar entradas válidas.

**Nota:** el panel **Comprar entradas** solo debe mostrarse a los clientes.

### 5.3. Portero: validar una entrada

1. Cierra la sesión del cliente e inicia sesión con una cuenta de rol **portero**.
2. Entra a la opción de validación de entradas.
3. Utiliza el código o QR de una entrada obtenida mediante una compra aprobada.
4. Comprueba que la primera validación sea aceptada.
5. Intenta validar la misma entrada otra vez: el sistema debe impedir que se use dos veces.

## 6. Arquitectura del sistema

| Componente | Función | Puerto local | Base de datos |
|---|---|---|---|
| `web` | Interfaz React/Vite | 5173 | — |
| `events` | Eventos, sectores y cupos | 3000 | `events_db` |
| `auth` | Registro, acceso y roles | 3001 | `auth_db` |
| `payments` | Simulación de pagos | 3002 | `payments_db` |
| `orders` | Creación y coordinación de compras | 3003 | `orders_db` |
| `tickets` | Entradas y generación de PDF/QR | 3004 | `tickets_db` |
| `notifications` | Notificaciones por correo | 3005 | — |
| `checkin` | Validación de entradas | 3006 | `checkin_db` |

