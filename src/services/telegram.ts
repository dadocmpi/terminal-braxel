import { ActiveSignal, MarketSession } from '../types/trading';

// Credenciais configuradas conforme fornecido pelo usuário
const TELEGRAM_BOT_TOKEN = '8597174703:AAGGVKCNBxL-5UCk1ZB52r1o0p6t7HbGle8'; 
const TELEGRAM_CHAT_ID = '7182172126';

export const formatTelegramSignal = (signal: ActiveSignal) => {
  const trend = signal.direction === 'BUY' ? 'BULLISH' : 'BEARISH';
  
  // Escapando caracteres especiais para o MarkdownV2 do Telegram
  const asset = signal.asset.replace('-', '\\-');
  const entry = signal.entry.toFixed(5).replace('.', '\\.');
  const sl = signal.sl.toFixed(5).replace('.', '\\.');
  const tp1 = signal.tp1.toFixed(5).replace('.', '\\.');
  const tp2 = signal.tp2.toFixed(5).replace('.', '\\.');
  const slPips = signal.sl_pips.toFixed(1).replace('.', '\\.');

  return `
🚀 *BRAXEL TERMINAL \- NEW SIGNAL* 🚀
━━━━━━━━━━━━━━━━━━━━━━━━
📈 *ASSET:* ${asset}
⚡ *TYPE:* ${trend} EXECUTION
🎯 *CONFIDENCE:* ${signal.confidence}%
━━━━━━━━━━━━━━━━━━━━━━━━
📍 *ENTRY:* \`${entry}\`
🛑 *STOP LOSS:* \`${sl}\` \(\-${slPips} pips\)
✅ *TAKE PROFIT 1:* \`${tp1}\`
✅ *TAKE PROFIT 2:* \`${tp2}\`
━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *STATUS:* Neural Engine Confirmed
🔗 [Open Terminal](https://braxel-terminal.vercel.app)
  `.trim();
};

export const formatSessionSummary = (session: MarketSession, bias: string, pips: number) => {
  const pipsFormatted = pips.toFixed(1).replace('.', '\\.').replace('-', '\\-');
  const sign = pips >= 0 ? '\\+' : '';
  const sessionEscaped = session.replace('_', '\\_');

  return `
🌍 *BRAXEL \- SESSION UPDATE* 🌍
━━━━━━━━━━━━━━━━━━━━━━━━
🕒 *SESSION:* ${sessionEscaped} KILLZONE
📊 *BIAS:* ${bias}
💰 *DAILY PIPS:* ${sign}${pipsFormatted}
━━━━━━━━━━━━━━━━━━━━━━━━
📡 *Monitoring 8 Institutional Pairs*
✅ *Copytrade Bridge: Online*
  `.trim();
};

export const sendToTelegram = async (message: string) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return false;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'MarkdownV2'
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return false;
  }
};