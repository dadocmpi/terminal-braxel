import { ActiveSignal, MarketSession } from '../types/trading';

const TELEGRAM_BOT_TOKEN = '8597174703:AAGGVKCNBxL-5UCk1ZB52r1o0p6t7HbGle8'; 
const TELEGRAM_CHAT_ID = '7182172126';

// Função auxiliar para escapar TODOS os caracteres especiais exigidos pelo MarkdownV2
const escapeMarkdown = (text: string | number) => {
  const str = String(text);
  return str.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
};

export const formatTelegramSignal = (signal: ActiveSignal) => {
  const trend = signal.direction === 'BUY' ? 'BULLISH' : 'BEARISH';
  
  const asset = escapeMarkdown(signal.asset);
  const entry = escapeMarkdown(signal.entry.toFixed(5));
  const sl = escapeMarkdown(signal.sl.toFixed(5));
  const tp1 = escapeMarkdown(signal.tp1.toFixed(5));
  const tp2 = escapeMarkdown(signal.tp2.toFixed(5));
  const slPips = escapeMarkdown(signal.sl_pips.toFixed(1));
  const confidence = escapeMarkdown(signal.confidence);

  return `
🚀 *BRAXEL TERMINAL \- NEW SIGNAL* 🚀
━━━━━━━━━━━━━━━━━━━━━━━━
📈 *ASSET:* ${asset}
⚡ *TYPE:* ${trend} EXECUTION
🎯 *CONFIDENCE:* ${confidence}%
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
  const pipsFormatted = escapeMarkdown(pips.toFixed(1));
  const sign = pips >= 0 ? '\\+' : '';
  const sessionEscaped = escapeMarkdown(session);
  const biasEscaped = escapeMarkdown(bias);

  return `
🌍 *BRAXEL \- SESSION UPDATE* 🌍
━━━━━━━━━━━━━━━━━━━━━━━━
🕒 *SESSION:* ${sessionEscaped} KILLZONE
📊 *BIAS:* ${biasEscaped}
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
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Network Error sending to Telegram:", error);
    return false;
  }
};