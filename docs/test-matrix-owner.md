# Matriz de Pruebas — Flujo Owner (Mobius Fly)

> Cubre: autenticación, registro, reglas de negocio, y CRUD completo de todos los módulos del panel owner.

---

## Convenciones

| Símbolo | Significado |
|---------|------------|
| ✅ | Resultado esperado (happy path) |
| ❌ | Resultado esperado (error / rechazo) |
| 🔒 | Restricción de acceso / guard |
| 📧 | Dispara envío de correo |

---

## 1. Registro y Onboarding

### 1.1 Creación de cuenta

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| R-01 | Registro exitoso con datos válidos | Nombre, apellido, email único, contraseña ≥ 8 chars, teléfono, nacionalidad, rol = OWNER | ✅ Cuenta creada, OTP enviado al email |
| R-02 | Email ya registrado | Email existente | ❌ Error "El correo ya está registrado" |
| R-03 | Contraseña débil | Contraseña < 8 caracteres | ❌ Validación en frontend |
| R-04 | OTP correcto | Código de 6 dígitos válido | ✅ Cuenta verificada, redirige a subida de documento |
| R-05 | OTP incorrecto | Código erróneo | ❌ Error "Código incorrecto" |
| R-06 | OTP expirado | Código fuera de vigencia | ❌ Error de expiración |
| R-07 | Reenviar OTP | Click en "Reenviar código" | 📧 ✅ Nuevo OTP enviado, contador reiniciado |
| R-08 | Subida de documento de identidad | PDF, JPEG o PNG ≤ 10 MB | ✅ Documento subido al bucket `identity-documents`, status = PENDING_REVIEW |
| R-09 | Subida de documento formato inválido | Archivo `.docx` o `.xlsx` | ❌ Error de validación de MIME type |
| R-10 | Subida de documento > 10 MB | Archivo de 15 MB | ❌ Error "Archivo demasiado grande" |
| R-11 | Nombre de flota en onboarding | Texto libre (ej. "AeroVentura MX") | ✅ Guardado vía `PATCH /api/owners/fleet-name` |
| R-12 | Nombre de flota vacío | String vacío | ❌ Error "El nombre de flota es requerido" |

---

### 1.2 Login

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| L-01 | Login exitoso como OWNER | Email + contraseña válidos | ✅ Redirige a `/owner/dashboard` |
| L-02 | Login como PASSENGER | Email de passenger | 🔒 Redirige a `/forbidden` |
| L-03 | Credenciales incorrectas | Email o contraseña erróneos | ❌ Error "Credenciales incorrectas" |
| L-04 | Email no verificado | Cuenta sin verificar OTP | ❌ Error o prompt a verificar |
| L-05 | Recuperar contraseña | Email registrado | 📧 ✅ Email con link de reset enviado |
| L-06 | Recuperar contraseña (email no existe) | Email no registrado | ❌ Error "Correo no encontrado" |
| L-07 | Reset contraseña con link válido | Token vigente + nueva contraseña | ✅ Contraseña actualizada, redirige a login |
| L-08 | Reset contraseña con link expirado | Token vencido | ❌ Error "El link ha expirado" |

---

## 2. Guard de Acceso — Owner Layout

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|------------|---------------------|
| G-01 | Owner ACTIVE accede al panel | `owner.status = "ACTIVE"` | ✅ Acceso completo a todos los módulos |
| G-02 | Owner PENDING_ONBOARDING accede al panel | `owner.status = "PENDING_ONBOARDING"` | 🔒 Muestra pantalla "Tu cuenta está en revisión" — no puede crear aeronaves, tripulación ni vuelos |
| G-03 | Owner SUSPENDED accede al panel | `owner.status = "SUSPENDED"` | 🔒 Pantalla de cuenta en revisión / acceso bloqueado |
| G-04 | Usuario no autenticado intenta acceder a `/owner/*` | Sin sesión | 🔒 Redirige a `/login?next=/owner/dashboard` |
| G-05 | Passenger intenta acceder a `/owner/*` | `role = "PASSENGER"` | 🔒 Redirige a `/forbidden` |
| G-06 | Owner PENDING navega entre rutas del panel | Sin importar la ruta | 🔒 Siempre muestra pantalla de revisión, nunca el contenido |

---

## 3. Módulo: Perfil

### 3.1 Ver perfil

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| P-01 | Cargar perfil con datos completos | Usuario con flota y documentos | ✅ Muestra nombre de flota, datos personales (solo lectura), documentos con status |
| P-02 | Documento con status APPROVED | `document_status = "APPROVED"` | ✅ Badge verde, botón "Reemplazar" activo |
| P-03 | Documento con status PENDING_REVIEW | `document_status = "PENDING_REVIEW"` | ✅ Badge amarillo, botón "Reemplazar" activo |
| P-04 | Documento con status REJECTED | `document_status = "REJECTED"`, `rejected_reason != null` | ✅ Badge rojo, razón de rechazo visible, botón "Reemplazar" activo |

### 3.2 Editar nombre de flota

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| P-05 | Actualizar nombre de flota válido | "AeroVentura MX" | ✅ Toast "Nombre actualizado" |
| P-06 | Actualizar con nombre vacío | "" | ❌ Validación (no envía) |
| P-07 | Nombre con espacios extra | "  Flota Norte  " | ✅ Se guarda trimmed |

### 3.3 Reemplazar documento de identidad

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| P-08 | Reemplazar con archivo válido | PDF, JPEG o PNG ≤ 10 MB | ✅ Sube al bucket, status = PENDING_REVIEW, razón de rechazo borrada, toast de éxito |
| P-09 | Reemplazar con formato inválido | `.docx` | ❌ Toast de error, no sube |
| P-10 | Reemplazar con archivo > 10 MB | 15 MB | ❌ Toast de error, no sube |
| P-11 | Botón "Reemplazar" muestra spinner | Upload en progreso | ✅ Botón deshabilitado con `isLoading` durante el proceso |

---

## 4. Módulo: Aeronaves

### 4.1 Listar aeronaves

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| A-01 | Lista con aeronaves activas | Owner con aeronaves | ✅ Muestra aeronaves, paginación de 5 items |
| A-02 | Lista vacía | Sin aeronaves | ✅ Estado vacío con mensaje |
| A-03 | Filtro por tipo (jet/turboprop/ligero) | Seleccionar filtro | ✅ Lista filtrada correctamente |
| A-04 | Filtro por capacidad (pequeño/mediano/grande) | Seleccionar filtro | ✅ Lista filtrada correctamente |
| A-05 | Filtro por status | Activo / Mantenimiento / Inactivo | ✅ Lista filtrada correctamente |
| A-06 | Limpiar filtros | Click "Limpiar" | ✅ Muestra todas las aeronaves, página reset a 1 |
| A-07 | Aeronave con documentos pendientes | `document_status = "PENDING_REVIEW"` | ✅ Aparece en lista (lista no filtra por documentos) |

### 4.2 Crear aeronave

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| A-08 | Crear con datos válidos | Modelo, matrícula, asientos, al menos 1 foto, 1-3 documentos | ✅ Aeronave creada con status = ACTIVE, documentos con status = PENDING_REVIEW, redirige al detalle |
| A-09 | Modelo vacío | Sin modelo | ❌ Validación en formulario |
| A-10 | Matrícula vacía | Sin matrícula | ❌ Validación en formulario |
| A-11 | Asientos vacíos / no numérico | "abc" | ❌ Validación en formulario |
| A-12 | Sin foto | 0 fotos | ❌ Validación (mínimo 1 foto requerida) |
| A-13 | Subida de foto formato inválido | `.pdf` en fotos | ❌ Error de MIME type |
| A-14 | Subida de documento formato inválido | `.exe` | ❌ Error de MIME type |
| A-15 | Foto > 10 MB | Imagen de 15 MB | ❌ Error "Archivo demasiado grande" |
| A-16 | Estado inicial de documentos | Después de crear | ✅ Todos los documentos = PENDING_REVIEW |
| A-17 | Botón crear muestra spinner | Creación en progreso | ✅ Botón deshabilitado con `isLoading` |

### 4.3 Ver detalle de aeronave

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| A-18 | Ver detalle aeronave propia | ID válido del owner | ✅ Muestra todos los campos, fotos, documentos, vuelos asignados |
| A-19 | Ver detalle aeronave de otro owner | ID de aeronave ajena | ❌ No muestra datos (query falla por FK owner) |

### 4.4 Editar aeronave

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| A-20 | Editar con datos válidos | Modelo actualizado | ✅ Toast "Aeronave actualizada" |
| A-21 | Editar matrícula a una existente | Matrícula duplicada | ❌ Error de constraint DB |
| A-22 | Vaciar campo requerido | Modelo = "" | ❌ Validación en formulario |

### 4.5 Cambiar status de aeronave

| ID | Caso de prueba | Transición | Resultado esperado |
|----|---------------|-----------|---------------------|
| A-23 | Cambiar de ACTIVE a INACTIVE | Click en botón | ✅ Status actualizado, toast de confirmación |
| A-24 | Cambiar de ACTIVE a MAINTENANCE | Click en botón | ✅ Status actualizado, toast de confirmación |
| A-25 | Cambiar de MAINTENANCE a ACTIVE | Click en botón | ✅ Status actualizado |
| A-26 | Botón de cambio muestra spinner | Transición en progreso | ✅ Botón deshabilitado con `isLoading` |

### 4.6 Eliminar aeronave

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| A-27 | Eliminar sin vuelos asignados | Aeronave sin vuelos | ✅ `ConfirmDialog` aparece → confirmar → eliminada, toast de éxito |
| A-28 | Eliminar con vuelos asignados | Aeronave con ≥ 1 vuelo | ❌ Toast de error "No se puede eliminar: tiene vuelos asociados" |
| A-29 | Cancelar eliminación en dialog | Click "Cancelar" | ✅ Dialog cierra, aeronave intacta |
| A-30 | Botón confirmar muestra spinner | Eliminación en progreso | ✅ `isLoading` activo en botón |

---

## 5. Módulo: Tripulación

### 5.1 Listar tripulantes

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| T-01 | Lista con tripulantes | Owner con crew | ✅ Cards con nombre, rol, status, paginación de 4 items |
| T-02 | Lista vacía | Sin tripulantes | ✅ Mensaje "No se encontraron miembros" |
| T-03 | Filtro por rol (Capitán/Copiloto/TCP) | Seleccionar filtro | ✅ Lista filtrada |
| T-04 | Filtro por status (activo/inactivo/pendiente) | Seleccionar filtro | ✅ Lista filtrada |
| T-05 | Limpiar filtros | Click "Limpiar" | ✅ Lista completa, página reset a 1 |
| T-06 | Tripulante no aprobado | `is_approved = false` | ✅ Aparece en lista (solo se excluye en asignación de vuelos) |

### 5.2 Crear tripulante

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| T-07 | Crear con datos válidos | Nombre, apellido, rol, licencia | ✅ Creado con `status = "ACTIVE"`, `is_approved = false`, toast de éxito |
| T-08 | Nombre vacío | Sin nombre | ❌ Validación en formulario |
| T-09 | Apellido vacío | Sin apellido | ❌ Validación en formulario |
| T-10 | Sin rol seleccionado | Dropdown vacío | ❌ Validación en formulario |
| T-11 | Estado inicial `is_approved` | Después de crear | ✅ `is_approved = false` siempre |
| T-12 | Botón crear muestra spinner | Creación en progreso | ✅ `isLoading` activo |

### 5.3 Ver detalle de tripulante

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| T-13 | Ver detalle tripulante propio | ID válido del owner | ✅ Nombre, rol, licencia, status, vuelos asignados |
| T-14 | Ver detalle tripulante ajeno | ID de crew de otro owner | ❌ No retorna datos |

### 5.4 Editar tripulante

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| T-15 | Editar con datos válidos | Campos actualizados | ✅ Toast "Tripulante actualizado" |
| T-16 | Vaciar nombre | Nombre = "" | ❌ Validación en formulario |
| T-17 | Cambiar de rol | Rol diferente | ✅ Rol actualizado en DB |

### 5.5 Cambiar status de tripulante

| ID | Caso de prueba | Transición | Resultado esperado |
|----|---------------|-----------|---------------------|
| T-18 | ACTIVE → INACTIVE | Click en botón | ✅ Status actualizado, toast |
| T-19 | INACTIVE → ACTIVE | Click en botón | ✅ Status actualizado, toast |
| T-20 | Tripulante inactivo no aparece en vuelos | `status = "INACTIVE"` | ✅ No aparece en dropdown de asignación de vuelo |

### 5.6 Eliminar tripulante

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| T-21 | Eliminar sin vuelos activos | Sin vuelos o solo vuelos completados/cancelados | ✅ `ConfirmDialog` → confirmar → eliminado, toast |
| T-22 | Eliminar con vuelo activo asignado | `flight.status` IN (SCHEDULED, DELAYED, IN_FLIGHT, ON_TIME) | ❌ Toast de error "Tiene vuelos activos asignados" |
| T-23 | Cancelar eliminación | Click "Cancelar" en dialog | ✅ Dialog cierra, tripulante intacto |
| T-24 | Botón confirmar muestra spinner | En progreso | ✅ `isLoading` activo |

---

## 6. Módulo: Vuelos

### 6.1 Precondiciones para crear vuelos

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| V-01 | Owner sin aeronaves | 0 aeronaves activas | 🔒 Banner de advertencia naranja visible, botón "Nuevo vuelo" deshabilitado |
| V-02 | Owner sin Capitán activo y aprobado | 0 capitanes `ACTIVE + is_approved = true` | 🔒 Banner naranja, botón deshabilitado |
| V-03 | Owner con aeronave pero docs pendientes | Aeronave sin documentos APPROVED | 🔒 Aeronave no aparece en dropdown de creación de vuelo |
| V-04 | Owner con tripulación no aprobada | `is_approved = false` | 🔒 Tripulante no aparece en dropdown de asignación |
| V-05 | Condiciones completas | Al menos 1 aeronave activa + 1 capitán `ACTIVE + is_approved = true` | ✅ Botón "Nuevo vuelo" habilitado |

### 6.2 Listar vuelos

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| V-06 | Lista con vuelos | Owner con vuelos | ✅ Tabla con ruta, fecha, aeronave, tipo, status, paginación de 5 |
| V-07 | Lista vacía | Sin vuelos | ✅ Tabla vacía o mensaje |
| V-08 | Filtro por origen/destino | IATA code | ✅ Filtra por ruta correctamente |
| V-09 | Filtro por aeronave | Texto parcial | ✅ Filtra por modelo |
| V-10 | Filtro por tipo | ONE_WAY / ROUND_TRIP | ✅ Filtra correctamente |
| V-11 | Filtro por status | pending_review / scheduled / etc. | ✅ Filtra correctamente |
| V-12 | Filtro por fecha | Formato YYYY-MM-DD | ✅ Filtra por fecha de salida |
| V-13 | Limpiar filtros | Click "Limpiar" | ✅ Lista completa, página reset |

### 6.3 Crear vuelo

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| V-14 | Crear vuelo one-way válido | Todos los campos requeridos, departure ≥ now+24h | ✅ Vuelo creado con `status = PENDING_REVIEW`, redirige a detalle |
| V-15 | Crear vuelo round-trip válido | Incluye returnDepartureDatetime | ✅ Creado con `is_round_trip = true` (o flight_type = "ROUND_TRIP") |
| V-16 | Origen = Destino | Mismo IATA en ambos campos | ❌ Validación "El origen y destino no pueden ser iguales" |
| V-17 | Arrival ≤ Departure | Llegada antes de salida | ❌ Validación "La llegada debe ser después de la salida" |
| V-18 | Departure < ahora + 24 horas | Fecha demasiado próxima | ❌ Validación "El vuelo debe programarse con al menos 24 horas de anticipación" |
| V-19 | Sin capitán asignado | Sin crew de tipo CAPTAIN | ❌ Validación "Se requiere al menos un Capitán" |
| V-20 | Sin aeronave seleccionada | Dropdown vacío | ❌ Validación en formulario |
| V-21 | Aeronave con conflicto de horario | Aeronave ya asignada en ese slot | ❌ Error "La aeronave ya tiene un vuelo en ese horario" (aeronave no aparece en dropdown) |
| V-22 | Tripulante con conflicto de horario | Crew ya asignado en ese slot | ❌ Tripulante no aparece en dropdown disponible |
| V-23 | Aeronave con docs pendientes | Docs en PENDING_REVIEW | ❌ No aparece en dropdown (excluida) |
| V-24 | Status inicial | Después de crear | ✅ `status = PENDING_REVIEW` siempre |
| V-25 | Asientos disponibles iniciales | Después de crear | ✅ `available_seats = total_seats` |
| V-26 | Vuelo con plan de vuelo | PDF subido | ✅ URL guardada en `flight_plan_url` |
| V-27 | Vuelo sin plan de vuelo | Campo vacío | ✅ `flight_plan_url = null`, sección no visible en detalle |
| V-28 | Botón crear con spinner | En progreso | ✅ `isLoading` activo |

### 6.4 Ver detalle de vuelo

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| V-29 | Ver detalle completo | Vuelo con crew, pasajeros y plan | ✅ Ruta, fechas, aeronave, crew, ocupación, pasajeros, link PDF |
| V-30 | Ver plan de vuelo | `flight_plan_url != null` | ✅ Link "Descargar PDF" visible y funcional (abre en nueva pestaña) |
| V-31 | Sin plan de vuelo | `flight_plan_url = null` | ✅ Sección de plan de vuelo no visible |
| V-32 | Ver pasajeros confirmados | Reservaciones en status CONFIRMED | ✅ Lista de pasajeros en AdminControlCard |
| V-33 | Sin pasajeros | 0 reservas confirmadas | ✅ Mensaje "Sin pasajeros confirmados aún" |
| V-34 | Ver detalle de vuelo ajeno | ID de vuelo de otro owner | ❌ No retorna datos |

### 6.5 Cambiar status de vuelo

| ID | Caso de prueba | Transición | Resultado esperado |
|----|---------------|-----------|---------------------|
| V-35 | SCHEDULED → IN_FLIGHT | Click "Marcar como En vuelo" | ✅ Status actualizado, toast, UI actualiza |
| V-36 | DELAYED → IN_FLIGHT | Click "Marcar como En vuelo" | ✅ Status actualizado |
| V-37 | ON_TIME → IN_FLIGHT | Click "Marcar como En vuelo" | ✅ Status actualizado |
| V-38 | IN_FLIGHT → COMPLETED | Click "Marcar como Completado" | ✅ Status actualizado |
| V-39 | SCHEDULED → CANCELLED | Click "Cancelar vuelo" | ✅ Status actualizado |
| V-40 | DELAYED → CANCELLED | Click "Cancelar vuelo" | ✅ Status actualizado |
| V-41 | COMPLETED o CANCELLED | Sin botones de transición | ✅ Sección "Acciones" no muestra botones de transición |
| V-42 | Botón de transición muestra spinner | En progreso | ✅ Solo el botón clickeado muestra `isLoading` |

### 6.6 Editar vuelo

| ID | Caso de prueba | Datos de entrada | Resultado esperado |
|----|---------------|------------------|--------------------|
| V-43 | Editar vuelo con datos válidos | Campos actualizados | ✅ Vuelo actualizado, crew reemplazada completamente |
| V-44 | Cambiar aeronave a una con conflicto | Aeronave ocupada en ese slot | ❌ Error "La aeronave ya tiene un vuelo en ese horario" |
| V-45 | Quitar el único capitán | Sin CAPTAIN en crew | ❌ Validación |
| V-46 | Editar con departure < ahora + 24h | Fecha muy próxima | ❌ Validación |

### 6.7 Eliminar vuelo

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| V-47 | Eliminar sin pasajeros | 0 reservaciones activas | ✅ `ConfirmDialog` (sin warning) → confirmar → eliminado, toast "Vuelo eliminado" |
| V-48 | Eliminar con pasajeros | ≥ 1 reservación activa | ✅ `ConfirmDialog` con warning de notificación → confirmar → emails enviados → vuelo eliminado, toast "Se notificó a N pasajeros" |
| V-49 | Email de cancelación a pasajeros | Eliminar vuelo con pasajeros | 📧 Cada pasajero recibe email "Tu vuelo ha sido cancelado — Mobius Fly" |
| V-50 | Fallo al enviar email no bloquea eliminación | Error en Resend API | ✅ Vuelo se elimina de todas formas, `notifiedPassengers` puede ser 0 |
| V-51 | Cancelar eliminación en dialog | Click "Cancelar" | ✅ Dialog cierra, vuelo intacto |
| V-52 | Botón confirmar muestra spinner | En progreso | ✅ `isLoading` activo |

---

## 7. Módulo: Dashboard

### 7.1 KPIs

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| D-01 | KPI "Vuelos activos" | Vuelos con status SCHEDULED / DELAYED / IN_FLIGHT / ON_TIME | ✅ Conteo correcto |
| D-02 | KPI "Aeronaves activas" | Aeronaves con `status = "ACTIVE"` | ✅ Conteo correcto |
| D-03 | KPI "Tripulantes activos" | Crew con `status = "ACTIVE"` | ✅ Conteo correcto |
| D-04 | KPI "Documentos pendientes" | `aircraft_documents.document_status = PENDING_REVIEW` | ✅ Conteo correcto |
| D-05 | KPI "Ingresos del mes" | Suma de asientos vendidos × precio, mes actual | ✅ Monto en MXN |
| D-06 | Sin datos | Owner nuevo, sin operaciones | ✅ Todos los KPIs en 0 |

### 7.2 Vuelos próximos

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| D-07 | Lista de próximos vuelos | Vuelos con departure ≥ ahora | ✅ Máximo 5 vuelos, ordenados por fecha ASC |
| D-08 | Vuelo sin tripulación | `hasCrew = false` | ✅ Indicador visual de "Sin tripulación" |
| D-09 | Sin vuelos próximos | 0 vuelos futuros | ✅ Estado vacío |

### 7.3 Alertas de atención

| ID | Caso de prueba | Condición | Resultado esperado |
|----|---------------|-----------|---------------------|
| D-10 | Alerta documentos pendientes | `pendingDocs > 0` | ✅ Alerta visible en sección de atención |
| D-11 | Alerta aeronaves en mantenimiento | `maintenanceAircraft > 0` | ✅ Alerta visible |
| D-12 | Alerta vuelos sin tripulación | `flightsWithoutCrew > 0` | ✅ Alerta visible |
| D-13 | Sin alertas | Operación normal | ✅ Sección de atención limpia / no muestra alertas |

---

## 8. Reglas de Negocio Cruzadas

| ID | Regla | Módulos afectados | Verificar en |
|----|-------|------------------|--------------|
| RN-01 | Owner PENDING_ONBOARDING no puede crear nada | Layout | G-02, V-01 |
| RN-02 | Aeronave con docs pendientes excluida de vuelos | Aeronaves, Vuelos | V-03, V-21 |
| RN-03 | Tripulante no aprobado excluido de vuelos | Tripulación, Vuelos | V-04, V-22 |
| RN-04 | Aeronave no elimnable si tiene vuelos | Aeronaves | A-27, A-28 |
| RN-05 | Tripulante no eliminable si tiene vuelos activos | Tripulación | T-21, T-22 |
| RN-06 | Vuelo nuevo siempre inicia en PENDING_REVIEW | Vuelos | V-24 |
| RN-07 | Tripulante nuevo siempre inicia con `is_approved = false` | Tripulación | T-11 |
| RN-08 | Documento reemplazado vuelve a PENDING_REVIEW | Perfil | P-08 |
| RN-09 | Vuelo eliminado con pasajeros envía emails | Vuelos | V-48, V-49 |
| RN-10 | Crew de vuelo editado se reemplaza completa | Vuelos | V-43 |
| RN-11 | Asientos disponibles = asientos totales al crear | Vuelos | V-25 |
| RN-12 | Departure mínimo 24h en el futuro | Vuelos | V-18 |
| RN-13 | Arrival > Departure | Vuelos | V-17 |
| RN-14 | Origen ≠ Destino | Vuelos | V-16 |
| RN-15 | Solo pasajeros de reservaciones CONFIRMED en manifiesto | Vuelos | V-32 |
| RN-16 | Solo aeronaves y crew disponibles en tiempo slot | Vuelos | V-21, V-22 |

---

## 9. Flujo de Aprobación Completo (End-to-End)

| Paso | Acción | Actores | Resultado esperado |
|------|--------|---------|---------------------|
| 1 | Owner crea cuenta y sube doc de identidad | Owner | Doc en PENDING_REVIEW, owner en PENDING_ONBOARDING |
| 2 | Mobius aprueba documento de identidad | Admin Mobius | `document_status = APPROVED` |
| 3 | Mobius activa cuenta del owner | Admin Mobius | `owner.status = ACTIVE` |
| 4 | Owner agrega aeronave y sube documentos | Owner | Aeronave ACTIVE, docs en PENDING_REVIEW |
| 5 | Mobius aprueba documentos de aeronave | Admin Mobius | `document_status = APPROVED` |
| 6 | Owner agrega tripulante (Capitán) | Owner | Crew ACTIVE, `is_approved = false` |
| 7 | Mobius aprueba tripulante | Admin Mobius | `is_approved = true` |
| 8 | Owner puede crear vuelo | Owner | Aeronave y capitán aparecen en dropdowns |
| 9 | Owner crea vuelo | Owner | Vuelo en PENDING_REVIEW, `is_visible = false` |
| 10 | Mobius revisa y aprueba vuelo | Admin Mobius | `is_visible = true`, status actualizado |
| 11 | Vuelo visible para pasajeros | Pasajeros | Aparece en `/flights` (filtro `is_visible = true`) |
| 12 | Pasajero reserva asiento | Pasajero | Reservación CONFIRMED, `available_seats` decrementado |
| 13 | Owner cancela vuelo aprobado con pasajeros | Owner | Emails enviados a todos los pasajeros, vuelo eliminado |

---

## 10. Casos de Seguridad y Edge Cases

| ID | Caso | Resultado esperado |
|----|------|--------------------|
| S-01 | Acceder a aeronave de otro owner por URL | `GET /owner/aeronaves/{id-ajeno}` | ❌ Sin datos (query falla por owner FK) |
| S-02 | Acceder a vuelo de otro owner por URL | `GET /owner/vuelos/{id-ajeno}` | ❌ Sin datos |
| S-03 | Eliminar aeronave de otro owner vía acción | `deleteAircraft(id-ajeno, my-owner-id)` | ❌ Sin efecto (WHERE incluye owner_id) |
| S-04 | Sesión expirada mientras opera | Token vencido | 🔒 Redirige a login |
| S-05 | Cambiar status a código inválido | Status code no existe en tabla | ❌ Error "Estado desconocido: {code}" |
| S-06 | Crear vuelo con aeronave de otro owner | ID de aeronave ajena en request | ❌ Aeronave no disponible en dropdown, query excluye otras owners |
| S-07 | Asignar tripulante de otro owner | ID de crew ajeno | ❌ No aparece en dropdown (query filtra por owner) |
| S-08 | Doble submit en formularios | Click rápido doble | ✅ Botón deshabilitado durante `isLoading` |
| S-09 | Network error en acción server | Error de red | ❌ Toast de error, estado local no cambia |
| S-10 | Upload de archivo con nombre especial | Nombre con espacios/caracteres especiales | ✅ UUID usado como nombre de archivo en storage |
