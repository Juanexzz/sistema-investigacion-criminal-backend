# Sistema de Investigación Criminal &mdash; API Backend

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Estilo Visual y Temático: **Expediente Forense Noir**

---

## 1. Descripción del Proyecto

API REST construida con **Node.js 20, Express, TypeScript estricto, Prisma ORM y PostgreSQL**. Proporciona el núcleo de dominio, persistencia relacional, seguridad mediante tokens JWT propios de alta entropía, administración de identidades, almacenamiento pericial en Supabase Storage y la gestión de investigaciones criminales estructurada en tres recursos principales:
- **Casos criminales**: Apertura formal (`CR-0001`), cronología pericial, lugar de los hechos, fotografía de la escena y estados procesales (`OPEN`, `IN_PROGRESS`, `CLOSED`).
- **Sospechosos / Personas de interés**: Fichas delictivas, nivel de sospecha (0 a 100), alias y fotografías periciales.
- **Evidencias materiales y peritaje**: Clasificación tipificada (`PHYSICAL`, `DIGITAL`, `DOCUMENT`, `TESTIMONY`, `FORENSIC`), escala de relevancia probatoria (1 a 5), registro fotográfico en almacenamiento binario (Supabase Storage) y vinculación a personas de interés del caso.

---

## 2. Enlaces de Despliegue y Repositorios

- **Backend en Producción (Render)**: `https://sistema-investigacion-criminal-backend.onrender.com`
- **Ruta de Verificación de Salud (Health Check)**: `https://sistema-investigacion-criminal-backend.onrender.com/api/health`
- **Frontend en Producción (Vercel)**: `https://sistema-investigacion-criminal-fron.vercel.app`
- **Repositorio Hermano (Frontend)**: [sistema-investigacion-criminal-frontend](https://github.com/Juanexzz/sistema-investigacion-criminal-frontend)
- **Monorepo Original Central**: [patria_milagro_web](https://github.com/juanfer2006/patria_milagro_web)

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Responsabilidad | Responsabilidades Principales |
| :--- | :--- | :--- |
| **Juan Fernando Castañeda Agudelo** | **Líder de Proyecto / Arquitectura Backend** | **Fundación y arquitectura en 4 capas, autenticación JWT, usuarios admin, migraciones Prisma, seed oficial y políticas de acceso.** |
| **Juan Esteban Vallejo Hincapié** | **Infraestructura, Casos & Uploads** | **Módulo de Casos (`/api/cases`), subida de archivos binarios a Supabase Storage (`/api/uploads`), detalle de expediente e integración de imágenes, y despliegue de infraestructura en producción (Render, Supabase y Vercel).** |
| **Camilo Gutiérrez Castañeda** | **Sospechosos & Retroalimentación** | **Módulo de Sospechosos (`/api/suspects`), componentes de retroalimentación modal/confirmación y estados de interfaz.** |
| **José Daniel Morales Villegas** | **Evidencias & Sistema de Diseño** | **Módulo de Evidencias de punta a punta (`/api/evidences`), Landing Page pericial, sistema de diseño noir, variables CSS, componentes UI base, Navbar y Footer.** |

---

## 4. Arquitectura de Software en 4 Capas

El backend implementa una arquitectura limpia por capas desacopladas, garantizando separación de responsabilidades y facilidad de pruebas:

```
src/
├── domain/                  # Capa 1: Dominio (Núcleo Puro)
│   ├── models/              # Modelos y entidades de negocio (User, Case, Suspect, Evidence)
│   ├── repository/          # Interfaces de repositorios (ICaseRepository, ISuspectRepository, etc.)
│   └── services/            # Interfaces de servicios de dominio (ITokenService, IPasswordHasher)
├── application/             # Capa 2: Aplicación (Casos de Uso)
│   ├── errors/              # Jerarquía de errores estandarizados (AppError, ValidationError, etc.)
│   └── use-cases/           # Casos de uso atómicos (auth, cases, suspects, evidences, users, uploads)
├── infrastructure/          # Capa 3: Infraestructura (Implementación Técnica)
│   ├── dtos/                # Validación de esquemas con Zod para entradas y filtros
│   ├── repository/          # Implementaciones con Prisma ORM (PrismaCaseRepository, etc.)
│   └── services/            # Servicios concretos (JwtTokenService, BcryptPasswordHasher, SupabaseUpload)
└── interface/               # Capa 4: Interfaces (Adaptadores de Entrada HTTP)
    ├── controllers/         # Controladores de Express para orquestar casos de uso
    ├── middlewares/         # Middlewares (auth, validate, error-handler, not-found, upload)
    └── routers/             # Enrutadores modulares de Express agrupados bajo /api
```

---

## 5. Credenciales de Prueba Oficiales (Seed)

El seed genera cuentas idempotentes bajo el dominio reservado `.test` para pruebas académicas y sustentación final:

| Rol | Correo Electrónico | Contraseña | Permisos y Alcance |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` | Comisario: acceso total a todos los casos, sospechosos, evidencias y panel de usuarios `/admin`. |
| **USER** | `detective@forense.test` | `Detective2026!` | Detective: acceso exclusivo a sus propios casos y a las evidencias/sospechosos vinculados a ellos. |

---

## 6. Variables de Entorno (`.env.example`)

Configurar en el archivo `.env` local (este archivo **NUNCA** se incluye en el control de versiones):

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

# CORS (Origen exacto del Frontend cliente, sin barra final)
CORS_ORIGIN=https://sistema-investigacion-criminal-fron.vercel.app

# Almacenamiento de Imágenes (Supabase Storage)
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="tu_supabase_service_role_key"
SUPABASE_BUCKET=case-images
```

---

## 7. Catálogo Completo de Endpoints de la API

Todas las rutas privadas exigen la cabecera `Authorization: Bearer <token>`.  
Para consultar ejemplos interactivos de solicitudes y respuestas HTTP, revisar el archivo [`docs/api-examples.http`](docs/api-examples.http).

### A. Autenticación y Perfil (`/api/auth`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registro de nuevos usuarios (rol `USER` por defecto). Valida contraseña segura. |
| `POST` | `/api/auth/login` | Público | Autenticación de credenciales y generación del token JWT. |
| `GET` | `/api/auth/me` | Autenticado | Retorna los datos y rol del usuario actualmente autenticado. |

### B. Gestión de Usuarios (`/api/users`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin | Listado paginado de usuarios con filtros por rol, estado y búsqueda textual (`q`). |
| `GET` | `/api/users/:id` | Admin | Consulta detallada de la ficha de un usuario por su UUID. |
| `PATCH` | `/api/users/:id/deactivate` | Admin | Desactivación lógica de un usuario. Prohíbe desactivar la propia cuenta en uso. |

### C. Expedientes Criminales (`/api/cases`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cases` | Autenticado | Listado paginado con filtros (`q`, `status`, `from`, `to`, `ownerId`). Detective solo ve sus propios casos; Admin ve todos. |
| `POST` | `/api/cases` | Autenticado | Apertura formal de expediente (`CR-0001`). Valida título, descripción (>= 10 chars), lugar y fecha no futura. |
| `GET` | `/api/cases/:id` | Autenticado | Consulta detallada del expediente por UUID. |
| `PUT` | `/api/cases/:id` | Autenticado | Modificación de datos del caso (título, descripción, lugar, fecha, estado procesal, imagen). |
| `DELETE` | `/api/cases/:id` | Autenticado | Desactivación lógica (`state: INACTIVE`) del expediente. Responde HTTP 204. |

### D. Personas de Interés y Sospechosos (`/api/suspects`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/suspects` | Autenticado | Listado paginado con filtros (`caseId`, `status`, `q`). |
| `POST` | `/api/suspects` | Autenticado | Registro y vinculación de persona de interés a un caso. Valida que el caso no esté cerrado (HTTP 409 Conflict). |
| `GET` | `/api/suspects/:id` | Autenticado | Consulta detallada de la ficha pericial de un sospechoso. |
| `PUT` | `/api/suspects/:id` | Autenticado | Modificación de datos del sospechoso (nombre, alias, nivel de sospecha 0-100, estado y foto). |
| `DELETE` | `/api/suspects/:id` | Autenticado | Desactivación lógica del sospechoso y desvinculación automática de sus evidencias asociadas. Responde HTTP 204. |

### E. Evidencias Materiales y Peritaje (`/api/evidences`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/evidences` | Autenticado | Listado paginado con filtros (`caseId`, `suspectId`, `type`, `q`). |
| `POST` | `/api/evidences` | Autenticado | Fijación de indicio probatorio. Valida que el caso no esté cerrado (HTTP 409), que el sospechoso pertenezca al caso (HTTP 400), relevancia (1 a 5) y fecha no futura. |
| `GET` | `/api/evidences/:id` | Autenticado | Detalle pericial de una evidencia por UUID. |
| `PUT` | `/api/evidences/:id` | Autenticado | Modificación probatoria (el `caseId` permanece inmutable). Permitido en casos cerrados para complementar peritajes. |
| `DELETE` | `/api/evidences/:id` | Autenticado | Desactivación lógica (`state: INACTIVE`) de la evidencia. Responde HTTP 204. |

### F. Almacenamiento Pericial y Salud (`/api/uploads` y `/api/health`)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/uploads` | Autenticado | Carga de archivos binarios (JPEG, PNG, WEBP, máx 5 MB) al bucket `case-images` en Supabase Storage. Retorna URL pública. |
| `GET` | `/api/health` | Público | Verificación de disponibilidad de la API y timestamp (`status: "ok"`). |

---

## 8. Suite de Pruebas Automatizadas

El backend cuenta con una completa batería de pruebas unitarias y de integración construida con **Vitest**:
- **119 pruebas automatizadas** distribuidas en 14 suites de prueba.
- Cobertura exhaustiva sobre:
  - Casos de uso de autenticación, usuarios, casos, sospechosos, evidencias y subida de archivos.
  - Validación de esquemas DTO con Zod (rechazo de límites inválidos, fechas futuras y tipos no permitidos).
  - Políticas de acceso de casos (aislamiento de datos entre detectives y privilegios de comisario).
  - Middlewares de autenticación JWT, control de roles (`requireRole`), subida con Multer (`handleMulterError`), manejo de errores JSON de body-parser (`entity.parse.failed`, `entity.too.large`) y rutas desconocidas (404 JSON).
  - Validación de configuración de entorno y longitud de `JWT_SECRET` en producción.

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

1. Ubicarse en la raíz del repositorio backend.
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
6. Ejecutar la suite completa de pruebas:
   ```bash
   npm test
   ```

---

## 10. Guía Paso a Paso de Despliegue en Producción

### A. Configuración en Supabase (Base de Datos & Storage)
1. Crear un proyecto en [Supabase Console](https://supabase.com) en región cercana (`us-east-1`).
2. En **Project Settings > Database**, obtener:
   - **Transaction Pooler (puerto 6543 con `?pgbouncer=true`)** para `DATABASE_URL`.
   - **Session Pooler (puerto 5432 en el mismo host pooler - NO `db.<ref>.supabase.co`)** para `DIRECT_URL`.
3. En **Storage > Buckets**:
   - Crear el bucket `case-images` público.
   - Configurar políticas: lectura pública (`"Public Access"`) y subida autenticada (`"Authenticated Upload"`).
4. En **Project Settings > API**, copiar la URL del proyecto y la llave secreta `service_role`.

### B. Despliegue en Render (Web Service)
1. En [Render Dashboard](https://dashboard.render.com), seleccionar **New > Web Service** desde repositorio público de Git.
2. Repositorio: `https://github.com/Juanexzz/sistema-investigacion-criminal-backend` (rama `main`).
3. Configuración del servicio:
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm ci --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Health Check Path** (en sección *Advanced*): `/api/health`
4. En **Environment Variables**, definir:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Cadena de conexión Transaction pooler puerto 6543 con `?pgbouncer=true`)*
   - `DIRECT_URL`: *(Cadena de conexión Session pooler puerto 5432)*
   - `JWT_SECRET`: *(Cadena secreta segura de alta entropía con al menos 32 caracteres)*
   - `JWT_EXPIRES_IN`: `1d`
   - `CORS_ORIGIN`: `https://sistema-investigacion-criminal-fron.vercel.app` *(Exacto, sin barra final)*
   - `SUPABASE_URL`: `https://[PROJECT_REF].supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Llave service_role secreta de Supabase)*
   - `SUPABASE_BUCKET`: `case-images`

### C. Ejecución del Seed en Producción
Dado que la terminal Shell no está disponible en el plan gratuito de Render, el seed inicial debe ejecutarse de forma local y segura contra la base de datos de producción:

**En Windows PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
npm run prisma:seed
```

**En Linux / macOS (Bash):**
```bash
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true" \
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres" \
npm run prisma:seed
```

### D. Despertar el Servicio de Render antes de la Sustentación
El plan gratuito de Render suspende los servicios inactivos después de 15 minutos. Para activarlo antes de una presentación o prueba:
1. Abrir en el navegador: `https://sistema-investigacion-criminal-backend.onrender.com/api/health`
2. Esperar entre 30 y 50 segundos hasta recibir:
   ```json
   {
     "status": "ok",
     "service": "Sistema de Investigación Criminal API",
     "timestamp": "2026-11-10T..."
   }
   ```
3. Una vez responda HTTP 200, la API permanecerá activa para la sustentación.
