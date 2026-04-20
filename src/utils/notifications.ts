export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  
  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendSignalNotification = (asset: string, direction: string, entry: number) => {
  if (Notification.permission === "granted") {
    new Notification(`🚨 NOVO SINAL: ${asset}`, {
      body: `${direction} em ${entry.toFixed(5)}. Verifique o terminal para detalhes de SL/TP.`,
      icon: '/placeholder.svg'
    });
    
    // Som de alerta
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Audio play blocked"));
  }
};