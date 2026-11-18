import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
test("Los 7 servicios backend tienen health check", () => {
  for (const s of [
    "auth",
    "events",
    "orders",
    "payments",
    "tickets",
    "notifications",
    "checkin",
  ])
    assert.match(read(`${s}/src/app.js`), /\/health/);
});
test("Los pagos son idempotentes por orden", () =>
  assert.match(read("payments/schema.sql"), /order_id TEXT NOT NULL UNIQUE/));
test("Tickets evita duplicar un asiento al reintentar", () =>
  assert.match(read("tickets/schema.sql"), /UNIQUE\(order_id,seat_index\)/));
test("Checkin evita usar dos veces un código", () =>
  assert.match(read("checkin/schema.sql"), /code UUID NOT NULL UNIQUE/));
test("Orders respeta máximo seis entradas", () =>
  assert.match(read("orders/schema.sql"), /BETWEEN 1 AND 6/));
test("Events no permite cupos negativos", () =>
  assert.match(
    read("events/schema.sql"),
    /cupos_disponibles INT NOT NULL CHECK\(cupos_disponibles>=0\)/,
  ));
test("El gateway no expone pagos ni notificaciones", () => {
  const config = read("nginx/entradasya.conf");
  assert.doesNotMatch(config, /location \/api\/(payments|notifications)/);
});
