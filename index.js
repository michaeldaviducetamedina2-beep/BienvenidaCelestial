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
  const canal = member.guild.systemChannel;
  if (!canal) return;

  canal.send(
    `🙌 **Dios te bendiga, ${member.user.username}**\nBienvenido/a a la familia cristiana ✝️🔥`
  );
});

// ---- COMANDOS ----
bot.on("messageCreate", msg => {
  if (msg.author.bot) return;

  // !versiculo
  if (msg.content === "!versiculo") {
    const vers = [
      "📖 Jehová es mi pastor; nada me faltará. — Salmos 23:1",
      "📖 Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13",
      "📖 Jehová es mi luz y mi salvación; ¿de quién temeré? — Salmos 27:1",
      "📖 Clama a mí y yo te responderé. — Jeremías 33:3",
      "📖 Porque yo sé los planes que tengo acerca de vosotros, dice Jehová, planes de bien y no de mal, para daros un futuro y una esperanza. — Jeremías 29:11",
      "📖 Buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas. — Mateo 6:33",
      "📖 No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo. — Isaías 41:10",
      "📖 Y conoceréis la verdad, y la verdad os hará libres. — Juan 8:32",
      "📖 Amad a vuestros enemigos, haced bien a los que os aborrecen. — Lucas 6:27",
      "📖 Bienaventurados los que tienen hambre y sed de justicia, porque ellos serán saciados. — Mateo 5:6"
      // Agrega más versículos según quieras
    ];
    msg.reply(vers[Math.floor(Math.random() * vers.length)]);
  }

  // !oracion
  if (msg.content === "!oracion") {
    const oraciones = [
      "🙏 Señor, bendice a este joven, guíalo y cúbrelo con tu paz en el nombre de Jesús, amén.",
      "🙏 Padre celestial, fortalece su fe y protégelo en el nombre de nuestro Señor Jesucristo, amén.",
      "🙏 Dios todopoderoso, ilumina su camino y bendice sus pasos en el nombre de Jesús, amén.",
      "🙏 Señor Jesús, que tu Espíritu Santo lo guíe y lo llene de sabiduría, amén.",
      "🙏 Padre amado, escucha su corazón y dale fuerzas cada día en el nombre de nuestro Señor Jesucristo, amén.",
      "🙏 Dios de amor, que tu paz repose sobre él y su familia en el nombre de Jesús, amén.",
      "🙏 Señor, límpialo de toda tentación y guárdalo de todo mal en el nombre de Jesús, amén."
      // Puedes agregar más frases de oración según quieras
    ];
    msg.reply(oraciones[Math.floor(Math.random() * oraciones.length)]);
  }

  // !ipul
  if (msg.content === "!ipul") {
    msg.reply(
      "🔥 La Iglesia Pentecostal Unida Latinoamericana (IPUL) es una comunidad cristiana dedicada a enseñar la Palabra de Dios, vivir en santidad, predicar el evangelio de Jesús y guiar a los jóvenes hacia una vida con Cristo, con amor y obediencia al Espíritu Santo."
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

  // ---- FILTRO DE PALABRAS VULGARES ----
  const palabrasProhibidas = [
    "verga", "mierda", "puta", "cabron", "gilipollas", "pendejo",
    "fuck", "shit", "bitch", "asshole", "damn",
    "vrg", "mrd", "pt", "cbn", "gll", "pndj" // iniciales
    // Agrega todas las demás que quieras
  ];

  const frasesCristianas = [
    "✝️ Por favor, usa palabras limpias y agradables a Dios.",
    "🙏 Recuerda hablar con amor y respeto según la Palabra de Dios.",
    "💒 Usa un lenguaje que bendiga a los demás, no palabras feas.",
    "🕊️ Habla como hijo/a de Dios, con palabras de paz y amor."
  ];

  for (const palabra of palabrasProhibidas) {
    if (msg.content.toLowerCase().includes(palabra)) {
      const frase = frasesCristianas[Math.floor(Math.random() * frasesCristianas.length)];
      msg.delete().catch(() => {});
      msg.channel.send(`${frase} ✝️`);
      return;
    }
  }
});

// ---- INICIAR BOT ----
bot.login(process.env.TOKEN || "AQUÍ_PARA_PROBAR_LOCAL");
