-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'REGISTRADOR');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'REGISTRADOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "miembros" (
    "id" TEXT NOT NULL,
    "codigo_miembro" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "estado_civil" "EstadoCivil" NOT NULL,
    "profesion" TEXT NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "celular" TEXT NOT NULL,
    "correo" TEXT,
    "direccion" TEXT NOT NULL,
    "foto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "miembros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "miembros_codigo_miembro_key" ON "miembros"("codigo_miembro");

-- CreateIndex
CREATE UNIQUE INDEX "miembros_dni_key" ON "miembros"("dni");
