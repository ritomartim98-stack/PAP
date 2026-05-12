const { BrevoClient } = require('@getbrevo/brevo');

let emailClient = null;
let loadedApiKey = null;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getEmailClient() {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    return null;
  }

  if (!emailClient || loadedApiKey !== apiKey) {
    emailClient = new BrevoClient({ apiKey });
    loadedApiKey = apiKey;
  }

  return emailClient;
}

async function sendWelcomeEmail(to, username) {
  const client = getEmailClient();
  const safeUsername = escapeHtml(username);
  const imageUrl = process.env.BREVO_EMAIL_IMAGE_URL;
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const imageHtml = imageUrl
    ? `
      <img
        src="${escapeHtml(imageUrl)}"
        alt="Motaroad"
        style="width:100%;max-width:560px;height:auto;display:block;border-radius:8px;margin:0 0 24px 0;"
      />
    `
    : '';

  if (!client) {
    console.warn('Email Brevo nao enviado: configure BREVO_API_KEY e BREVO_SENDER_EMAIL no backend/.env.');
    return;
  }

  await client.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || 'Moto Oficina'
    },
    to: [
      {
        email: to,
        name: username
      }
    ],
    subject: 'Bem-vindo a Motaroad',
    htmlContent: `
      <div style="display:none;max-height:0;overflow:hidden;">
        A sua conta Motaroad foi criada com sucesso.
      </div>
      <div style="margin:0;padding:32px 16px;background:#f3f4f6;font-family:Arial,sans-serif;color:#1f2937;">
        <div style="max-width:600px;margin:0 auto;">
          ${imageHtml}
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:32px;">
            <p style="margin:0 0 8px 0;font-size:13px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;">
              Motaroad
            </p>
            <h2 style="margin:0 0 18px 0;font-size:24px;line-height:1.3;color:#111827;">
              Bem-vindo, ${safeUsername}
            </h2>
            <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;">
              A sua conta foi criada com sucesso. Ja pode aceder a plataforma e acompanhar os servicos disponiveis para a sua mota.
            </p>
            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;">
              Obrigado por escolher a Motaroad. Estamos prontos para o ajudar com um atendimento rapido, organizado e profissional.
            </p>
            <a
              href="${escapeHtml(appUrl)}"
              style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 20px;border-radius:6px;"
            >
              Aceder a plataforma
            </a>
          </div>
          <p style="margin:18px 0 0 0;text-align:center;font-size:12px;line-height:1.6;color:#6b7280;">
            Este email foi enviado automaticamente pela Motaroad. Por favor, nao responda a esta mensagem.
          </p>
        </div>
      </div>
    `
  });
}

module.exports = {
  sendWelcomeEmail
};
