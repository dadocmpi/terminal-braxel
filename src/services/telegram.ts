import { ActiveSignal, MarketSession } from '../types/trading';

// Nota: O usuário precisará configurar o BOT_TOKEN e CHAT_ID no Supabase ou Env
const TELEGRAM_BOT_TOKEN = ''; 
const TELEGRAM_CHAT_ID = '';

export const formatTelegramSignal = (signal: ActiveSignal) => {
  const emoji = signal.direction === 'BUY' ? '🔵' : '🔴';
  const trend = signal.direction === 'BUY' ? 'BULLISH' : 'BEARISH';
  
  return `
🚀 *BRAXEL TERMINAL \- NEW SIGNAL* 🚀
━━━━━━━━━━━━━━━━━━━━━━━━
📈 *ASSET:* ${signal.asset}
⚡ *TYPE:* ${trend} EXECUTION
🎯 *CONFIDENCE:* ${signal.confidence}%
━━━━━━━━━━━━━━━━━━━━━━━━
📍 *ENTRY:* \`${signal.entry.toFixed(5)}\`
🛑 *STOP LOSS:* \`${signal.sl.toFixed(5)}\` \(\-${signal.sl_pips.toFixed(1)} pips\)
✅ *TAKE PROFIT 1:* \`${signal.tp1.toFixed(5)}\`
✅ *TAKE PROFIT 2:* \`${signal.tp2.toFixed(5)}\`
━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *STATUS:* Neural Engine Confirmed
🔗 [Open Terminal](https://braxel-terminal.vercel.app)
  `.trim();
};

export const formatSessionSummary = (session: MarketSession, bias: string, pips: number) => {
  return `
🌍 *BRAXEL \- SESSION UPDATE* 🌍
━━━━━━━━━━━━━━━━━━━━━━━━
🕒 *SESSION:* ${session} KILLZONE
📊 *BIAS:* ${bias}
💰 *DAILY PIPS:* ${pips > 0 ? '+' : ''}${pips.toFixed(1)}
━━━━━━━━━━━━━━━━━━━━━━━━
📡 *Monitoring 8 Institutional Pairs*
✅ *Copytrade Bridge: Online*
  `.trim();
};

export const sendToTelegram = async (message: string) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("Telegram credentials missing. Message preview:\n", message);
    return false;
  }

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