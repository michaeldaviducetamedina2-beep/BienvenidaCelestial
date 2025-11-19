const { Client, GatewayIntentBits, Partials, PermissionsBitField } = require("discord.js");
const express = require("express");

// ---- SERVIDOR EXPRESS PARA QUE EL BOT NO SE APAGUE ----
const app = express();
app.get("/", (req, res) => res.send("Bot funcionando correctamente ✝️🔥"));
app.listen(process.env.PORT || 3000);

// ---- INICIALIZAR BOT ----
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// ---- CUANDO EL BOT INICIA ----
bot.on("ready", () => {
  console.log(`Bot activo como: ${bot.user.tag}`);
  bot.user.setPresence({
    activities: [{ name: "Jesús te ama | IPULRD ✝️🔥" }],
    status: "online"
  });
});

// ---- MENSAJE DE BIENVENIDA ----
bot.on("guildMemberAdd", member => {
  const canal = bot.channels.cache.get("1440511721205661706"); // <- Pega aquí el ID de tu canal
  if (!canal) return;

  canal.send(
    `🙌 **Dios te bendiga, ${member.user.username}**\n¡Dios te bendiga! ¡Bienvenido/a a la familia de hermanos en Cristo! ✝️🔥`
  );
});

// ---- COMANDOS ----
bot.on("messageCreate", msg => {
  if (msg.author.bot) return;

  // ---- FILTRO DE PALABRAS ----
  const palabrasProhibidas = [
    "verga", "vrg", "puta", "mierda", "fuck", "shit", "pendejo", "idiota", 
    "imbecil", "cabron", "culero", "maldito", "penis", "vagina",
    "xxx", "sex", "sexo", "puta madre", "asshole", "bitch", "mrd", "hdp", "maricon", "callate", "mamahuevo", "mmg"   // "chatgpt" no será censurado
  ];

  const mensajeMinuscula = msg.content.toLowerCase();
  if (palabrasProhibidas.some(p => mensajeMinuscula.includes(p))) {
    msg.delete().catch(() => {});
    const respuestasCristianas = [
      "🙏 Por favor, use palabras amables y cristianas ✝️",
      "✨ Recordemos hablar con respeto y amor en Cristo.",
      "✝️ Mantengamos un lenguaje limpio, en el nombre de Jesús.",
      "🌿 Hablemos con palabras que edifiquen."
    ];
    const respuesta = respuestasCristianas[Math.floor(Math.random() * respuestasCristianas.length)];
    msg.channel.send(respuesta);
    return;
  }

  // !versiculo
  if (msg.content === "!versiculo") {
    const vers = [
      "📖 Jehová es mi pastor; nada me faltará. — Salmos 23:1",
      "📖 Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13",
      "📖 Jehová es mi luz y mi salvación; ¿de quién temeré? — Salmos 27:1",
      "📖 Clama a mí y yo te responderé. — Jeremías 33:3"
      // Puedes añadir más versículos aquí
    ];
    msg.reply(vers[Math.floor(Math.random() * vers.length)]);
  }

  // !oracion
  if (msg.content === "!oracion") {
    const oraciones = [
      "🙏 Señor, bendice a este joven, guíalo, fortalécelo y cúbrelo con tu paz, en el nombre de Jesús, amén.",
      "🙏 Padre Celestial, protégenos y acompáñanos en cada paso que damos, en el nombre de nuestro Señor Jesucristo, amén.",
      "🙏 Que Tu luz ilumine nuestro camino, que Tu amor nos guíe, en el nombre de Jesús, amén.",
      "🙏 Señor, gracias por tu misericordia y tu gracia, ayúdanos a caminar rectamente, en el nombre de nuestro Señor Jesucristo, amén."
      // Puedes añadir más oraciones aquí
    ];
    msg.reply(oraciones[Math.floor(Math.random() * oraciones.length)]);
  }

  // !ipul
  if (msg.content === "!ipul") {
    msg.reply(
      "🔥 La Iglesia Pentecostal Unida Latinoamericana (IPUL) enseña la importancia del bautismo en el Nombre de Jesús, la santidad personal y vivir guiados por el Espíritu Santo. Nuestra misión es compartir el evangelio y ayudar a todos a acercarse a Cristo."
    );
  }

  // !limpiar
  if (msg.content.startsWith("!limpiar")) {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return msg.reply("❌ No tienes permiso para limpiar mensajes.");

    const cantidad = parseInt(msg.content.split(" ")[1]);
    if (!cantidad || cantidad < 1)
      return msg.reply("Escribe cuántos mensajes borrar.");

    msg.channel.bulkDelete(cantidad, true);
    msg.channel.send(`🧹 Se borraron **${cantidad}** mensajes.`);
  }
});

// ---- INICIAR BOT ----
bot.login(process.env.TOKEN || "AQUÍ_PARA_PROBAR_LOCAL");
