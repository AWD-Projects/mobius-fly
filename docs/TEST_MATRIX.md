# Matriz de pruebas - Mobius Fly

Ultima actualizacion: 2026-04-30

## Alcance

Esta matriz cubre la app Next.js de Mobius Fly: landing publica, busqueda de vuelos, detalle, flujo de pasajeros, reservas, pagos con Stripe, autenticacion con OTP, area de pasajero, area de owner, SEO, middleware, APIs, emails/PDFs y componentes UI.

## Criterios de severidad

| Prioridad | Criterio |
| --- | --- |
| P0 | Bloquea compra, pago, reserva, seguridad, acceso indebido o integridad de asientos/dinero. |
| P1 | Rompe un flujo principal, datos importantes, SEO critico o regresion visible de alto impacto. |
| P2 | Afecta flujo secundario, validacion, copy, responsive, estado vacio o experiencia recuperable. |
| P3 | Mejora menor, caso cosmetico o validacion de baja frecuencia. |

## Ambientes y datos base

| Elemento | Requisito |
| --- | --- |
| Navegadores | Chrome, Safari, Firefox, Edge. |
| Viewports | 390x844 movil, 768x1024 tablet, 1440x900 desktop. |
| Roles | Invitado, pasajero autenticado, owner autenticado. |
| Integraciones | Supabase, Stripe test mode, Resend sandbox/test, storage `identity-documents`. |
| Datos minimos | Aeropuertos validos, vuelos `ONE_WAY`, vuelos `ROUND_TRIP`, vuelos sin asientos, vuelos no visibles, reservas `BLOCKED`, `CONFIRMED`, `EXPIRED`, pagos `PENDING`, `PAID`, `REFUNDED`. |
| Comandos base | `npm run lint`, `npm run typecheck`, `npm run build`, `npm run storybook`. |

## Smoke suite

| ID | Prioridad | Area | Caso | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| SM-001 | P0 | Build | Compilacion productiva | Ejecutar `npm run lint`, `npm run typecheck`, `npm run build`. | Sin errores bloqueantes. | CI |
| SM-002 | P0 | Landing | Carga inicial publica | Abrir `/`. | Header, hero, busqueda, secciones y footer cargan sin error. | Playwright |
| SM-003 | P0 | Busqueda | Buscar vuelo sencillo valido | Seleccionar origen, destino, fecha, pasajeros y buscar. | Redirige/lista vuelos correctos. | Playwright |
| SM-004 | P0 | Reserva | Crear reserva invitado | Desde detalle, elegir asientos, llenar pasajeros y continuar. | Reserva `BLOCKED`, referencia `MOB-XXXXXX`, timer visible. | API + Playwright |
| SM-005 | P0 | Pago | Crear PaymentIntent/Checkout | Continuar desde reserva bloqueada. | Se crea pago por monto calculado servidor-side. | API |
| SM-006 | P0 | Webhook | Confirmar pago exitoso | Simular evento Stripe exitoso. | Reserva `CONFIRMED`, pago `PAID`, emails/PDF generados. | Integracion |
| SM-007 | P0 | Auth | Registro pasajero completo | Registrar buyer con documento y OTP valido. | Usuario creado, perfil activo, documento en revision. | E2E |
| SM-008 | P0 | Middleware | Ruta protegida sin sesion | Abrir `/my-trips`. | Redirige a `/login?next=/my-trips`. | Playwright |
| SM-009 | P1 | Owner | Acceso owner dashboard | Login como owner y abrir `/owner/dashboard`. | Dashboard visible, nav owner correcta. | Playwright |
| SM-010 | P1 | SEO | Sitemap/robots | Abrir `/robots.txt`, `/sitemap.xml` o rutas sitemap. | Respuestas 200 y URLs esperadas. | API |

## Landing y paginas publicas

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| PUB-001 | P1 | Landing render completo | Ninguna | Abrir `/`. | No hay errores JS, layout estable, CTA visibles. | Playwright |
| PUB-002 | P1 | Navegacion por secciones | Ninguna | Usar links/scroll a features, beneficios, FAQ, contacto. | Scroll correcto y seccion visible. | Playwright |
| PUB-003 | P1 | Buscador embebido | Aeropuertos disponibles | Completar busqueda desde landing. | Parametros se preservan al ir a `/flights`. | Playwright |
| PUB-004 | P2 | FAQ por rol | Ninguna | Cambiar categoria/preguntas. | Preguntas correctas, sin solapamiento responsive. | Manual |
| PUB-005 | P2 | Formulario contacto valido | Ninguna | Enviar nombre, email, mensaje validos. | API responde exito y UI confirma envio. | API + Playwright |
| PUB-006 | P2 | Formulario contacto invalido | Ninguna | Enviar email invalido/campos vacios. | Mensajes de validacion sin request invalido. | Playwright |
| PUB-007 | P1 | Paginas legales | Ninguna | Abrir `/terms` y `/privacy`. | Contenido legible, header/footer, `X-Robots-Tag` indexable. | Playwright |
| PUB-008 | P2 | Paginas de estado | Ninguna | Abrir `/maintenance`, `/offline`, `/rate-limit`, `/service-unavailable`, `/unauthorized`, `/forbidden`, `/empty`. | Render correcto y noindex en privadas/estado. | API |
| PUB-009 | P2 | 404 | Ninguna | Abrir ruta inexistente. | Pagina not found sin crash. | Playwright |
| PUB-010 | P2 | Offline fallback | Simular offline | Navegar/reintentar. | Mensaje recuperable, sin loops. | Manual |

## Busqueda y listado de vuelos

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| FLT-001 | P0 | Validacion origen requerido | Ninguna | Buscar sin origen. | Muestra error y no consulta vuelos. | Unit + Playwright |
| FLT-002 | P0 | Validacion destino requerido | Ninguna | Buscar sin destino. | Muestra error y no consulta vuelos. | Unit + Playwright |
| FLT-003 | P1 | Origen igual a destino | Ninguna | Buscar MEX -> MEX. | Error: origen y destino no pueden ser iguales. | Unit |
| FLT-004 | P1 | Codigo IATA normalizado | Aeropuerto `mex` existe | Buscar con minusculas. | Se consulta `MEX`. | Unit/API |
| FLT-005 | P0 | Fecha formato invalido | Ninguna | Enviar fecha no `YYYY-MM-DD`. | Rechazo de validacion. | Unit |
| FLT-006 | P0 | Viaje redondo sin regreso | Ninguna | Tipo round trip sin `returnDate`. | Error en fecha de regreso. | Unit |
| FLT-007 | P1 | Pasajeros minimo | Ninguna | Buscar 0 pasajeros. | Error minimo 1. | Unit |
| FLT-008 | P1 | Pasajeros maximo | Ninguna | Buscar 21 pasajeros. | Error maximo 20. | Unit |
| FLT-009 | P0 | One way con resultados | Vuelo visible `ONE_WAY`, estado reservable, asientos suficientes. | Buscar ruta/fecha/pasajeros. | Lista solo vuelos coincidentes. | API + Playwright |
| FLT-010 | P0 | One way sin asientos suficientes | Vuelo visible con menos asientos. | Buscar mas pasajeros que asientos. | No aparece el vuelo. | API |
| FLT-011 | P0 | Estado no reservable | Vuelo cancelado/completado. | Buscar ruta/fecha. | No aparece o `is_reservable=false` segun pantalla. | API |
| FLT-012 | P1 | Vuelo no visible | Vuelo `is_visible=false`. | Buscar ruta/fecha. | No aparece. | API |
| FLT-013 | P1 | Orden precio ascendente | Multiples vuelos. | Ordenar `price_asc`. | Menor precio primero. | API |
| FLT-014 | P1 | Orden precio descendente | Multiples vuelos. | Ordenar `price_desc`. | Mayor precio primero. | API |
| FLT-015 | P1 | Paginacion | Mas de 4 vuelos. | Avanzar pagina. | Conteo, pagina y elementos correctos. | API + Playwright |
| FLT-016 | P0 | Round trip con regreso exacto | Vuelo `ROUND_TRIP` con `return_departure_datetime`. | Buscar ida y regreso. | Devuelve par outbound/inbound sintetico. | API |
| FLT-017 | P1 | Round trip sin resultados fecha regreso | Datos no coinciden. | Buscar fecha regreso distinta. | Estado vacio. | API |
| FLT-018 | P2 | Estado vacio UI | Sin vuelos. | Buscar ruta sin datos. | Mensaje claro y opcion de modificar busqueda. | Playwright |
| FLT-019 | P1 | Modificar busqueda | Resultados cargados. | Abrir modal modificar y cambiar parametros. | Nueva busqueda conserva datos correctos. | Playwright |
| FLT-020 | P1 | Persistencia ultima busqueda | Hacer busqueda. | Navegar detalle y volver. | Criterios previos disponibles. | Playwright |

## Detalle de vuelo y seleccion de compra

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| DET-001 | P0 | Detalle valido | Vuelo visible. | Abrir `/flights/[id]`. | Datos de ruta, horario, aeronave, crew y precio visibles. | Playwright |
| DET-002 | P1 | Detalle inexistente | ID inexistente. | Abrir `/flights/[id]`. | Not found/estado recuperable. | Playwright |
| DET-003 | P1 | Vuelo no visible | ID no visible. | Abrir detalle. | No muestra compra. | API + Playwright |
| DET-004 | P0 | Seleccionar asientos | Vuelo con asientos. | Elegir `seats` y cantidad valida. | Total = precio por asiento x cantidad. | Playwright |
| DET-005 | P0 | Seleccionar avion completo | Vuelo disponible. | Elegir `full_aircraft`. | Total = `price_full_aircraft`, pasajeros limitados por seats. | Playwright |
| DET-006 | P0 | Avion completo no disponible | Vuelo parcialmente reservado. | Intentar avion completo. | UI/API bloquea. | API + Playwright |
| DET-007 | P1 | Cantidad excede disponibilidad | Vuelo con N asientos. | Intentar N+1. | Control impide o API rechaza. | Playwright |
| DET-008 | P1 | Galeria aeronave sin fotos | Vuelo sin fotos. | Abrir detalle. | Placeholder estable, sin imagen rota. | Playwright |
| DET-009 | P2 | Crew incompleto | Vuelo sin crew. | Abrir detalle. | UI maneja ausencia sin crash. | Playwright |
| DET-010 | P1 | CTA continuar | Seleccion valida. | Click continuar. | Store `mobius-booking` actualizado y redirige a pasajeros. | Playwright |

## Pasajeros y reserva

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| RSV-001 | P0 | Acceso pasajeros sin vuelo | Store vacio. | Abrir `/flights/[id]/passengers` directo. | Redirige o pide reiniciar seleccion. | Playwright |
| RSV-002 | P0 | Adulto requerido para invitado | Invitado, reserva con menor o adulto sin email. | Continuar. | Error de email contacto requerido. | API + Playwright |
| RSV-003 | P0 | Datos adulto validos | Invitado. | Llenar nombre, sexo, nacimiento, email, telefono. | Pasajero marcado completo. | Playwright |
| RSV-004 | P1 | Datos menor | Compra con menores. | Llenar menor y responsable. | Datos persistidos y validaciones correctas. | Playwright |
| RSV-005 | P1 | Persistencia local | Llenar pasajeros, refrescar. | Recargar pagina. | Datos persisten desde Zustand/localStorage. | Playwright |
| RSV-006 | P0 | Crear reserva seats invitado | Vuelo reservable. | POST `/api/reservations`. | 201, reserva `BLOCKED`, asientos decrementados, pago `PENDING`. | API |
| RSV-007 | P0 | Crear reserva seats autenticado | Sesion pasajero. | POST con pasajeros validos. | Contacto se toma del perfil/auth email. | API |
| RSV-008 | P0 | Crear reserva avion completo | Vuelo con todos los asientos disponibles. | POST purchaseType `full_aircraft`. | Reserva bloqueada por avion completo. | API |
| RSV-009 | P0 | Asientos insuficientes concurrente | Dos requests simultaneos por ultimos asientos. | Ejecutar en paralelo. | Solo una reserva exitosa, sin asientos negativos. | Integracion |
| RSV-010 | P0 | Vuelo sale en menos de 3 horas | Vuelo cercano. | Crear reserva. | 409 `FLIGHT_DEPARTURE_TOO_SOON`. | API |
| RSV-011 | P0 | Error insercion pasajeros compensa | Forzar fallo de pasajeros. | Crear reserva. | Asientos liberados via RPC compensatoria. | Integracion |
| RSV-012 | P0 | Error insercion pago compensa | Forzar fallo de payment. | Crear reserva. | Asientos liberados, respuesta 500 controlada. | Integracion |
| RSV-013 | P1 | Referencia unica colision | Simular colision `MOB-XXXXXX`. | Crear reserva. | Reintenta hasta 3 veces o falla controlado. | Unit/Integracion |
| RSV-014 | P1 | Expiracion reserva | Reserva `BLOCKED` vencida. | Esperar job/RPC expiracion. | Reserva `EXPIRED`, asientos restaurados. | Integracion |
| RSV-015 | P1 | Timer de bloqueo | Reserva creada. | Ver pagina pago. | Cuenta regresiva usa `blockedUntil` y al vencer bloquea pago. | Playwright |
| RSV-016 | P1 | Store reset post compra | Pago confirmado/thank-you. | Completar flujo. | Store limpia o queda en estado consistente. | Playwright |

## Pagos Stripe

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| PAY-001 | P0 | Calculo comisiones base 10000 | Ninguna. | Ejecutar `calculatePaymentBreakdown(10000)`. | Total y subtotales coinciden con formula documentada. | Unit |
| PAY-002 | P0 | Redondeo centavos | Bases con decimales. | Calcular breakdown. | Redondeo a 2 decimales estable. | Unit |
| PAY-003 | P0 | PaymentIntent lee monto servidor | Pago `PENDING`. | POST `/api/payments/intent` sin monto cliente. | Monto viene de tabla `payments`, no del cliente. | API |
| PAY-004 | P0 | Checkout lee monto servidor | Pago `PENDING`. | POST `/api/payments/checkout`. | Session usa monto esperado. | API |
| PAY-005 | P1 | Body invalido intent | Ninguna. | Enviar UUID invalido. | 422 con detalles. | API |
| PAY-006 | P1 | Body invalido checkout | Ninguna. | Enviar JSON invalido. | 400 `Invalid JSON`. | API |
| PAY-007 | P0 | Reserva expirada antes de pago | Reserva `EXPIRED`. | Crear intent/checkout. | 410. | API |
| PAY-008 | P0 | Reserva no bloqueada | Reserva `CONFIRMED` o `CANCELLED`. | Crear intent/checkout. | 409. | API |
| PAY-009 | P0 | Reserva inexistente | IDs validos sin row. | Crear intent/checkout. | 404. | API |
| PAY-010 | P0 | Webhook sin firma | Ninguna. | POST webhook sin `stripe-signature`. | 400. | API |
| PAY-011 | P0 | Webhook firma invalida | Webhook secret configurado. | Enviar firma invalida. | 400. | Integracion |
| PAY-012 | P0 | Checkout completado exitoso | Session valida. | Simular `checkout.session.completed`. | Reserva `CONFIRMED`, pago `PAID`. | Integracion |
| PAY-013 | P0 | PaymentIntent exitoso | PI valido. | Simular `payment_intent.succeeded`. | Reserva `CONFIRMED`, pago `PAID`. | Integracion |
| PAY-014 | P0 | Idempotencia webhook pagado | Pago ya `PAID`. | Reenviar evento. | 200 con business exit, sin duplicar efectos. | Integracion |
| PAY-015 | P0 | Amount mismatch checkout | Session amount distinto. | Simular evento. | Refund creado, pago `REFUNDED`, reserva no confirma. | Integracion |
| PAY-016 | P0 | Amount mismatch intent | PI amount distinto. | Simular evento. | Refund creado, pago `REFUNDED`. | Integracion |
| PAY-017 | P0 | Reserva expira durante webhook | Race condition. | Expirar entre fetch y update. | Refund, pago `REFUNDED`. | Integracion |
| PAY-018 | P1 | Evento no soportado | Evento Stripe distinto. | POST webhook. | 200 `{ received: true }`. | API |
| PAY-019 | P1 | Payment failed | Evento `payment_intent.payment_failed`. | POST webhook. | 200, log informativo, sin confirmar. | API |
| PAY-020 | P1 | Email/PDF no bloquea pago | Forzar fallo Resend/PDF. | Confirmar webhook. | Pago/reserva quedan confirmados; fallo se registra. | Integracion |

## Autenticacion, registro y OTP

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| AUTH-001 | P0 | Login valido | Usuario existente. | POST `/api/auth/login` o UI login. | Sesion creada y redirect por rol. | E2E |
| AUTH-002 | P0 | Login invalido | Usuario inexistente/password mala. | Intentar login. | Error claro, sin sesion. | API + Playwright |
| AUTH-003 | P1 | Logout | Sesion activa. | POST `/api/auth/logout`. | Cookies/sesion removidas. | API |
| AUTH-004 | P0 | Registro buyer valido | Email nuevo, documento valido. | Completar formulario, signup, OTP. | Auth user, `user_profiles`, `user_documents`, sin owner row. | E2E |
| AUTH-005 | P0 | Registro owner valido | Email nuevo, documento valido. | Completar owner, OTP. | Auth user, perfil OWNER, row `owners`. | E2E |
| AUTH-006 | P1 | Edad menor a 18 | Ninguna. | Registrar con fecha menor. | Error "Debes ser mayor de 18 anos". | Unit + Playwright |
| AUTH-007 | P1 | Password debil | Ninguna. | Password sin mayuscula/minuscula/numero o menor a 8. | Error especifico. | Unit |
| AUTH-008 | P1 | Confirm password distinto | Ninguna. | Enviar passwords diferentes. | Error en confirmacion. | Unit |
| AUTH-009 | P1 | Documento faltante | Ninguna. | Avanzar sin archivo. | Error requerido. | Playwright |
| AUTH-010 | P1 | Documento tipo no permitido | Archivo `.exe`/mime invalido. | Signup. | 422 tipo no permitido. | API |
| AUTH-011 | P1 | Documento >10MB API | Archivo grande. | Signup. | 422 tamano maximo. | API |
| AUTH-012 | P1 | Documento >5MB UI | Archivo >5MB. | Validar en formulario. | Error UI segun schema. | Unit/Playwright |
| AUTH-013 | P1 | Signup JSON invalido | Ninguna. | POST body invalido. | 400. | API |
| AUTH-014 | P0 | Signup campos requeridos | Ninguna. | Omitir email/password/documento. | 400. | API |
| AUTH-015 | P0 | OTP correcto | Row `signup_otps` vigente. | POST `/api/auth/verify-otp`. | Usuario creado, row OTP eliminada. | API |
| AUTH-016 | P0 | OTP incorrecto | Row vigente. | Token erroneo. | 422, no crea usuario. | API |
| AUTH-017 | P0 | OTP expirado | Row expirada. | Token correcto vencido. | 422 expirado, no crea usuario. | API |
| AUTH-018 | P1 | OTP formato invalido | Ninguna. | Token no numerico o !=6. | 400. | API |
| AUTH-019 | P0 | Email duplicado al verificar | Auth user ya existe. | Verificar OTP. | 409 correo registrado. | API |
| AUTH-020 | P1 | Reenvio OTP | Row pendiente. | POST `/api/auth/resend-otp`. | Nuevo hash/expiracion, email enviado. | API |
| AUTH-021 | P1 | Rate limit signup | Misma IP >5/min. | Repetir signup. | 429 y pagina/estado consistente. | API |
| AUTH-022 | P1 | Rate limit pagos | Misma IP >10/min. | Repetir intent/checkout. | 429. | API |
| AUTH-023 | P0 | Auth-only con sesion passenger | Sesion pasajero. | Abrir `/login` o `/register`. | Redirige a `/my-trips`. | Playwright |
| AUTH-024 | P0 | Auth-only con sesion owner | Sesion owner. | Abrir `/login`. | Redirige a `/owner/dashboard`. | Playwright |

## Area pasajero: mis viajes

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| TRP-001 | P0 | Mis viajes sin sesion | Ninguna. | Abrir `/my-trips`. | Redirect login con `next`. | Playwright |
| TRP-002 | P1 | Lista sin reservas | Pasajero sin reservas. | Abrir `/my-trips`. | Estado vacio claro. | Playwright |
| TRP-003 | P1 | Lista upcoming/past | Pasajero con reservas futuras y pasadas. | Abrir `/my-trips`. | Separacion por fecha de salida. | API + Playwright |
| TRP-004 | P0 | No muestra expiradas | Pasajero con `EXPIRED`. | Abrir lista. | Reservas expiradas filtradas. | API |
| TRP-005 | P0 | Detalle propia reserva | Pasajero con reserva. | Abrir `/my-trips/[id]`. | Detalle, pasajeros, vuelo y estado correctos. | Playwright |
| TRP-006 | P0 | Detalle reserva ajena | Pasajero A intenta ID de B. | Abrir detalle. | No autorizado/not found. | API + Playwright |
| TRP-007 | P1 | Reserva bloqueada | Reserva `BLOCKED`. | Abrir detalle. | Estado pendiente y accion de pago si aplica. | Playwright |
| TRP-008 | P1 | Reserva confirmada | Reserva `CONFIRMED`. | Abrir detalle. | Confirmacion y datos finales. | Playwright |

## Area owner

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| OWN-001 | P0 | Owner rutas sin sesion | Ninguna. | Abrir `/owner/dashboard`. | Redirect login. | Playwright |
| OWN-002 | P0 | Passenger intenta owner | Sesion passenger. | Abrir `/owner/dashboard`. | Forbidden/redirect apropiado. | Playwright |
| OWN-003 | P0 | Owner dashboard | Sesion owner. | Abrir `/owner/dashboard`. | KPIs y layout owner cargan. | Playwright |
| OWN-004 | P1 | Vuelos owner | Sesion owner con vuelos. | Abrir `/owner/vuelos`. | Lista vuelos asignados/propios. | Playwright |
| OWN-005 | P1 | Tripulacion | Sesion owner. | Abrir `/owner/tripulacion`. | Cards/lista tripulacion sin crash. | Playwright |
| OWN-006 | P1 | Manifiestos | Sesion owner con reservas. | Abrir `/owner/manifiestos`. | Manifiestos disponibles/estado vacio. | Playwright |
| OWN-007 | P1 | Perfil owner | Sesion owner. | Abrir `/owner/perfil`. | Datos de perfil visibles. | Playwright |
| OWN-008 | P1 | Fleet name API | Owner valido. | POST/GET `/api/owners/fleet-name`. | Guarda/retorna nombre de flota. | API |
| OWN-009 | P1 | Fleet name sin auth | Ninguna. | Llamar API. | 401/403. | API |
| OWN-010 | P2 | Owner nav responsive | Sesion owner. | Probar movil/tablet. | Navegacion usable sin overflow. | Playwright |

## Middleware, seguridad y headers

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-001 | P0 | Proteccion rutas privadas | Sin sesion. | Abrir rutas `PROTECTED_PATTERNS`. | Redirect login con `next`. | API/Playwright |
| SEC-002 | P0 | Noindex privadas | Sin/sesion. | HEAD/GET `/login`, `/register`, `/my-trips`, `/owner`, `/api/*`. | `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`. | API |
| SEC-003 | P1 | Index publicas | Ninguna. | GET `/`, `/flights`, `/terms`, `/privacy`. | `X-Robots-Tag: index, follow`. | API |
| SEC-004 | P1 | Security headers | Ninguna. | GET rutas publicas/privadas. | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` presentes. | API |
| SEC-005 | P0 | Session refresh | Sesion valida. | Navegar app. | Cookies actualizadas sin perder sesion. | E2E |
| SEC-006 | P0 | API no confia en precio cliente | Reserva/pago. | Enviar `basePrice` o monto manipulado. | Monto final sale de server/RPC/payment row; inconsistencias bloqueadas. | Integracion |
| SEC-007 | P0 | RLS payment tables | Usuario A/B. | Intentar leer/escribir pagos ajenos desde cliente. | RLS bloquea acceso indebido. | Integracion Supabase |
| SEC-008 | P0 | Storage identity docs | Usuario sin permisos. | Intentar leer docs ajenos. | Acceso denegado. | Integracion Supabase |
| SEC-009 | P1 | Rate limit memoria | Repetir requests. | Superar limite. | 429 estable, sin afectar rutas no limitadas. | API |
| SEC-010 | P1 | JSON invalido en APIs | APIs POST. | Enviar body no JSON. | 400 controlado. | API |

## SEO, metadatos y assets

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| SEO-001 | P1 | Metadata home | Ninguna. | Inspeccionar `/`. | Title, description, canonical/OG coherentes. | Playwright |
| SEO-002 | P1 | Metadata vuelos | Vuelo valido. | Abrir `/flights/[id]`. | Metadata especifica del vuelo. | Playwright |
| SEO-003 | P1 | OG image | Vuelo valido. | GET `/api/og?...`. | Imagen 200, dimensiones correctas. | API |
| SEO-004 | P1 | Robots | Ninguna. | GET `/robots.txt`. | Reglas esperadas y sitemap declarado. | API |
| SEO-005 | P1 | Sitemap static | Ninguna. | GET `/sitemap-static.xml`. | XML valido con rutas publicas. | API |
| SEO-006 | P1 | Sitemap index | Ninguna. | GET `/sitemap-index.xml`. | XML valido. | API |
| SEO-007 | P2 | Manifest PWA | Ninguna. | GET `/site.webmanifest`. | JSON valido e iconos resolubles. | API |
| SEO-008 | P2 | Favicon/logos | Ninguna. | GET assets publicos. | 200 y mime correcto. | API |
| SEO-009 | P1 | Structured data | Ninguna. | Inspeccionar JSON-LD. | JSON valido sin campos vacios criticos. | Playwright/API |
| SEO-010 | P1 | Mobile friendly | Build deploy/staging. | Ejecutar Lighthouse/mobile checks. | Sin problemas criticos de viewport/tap targets. | Manual/CI |

## Emails y PDFs

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| EML-001 | P1 | OTP email | Signup exitoso. | Revisar email. | Codigo visible, expiracion correcta, branding. | Manual/API |
| EML-002 | P0 | Buyer confirmation | Pago confirmado. | Revisar email comprador. | Datos vuelo/reserva/pasajeros correctos. | Integracion |
| EML-003 | P0 | Owner notification | Pago confirmado con owner. | Revisar email owner. | Manifiesto y datos correctos. | Integracion |
| EML-004 | P1 | Mobius internal | Pago confirmado. | Revisar email interno. | Resumen completo y referencia correcta. | Integracion |
| EML-005 | P1 | PDF manifest | Pago confirmado. | Generar PDF. | Pasajeros, vuelo, aeronave y booking ref correctos. | Script/manual |
| EML-006 | P1 | PDF confirmation | Pago confirmado. | Generar PDF. | Datos comprador/reserva correctos. | Script/manual |
| EML-007 | P2 | Caracteres espanoles | Datos con acentos/n. | Generar emails/PDF. | Texto legible sin corrupcion. | Manual |
| EML-008 | P1 | Sin RESEND real en dev | Dev sin key. | Signup. | No intenta envio real, responde 201. | API |
| EML-009 | P1 | Falla Resend signup | Key invalida/servicio falla. | Signup. | Rollback storage + OTP row. | Integracion |
| EML-010 | P1 | Scripts emails | Variables configuradas. | Ejecutar `scripts/test-emails.*`. | Envia muestras o falla con error claro. | Manual |

## Componentes UI y Storybook

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| UI-001 | P1 | Storybook build | Ninguna. | Ejecutar `npm run build-storybook`. | Build exitoso. | CI |
| UI-002 | P1 | Atoms interactivos | Storybook. | Revisar Button, Input, Select, Checkbox, Radio, Switch, Toast. | Estados default/hover/focus/disabled/error correctos. | Visual |
| UI-003 | P1 | DatePicker/TimePicker | Storybook/app. | Seleccionar fechas/horas. | Valor correcto, teclado usable. | Playwright |
| UI-004 | P1 | Navbar estados | Storybook. | Probar invitado, buyer, owner, hero/no hero. | Opciones por rol correctas. | Visual |
| UI-005 | P2 | Skeleton/loading | Rutas con loading. | Simular carga. | Skeleton sin layout shift severo. | Visual |
| UI-006 | P1 | Cards de vuelo | Storybook/app. | Revisar minimal, upcoming, past, summary. | Datos, badges, precios y estados correctos. | Visual |
| UI-007 | P1 | Passenger form | App/story. | Completar adulto/menor. | Validaciones y campos condicionales correctos. | Playwright |
| UI-008 | P2 | Tablas/paginacion | Storybook/app. | Probar datos largos. | No overflow, paginacion usable. | Visual |
| UI-009 | P2 | Accesibilidad foco | App. | Navegar con teclado. | Focus visible y orden logico. | Playwright/a11y |
| UI-010 | P2 | Contraste | App. | Auditar colores principales. | Sin contrastes criticos. | Lighthouse/a11y |

## Responsive, accesibilidad y compatibilidad

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| RSP-001 | P1 | Home movil | 390x844. | Abrir `/`. | Sin overflow horizontal, CTAs visibles. | Playwright screenshot |
| RSP-002 | P1 | Busqueda movil | 390x844. | Buscar vuelos. | Form usable, resultados escaneables. | Playwright |
| RSP-003 | P1 | Detalle movil | 390x844. | Abrir detalle. | Sidebar/compra no tapa contenido. | Playwright |
| RSP-004 | P1 | Pasajeros movil | 390x844. | Llenar formulario. | Inputs visibles, teclado no rompe flujo. | Manual |
| RSP-005 | P1 | Pago movil | 390x844. | Abrir pago Stripe Elements/Checkout. | Monto/timer/form visibles. | Manual/Playwright |
| RSP-006 | P1 | Owner movil | 390x844. | Abrir owner routes. | Nav y contenido no se solapan. | Playwright |
| RSP-007 | P2 | Tablet | 768x1024. | Recorrer rutas principales. | Layout estable. | Playwright |
| RSP-008 | P2 | Desktop ancho | 1440x900. | Recorrer rutas principales. | Contenido no queda desproporcionado. | Playwright |
| RSP-009 | P1 | Teclado | App completa. | Tab/Shift+Tab/Enter/Escape. | Flujos principales operables. | Playwright |
| RSP-010 | P1 | Screen reader basico | App publica/formularios. | Inspeccionar labels/aria. | Inputs y botones nombrados. | Manual/a11y |
| RSP-011 | P2 | Reduced motion | OS reduce motion. | Abrir landing. | Animaciones no afectan uso. | Manual |
| RSP-012 | P2 | Navegadores | Chrome/Safari/Firefox/Edge. | Ejecutar smoke. | Sin diferencias bloqueantes. | Manual/Cloud |

## Base de datos, RPC y migraciones

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| DB-001 | P0 | Migraciones limpias | DB nueva. | Aplicar migraciones Supabase. | Sin errores. | CI |
| DB-002 | P0 | RPC lock seats | Vuelo con asientos. | Ejecutar `lock_seats_and_create_reservation`. | Reserva `BLOCKED`, asientos decrementados atomicamente. | Integracion |
| DB-003 | P0 | RPC no asientos negativos | Concurrencia. | Ejecutar locks simultaneos. | Integridad de asientos. | Integracion |
| DB-004 | P0 | RPC full aircraft | Vuelo completo disponible. | Reservar avion completo. | Bloquea todos/asientos segun regla. | Integracion |
| DB-005 | P0 | Check departure window | Vuelo <3h. | Insertar/reservar. | Rechazo por ventana. | Integracion |
| DB-006 | P0 | Cancel blocked reservation | Reserva `BLOCKED`. | Ejecutar `cancel_blocked_reservation`. | Reserva cancelada/expirada y asientos restaurados. | Integracion |
| DB-007 | P1 | Lazy expiration RPC | Reserva vencida. | Consultar/ejecutar expiracion. | Estado `EXPIRED` consistente. | Integracion |
| DB-008 | P0 | RLS reservations | Usuarios A/B. | Acceso cruzado. | Usuario no ve reserva ajena. | Integracion |
| DB-009 | P0 | RLS payments | Usuarios A/B. | Acceso cruzado. | Usuario no ve pago ajeno. | Integracion |
| DB-010 | P1 | Owner flights relation | Vuelo con `owner_id`. | Consultar owner. | Solo muestra vuelos owner correctos. | Integracion |

## Pruebas negativas y resiliencia

| ID | Prioridad | Caso | Precondiciones | Pasos | Resultado esperado | Automatizacion |
| --- | --- | --- | --- | --- | --- | --- |
| NEG-001 | P0 | Supabase caido | Simular fallo. | Buscar/reservar/login. | Errores controlados, sin datos corruptos. | Manual/Integracion |
| NEG-002 | P0 | Stripe caido | Simular error Stripe. | Crear intent/checkout. | Reserva sigue `BLOCKED`, UI permite reintentar. | Integracion |
| NEG-003 | P1 | Resend caido OTP | Simular error. | Signup. | Rollback y mensaje claro. | Integracion |
| NEG-004 | P1 | Storage caido | Simular upload error. | Signup. | 500 controlado, no OTP row. | Integracion |
| NEG-005 | P1 | LocalStorage corrupto | Editar `mobius-booking`. | Abrir flujo. | App no crashea y permite reiniciar. | Playwright |
| NEG-006 | P1 | Back/forward browser | Flujos booking/auth. | Usar atras/adelante. | Estado consistente, no duplica reservas. | Playwright |
| NEG-007 | P1 | Refresh en pago | Reserva bloqueada. | Refrescar `/payment`. | Recupera reserva/timer desde store/API o muestra accion clara. | Playwright |
| NEG-008 | P0 | Doble click comprar | Detalle. | Click rapido multiple. | Un solo request efectivo o API conserva integridad. | Playwright/API |
| NEG-009 | P0 | Doble webhook | Evento duplicado. | Reenviar Stripe event. | Idempotente. | Integracion |
| NEG-010 | P1 | Payload muy grande | APIs POST. | Enviar body grande. | Rechazo controlado o limite de plataforma. | API |

## Matriz de automatizacion sugerida

| Capa | Herramienta sugerida | Casos candidatos |
| --- | --- | --- |
| Unit | Vitest o Jest | Schemas Zod, fee calculation, OTP hash/verify, helpers de mapping. |
| API | Playwright request o Supertest sobre Next | Auth APIs, reservations, payments, webhooks, SEO routes, headers. |
| E2E | Playwright | Smoke, busqueda, booking, auth, rutas protegidas, responsive screenshots. |
| Integracion DB | Supabase local/remote test | RPC de asientos, RLS, migraciones, expiracion, compensaciones. |
| Visual | Storybook + Chromatic/Playwright screenshots | Componentes atom/molecule/organism y rutas principales. |
| Manual | QA checklist | Stripe real test mode, emails/PDF render, cross-browser Safari/iOS, accesibilidad con screen reader. |

## Gates recomendados por release

| Gate | Debe pasar |
| --- | --- |
| Pull request | `lint`, `typecheck`, unit tests de validaciones/fees/OTP, API smoke sin integraciones reales. |
| Release candidate | Smoke suite completa, E2E buyer invitado, E2E registro buyer/owner, pagos Stripe test, SEO headers/sitemaps. |
| Produccion | Verificacion de variables, webhook Stripe activo, Resend activo, storage buckets, sitemap/robots, monitoreo de errores. |

