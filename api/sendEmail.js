import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { clientEmail, clientName, professionalName, serviceName, date, time } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: clientEmail,
    subject: "Confirmación de Cita - Podología Marta",
    html: `
      <p>Hola ${clientName},</p>
      <p>Se ha agendado una <strong>CITA</strong> en Podología Marta para:</p>
      <ul>
        <li>Profesional: ${professionalName}</li>
        <li>Servicio: ${serviceName}</li>
        <li>Fecha: ${date}</li>
        <li>Hora: ${time}</li>
      </ul>
      <p>¡Gracias!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
