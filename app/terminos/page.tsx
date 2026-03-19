"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/organisms/AppNavbar";
import { FooterSection } from "@/app/sections/FooterSection";

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

export default function TerminosPage() {
    const router = useRouter();

    return (
        <LazyMotion features={domAnimation} strict>
            <div className="min-h-screen bg-background text-text flex flex-col">
                <AppNavbar
                    backgroundColor="var(--color-background)"
                    contentPadding={sectionPadding}
                    navLinks={[]}
                    onLogoClick={() => router.push("/")}
                    onNavLinkClick={(href) => router.push(href)}
                    onLoginClick={() => router.push("/login")}
                    onSignUpClick={() => router.push("/register")}
                />

                {/* Header */}
                <header className={`${sectionPadding} pt-32 pb-12 border-b border-text/10`}>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-sm text-text/50 uppercase tracking-widest mb-3">Versión 2.0 · 17 de marzo de 2026</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
                            Términos y Condiciones Generales de Uso
                        </h1>
                        <p className="mt-4 text-text/60 text-base">
                            Mobius Fly, S.A. de C.V. · contacto@mobiusfly.com
                        </p>
                    </div>
                </header>

                {/* Intro */}
                <section className={`${sectionPadding} pt-10`}>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-text/80 leading-relaxed mb-4">
                            Estos Términos y Condiciones Generales de Uso (los &ldquo;TyC Generales&rdquo;) regulan el acceso, registro,
                            navegación y uso del sitio web, aplicaciones web o móviles, software, interfaces, funcionalidades,
                            contenido, herramientas y demás servicios digitales identificados con el dominio mobiusfly.com y/o los
                            subdominios, aplicaciones o medios digitales operados por Mobius Fly, S.A. de C.V. (&ldquo;Mobius&rdquo;, la
                            &ldquo;Empresa&rdquo;, &ldquo;nosotros&rdquo; o &ldquo;nuestro&rdquo;).
                        </p>
                        <p className="text-text/80 leading-relaxed mb-4">
                            Al acceder al Portal, crear una cuenta, hacer clic en &ldquo;acepto&rdquo;, &ldquo;continuar&rdquo;, &ldquo;crear cuenta&rdquo; o cualquier
                            mecanismo equivalente de aceptación, o utilizar el Portal de cualquier forma, la persona usuaria reconoce
                            haber leído, entendido y aceptado obligarse por estos TyC Generales, así como por el Aviso de Privacidad y,
                            en su caso, por los términos particulares que resulten aplicables según el rol del usuario o el servicio utilizado.
                        </p>
                        <p className="text-text/70 text-sm italic">
                            Si la persona usuaria no está de acuerdo con estos TyC Generales, deberá abstenerse de acceder, navegar, registrarse o utilizar el Portal.
                        </p>
                    </div>
                </section>

                {/* Sections */}
                <main className={`${sectionPadding} pb-16 flex-1`}>
                    <div className="max-w-3xl mx-auto space-y-12">

                        {/* 1 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">1. Identidad del Proveedor del Portal</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Portal es operado por Mobius Fly, S.A. de C.V., sociedad constituida conforme a las leyes de los
                                Estados Unidos Mexicanos.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Para cualquier aclaración, comentario, duda, queja o notificación relacionada con el Portal o con estos
                                TyC Generales, el usuario podrá contactarnos en:{" "}
                                <a href="mailto:contacto@mobiusfly.com" className="text-primary underline">contacto@mobiusfly.com</a>.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                La información corporativa complementaria, así como los medios de contacto adicionales y el domicilio
                                para efectos legales o administrativos, podrán estar disponibles en el propio Portal, en el Aviso de
                                Privacidad o en la documentación legal complementaria publicada por Mobius.
                            </p>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">2. Definiciones</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Para efectos de estos TyC Generales, los siguientes términos tendrán el significado que aquí se les
                                atribuye, ya sea en singular o plural:
                            </p>
                            <div className="space-y-4">
                                {[
                                    { term: '"Portal"', def: 'significa el sitio web, aplicaciones, software, herramientas, interfaces, bases de datos, funcionalidades, contenido y servicios digitales operados por Mobius bajo el dominio mobiusfly.com o cualquiera de sus extensiones, subdominios o aplicaciones relacionadas.' },
                                    { term: '"Usuario"', def: 'significa toda persona física o moral que acceda, navegue, visite, cree una cuenta o utilice el Portal, con independencia de su rol específico.' },
                                    { term: '"Cuenta"', def: 'significa el perfil digital creado por un Usuario dentro del Portal para acceder a funcionalidades restringidas o personalizadas.' },
                                    { term: '"Servicios del Portal"', def: 'significa las funcionalidades tecnológicas, digitales, informativas, administrativas o de intermediación que Mobius ponga a disposición de los Usuarios a través del Portal.' },
                                    { term: '"Servicios de Terceros"', def: 'significa los servicios, productos, infraestructura, procesamiento de pagos, verificación de identidad, mensajería, almacenamiento, servicios aeronáuticos, transporte, seguros, conectividad, datos, contenido o herramientas proporcionados por terceros, aunque estén integrados, enlazados o sean accesibles a través del Portal.' },
                                    { term: '"Términos Particulares"', def: 'significa las condiciones específicas aplicables a determinados roles, transacciones, servicios, promociones, programas, productos o funcionalidades, incluyendo, sin limitar, condiciones para pasajeros, owners, operadores, administradores de aeronaves, proveedores, políticas de cancelación, pagos, reembolsos, promociones o cualquier otro documento complementario.' },
                                    { term: '"Contenido de Usuario"', def: 'significa toda la información, datos, documentos, imágenes, marcas, avisos, publicaciones, comentarios, listados, mensajes o materiales que un Usuario cargue, publique, transmita, comparta o ponga a disposición a través del Portal.' },
                                ].map(({ term, def }) => (
                                    <div key={term} className="bg-text/5 rounded-xl p-4 border border-text/10">
                                        <span className="font-medium">{term}</span>{" "}
                                        <span className="text-text/75">{def}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">3. Naturaleza del Portal y Alcance de Mobius</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius opera una plataforma tecnológica que permite a los Usuarios acceder a funcionalidades digitales
                                relacionadas con la publicación, descubrimiento, consulta, administración, promoción, solicitud, reserva,
                                gestión, coordinación o intermediación de servicios y oportunidades vinculadas con vuelos, trayectos,
                                empty legs, aeronaves, operadores, administradores, pasajeros y servicios relacionados.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Salvo que en un documento específico se indique expresamente lo contrario, Mobius no es el propietario
                                ni el operador aéreo de las aeronaves, no presta por sí misma el servicio de transporte aéreo, no
                                garantiza la disponibilidad de vuelos específicos, ni asume obligaciones que legalmente correspondan al
                                propietario, operador, administrador, transportista o proveedor tercero que efectivamente preste el
                                servicio correspondiente.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                El uso de ciertos servicios o funcionalidades puede estar sujeto a Términos Particulares adicionales. En
                                caso de conflicto entre estos TyC Generales y los Términos Particulares aplicables a una funcionalidad,
                                servicio, reserva, transacción o rol específico, prevalecerán los Términos Particulares respecto de esa
                                materia concreta, y estos TyC Generales seguirán aplicando en todo lo no modificado expresamente.
                            </p>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">4. Capacidad Legal y Elegibilidad</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Al crear una Cuenta o utilizar el Portal, el Usuario declara y garantiza que:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Tiene capacidad legal suficiente para obligarse conforme a la legislación que le resulte aplicable.</li>
                                <li>Si es persona física, tiene al menos 18 años de edad o la mayoría de edad legal en su jurisdicción.</li>
                                <li>Si actúa en nombre de una persona moral o de un tercero, cuenta con facultades suficientes para obligarla.</li>
                                <li>La información, datos, documentos y manifestaciones que proporcione a Mobius son verdaderos, completos, exactos, actuales y verificables.</li>
                                <li>No utilizará el Portal para fines ilícitos, fraudulentos, engañosos, prohibidos o contrarios a estos TyC Generales.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed">
                                Mobius podrá, en cualquier momento y sin responsabilidad frente al Usuario, solicitar información o
                                documentación adicional para verificar identidad, facultades, edad, domicilio, titularidad, situación
                                fiscal, medios de pago, documentación operativa o cualquier otro dato necesario para habilitar, mantener,
                                limitar, suspender o cancelar el acceso a la Cuenta o a determinados Servicios del Portal.
                            </p>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">5. Registro, Cuentas y Seguridad</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Para acceder a ciertas funcionalidades del Portal, el Usuario deberá crear una Cuenta y proporcionar la
                                información que le sea requerida.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">El Usuario es el único y exclusivo responsable de:</p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Mantener la confidencialidad de sus contraseñas, códigos, credenciales, tokens, llaves o mecanismos de acceso.</li>
                                <li>Restringir el acceso no autorizado a sus dispositivos, correos electrónicos y métodos de autenticación.</li>
                                <li>Todas las actividades que se realicen desde su Cuenta, salvo prueba suficiente de uso no autorizado no imputable al Usuario.</li>
                                <li>Notificar de inmediato a Mobius cualquier sospecha o evento de acceso no autorizado, uso indebido, vulneración de seguridad, suplantación o compromiso de su Cuenta.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius podrá implementar medidas de autenticación, verificación, validación, monitoreo, revisión,
                                bloqueo, suspensión, restablecimiento o recuperación de acceso cuando lo considere razonablemente
                                necesario por seguridad, prevención de fraude, cumplimiento normativo o protección del Portal, de otros
                                Usuarios o de terceros.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                La creación de múltiples cuentas con fines de evasión, fraude, abuso, manipulación de precios, elusión
                                de verificaciones, simulación de identidad o incumplimiento de restricciones está prohibida.
                            </p>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">6. Aceptación por Medios Electrónicos y Evidencia</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Usuario reconoce y acepta que su manifestación de voluntad por medios electrónicos, ópticos o por
                                cualquier otra tecnología, incluyendo la creación de una Cuenta, el uso del Portal, la selección de
                                casillas, botones o mecanismos equivalentes, constituye consentimiento válido y suficiente para obligarse
                                conforme a estos TyC Generales y a los documentos complementarios aplicables.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Usuario acepta que Mobius pueda conservar, generar, compilar, resguardar y presentar como evidencia,
                                para efectos legales, técnicos, operativos, administrativos o de atención de controversias, los registros
                                electrónicos relacionados con el uso del Portal, incluyendo de manera enunciativa más no limitativa:
                                direcciones IP, identificadores de dispositivo, fecha y hora, logs, bitácoras, confirmaciones, acuses,
                                historial de aceptación, versión del documento aceptado, eventos de sesión, actividad de la Cuenta y
                                cualquier otro Mensaje de Datos o elemento de trazabilidad técnica.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Salvo prueba en contrario, dichos registros harán prueba del acceso, uso, aceptación, instrucciones y
                                operaciones atribuidas a la Cuenta del Usuario cuando hayan sido generados mediante los sistemas de
                                Mobius o de sus proveedores tecnológicos.
                            </p>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">7. Uso Autorizado del Portal</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                El Usuario se obliga a utilizar el Portal únicamente para fines lícitos y de conformidad con estos TyC
                                Generales, la legislación aplicable, el orden público, las buenas costumbres y los derechos de terceros.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">Queda estrictamente prohibido:</p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Interferir, interrumpir, dañar, descompilar, desensamblar, vulnerar, atacar, probar, escanear o comprometer la seguridad, disponibilidad, integridad o funcionamiento del Portal.</li>
                                <li>Usar bots, scrapers, spiders, scripts automáticos, software masivo, técnicas de extracción automatizada o cualquier otro mecanismo no autorizado para acceder, recolectar, copiar, monitorear o explotar información del Portal.</li>
                                <li>Suplantar identidades, falsificar información, crear cuentas con datos falsos o engañosos, o actuar en nombre de terceros sin autorización suficiente.</li>
                                <li>Publicar, cargar, transmitir o compartir Contenido de Usuario falso, fraudulento, ilícito, difamatorio, infractor, ofensivo, discriminatorio, obsceno, violento o que vulnere derechos de terceros.</li>
                                <li>Utilizar el Portal para fraude, lavado de dinero, financiamiento ilícito, evasión regulatoria, actos simulados, contracargos abusivos, manipulación de operaciones o cualquier actividad sospechosa o prohibida por la ley.</li>
                                <li>Reproducir, copiar, comercializar, sublicenciar, distribuir, transformar, explotar o utilizar el Portal o sus contenidos fuera de los usos expresamente permitidos por Mobius.</li>
                                <li>Eludir restricciones técnicas, validaciones, políticas, filtros, verificaciones o decisiones de suspensión, bloqueo o terminación adoptadas por Mobius.</li>
                                <li>Utilizar el Portal de forma que pueda generar responsabilidad, daño reputacional, sanciones regulatorias, contingencias financieras o afectaciones operativas para Mobius o terceros.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed">
                                Mobius podrá investigar cualquier incumplimiento real o presunto y adoptar las medidas que estime
                                necesarias, incluyendo la suspensión o cancelación de la Cuenta, la retención temporal de
                                funcionalidades, la cancelación de publicaciones, la negativa de acceso y la colaboración con
                                autoridades competentes.
                            </p>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">8. Información Proporcionada por el Usuario</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                El Usuario es el único responsable del Contenido de Usuario que publique, cargue, transmita o proporcione
                                a través del Portal, y declara que cuenta con todos los derechos, autorizaciones, licencias y facultades
                                necesarias para ello.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">El Usuario garantiza que el Contenido de Usuario:</p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Es exacto, veraz, completo y no induce a error.</li>
                                <li>No infringe derechos de propiedad intelectual, industrial, imagen, privacidad, confidencialidad o cualquier otro derecho de terceros.</li>
                                <li>No incumple obligaciones legales, contractuales, regulatorias o administrativas.</li>
                                <li>Puede ser almacenado, procesado, mostrado, reproducido y utilizado por Mobius para fines operativos vinculados con el funcionamiento del Portal.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Usuario otorga a Mobius una licencia no exclusiva, mundial, gratuita, sublicenciable y vigente por el
                                tiempo necesario para operar el Portal y sus servicios, para usar, alojar, almacenar, reproducir, adaptar,
                                formatear, comunicar, mostrar y distribuir el Contenido de Usuario únicamente para fines relacionados con
                                la operación, mejora, soporte, seguridad, cumplimiento, promoción del servicio ofrecido por el propio
                                Usuario dentro del Portal y atención de controversias o requerimientos de autoridad, siempre sujeto al
                                Aviso de Privacidad y a la legislación aplicable.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Mobius no adquiere la propiedad del Contenido de Usuario por el solo hecho de que éste sea cargado o
                                publicado en el Portal.
                            </p>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">9. Disponibilidad, Cambios y Funcionalidades del Portal</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius podrá en cualquier momento, con o sin previo aviso cuando la naturaleza del caso lo permita:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Modificar, actualizar, mejorar, suspender, limitar, descontinuar o reemplazar parcial o totalmente el Portal o cualquiera de sus funcionalidades.</li>
                                <li>Corregir errores, inconsistencias, fallas, vulnerabilidades o incidencias técnicas.</li>
                                <li>Incorporar nuevas herramientas, validaciones, restricciones, servicios o integraciones.</li>
                                <li>Establecer límites de uso, elegibilidad, cobertura geográfica, categorías de usuario, métodos de pago, validaciones documentales o requisitos técnicos.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius no garantiza que el Portal operará de forma ininterrumpida, libre de errores, segura en todo
                                momento o compatible con todos los dispositivos, sistemas operativos, redes o navegadores.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Cuando sea razonablemente posible, Mobius procurará informar cambios materiales que afecten de forma
                                sustancial el uso de la Cuenta o de los Servicios del Portal. No obstante, el Usuario reconoce que
                                ciertas modificaciones podrán implementarse por razones de seguridad, mantenimiento, cumplimiento
                                normativo, continuidad operativa o prevención de fraude sin previo aviso.
                            </p>
                        </section>

                        {/* 10 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">10. Servicios de Terceros</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Portal puede contener integraciones, enlaces, pasarelas, contenidos, APIs, herramientas, servicios,
                                plataformas o funcionalidades provistas por terceros.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius no controla ni garantiza los servicios, contenidos, políticas, disponibilidad, seguridad,
                                legalidad, exactitud, calidad, tiempos, actos u omisiones de terceros. El acceso o utilización de
                                Servicios de Terceros podrá estar sujeto a términos, políticas y condiciones independientes de dichos terceros.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Sin perjuicio de lo anterior, cuando un servicio ofrecido a través del Portal sea efectivamente prestado
                                por un tercero, el Usuario reconoce que la responsabilidad primaria por la prestación material del
                                servicio corresponderá al tercero que lo ejecute, sin perjuicio de las obligaciones propias que
                                expresamente asuma Mobius en la documentación aplicable.
                            </p>
                        </section>

                        {/* 11 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">11. Pagos, Cargos, Impuestos y Procesadores</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Algunas funcionalidades del Portal pueden implicar pagos, comisiones, cargos, tarifas,
                                contraprestaciones, depósitos, penalizaciones, reembolsos, retenciones, dispersión de fondos o costos
                                adicionales. Tales conceptos podrán depender del servicio específico, del rol del Usuario, de los
                                Términos Particulares aplicables y de la información mostrada al momento de la operación.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Cuando corresponda, el Usuario autoriza a Mobius y/o a los proveedores de procesamiento de pagos
                                designados por Mobius a efectuar cargos en los medios de pago proporcionados por el Usuario por los
                                montos expresamente aceptados durante la operación correspondiente.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">El Usuario será responsable de:</p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Proporcionar métodos de pago válidos, suficientes y de su titularidad o debidamente autorizados.</li>
                                <li>Mantener actualizada la información de pago y facturación.</li>
                                <li>Cubrir los impuestos, contribuciones, derechos, retenciones o cargas fiscales que le correspondan conforme a la legislación aplicable.</li>
                                <li>Abstenerse de promover contracargos improcedentes, reclamaciones fraudulentas o reversos abusivos.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius podrá retener, compensar, rechazar, suspender o revertir operaciones cuando exista sospecha
                                razonable de fraude, error, duplicidad, uso indebido, incumplimiento contractual, disputa activa,
                                requerimiento de autoridad o riesgo financiero u operativo.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Las reglas específicas de cobro, confirmación, dispersión, reembolso, cancelación y penalizaciones
                                aplicables a operaciones o roles determinados se establecerán en los Términos Particulares correspondientes.
                            </p>
                        </section>

                        {/* 12 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">12. No Garantía de Disponibilidad ni de Resultados</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                El Portal y los Servicios del Portal se proporcionan en el estado en que se encuentran y según disponibilidad.
                                En la máxima medida permitida por la ley aplicable, Mobius no garantiza que:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>El Portal estará disponible en todo momento o sin interrupciones.</li>
                                <li>El Portal estará libre de errores, virus, vulnerabilidades o fallas.</li>
                                <li>El uso del Portal generará resultados, reservas, ingresos, conversiones, ventas, disponibilidad, compatibilidad o beneficios económicos específicos para el Usuario.</li>
                                <li>La información mostrada por terceros en el Portal sea exacta, completa, actualizada o suficiente para una decisión concreta.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed">
                                El Usuario reconoce que cualquier decisión comercial, operativa, personal, patrimonial o de cualquier
                                otra naturaleza tomada con base en información obtenida del Portal será bajo su propia responsabilidad.
                            </p>
                        </section>

                        {/* 13 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">13. Propiedad Intelectual e Industrial</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Todos los derechos de propiedad intelectual e industrial sobre el Portal, incluyendo sin limitar software,
                                código, diseño, arquitectura, interfaces, bases de datos, compilaciones, textos, logotipos, marcas,
                                nombres comerciales, avisos comerciales, diseños, funcionalidades, imágenes, contenido propio, material
                                audiovisual y demás elementos que integran el Portal, son propiedad de Mobius o de sus licenciantes y se
                                encuentran protegidos por la legislación aplicable.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Salvo autorización previa y por escrito de Mobius, el Usuario no podrá reproducir, distribuir, comunicar
                                públicamente, transformar, adaptar, descompilar, explotar o utilizar dichos elementos para fines
                                distintos a los expresamente permitidos por estos TyC Generales.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Nada de lo previsto en estos TyC Generales se interpretará como cesión, licencia o transmisión de
                                derecho alguno en favor del Usuario, salvo el derecho limitado, revocable, no exclusivo, no
                                sublicenciable e intransferible de acceder y usar el Portal conforme a su finalidad autorizada.
                            </p>
                        </section>

                        {/* 14 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">14. Privacidad, Datos Personales y Cookies</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El tratamiento de datos personales realizado por Mobius se rige por el{" "}
                                <a href="/privacidad" className="text-primary underline">Aviso de Privacidad</a>{" "}
                                vigente, el cual forma parte integrante de estos TyC Generales por referencia.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Al utilizar el Portal, el Usuario reconoce que ha puesto o tendrá a su disposición el Aviso de Privacidad
                                aplicable y que ha sido informado de las características principales del tratamiento de sus datos personales.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                El Portal puede utilizar cookies, etiquetas, píxeles, SDKs, identificadores de sesión, almacenamiento
                                local y tecnologías similares para fines técnicos, operativos, analíticos, de seguridad, autenticación,
                                personalización, continuidad de sesión, medición, prevención de fraude y mejora del servicio. El Usuario
                                podrá gestionar ciertas preferencias mediante las herramientas del propio Portal o de su navegador, sin
                                perjuicio de que la desactivación de determinadas tecnologías pueda afectar la funcionalidad del Portal.
                            </p>
                        </section>

                        {/* 15 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">15. Comunicaciones y Notificaciones</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Usuario acepta que Mobius pueda enviarle comunicaciones, avisos, requerimientos, alertas de
                                seguridad, mensajes transaccionales, actualizaciones legales, operativas o administrativas,
                                comprobantes, recordatorios, notificaciones de cuenta, mensajes de soporte y otras comunicaciones
                                relacionadas con el Portal a través de correo electrónico, notificaciones dentro del Portal, mensajes
                                SMS, mensajería instantánea, llamadas, notificaciones push o cualquier otro medio de contacto
                                proporcionado por el Usuario o habilitado en la Cuenta.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Las notificaciones se tendrán por válidamente realizadas cuando sean enviadas a los datos de contacto
                                registrados por el Usuario en su Cuenta o a través del Portal.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Es responsabilidad del Usuario mantener actualizada su información de contacto y revisar periódicamente
                                los avisos publicados o enviados por Mobius.
                            </p>
                        </section>

                        {/* 16 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">16. Suspensión, Restricción y Terminación</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius podrá, a su sola discreción razonable y sin asumir responsabilidad frente al Usuario, suspender,
                                restringir, bloquear, cancelar o dar de baja la Cuenta o el acceso al Portal, de forma temporal o
                                definitiva, cuando:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Exista incumplimiento real o presunto de estos TyC Generales o de los Términos Particulares aplicables.</li>
                                <li>La información o documentación proporcionada sea falsa, inexacta, insuficiente, inconsistente o no verificable.</li>
                                <li>Existan indicios de fraude, suplantación, lavado de dinero, actividad inusual, contracargos abusivos, manipulación, abuso del sistema o riesgos de cumplimiento.</li>
                                <li>Sea necesario para proteger a Mobius, a otros Usuarios, a terceros o al propio Portal.</li>
                                <li>Exista requerimiento, orden, recomendación o investigación de autoridad competente.</li>
                                <li>El Usuario utilice el Portal de forma contraria a la ley, al orden público o a la finalidad del servicio.</li>
                                <li>Mobius decida descontinuar total o parcialmente el Portal o determinada categoría de servicio.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed mb-3">
                                La suspensión o terminación de la Cuenta no extinguirá las obligaciones pendientes del Usuario ni los
                                derechos de Mobius generados con anterioridad a dicha medida.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                El Usuario podrá solicitar la cancelación de su Cuenta a través de los canales habilitados por Mobius,
                                sin perjuicio de que Mobius deba conservar determinada información por periodos de retención legal,
                                seguridad, cumplimiento, auditoría o atención de controversias.
                            </p>
                        </section>

                        {/* 17 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">17. Indemnización</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Usuario se obliga a sacar en paz y a salvo e indemnizar a Mobius, sus afiliadas, subsidiarias,
                                controladoras, accionistas, directivos, representantes, empleados, asesores, proveedores tecnológicos y
                                cesionarios, frente a cualquier reclamación, acción, procedimiento, daño, pérdida, responsabilidad,
                                multa, sanción, costo o gasto, incluyendo honorarios razonables de abogados, que deriven de o se
                                relacionen con:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2">
                                <li>El uso del Portal por parte del Usuario.</li>
                                <li>El incumplimiento de estos TyC Generales o de los Términos Particulares aplicables.</li>
                                <li>La información, documentación o Contenido de Usuario proporcionado por el Usuario.</li>
                                <li>La violación de derechos de terceros.</li>
                                <li>Conductas fraudulentas, ilícitas o negligentes del Usuario.</li>
                                <li>Cualquier disputa entre el Usuario y otro usuario o tercero en la que Mobius sea llamado, implicado o afectado con motivo del uso del Portal.</li>
                            </ol>
                        </section>

                        {/* 18 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">18. Limitación de Responsabilidad</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                En la máxima medida permitida por la legislación aplicable, Mobius no será responsable por daños
                                indirectos, incidentales, especiales, consecuenciales, punitivos o lucro cesante, pérdida de
                                oportunidad, pérdida de ingresos, pérdida de datos, daño reputacional o interrupción de negocio
                                derivados del acceso, uso o imposibilidad de uso del Portal.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                La responsabilidad acumulada total de Mobius frente a un Usuario, por cualquier causa de acción
                                relacionada con estos TyC Generales o con el uso del Portal, no excederá del monto efectivamente pagado
                                por dicho Usuario directamente a Mobius por el servicio específico que haya dado origen a la
                                reclamación durante los seis meses inmediatos anteriores al hecho reclamado o, si no hubo pago directo
                                a Mobius, de la cantidad de{" "}
                                <strong>$5,000.00 MXN</strong>.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Nada de lo anterior limitará la responsabilidad de Mobius en aquellos casos en que dicha limitación no
                                sea válida o sea irrenunciable conforme a la legislación aplicable.
                            </p>
                        </section>

                        {/* 19 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">19. Relación entre las Partes</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Nada de lo previsto en estos TyC Generales se interpretará como constitutivo de sociedad, asociación,
                                joint venture, agencia, mandato, relación laboral, representación legal, franquicia o relación
                                fiduciaria entre Mobius y el Usuario, salvo pacto expreso por escrito suscrito por representantes autorizados.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                El uso del Portal no confiere al Usuario facultad alguna para actuar en nombre de Mobius ni para asumir
                                obligaciones por su cuenta.
                            </p>
                        </section>

                        {/* 20 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">20. Cesión</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El Usuario no podrá ceder, transferir, delegar ni gravar sus derechos u obligaciones derivados de estos
                                TyC Generales sin autorización previa y por escrito de Mobius.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Mobius podrá ceder o transferir total o parcialmente sus derechos y obligaciones derivados de estos TyC
                                Generales a cualquier afiliada, subsidiaria, adquirente, fusionante, cesionario, vehículo corporativo o
                                tercero relacionado con una reorganización, financiamiento, compraventa de activos, cesión de cartera,
                                fusión o escisión, siempre que ello no implique una reducción ilícita de los derechos irrenunciables del Usuario.
                            </p>
                        </section>

                        {/* 21 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">21. Modificaciones a estos Términos</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius podrá modificar, actualizar o sustituir estos TyC Generales en cualquier momento.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Cuando las modificaciones sean materiales, Mobius procurará comunicarlo al Usuario a través del Portal,
                                por correo electrónico o por cualquier otro medio de contacto disponible. La versión vigente será la
                                publicada en el Portal con su fecha de última actualización.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El acceso o uso continuado del Portal con posterioridad a la entrada en vigor de las modificaciones
                                constituirá aceptación de la versión actualizada, salvo que la ley aplicable exija una aceptación
                                adicional expresa para determinados cambios.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Si el Usuario no está de acuerdo con una modificación, deberá dejar de utilizar el Portal y, en su caso,
                                solicitar la cancelación de su Cuenta.
                            </p>
                        </section>

                        {/* 22 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">22. Nulidad Parcial y No Renuncia</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Si cualquier disposición de estos TyC Generales se considera inválida, ilegal, nula o inexigible por
                                autoridad competente, dicha disposición se interpretará o ajustará, en la medida de lo posible, de forma
                                consistente con la intención original y el resto de las disposiciones permanecerá en pleno vigor y efecto.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                La falta de ejercicio o demora por parte de Mobius en el ejercicio de cualquier derecho o facultad
                                prevista en estos TyC Generales no constituirá renuncia a los mismos.
                            </p>
                        </section>

                        {/* 23 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">23. Idioma</h2>
                            <p className="text-text/80 leading-relaxed">
                                Estos TyC Generales podrán ponerse a disposición del Usuario en idioma español y, en su caso, en
                                versiones de cortesía en otros idiomas. En caso de discrepancia, ambigüedad o conflicto de
                                interpretación, prevalecerá la versión en español.
                            </p>
                        </section>

                        {/* 24 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">24. Ley Aplicable y Jurisdicción</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Estos TyC Generales se regirán e interpretarán conforme a las leyes federales aplicables de los Estados
                                Unidos Mexicanos.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Para la interpretación, cumplimiento y ejecución de estos TyC Generales, el Usuario y Mobius se someten
                                a la jurisdicción de los tribunales competentes de San Pedro Garza García, Nuevo León, renunciando a
                                cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros o por
                                cualquier otra causa, salvo que la legislación aplicable otorgue al consumidor un derecho irrenunciable distinto.
                            </p>
                        </section>

                        {/* 25 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">25. Orden de Prelación Documental</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Salvo disposición expresa en contrario, los documentos contractuales aplicables entre Mobius y el
                                Usuario se interpretarán en el siguiente orden de prelación:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2">
                                <li>El flujo transaccional específico, pantalla de confirmación o documento particular aceptado para una operación concreta.</li>
                                <li>Los Términos Particulares aplicables al rol o servicio específico.</li>
                                <li>Las políticas específicas de pagos, cancelaciones, reembolsos, promociones o cumplimiento que resulten aplicables.</li>
                                <li>El Aviso de Privacidad respecto del tratamiento de datos personales.</li>
                                <li>Estos TyC Generales.</li>
                            </ol>
                        </section>

                        {/* 26 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">26. Contacto</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Para cualquier aclaración, comentario, duda, reclamación, solicitud relacionada con la Cuenta o consulta
                                sobre estos TyC Generales, el Usuario podrá escribir a:
                            </p>
                            <div className="bg-text/5 rounded-xl p-5 border border-text/10">
                                <p className="text-text/70">
                                    <a href="mailto:contacto@mobiusfly.com" className="text-primary underline font-medium">contacto@mobiusfly.com</a>
                                </p>
                            </div>
                        </section>

                        {/* Closing note */}
                        <div className="border-t border-text/10 pt-8">
                            <p className="text-text/60 text-sm leading-relaxed">
                                Al crear una Cuenta o continuar usando el Portal, el Usuario reconoce que ha leído y aceptado estos
                                Términos y Condiciones Generales de Uso de Mobius Fly.
                            </p>
                        </div>
                    </div>
                </main>

                <FooterSection sectionPadding={sectionPadding} onScrollToSection={() => {}} />
            </div>
        </LazyMotion>
    );
}
