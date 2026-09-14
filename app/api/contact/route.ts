import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildContactNotificationEmail } from "@/lib/emails/contact-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userType, name, email, phone, message } = body;

    const htmlContent = buildContactNotificationEmail({ userType, name, email, phone, message });

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@amoxtli.tech",
      to: process.env.CONTACT_EMAIL || "contact@amoxtli.tech",
      subject: `Nuevo contacto de ${name} - Mobius Fly`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
