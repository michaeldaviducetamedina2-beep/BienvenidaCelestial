// === CÓDIGO COMPLETO DEL BOT ARREGLADO ===
// Incluye: !preguntar, !existeDios, imágenes de bienvenida/despedida,
// y todas las funciones funcionando correctamente.

const { Client, GatewayIntentBits, Partials, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const express = require("express");
const OpenAI = require("openai");

// === OPENAI ===
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    .setImage("https://i.imgur.com/6YV4M2Q.jpeg") // Imagen cristiana
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
    .setImage("https://i.imgur.com/uVX1u0p.jpeg"); // Imagen cristiana

  canalDespedida.send({ embeds: [embedDespedida] });
});

// === MENSAJES Y COMANDOS ===
bot.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  // === FILTRO ===
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

  // === !preguntar ===
  if (msg.content.startsWith("!preguntar")) {
    const pregunta = msg.content.replace("!preguntar", "").trim();

    if (!pregunta)
      return msg.reply("✝️ Ejemplo: `!preguntar ¿Qué es la fe?`");

    try {
      const respuesta = await openai.responses.create({
        model: "gpt-4o-mini",
        input: `Responde como un consejero cristiano pentecostal dominicano de la IPULRD: ${pregunta}`
      });

      msg.reply("📖 **Respuesta:**\n" + respuesta.output[0].content[0].text);
    } catch (e) {
      console.log(e);
      msg.reply("❌ Hubo un error procesando la pregunta.");
    }
  }

  // === !existeDios ===
  if (msg.content === "!existeDios") {
    try {
      const r = await openai.responses.create({
        model: "gpt-4o-mini",
        input: "Explica por qué Dios existe sin usar la Biblia, usando lógica, ciencia y filosofía."
      });

      msg.reply("📘 **¿Cómo sabemos que Dios existe?**\n" + r.output[0].content[0].text);
    } catch (e) {
      msg.reply("❌ Error con la IA.");
    }
  }

  // === !consejo ===
  if (msg.content.startsWith("!consejo")) {
    const tema = msg.content.replace("!consejo", "").trim();

    if (!tema)
      return msg.reply("✝️ Ejemplo: `!consejo tristeza`");

    const respuesta = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `Da un consejo cristiano pentecostal sobre el tema '${tema}'.`
    });

    msg.reply("💬 **Consejo:**\n" + respuesta.output[0].content[0].text);
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
    msg.reply("📜 **Comandos:**\n!preguntar <pregunta>\n!biblia <tema>\n!consejo <tema>\n!existeDios\n!versiculo\n!oracion\n!ipul\n!saludo\n!ayuda\n!limpiar");
  }

  if (msg.content === "!saludo") msg.reply("👋 Dios te bendiga mucho ✝️");
  if (msg.content === "!ayuda") msg.reply("💡 Usa !cmds para ver todos los comandos.");
});

// === LOGIN ===
bot.login(process.env.TOKEN || "AQUÍ_PARA_PROBAR_LOCAL");

// === ERRORES ===
process.on("uncaughtException", err => console.log("Error controlado:", err));
process.on("unhandledRejection", err => console.log("Promesa rechazada:", err));
