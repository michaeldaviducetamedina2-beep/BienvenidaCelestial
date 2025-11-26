// === CÓDIGO DEL BOT SIN COMANDOS DE IA ===
// Mantiene bienvenida/despedida y todos los comandos normales

const { Client, GatewayIntentBits, Partials, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const express = require("express");

// === EXPRESS ===
const app = express();
app.get("/", (req, res) => res.send("Bot funcionando correctamente ✝️🔥"));
app.listen(process.env.PORT || 3000);

// === DISCORD BOT ===
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// === BOT READY ===
bot.on("ready", () => {
  console.log(`Bot activo como: ${bot.user.tag}`);
  bot.user.setPresence({
    activities: [{ name: "Jesús te ama | IPULRD ✝️🔥" }],
    status: "online"
  });
});

// === BIENVENIDA ===
bot.on("guildMemberAdd", member => {
  const canalBienvenida = bot.channels.cache.get("1440511721205661706");
  const canalReglas = bot.channels.cache.get("1440511929566232676");

  if (!canalBienvenida || !canalReglas) return;

  const embedBienvenida = new EmbedBuilder()
    .setTitle("🙌 ¡Dios te bendiga!")
    .setDescription(`Bienvenido/a **${member}** ✝️🔥\nNos alegra que estés aquí.`)
    .setColor("#2ECC71")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage("https://image.slidesdocs.com/responsive-images/background/glorious-3d-rendering-vibrant-sunrise-sky-illuminates-majestic-religious-cross-silhouette-powerpoint-background_b8ba8b6bbf__960_540.jpg") // Imagen cristiana NUEVA
    .setFooter({ text: "IPUL República Dominicana ✝️" });

  canalBienvenida.send({ embeds: [embedBienvenida] });

  const filaBienvenida = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Leer reglas")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/channels/${member.guild.id}/${canalReglas.id}`)
  );

  canalBienvenida.send({
    content: "📜 Antes de comenzar, revisa las reglas:",
    components: [filaBienvenida]
  });
});

// === DESPEDIDA ===
bot.on("guildMemberRemove", member => {
  const canalDespedida = bot.channels.cache.get("1440511965276409918");
  if (!canalDespedida) return;

  const embedDespedida = new EmbedBuilder()
    .setTitle("🙏 Que Dios te guarde")
    .setDescription(`${member.user.tag} ha salido del servidor.`)
    .setColor("#E74C3C")
    .setImage("https://png.pngtree.com/thumb_back/fh260/background/20240916/pngtree-the-cross-on-hill-with-a-beautiful-sunrise-background-christian-concept-image_16216607.jpg"); // Imagen cristiana NUEVA

  canalDespedida.send({ embeds: [embedDespedida] });
});

// === MENSAJES Y COMANDOS ===
bot.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  // === FILTRO DE PALABRAS ===
  const palabrasProhibidas = [
    "verga", "vrg", "puta", "mierda", "fuck", "shit", "pendejo", "idiota", "imbecil", "cabron",
    "culero", "maldito", "penis", "vagina", "xxx", "sex", "sexo", "puta madre", "asshole", "bitch",
    "mrd", "hdp", "maricon", "callate", "mamahuevo", "mmg", "wtf", "wth" 
  ];

  const mensajeMinuscula = msg.content.toLowerCase();
  if (palabrasProhibidas.some(p => mensajeMinuscula.includes(p))) {
    msg.delete().catch(() => {});
    msg.channel.send("🙏 Usa palabras que edifiquen, Dios te bendiga ✝️");
    return;
  }

  // === !versiculo ===
  if (msg.content === "!versiculo") {
    const vers = [
      "📖 Jehová es mi pastor; nada me faltará. — Salmos 23:1",
      "📖 Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13",
      "📖 Jehová es mi luz y mi salvación; ¿de quién temeré? — Salmos 27:1",
      "📖 Clama a mí y yo te responderé. — Jeremías 33:3"
    ];
    msg.reply(vers[Math.floor(Math.random() * vers.length)]);
  }

  // === !oracion ===
  if (msg.content === "!oracion") {
    const oraciones = [
      "🙏 Señor, bendice a este joven, guíalo y cúbrelo con Tu paz.",
      "🙏 Padre Celestial, protégenos cada día.",
      "🙏 Que Tu luz ilumine nuestro camino.",
      "🙏 Gracias por Tu misericordia, Jesús."
    ];
    msg.reply(oraciones[Math.floor(Math.random() * oraciones.length)]);
  }

  // === !ipul ===
  if (msg.content === "!ipul") {
    msg.reply("🔥 La Iglesia Pentecostal Unida Latinoamericana (IPUL) enseña la importancia del bautismo en el Nombre de Jesús, la santidad personal y vivir guiados por el Espíritu Santo. Nuestra misión es compartir el evangelio y ayudar a todos a acercarse a Cristo.");
  }

  // === !limpiar ===
  if (msg.content.startsWith("!limpiar")) {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return msg.reply("❌ No tienes permiso.");

    const cantidad = parseInt(msg.content.split(" ")[1]);
    if (!cantidad || cantidad < 1)
      return msg.reply("Escribe cuántos mensajes borrar.");

    msg.channel.bulkDelete(cantidad, true);
    msg.channel.send(`🧹 Se borraron **${cantidad}** mensajes.`);
  }

  // === !cmds ===
  if (msg.content === "!cmds") {
    msg.reply("📜 **Comandos:**\n!versiculo\n!oracion\n!ipul\n!saludo\n!ayuda\n!limpiar");
  }

  if (msg.content === "!saludo") msg.reply("👋 Dios te bendiga mucho ✝️");
  if (msg.content === "!ayuda") msg.reply("💡 Usa !cmds para ver todos los comandos.");
});

// === LOGIN ===
bot.login(process.env.TOKEN || "AQUÍ_PARA_PROBAR_LOCAL");

// === ERRORES ===
process.on("uncaughtException", err => {
  console.log("Error controlado:", err);
});

process.on("unhandledRejection", err => {
  console.log("Promesa rechazada:", err);
});
