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
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000/';
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

async function sendOrderSuccessEmail(to, customerName, order) {
  const client = getEmailClient();
  const safeCustomerName = escapeHtml(customerName);
  const itemsHtml = order.items.map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${escapeHtml(item.quantity)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${Number(item.price).toFixed(2)} EUR</td>
    </tr>
  `).join('');

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
        name: customerName
      }
    ],
    subject: 'Compra efetuada com sucesso',
    htmlContent: `
      <div style="display:none;max-height:0;overflow:hidden;">
        A sua compra foi efetuada com sucesso e sera enviada o mais rapido possivel.
      </div>
      <div style="margin:0;padding:32px 16px;background:#f3f4f6;font-family:Arial,sans-serif;color:#1f2937;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:32px;">
          <p style="margin:0 0 8px 0;font-size:13px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;">
            Motaroad
          </p>
          <h2 style="margin:0 0 18px 0;font-size:24px;line-height:1.3;color:#111827;">
            Compra bem sucedida, ${safeCustomerName}
          </h2>
          <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;">
            A sua compra foi registada com sucesso. Vamos preparar a encomenda e envia-la o mais rapido possivel.
          </p>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;">
            Entraremos em contacto caso seja necessario confirmar algum detalhe da entrega.
          </p>
          <table style="width:100%;border-collapse:collapse;margin:0 0 20px 0;font-size:14px;">
            <thead>
              <tr>
                <th style="padding:0 0 10px 0;text-align:left;border-bottom:2px solid #111827;">Produto</th>
                <th style="padding:0 0 10px 0;text-align:center;border-bottom:2px solid #111827;">Qtd.</th>
                <th style="padding:0 0 10px 0;text-align:right;border-bottom:2px solid #111827;">Preco</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="margin:0;font-size:16px;font-weight:bold;text-align:right;color:#111827;">
            Total: ${Number(order.total).toFixed(2)} EUR
          </p>
        </div>
        <p style="margin:18px 0 0 0;text-align:center;font-size:12px;line-height:1.6;color:#6b7280;">
          Este email foi enviado automaticamente pela Motaroad. Por favor, nao responda a esta mensagem.
        </p>
      </div>
    `
  });
}

async function sendBookingCompletedEmail(to, customerName, booking) {
  const client = getEmailClient();
  const safeCustomerName = escapeHtml(customerName || 'Cliente');
  const safeVehicle = escapeHtml(booking.vehicle || 'a sua mota');
  const safeService = escapeHtml(booking.serviceName || 'o servico');

  if (!client) {
    console.warn('Email Brevo nao enviado: configure BREVO_API_KEY e BREVO_SENDER_EMAIL no backend/.env.');
    return;
  }

  await client.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || 'MotaRoad'
    },
    to: [
      {
        email: to,
        name: customerName || to
      }
    ],
    subject: 'A sua mota esta pronta para levantamento',
    htmlContent: `
      <div style="display:none;max-height:0;overflow:hidden;">
        O servico da sua mota foi concluido. Ja pode vir busca-la ao stand.
      </div>
      <div style="margin:0;padding:32px 16px;background:#f3f4f6;font-family:Arial,sans-serif;color:#1f2937;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:32px;">
          <p style="margin:0 0 8px 0;font-size:13px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;">
            MotaRoad
          </p>
          <h2 style="margin:0 0 18px 0;font-size:24px;line-height:1.3;color:#111827;">
            A sua mota esta pronta, ${safeCustomerName}
          </h2>
          <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;">
            O servico <strong>${safeService}</strong> foi concluido com sucesso.
          </p>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;">
            Ja pode vir buscar <strong>${safeVehicle}</strong> ao nosso stand dentro do horario de atendimento.
          </p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;">
            Caso precise de confirmar algum detalhe antes de passar pelo stand, contacte-nos por telefone ou email.
          </div>
        </div>
        <p style="margin:18px 0 0 0;text-align:center;font-size:12px;line-height:1.6;color:#6b7280;">
          Este email foi enviado automaticamente pela MotaRoad. Por favor, nao responda a esta mensagem.
        </p>
      </div>
    `
  });
}

module.exports = {
  sendWelcomeEmail,
  sendOrderSuccessEmail,
  sendBookingCompletedEmail
};
