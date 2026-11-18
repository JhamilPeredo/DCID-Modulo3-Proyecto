import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const services = [
  "auth",
  "events",
  "orders",
  "payments",
  "tickets",
  "notifications",
  "checkin",
];
for (const name of services) {
  test(`${name} tiene rutas de salud, configuración y README`, () => {
    const code = fs.readFileSync(
      path.join(root, name, "src/server.js"),
      "utf8",
    );
    assert.match(code, /app\.get\('\/health'/);
    assert.ok(fs.existsSync(path.join(root, name, ".env.example")));
    assert.ok(fs.existsSync(path.join(root, name, "README.md")));
  });
}
test("Orders limita la compra a seis entradas y maneja rechazo", () => {
  const code = fs.readFileSync(path.join(root, "orders/src/server.js"), "utf8");
  assert.match(code, /cantidad>6/);
  assert.match(code, /estado='rechazada'/);
  assert.match(code, /reservations\/\$\{orderId\}\/release/);
});
test("Checkin bloquea códigos usados con restricción única", () => {
  const sql = fs.readFileSync(path.join(root, "checkin/schema.sql"), "utf8");
  assert.match(sql, /code UUID NOT NULL UNIQUE/);
});
test("Vite elimina prefijo /api antes de reenviar", () => {
  const cfg = fs.readFileSync(path.join(root, "web/vite.config.js"), "utf8");
  assert.match(cfg, /replace\(\/\^\\\/api/);
});
