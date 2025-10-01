// /api/sendEmail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clientEmail, clientName, professionalName, serviceName, date, time } = req.body;

  if (!clientEmail || !clientName || !professionalName || !serviceName || !date || !time) {
    return res.status(400).json({ error: "Faltan datos para enviar el correo" });
  }

  // Configuración de Nodemailer usando Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,       // Tu correo Gmail
      pass: process.env.GMAIL_APP_PASS,   // Contraseña de aplicación
    },
  });

  // Contenido del correo
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: clientEmail,
    subject: "Confirmación de Cita - Podología Marta",
    html: `
      <p>Hola ${clientName},</p>
      <p>Se ha agendado una <strong>CITA</strong> en Podología Marta:</p>
      <ul>
        <li>Profesional: ${professionalName}</li>
        <li>Servicio: ${serviceName}</li>
        <li>Fecha: ${date}</li>
        <li>Hora: ${time}</li>
      </ul>
      <p>¡Gracias por preferirnos!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error enviando email:", err);
    res.status(500).json({ error: err.message });
  }
}
