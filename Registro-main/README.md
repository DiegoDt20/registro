# Sistema de Gestión de Miembros y Credenciales Digitales

Aplicación web para registrar, administrar y validar miembros de una organización,
con generación automática de credenciales digitales con código QR.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + React Router + React Hook Form + Zod
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** PostgreSQL (vía Prisma ORM)
- **Autenticación:** JWT
- **QR:** `qrcode` · **Credenciales:** `html2canvas` + `jspdf`

## Estructura

```
Registro/
├─ docker-compose.yml     # PostgreSQL dedicado (puerto 5433)
├─ backend/               # API Express + Prisma
└─ frontend/              # SPA React + Vite
```

## Requisitos

- Node.js 20+
- PostgreSQL. Lo más sencillo es usar el contenedor incluido:
  ```bash
  docker compose up -d
  ```
  Esto levanta PostgreSQL en `localhost:5433` con la base `registro_miembros`
  (usuario `registro`, contraseña `registro123`). Si prefieres tu propio Postgres,
  ajusta `DATABASE_URL` en `backend/.env`.

## Puesta en marcha

### 1. Base de datos
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env            # ya viene un .env listo para el contenedor
npm run prisma:migrate          # crea las tablas (npx prisma migrate dev)
npm run db:seed                 # crea el usuario administrador inicial
npm run dev                     # API en http://localhost:8000/api
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env            # VITE_API_URL=http://localhost:8000/api
npm run dev                     # App en http://localhost:5180
```

## Credenciales iniciales

| Correo               | Contraseña | Rol           |
|----------------------|-----------|---------------|
| admin@registro.com   | admin123  | Administrador |

> Cámbialas tras el primer ingreso. Los registradores se crean desde el módulo **Usuarios**.

## Roles

- **Administrador:** ver todo, crear/editar/eliminar miembros, generar credenciales,
  dashboard, validar, administrar usuarios.
- **Registrador:** crear y editar miembros, generar credenciales, buscar y validar.
  No puede eliminar registros ni administrar usuarios.

## API

| Método | Ruta                         | Acceso        |
|--------|------------------------------|---------------|
| POST   | `/api/auth/login`            | Público       |
| GET    | `/api/users`                 | Admin         |
| POST   | `/api/users`                 | Admin         |
| PUT    | `/api/users/:id`             | Admin         |
| DELETE | `/api/users/:id`             | Admin         |
| GET    | `/api/members`               | Autenticado   |
| GET    | `/api/members/:id`           | Autenticado   |
| POST   | `/api/members`               | Autenticado   |
| PUT    | `/api/members/:id`           | Autenticado   |
| DELETE | `/api/members/:id`           | Admin         |
| GET    | `/api/validate/:codigo`      | Autenticado   |
| GET    | `/api/validate/dni/:dni`     | Autenticado   |
| GET    | `/api/dashboard/stats`       | Autenticado   |

## Notas de diseño

- El **código de miembro** se genera automáticamente con formato `MEM-000001`.
- El **DNI** es único; **correo** y **fotografía** son opcionales.
- La **fotografía** se guarda como Data URL (base64) en la base de datos.
- El **QR** de la credencial contiene el código de miembro (p. ej. `MEM-000001`).
- La credencial se exporta en formato vertical 1080×1920 como **PNG** o **PDF**.
```
