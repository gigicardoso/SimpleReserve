const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
// Carrega .env explicitamente a partir da raiz do projeto (../.env)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Helper para normalizar valores vindos do .env (remove espaços e trata undefined)
const env = (name) => {
  const v = process.env[name];
  return typeof v === 'string' ? v.trim() : (v || '');
};

const OAUTH_CLIENT_ID = env('OAUTH_CLIENT_ID');
const OAUTH_CLIENT_SECRET = env('OAUTH_CLIENT_SECRET');
const OAUTH_REDIRECT_URI = env('OAUTH_REDIRECT_URI');
const OAUTH_REFRESH_TOKEN = env('OAUTH_REFRESH_TOKEN');
const MAIL_FROM = env('MAIL_FROM');

function missingVars() {
  const missing = [];
  if (!OAUTH_CLIENT_ID) missing.push('OAUTH_CLIENT_ID');
  if (!OAUTH_CLIENT_SECRET) missing.push('OAUTH_CLIENT_SECRET');
  // O redirect URI ajuda na geração do refresh token; se ausente, usamos padrão do OAuth Playground
  if (!OAUTH_REDIRECT_URI) missing.push('OAUTH_REDIRECT_URI');
  if (!OAUTH_REFRESH_TOKEN) missing.push('OAUTH_REFRESH_TOKEN');
  if (!MAIL_FROM) missing.push('MAIL_FROM');
  return missing;
}

const missing = missingVars();
if (missing.length) {
  console.warn(`[mailer] Variáveis de ambiente ausentes: ${missing.join(', ')}. Consulte .env.example.`);
}

function isConfigured() {
  // Consideramos essencial: CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN e MAIL_FROM.
  return !!(OAUTH_CLIENT_ID && OAUTH_CLIENT_SECRET && OAUTH_REFRESH_TOKEN && MAIL_FROM);
}

const oAuth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
);

if (OAUTH_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });
}

async function getTransport() {
  if (!isConfigured()) {
    const err = new Error('MAILER_NOT_CONFIGURED');
    err.code = 'MAILER_NOT_CONFIGURED';
    throw err;
  }

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: MAIL_FROM,
        clientId: OAUTH_CLIENT_ID,
        clientSecret: OAUTH_CLIENT_SECRET,
        refreshToken: OAUTH_REFRESH_TOKEN,
        accessToken: accessToken && accessToken.token ? accessToken.token : accessToken
      }
    });
  } catch (error) {
    // Log mais detalhado para facilitar depuração do erro retornado pela API do Google
    console.error('[mailer] Erro ao obter access token:', error && error.message ? error.message : error);
    // Se houver resposta da API (axios/gaxios), exiba o body para ver detalhes (ex.: { error: 'invalid_grant' })
    try {
      if (error && error.response && error.response.data) {
        console.error('[mailer] Detalhes da resposta do provedor OAuth:', JSON.stringify(error.response.data, null, 2));
      } else if (error && error.originalError && error.originalError.response && error.originalError.response.data) {
        console.error('[mailer] Detalhes (originalError):', JSON.stringify(error.originalError.response.data, null, 2));
      } else {
        console.error('[mailer] Erro completo:', error);
      }
    } catch (logErr) {
      console.error('[mailer] Falha ao tentar fazer log detalhado do erro:', logErr);
    }

    const err = new Error('OAUTH_ERROR: ' + (error && error.message ? error.message : 'unknown'));
    err.code = 'OAUTH_ERROR';
    err.originalError = error;
    throw err;
  }
}

async function sendMail({ to, subject, html }) {
  const transporter = await getTransport();
  return transporter.sendMail({ from: MAIL_FROM, to, subject, html });
}

module.exports = { sendMail, isConfigured };
