const { Client, GatewayIntentBits, Partials, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
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
  const canalBienvenida = bot.channels.cache.get("1440511721205661706"); // <- ID canal de bienvenida
  const canalReglas = bot.channels.cache.get("1440511929566232676"); // <- ID canal de reglas
  if (!canalBienvenida || !canalReglas) return;

  // ==== EMBED DE BIENVENIDA ====
  const embedBienvenida = new EmbedBuilder()
    .setTitle("🙌 ¡Dios te bendiga!")
    .setDescription(`Bienvenido/a **${member}** ✝️🔥\nEres parte de una familia en Cristo. ¡Nos alegra que estés aquí!`)
    .setColor("#2ECC71")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage("https://i.imgur.com/3ZQ3ZQp.jpeg")  // <<< FONDO CRISTIANO AÑADIDO AQUÍ
    .setFooter({ text: "IPUL República Dominicana ✝️" });

  canalBienvenida.send({ embeds: [embedBienvenida] });

  // Mensaje normal de bienvenida
  canalBienvenida.send(
    `🙌 **Dios te bendiga, ${member}**\n¡Dios te bendiga! ¡Bienvenido/a a la familia de hermanos en Cristo! ✝️🔥`
  );

  // Botón que lleva a las reglas
  const filaBienvenida = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Revisa las reglas aquí")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/channels/${member.guild.id}/${canalReglas.id}`)
  );

  canalBienvenida.send({
    content: "📜 Antes de empezar, por favor lee las reglas:",
    components: [filaBienvenida]
  });

  // Botón en canal de reglas que lleva al canal general
  const canalGeneral = bot.channels.cache.get("1440502884545462375"); // <- ID canal general
  if (canalGeneral) {
    const filaReglas = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Ya leí las reglas, ve al general")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/channels/${member.guild.id}/${canalGeneral.id}`)
    );
    canalReglas.send({
      content: "✅ Una vez que leas las reglas, puedes ir al canal general:",
      components: [filaReglas]
    });
  }
});

// ---- MENSAJE DE DESPEDIDA ----
bot.on("guildMemberRemove", member => {
  const canalDespedida = bot.channels.cache.get("1440511965276409918");
  if (!canalDespedida) return;

  canalDespedida.send(
    `😢 ${member.user.tag} ha salido del servidor. Que Dios lo bendiga y lo guíe siempre ✝️🙏`
  );
});

// ---- COMANDOS ----
bot.on("messageCreate", msg => {
  if (msg.author.bot) return;

  // ---- FILTRO DE PALABRAS ----
  const palabrasProhibidas = [
    "verga", "vrg", "puta", "mierda", "fuck", "shit", "pendejo", "idiota", 
    "imbecil", "cabron", "culero", "maldito", "penis", "vagina",
    "xxx", "sex", "sexo", "puta madre", "asshole", "bitch", "mrd", "hdp", "maricon", "callate", "mamahuevo", "mmg"
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

  // !cmds
  if (msg.content === "!cmds") {
    const comandos = [
      "!versiculo - Te da un versículo aleatorio",
      "!oracion - Te da una oración aleatoria",
      "!ipul - Información sobre la iglesia",
      "!limpiar [cantidad] - Borra mensajes (permiso requerido)",
      "!saludo - Un saludo del bot",
      "!ayuda - Info de ayuda",
      "!cmds - Lista todos los comandos"
    ];
    msg.reply("📜 **Comandos disponibles:**\n" + comandos.join("\n"));
  }

  // !saludo
  if (msg.content === "!saludo") {
    msg.reply("👋 ¡Hola! Que Dios te bendiga hoy y siempre ✝️");
  }

  // !ayuda
  if (msg.content === "!ayuda") {
    msg.reply("💡 Usa !cmds para ver todos los comandos del bot.");
  }
});

// ---- BOT LOGIN ----
bot.login(process.env.TOKEN || "AQUÍ_PARA_PROBAR_LOCAL");
