import axios from 'axios';

// Estas variáveis devem ser configuradas no seu ambiente (Vercel/Supabase)
const META_API_TOKEN = import.meta.env.VITE_METAAPI_TOKEN;
const META_API_ACCOUNT_ID = import.meta.env.VITE_METAAPI_ACCOUNT_ID;
const META_API_URL = `https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${META_API_ACCOUNT_ID}/trade`;

const BROKER_CONFIG = {
  risk_per_trade: 0.005, // 0.5% FIXO
  account_balance: 12450.00 // Idealmente buscar via API da MetaApi
};

export const executeTrade = async (signal: any) => {
  if (!META_API_TOKEN || !META_API_ACCOUNT_ID) {
    console.error("❌ MetaApi Credentials Missing");
    return { success: false, error: "Credentials missing" };
  }

  try {
    console.log(`🤖 BRAXEL BRIDGE: Executando ${signal.asset} via MetaApi...`);

    // Cálculo de Lote (0.5% de risco)
    const riskAmount = BROKER_CONFIG.account_balance * BROKER_CONFIG.risk_per_trade;
    const pipValue = signal.asset.includes('JPY') ? 10 : 10; 
    const lot = Math.max(0.01, riskAmount / (signal.sl_pips * pipValue));

    const orderData = {
      symbol: signal.asset,
      action: signal.direction === 'BUY' ? 'ORDER_TYPE_BUY' : 'ORDER_TYPE_SELL',
      volume: parseFloat(lot.toFixed(2)),
      stopLoss: signal.sl,
      takeProfit: signal.tp1, // Executa TP1 inicialmente
      comment: `Braxel AI | Conf: ${signal.confidence}%`
    };

    const response = await axios.post(META_API_URL, orderData, {
      headers: {
        'auth-token': META_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Ordem enviada com sucesso:", response.data);
    return { 
      success: true, 
      orderId: response.data.orderId,
      lot: lot.toFixed(2)
    };
  } catch (error: any) {
    console.error("❌ Erro na MetaApi:", error.response?.data || error.message);
    throw error;
  }
};