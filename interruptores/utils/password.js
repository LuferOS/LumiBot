export default {
  name: "password",
  alias: ["clave", "pass", "generar"],
  category: "utilidad",
  desc: "Generador de contraseñas de seguridad militar.",
  run: async ({ sock, m, args }) => {
    let length = 16;
    if (args[0] && !isNaN(args[0])) {
      length = parseInt(args[0]);
    }
    
    if (length > 100) length = 100;
    if (length < 8) length = 8;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const txt = `*🔐 PROTOCOLO DE SEGURIDAD*\n\n` +
      `Se ha generado una clave táctica de ${length} caracteres:\n\n` +
      `\`${password}\`\n\n` +
      `_Aviso: No guardamos registros de las claves generadas. Cópiela y destrúyala._`;
      
    m.reply(txt);
  }
};
