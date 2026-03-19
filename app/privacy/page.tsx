"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/organisms/AppNavbar";
import { FooterSection } from "@/app/sections/FooterSection";

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

export default function PrivacidadPage() {
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
                            Aviso de Privacidad Integral
                        </h1>
                        <p className="mt-4 text-text/60 text-base">
                            Mobius Fly, S.A. de C.V. · Ignacio Morones Prieto 3050, Col. Del Carmen, San Pedro Garza García, Nuevo León, C.P. 64710, México.
                        </p>
                    </div>
                </header>

                {/* Intro */}
                <section className={`${sectionPadding} pt-10`}>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-text/80 leading-relaxed mb-4">
                            En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares,
                            su Reglamento y demás disposiciones aplicables, Mobius Fly, S.A. de C.V. (&ldquo;Mobius&rdquo;, la &ldquo;Empresa&rdquo;,
                            &ldquo;nosotros&rdquo; o &ldquo;nuestro&rdquo;), con domicilio en Ignacio Morones Prieto 3050, Col. Del Carmen, San Pedro
                            Garza García, Nuevo León, C.P. 64710, México, pone a su disposición el presente Aviso de Privacidad Integral.
                        </p>
                        <p className="text-text/80 leading-relaxed">
                            El presente aviso aplica a las personas físicas que accedan, naveguen, se registren, interactúen, contraten,
                            publiquen, soliciten información, realicen reservas, administren vuelos, gestionen una cuenta o utilicen de
                            cualquier forma el sitio web, aplicaciones, interfaces, herramientas, software y servicios digitales
                            identificados con el dominio mobiusfly.com y sus subdominios o medios digitales relacionados (el &ldquo;Portal&rdquo;).
                        </p>
                    </div>
                </section>

                {/* Sections */}
                <main className={`${sectionPadding} pb-16 flex-1`}>
                    <div className="max-w-3xl mx-auto space-y-12">

                        {/* 1 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">1. Responsable del Tratamiento de sus Datos Personales</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                El responsable del tratamiento de sus datos personales es Mobius Fly, S.A. de C.V.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Para cualquier asunto relacionado con el tratamiento de sus datos personales, así como para ejercer sus
                                derechos de acceso, rectificación, cancelación u oposición (Derechos ARCO), revocar su consentimiento,
                                limitar el uso o divulgación de sus datos o realizar consultas sobre este aviso, podrá contactar a nuestro:
                            </p>
                            <div className="bg-text/5 rounded-xl p-5 border border-text/10">
                                <p className="font-medium mb-1">Departamento de Privacidad y Datos Personales</p>
                                <p className="text-text/70">Correo electrónico: <a href="mailto:contacto@mobiusfly.com" className="text-primary underline">contacto@mobiusfly.com</a></p>
                            </div>
                            <p className="text-text/80 leading-relaxed mt-3">
                                Mobius podrá habilitar en el Portal formularios, centros de ayuda u otros canales complementarios para la
                                atención de solicitudes relacionadas con datos personales. En caso de discrepancia, prevalecerá lo previsto
                                en este Aviso de Privacidad.
                            </p>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">2. Datos Personales que Podemos Recabar</h2>
                            <p className="text-text/80 leading-relaxed mb-6">
                                Mobius podrá recabar, directa o indirectamente, según el tipo de interacción, servicio, rol del usuario y
                                momento de la relación, las siguientes categorías de datos personales:
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium text-text mb-2">a) Datos de identificación</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Nombre completo</li>
                                        <li>Fecha de nacimiento</li>
                                        <li>Nacionalidad</li>
                                        <li>Firma autógrafa o electrónica, cuando corresponda</li>
                                        <li>Imagen contenida en identificaciones oficiales o documentos proporcionados por usted</li>
                                        <li>Datos contenidos en documentos oficiales de identificación, según corresponda</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">b) Datos de contacto</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Correo electrónico</li>
                                        <li>Número telefónico</li>
                                        <li>Domicilio</li>
                                        <li>Ciudad, estado y país</li>
                                        <li>Medios de contacto adicionales que usted proporcione</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">c) Datos de cuenta y autenticación</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Usuario</li>
                                        <li>Contraseña cifrada o elementos de autenticación</li>
                                        <li>Historial de inicio de sesión</li>
                                        <li>Configuraciones de cuenta</li>
                                        <li>Preferencias de contacto y uso de la plataforma</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">d) Datos transaccionales, operativos y de uso del servicio</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Información relacionada con solicitudes, reservas, publicaciones, listados, operaciones, cancelaciones, reembolsos, incidencias, soporte y comunicaciones dentro del Portal</li>
                                        <li>Historial de interacción con el Portal</li>
                                        <li>Información sobre vuelos, trayectos, solicitudes, disponibilidad y transacciones vinculadas con su uso del servicio</li>
                                        <li>Datos relacionados con la coordinación operativa de un servicio solicitado o publicado en el Portal</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">e) Datos de facturación y fiscales</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Razón social</li>
                                        <li>RFC</li>
                                        <li>Domicilio fiscal</li>
                                        <li>Uso de CFDI, régimen fiscal u otros datos necesarios para facturación, cuando aplique</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">f) Datos patrimoniales y/o financieros</h3>
                                    <p className="text-text/80 leading-relaxed mb-2">
                                        Dependiendo del servicio utilizado y del rol que desempeñe dentro del Portal, Mobius podrá recabar o
                                        tratar datos patrimoniales y/o financieros, tales como:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Datos de cuenta bancaria, CLABE u otros datos para dispersión o recepción de pagos</li>
                                        <li>Información relacionada con métodos de pago</li>
                                        <li>Información sobre cobros, pagos, reembolsos, comisiones, contracargos o validaciones financieras</li>
                                    </ul>
                                    <p className="text-text/70 text-sm mt-3 italic">
                                        Importante: cuando el tratamiento de datos patrimoniales y/o financieros requiera consentimiento
                                        expreso conforme a la legislación aplicable, Mobius recabará dicho consentimiento a través de los
                                        mecanismos habilitados para ello.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">g) Datos técnicos y de navegación</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Dirección IP</li>
                                        <li>Tipo de navegador</li>
                                        <li>Sistema operativo</li>
                                        <li>Identificadores de dispositivo</li>
                                        <li>Datos de sesión</li>
                                        <li>Fecha, hora y duración de acceso</li>
                                        <li>Páginas visitadas, clics, eventos de navegación e información técnica generada por el uso del Portal</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">h) Datos derivados de atención y soporte</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text/75 pl-2">
                                        <li>Contenido de mensajes, aclaraciones, reportes, solicitudes y comunicaciones que usted mantenga con Mobius</li>
                                        <li>Evidencia documental que usted remita para resolver incidencias, reclamaciones o verificaciones</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-text mb-2">i) Datos de terceros proporcionados por usted</h3>
                                    <p className="text-text/80 leading-relaxed">
                                        Cuando usted proporcione datos personales de terceros a Mobius, declara contar con la autorización
                                        necesaria para compartirlos y reconoce que es su obligación informarles sobre el tratamiento
                                        correspondiente, cuando legalmente proceda.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">3. Datos Personales Sensibles</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Como regla general, Mobius no solicita ni trata datos personales sensibles.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                En caso de que, por la naturaleza de un servicio específico, una obligación legal, un requerimiento
                                operativo excepcional o una incidencia concreta, resulte estrictamente necesario tratar datos personales
                                sensibles, Mobius lo informará de manera específica y recabará el consentimiento expreso correspondiente
                                cuando así lo exija la legislación aplicable.
                            </p>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">4. Finalidades Primarias del Tratamiento</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Los datos personales que recabamos serán utilizados para las finalidades primarias que son necesarias
                                para la existencia, mantenimiento y cumplimiento de la relación jurídica entre usted y Mobius, incluyendo:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2">
                                <li>Identificarle y autenticarle dentro del Portal.</li>
                                <li>Crear, administrar, mantener, actualizar y proteger su cuenta.</li>
                                <li>Permitir el acceso y uso de las funcionalidades del Portal.</li>
                                <li>Atender solicitudes de información, soporte, aclaraciones, incidencias, quejas o reclamaciones.</li>
                                <li>Gestionar publicaciones, reservas, solicitudes, operaciones, transacciones o interacciones realizadas a través del Portal.</li>
                                <li>Coordinar, facilitar, documentar y dar seguimiento operativo y administrativo a los servicios solicitados, publicados o gestionados mediante el Portal.</li>
                                <li>Verificar información, validar identidad, prevenir fraude, suplantación, contracargos improcedentes, lavado de dinero, actividades ilícitas o riesgos de cumplimiento.</li>
                                <li>Procesar cobros, pagos, reembolsos, comisiones, dispersión de fondos y gestiones relacionadas con medios de pago, directa o indirectamente a través de terceros autorizados.</li>
                                <li>Emitir facturas, comprobantes, reportes, constancias y documentación administrativa o fiscal que resulte aplicable.</li>
                                <li>Dar cumplimiento a obligaciones legales, regulatorias, contractuales, de seguridad, de auditoría o derivadas de requerimientos de autoridad competente.</li>
                                <li>Mantener registros, bitácoras, evidencia y trazabilidad técnica, operativa y contractual del uso del Portal.</li>
                                <li>Mejorar la seguridad, estabilidad, funcionamiento, soporte, monitoreo y continuidad operativa del Portal.</li>
                                <li>Realizar análisis internos, estadísticos, operativos, de riesgo, desempeño, calidad y mejora del servicio, utilizando cuando sea posible información agregada o disociada.</li>
                            </ol>
                            <p className="text-text/70 text-sm mt-4 italic">
                                Si usted no desea que sus datos sean tratados para aquellas finalidades que no son necesarias para la
                                relación jurídica, podrá manifestarlo conforme a lo previsto en la sección de Finalidades Secundarias y en
                                la sección de Opciones y medios para limitar el uso o divulgación.
                            </p>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">5. Finalidades Secundarias del Tratamiento</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                De manera adicional, y únicamente cuando resulte aplicable, Mobius podrá tratar sus datos personales
                                para las siguientes finalidades secundarias, que no son necesarias para la relación jurídica principal:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2">
                                <li>Enviarle comunicaciones comerciales, informativas, promocionales o publicitarias sobre productos, servicios, beneficios, alianzas, novedades o campañas de Mobius.</li>
                                <li>Invitarle a participar en encuestas, estudios de satisfacción, investigaciones de mercado, dinámicas promocionales o programas piloto.</li>
                                <li>Elaborar perfiles comerciales o de uso para fines de personalización básica, segmentación o mejora comercial del servicio.</li>
                                <li>Informarle sobre eventos, contenidos, recomendaciones, alianzas o iniciativas relacionadas con Mobius.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed mt-4">
                                Usted puede oponerse al tratamiento de sus datos para estas finalidades secundarias desde este momento
                                o en cualquier momento posterior, enviando un correo a{" "}
                                <a href="mailto:contacto@mobiusfly.com" className="text-primary underline">contacto@mobiusfly.com</a>{" "}
                                con el asunto &ldquo;Negativa a finalidades secundarias&rdquo; e indicando su nombre completo, correo asociado a su
                                cuenta y la solicitud específica. Su negativa no afectará las finalidades primarias ni la prestación de
                                los servicios que dependan de ellas.
                            </p>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">6. Opciones y Medios para Limitar el Uso o Divulgación de sus Datos Personales</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Usted podrá limitar el uso o divulgación de sus datos personales mediante:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>El envío de un correo electrónico a <a href="mailto:contacto@mobiusfly.com" className="text-primary underline">contacto@mobiusfly.com</a>.</li>
                                <li>La actualización de ciertas preferencias disponibles dentro de su cuenta o del Portal, cuando dicha funcionalidad esté habilitada.</li>
                                <li>La solicitud expresa de inscripción en nuestros listados de exclusión para finalidades secundarias, cuando proceda.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed">
                                Para atender su solicitud, deberá proporcionar al menos: nombre completo, correo electrónico vinculado
                                a su cuenta o medio de identificación suficiente, descripción clara de la limitación solicitada y, en su
                                caso, documentación que permita acreditar su identidad o representación legal.
                            </p>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">7. Medios para Ejercer sus Derechos ARCO</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Usted, o su representante legal debidamente acreditado, podrá ejercer sus Derechos ARCO respecto de los
                                datos personales que obren en posesión de Mobius.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Para ello, deberá enviar una solicitud al correo{" "}
                                <a href="mailto:contacto@mobiusfly.com" className="text-primary underline">contacto@mobiusfly.com</a>{" "}
                                con el asunto &ldquo;Solicitud ARCO&rdquo;, adjuntando o incluyendo al menos:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Nombre completo del titular.</li>
                                <li>Correo electrónico, domicilio u otro medio para comunicar la respuesta.</li>
                                <li>Documentos que acrediten su identidad o, en su caso, la representación legal.</li>
                                <li>Descripción clara y precisa de los datos personales respecto de los cuales desea ejercer algún derecho.</li>
                                <li>Indicación expresa del derecho que desea ejercer: acceso, rectificación, cancelación u oposición.</li>
                                <li>En caso de rectificación, las modificaciones a realizar y la documentación que sustente su petición.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed">
                                Si la solicitud es incompleta o requiere aclaraciones, Mobius podrá requerir información adicional dentro
                                de los plazos legales aplicables. Mobius dará trámite a las solicitudes presentadas conforme a la
                                legislación aplicable y comunicará la determinación correspondiente a través del medio señalado por el titular.
                            </p>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">8. Revocación del Consentimiento</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Usted podrá revocar, en cualquier momento, el consentimiento que haya otorgado para el tratamiento de
                                sus datos personales, siempre que dicha revocación no impida el cumplimiento de obligaciones legales,
                                regulatorias, contractuales, de seguridad o la continuidad de tratamientos necesarios para la relación
                                jurídica vigente.
                            </p>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Para ello, deberá enviar su solicitud a{" "}
                                <a href="mailto:contacto@mobiusfly.com" className="text-primary underline">contacto@mobiusfly.com</a>{" "}
                                con el asunto &ldquo;Revocación de consentimiento&rdquo;, acompañando la información necesaria para acreditar su
                                identidad y detallar el alcance de su solicitud.
                            </p>
                            <p className="text-text/70 text-sm italic">La revocación del consentimiento no tendrá efectos retroactivos.</p>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">9. Transferencia de Datos Personales</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Mobius podrá transferir o compartir sus datos personales con terceros nacionales o extranjeros en los
                                supuestos permitidos por la legislación aplicable y conforme a este Aviso de Privacidad.
                            </p>

                            <h3 className="font-medium text-text mb-2">Transferencias que pueden resultar necesarias para las finalidades primarias</h3>
                            <p className="text-text/80 leading-relaxed mb-3">Sus datos personales podrán ser compartidos, según corresponda, con:</p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-6">
                                <li>Proveedores tecnológicos, de infraestructura, hospedaje, almacenamiento, soporte, mensajería, analítica, atención y seguridad, que actúen por cuenta de Mobius.</li>
                                <li>Procesadores, agregadores, instituciones o intermediarios de pago y herramientas de prevención de fraude.</li>
                                <li>Propietarios, operadores, administradores, prestadores de servicios o contrapartes involucradas en una solicitud, reserva, publicación, operación o servicio gestionado a través del Portal, en la medida necesaria para su ejecución.</li>
                                <li>Asesores profesionales de Mobius, incluyendo asesores legales, contables, fiscales, auditores o administradores de riesgos, cuando ello sea necesario.</li>
                                <li>Autoridades competentes cuando exista obligación legal, requerimiento fundado o mandato de autoridad.</li>
                                <li>Sociedades controladoras, subsidiarias, afiliadas o vinculadas de Mobius, cuando ello sea necesario para finalidades administrativas internas, continuidad operativa, soporte, cumplimiento o gestión corporativa, en términos de la legislación aplicable.</li>
                            </ol>

                            <h3 className="font-medium text-text mb-2">Transferencias sujetas a consentimiento</h3>
                            <p className="text-text/80 leading-relaxed mb-4">
                                En caso de que Mobius pretenda realizar transferencias de datos personales que requieran su
                                consentimiento conforme a la legislación aplicable y que no se ubiquen en alguno de los supuestos de
                                excepción legal, dicho consentimiento le será solicitado por separado a través de los mecanismos correspondientes.
                            </p>

                            <h3 className="font-medium text-text mb-2">Encargados</h3>
                            <p className="text-text/80 leading-relaxed">
                                Los terceros que actúen por cuenta de Mobius como encargados del tratamiento únicamente tratarán sus
                                datos conforme a las instrucciones de Mobius, bajo medidas de confidencialidad y seguridad apropiadas,
                                y no para finalidades propias incompatibles.
                            </p>
                        </section>

                        {/* 10 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">10. Uso de Cookies, Web Beacons y Tecnologías Similares</h2>
                            <p className="text-text/80 leading-relaxed mb-4">
                                Mobius puede utilizar cookies, web beacons, píxeles, SDKs, almacenamiento local, identificadores de
                                sesión y tecnologías similares para:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-text/75 pl-2 mb-4">
                                <li>Recordar preferencias y mantener sesiones activas.</li>
                                <li>Facilitar la navegación y funcionamiento técnico del Portal.</li>
                                <li>Analizar tráfico, uso, rendimiento y comportamiento dentro del Portal.</li>
                                <li>Mejorar seguridad, prevenir fraude y detectar incidentes.</li>
                                <li>Personalizar ciertos contenidos o experiencias básicas de uso.</li>
                            </ol>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Estas tecnologías pueden recabar datos como dirección IP, tipo de navegador, sistema operativo, idioma,
                                páginas visitadas, duración de la sesión, rutas de navegación y eventos de interacción.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Usted puede configurar su navegador o dispositivo para bloquear, restringir o eliminar ciertas cookies o
                                tecnologías similares. Sin embargo, ello puede afectar el correcto funcionamiento del Portal.
                            </p>
                        </section>

                        {/* 11 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">11. Medidas de Seguridad</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius adopta medidas de seguridad administrativas, técnicas y físicas razonablemente necesarias para
                                proteger sus datos personales contra daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                No obstante, ningún sistema es absolutamente invulnerable. En caso de que ocurra una vulneración de
                                seguridad que afecte de forma significativa sus derechos patrimoniales o morales, Mobius le informará
                                conforme a la legislación aplicable.
                            </p>
                        </section>

                        {/* 12 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">12. Conservación de los Datos Personales</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius conservará sus datos personales únicamente durante el tiempo que resulte necesario para cumplir
                                con las finalidades descritas en este Aviso de Privacidad, así como para atender obligaciones legales,
                                regulatorias, fiscales, contractuales, de seguridad, auditoría, prevención de fraude, resolución de
                                controversias y conservación de evidencia.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Una vez concluido el periodo aplicable, sus datos serán eliminados, bloqueados, anonimizados o
                                conservados únicamente en la forma permitida por la legislación aplicable.
                            </p>
                        </section>

                        {/* 13 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">13. Cambios al Aviso de Privacidad</h2>
                            <p className="text-text/80 leading-relaxed mb-3">
                                Mobius podrá modificar, actualizar o reformar el presente Aviso de Privacidad en cualquier momento,
                                entre otras razones, por cambios legales, regulatorios, operativos, tecnológicos, comerciales o de
                                modelo de negocio.
                            </p>
                            <p className="text-text/80 leading-relaxed">
                                Cualquier cambio sustancial será dado a conocer a través del Portal, por correo electrónico, por medios
                                electrónicos asociados a su cuenta o por cualquier otro medio legalmente permitido. La fecha de última
                                actualización que aparece al inicio de este documento indicará la versión vigente.
                            </p>
                        </section>

                        {/* 14 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">14. Medio para Conocer el Aviso de Privacidad Integral</h2>
                            <p className="text-text/80 leading-relaxed">
                                El presente texto constituye el Aviso de Privacidad Integral de Mobius. Cuando Mobius recabe datos
                                personales por medios electrónicos, podrá poner a disposición del titular un aviso simplificado en el
                                punto de captura correspondiente, indicando el medio para consultar este documento integral.
                            </p>
                        </section>

                        {/* 15 */}
                        <section>
                            <h2 className="text-xl font-medium mb-4">15. Autoridad Competente</h2>
                            <p className="text-text/80 leading-relaxed">
                                Si usted considera que su derecho a la protección de datos personales ha sido lesionado por alguna
                                conducta u omisión de Mobius, o presume alguna violación a las disposiciones aplicables en la materia,
                                podrá acudir ante la autoridad competente en materia de protección de datos personales en México.
                            </p>
                        </section>

                        {/* Closing note */}
                        <div className="border-t border-text/10 pt-8">
                            <p className="text-text/60 text-sm leading-relaxed">
                                Al proporcionar sus datos personales, crear una cuenta, utilizar el Portal o continuar interactuando con
                                Mobius, usted reconoce haber leído el presente Aviso de Privacidad Integral y haber sido informado sobre
                                el tratamiento de sus datos personales en los términos aquí descritos.
                            </p>
                        </div>
                    </div>
                </main>

                <FooterSection sectionPadding={sectionPadding} onScrollToSection={() => {}} />
            </div>
        </LazyMotion>
    );
}
