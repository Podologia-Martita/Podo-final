import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { clientEmail, clientName, professionalName, serviceName, date, time } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS, // contraseña de app
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: clientEmail,
    subject: "Confirmación de cita - Podología Marta",
    html: `
      <p>Hola ${clientName},</p>
      <p>Tu cita con <strong>${professionalName}</strong> para <strong>${serviceName}</strong>
      el <strong>${date}</strong> a las <strong>${time}</strong> ha sido confirmada.</p>
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
