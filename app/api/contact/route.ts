import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userType, name, email, phone, message } = body;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo contacto - Mobius Fly</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'SF Pro Text', -apple-system, sans-serif; background-color: #F6F6F4;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F6F4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color: #C4A77D; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 600; letter-spacing: -0.02em;">
                Mobius Fly
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 24px 0; color: #39424E; font-size: 24px; font-weight: 500; letter-spacing: -0.01em;">
                Nuevo contacto recibido
              </h2>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #E0E0DE;">
                    <p style="margin: 0 0 4px 0; color: #39424E; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6;">
                      Tipo de usuario
                    </p>
                    <p style="margin: 0; color: #39424E; font-size: 16px; font-weight: 500;">
                      ${userType === "reservar" ? "Reservar un vuelo" : "Administrar mis vuelos"}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #E0E0DE;">
                    <p style="margin: 0 0 4px 0; color: #39424E; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6;">
                      Nombre
                    </p>
                    <p style="margin: 0; color: #39424E; font-size: 16px; font-weight: 500;">
                      ${name}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #E0E0DE;">
                    <p style="margin: 0 0 4px 0; color: #39424E; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6;">
                      Correo
                    </p>
                    <p style="margin: 0; color: #C4A77D; font-size: 16px; font-weight: 500;">
                      <a href="mailto:${email}" style="color: #C4A77D; text-decoration: none;">
                        ${email}
                      </a>
                    </p>
                  </td>
                </tr>

                ${
                  phone
                    ? `
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #E0E0DE;">
                    <p style="margin: 0 0 4px 0; color: #39424E; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6;">
                      Teléfono
                    </p>
                    <p style="margin: 0; color: #39424E; font-size: 16px; font-weight: 500;">
                      ${phone}
                    </p>
                  </td>
                </tr>
                `
                    : ""
                }

                ${
                  message
                    ? `
                <tr>
                  <td style="padding: 16px 0;">
                    <p style="margin: 0 0 8px 0; color: #39424E; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6;">
                      Mensaje
                    </p>
                    <p style="margin: 0; color: #39424E; font-size: 15px; font-weight: 400; line-height: 1.6; white-space: pre-line;">
                      ${message.trim()}
                    </p>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #F6F6F4; text-align: center;">
              <p style="margin: 0; color: #39424E; font-size: 14px; opacity: 0.7;">
                Este mensaje fue enviado desde el formulario de contacto de Mobius Fly
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@amoxtli.tech",
      to: process.env.CONTACT_EMAIL || "contact@amoxtli.tech",
      subject: `Nuevo contacto de ${name} - Mobius Fly`,
      html: htmlContent,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
