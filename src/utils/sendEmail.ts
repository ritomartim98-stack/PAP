import * as brevo from "@getbrevo/brevo";

const client = new brevo.TransactionalEmailsApi();

client.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

export const sendWelcomeEmail = async (to: string, username: string) => {
  await client.sendTransacEmail({
    sender: {
      email: "teuemail@dominio.com",
      name: "Minha PAP",
    },
    to: [
      {
        email: to,
        name: username,
      },
    ],
    subject: "Conta criada com sucesso 🎉",
    htmlContent: `
      <h2>Olá ${username} 👋</h2>
      <p>A tua conta foi criada com sucesso.</p>
      <p>Já podes iniciar sessão e usar a plataforma.</p>
      <br/>
      <p>Bem-vindo!</p>
    `,
  });
};