import axios from 'axios';

export default {
  command: ["crypto", "bitcoin", "eth", "solana"],
  category: "utilidad",
  desc: "Muestra la cotización en vivo de criptomonedas base.",
  run: async (sock, m) => {
    m.reply("Extrayendo cotizaciones de la cadena de bloques...");
    
    try {
      const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
      
      const btc = data.bitcoin.usd.toLocaleString();
      const eth = data.ethereum.usd.toLocaleString();
      const sol = data.solana.usd.toLocaleString();
      
      const txt = `*💰 COTIZACIONES CRYPTO*\n\n` +
        `*Bitcoin (BTC):* $${btc} USD\n` +
        `*Ethereum (ETH):* $${eth} USD\n` +
        `*Solana (SOL):* $${sol} USD`;
        
      m.reply(txt);
    } catch (e) {
      m.reply("❌ Interferencia en la conexión con la API de precios.");
    }
  }
};
