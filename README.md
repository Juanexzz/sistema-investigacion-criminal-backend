# Sistema de Investigación Criminal &mdash; Backend API

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Implementación del Backend: **Node.js, Express, TypeScript estricto, Prisma ORM y PostgreSQL**

---

## 1. Cómo Probar la Aplicación

### Opción A: Probar en Producción (Recomendada para Evaluación)
1. **Despertar el servicio en Render**:  
   Abrir en el navegador el endpoint de salud:  
   👉 [https://sistema-investigacion-criminal-backend.onrender.com/api/health](https://sistema-investigacion-criminal-backend.onrender.com/api/health)  
   Esperar entre 30 y 50 segundos hasta que responda:
   ```json
   {
     "status": "ok",
     "service": "Sistema de Investigación Criminal API",
     "timestamp": "2026-11-10T..."
   }
   ```
2. **Acceder a la aplicación web en Vercel**:  
   👉 [https://sistema-investigacion-criminal-fron.vercel.app](https://sistema-investigacion-criminal-fron.vercel.app)
3. **Iniciar sesión con las credenciales de prueba**:
   - **Detective**: `detective@forense.test` | Contraseña: `Detective2026!`
   - **Administrador**: `admin@forense.test` | Contraseña: `Admin2026!`

---

### Opción B: Ejecución en Entorno Local
1. **Levantar primero el backend**:
   ```bash
   cd sistema-investigacion-criminal-backend
   cp .env.example .env
   # Configurar cadenas de conexión de base de datos en .env
   npm ci
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   npm run dev
   ```
   El servidor API iniciará en `http://localhost:4000`.

2. **Levantar el frontend**:
   ```bash
   cd ../sistema-investigacion-criminal-frontend
   cp .env.example .env.local
   # Asegurar que NEXT_PUBLIC_API_HOST=http://localhost:4000
   npm ci
   npm run dev
   ```
   Abrir en el navegador: [http://localhost:3000](http://localhost:3000).

---

## 2. Enlaces del Proyecto

- **API en Producción (Render)**: [https://sistema-investigacion-criminal-backend.onrender.com](https://sistema-investigacion-criminal-backend.onrender.com)
- **Health Check de la API**: [https://sistema-investigacion-criminal-backend.onrender.com/api/health](https://sistema-investigacion-criminal-backend.onrender.com/api/health)
- **Frontend en Producción (Vercel)**: [https://sistema-investigacion-criminal-fron.vercel.app](https://sistema-investigacion-criminal-fron.vercel.app)
- **Repositorio Frontend (GitHub)**: [https://github.com/Juanexzz/sistema-investigacion-criminal-frontend](https://github.com/Juanexzz/sistema-investigacion-criminal-frontend)
- **Monorepo Histórico Original**: [https://github.com/juanfer2006/patria_milagro_web](https://github.com/juanfer2006/patria_milagro_web)

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Responsabilidad | Aportes Principales |
| :--- | :--- | :--- |
| **Juan Esteban Vallejo Hincapié** | **Despliegue, Infraestructura y Casos** | **Despliegue del backend en Render, configuración de variables de entorno y poolers de Supabase, pipeline de build con migraciones automáticas, y módulo de casos (`/api/cases`).** |
| **Juan Fernando Castañeda Agudelo** | **Líder de Proyecto y Arquitectura** | **Fundación del proyecto, arquitectura limpia en 4 capas, autenticación JWT, hashing con bcrypt, middlewares (`auth`, `validate`, `error-handler`, `not-found`) y módulo de usuarios (`/api/users`).** |
| **Camilo Gutiérrez Castañeda** | **Sospechosos y Validación DTO** | **Módulo de personas de interés (`/api/suspects`), cálculo de nivel de sospecha (0-100), reglas de negocio de casos cerrados y pruebas unitarias de casos de uso.** |
| **José Daniel Morales Villegas** | **Evidencias y Almacenamiento** | **Módulo de evidencias (`/api/evidences`), tipificación y relevancia, servicio de almacenamiento en Supabase Storage (`/api/uploads`), subida de imágenes con Multer y catálogo de pruebas HTTP.** |

---

## 4. Arquitectura Limpia en 4 Capas

El backend implementa los principios de Arquitectura Limpia (*Clean Architecture*) y diseño guiado por el dominio (*DDD*), manteniendo la lógica de negocio desacoplada de la base de datos y de los frameworks HTTP:

```
src/
├── domain/                  # Capa 1: Dominio (Entidades y Reglas de Negocio Puras)
│   ├── errors/              # Errores tipados de dominio (ConflictError, NotFoundError, etc.)
│   ├── models/              # Modelos de dominio puros (User, Case, Suspect, Evidence)
│   ├── repositories/        # Interfaces abstractas de repositorios (ICaseRepository, etc.)
│   └── services/            # Interfaces de servicios de dominio (IPasswordHasher, ITokenService)
├── application/             # Capa 2: Aplicación (Casos de Uso del Sistema)
│   └── use-cases/           # Orquestación de casos de uso (auth, cases, suspects, evidences, users, uploads)
├── infrastructure/          # Capa 3: Infraestructura (Implementación Técnica)
│   ├── dtos/                # Validación de esquemas con Zod para entradas y filtros
│   ├── repository/          # Implementaciones con Prisma ORM (PrismaCaseRepository, etc.)
│   └── services/            # Servicios concretos (JwtTokenService, BcryptPasswordHasher, SupabaseStorageService)
└── interface/               # Capa 4: Interfaces (Adaptadores de Entrada HTTP)
    ├── controllers/         # Controladores de Express para transformar DTOs y llamar casos de uso
    ├── middlewares/         # Middlewares (auth, validate, error-handler, not-found, upload)
    └── routers/             # Enrutadores modulares de Express agrupados bajo /api
```

---

## 5. Credenciales de Prueba Oficiales (Seed)

El script de seed genera cuentas de prueba idempotentes para la evaluación del sistema:

| Rol | Correo Electrónico | Contraseña | Permisos y Alcance |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` | Acceso a todos los casos, sospechosos, evidencias y al módulo administrativo de usuarios (`/api/users`). |
| **USER** | `detective@forense.test` | `Detective2026!` | Acceso exclusivo a los casos propios y a las evidencias/sospechosos vinculados a ellos. |

---

## 6. Variables de Entorno Locales (`.env.example`)

Configuración para el archivo `.env` en entorno de desarrollo local:

```env
# Entorno y Puerto
NODE_ENV=development
PORT=4000

# Conexión PostgreSQL (Supabase con Transaction Pooler en puerto 6543)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexión Directa / Session Pooler (Mismo host del pooler en puerto 5432 - NO db.<ref>.supabase.co)
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Autenticación JWT (Mínimo 32 caracteres obligatorios en producción)
JWT_SECRET="clave_secreta_jwt_de_alta_entropia_minimo_32_caracteres"
JWT_EXPIRES_IN=1d

# CORS (Origen local del frontend en desarrollo)
CORS_ORIGIN=http://localhost:3000

# Almacenamiento de Imágenes (Supabase Storage)
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="tu_supabase_service_role_key"
SUPABASE_BUCKET=case-images
```

---

## 7. Catálogo de Endpoints de la API

La API expone los siguientes endpoints REST. Ejemplos listos para ejecutar se encuentran en [`docs/api-examples.http`](docs/api-examples.http).

### A. Autenticación (`/api/auth`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registro de usuario. Valida nombre (2 a 80 caracteres), correo válido y contraseña entre 8 y 72 caracteres con al menos una letra y un número. Rol por defecto: `USER`. |
| `POST` | `/api/auth/login` | Público | Autenticación con correo y contraseña. Retorna token JWT (expira en 1 día) y datos del usuario. |
| `GET` | `/api/auth/me` | Autenticado | Retorna los datos y rol del usuario autenticado. |

### B. Gestión de Usuarios (`/api/users`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin | Listado paginado de usuarios con filtros por rol, estado y búsqueda textual (`q`). Requiere rol `ADMIN`. |
| `DELETE` | `/api/users/:id` | Admin | Desactivación lógica de un usuario (`state: INACTIVE`). Requiere rol `ADMIN`. Prohíbe desactivar la propia cuenta en uso. Responde HTTP 204. |

### C. Expedientes Criminales (`/api/cases`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cases` | Autenticado | Listado paginado con filtros (`q`, `status`, `from`, `to`, `ownerId`). Detective ve sus casos; Admin ve todos. |
| `POST` | `/api/cases` | Autenticado | Creación de expediente con numeración correlativa (`CR-0001`). Valida título (3-120), descripción ($\ge 10$ caracteres), lugar (3-120) y fecha no futura. |
| `GET` | `/api/cases/:id` | Autenticado | Consulta detallada del expediente por UUID. |
| `PUT` | `/api/cases/:id` | Autenticado | Actualización de datos del caso (título, descripción, lugar, fecha, estado `OPEN` / `IN_PROGRESS` / `CLOSED`, imagen). |
| `DELETE` | `/api/cases/:id` | Autenticado | Desactivación lógica (`state: INACTIVE`) del expediente. Responde HTTP 204. |

### D. Personas de Interés y Sospechosos (`/api/suspects`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/suspects` | Autenticado | Listado paginado con filtros (`caseId`, `status`, `q`). |
| `POST` | `/api/suspects` | Autenticado | Registro y vinculación de persona de interés a un caso. Valida que el caso no esté cerrado (HTTP 409 Conflict si está `CLOSED`). |
| `GET` | `/api/suspects/:id` | Autenticado | Consulta detallada de un sospechoso por UUID. |
| `PUT` | `/api/suspects/:id` | Autenticado | Modificación de sospechoso (nombre, alias, nivel de sospecha 0-100, estado y foto). |
| `DELETE` | `/api/suspects/:id` | Autenticado | Desactivación lógica del sospechoso y desvinculación de evidencias asociadas. Responde HTTP 204. |

### E. Evidencias Materiales (`/api/evidences`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/evidences` | Autenticado | Listado paginado con filtros (`caseId`, `suspectId`, `type`, `q`). |
| `POST` | `/api/evidences` | Autenticado | Registro de evidencia. Valida que el caso no esté cerrado (HTTP 409), que el sospechoso pertenezca al caso (HTTP 400), relevancia (1 a 5) y fecha no futura. |
| `GET` | `/api/evidences/:id` | Autenticado | Detalle de una evidencia por UUID. |
| `PUT` | `/api/evidences/:id` | Autenticado | Modificación de evidencia (`caseId` inmutable; permitido en casos cerrados para complementar información pericial). |
| `DELETE` | `/api/evidences/:id` | Autenticado | Desactivación lógica (`state: INACTIVE`) de la evidencia. Responde HTTP 204. |

### F. Almacenamiento de Archivos y Salud (`/api/uploads` y `/api/health`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/uploads` | Autenticado | Carga de archivos binarios (JPEG, PNG, WEBP, máx 5 MB) al bucket `case-images` en Supabase Storage. Retorna URL pública. |
| `GET` | `/api/health` | Público | Verificación de disponibilidad de la API y timestamp (`status: "ok"`). |

---

## 8. Suite de Pruebas Automatizadas

El backend cuenta con una batería de pruebas unitarias y de integración construida con **Vitest**:
- **119 pruebas automatizadas** distribuidas en 14 suites de prueba.
- Cobertura sobre:
  - Casos de uso de autenticación, usuarios, casos, sospechosos, evidencias y subida de archivos.
  - Validación de esquemas DTO con Zod (rechazo de límites inválidos, fechas futuras y tipos no permitidos).
  - Políticas de acceso de casos (aislamiento de datos entre detectives y privilegios de administrador).
  - Middlewares de autenticación JWT, control de roles (`requireRole`), subida con Multer, manejo de errores JSON de body-parser (`entity.parse.failed`, `entity.too.large`) y rutas desconocidas (404 JSON).
  - Validación de variables de entorno y longitud de `JWT_SECRET` ($\ge 32$ caracteres en producción).

Para ejecutar las pruebas:
```bash
npm test
```

Para verificar tipos en las pruebas:
```bash
npm run typecheck:tests
```

---

## 9. Instalación y Ejecución Local

1. Ubicarse en la raíz del repositorio backend:
   ```bash
   cd sistema-investigacion-criminal-backend
   ```
2. Instalar dependencias exactas:
   ```bash
   npm ci
   ```
3. Generar el cliente de Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Ejecutar migraciones y poblar la base de datos con el seed:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
5. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## 10. Despertar el Servicio de Render antes de la Sustentación

Render suspende los servicios web inactivos tras 15 minutos en planes gratuitos. Para activarlo antes de una presentación o prueba:
1. Abrir en el navegador: [https://sistema-investigacion-criminal-backend.onrender.com/api/health](https://sistema-investigacion-criminal-backend.onrender.com/api/health)
2. Esperar entre 30 y 50 segundos hasta recibir respuesta:
   ```json
   {
     "status": "ok",
     "service": "Sistema de Investigación Criminal API",
     "timestamp": "2026-11-10T..."
   }
   ```
3. Una vez responda HTTP 200, la API permanecerá activa para la navegación y pruebas del frontend.

---

## 11. Arquitectura de Despliegue en Producción

### 11.1. Topología de Servicios
- **Capa de Cómputo (Render Web Service)**: Servicio web contenerizado en Node.js con despliegue continuo vinculado a la rama `main` de GitHub.
- **Capa de Persistencia Relacional (Supabase PostgreSQL)**: Base de datos PostgreSQL en la nube con doble esquema de conexión:
  - **Transaction Pooler (Puerto 6543 con PgBouncer)**: Asignado a `DATABASE_URL` para transacciones de la API.
  - **Session Pooler (Puerto 5432)**: Asignado a `DIRECT_URL` para migraciones de Prisma y scripts de seed.
- **Capa de Almacenamiento de Archivos (Supabase Storage)**: Bucket `case-images` configurado con políticas de lectura pública y subida autenticada.

### 11.2. Pipeline de Construcción y Arranque en Render
- **Build Command**:
  ```bash
  npm ci --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
  ```
- **Start Command**:
  ```bash
  node dist/server.js
  ```
  *(o `npm start`)*
- **Health Check Path**: `/api/health`

### 11.3. Matriz de Variables de Entorno en Producción
| Variable | Valor / Propósito |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | Asignado automáticamente por Render (`10000` o puerto del host). |
| `DATABASE_URL` | Cadena al Transaction Pooler (puerto 6543 con `?pgbouncer=true`). |
| `DIRECT_URL` | Cadena al Session Pooler (puerto 5432 en el mismo host del pooler). |
| `JWT_SECRET` | Clave criptográfica segura con al menos 32 caracteres. |
| `JWT_EXPIRES_IN` | `1d` |
| `CORS_ORIGIN` | `https://sistema-investigacion-criminal-fron.vercel.app` (sin barra final). |
| `SUPABASE_URL` | `https://[PROJECT_REF].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase para subida autenticada de imágenes. |
| `SUPABASE_BUCKET` | `case-images` |
