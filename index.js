const { Client, GatewayIntentBits, Partials, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const express = require("express");

// === IMPORTAR OPENAI (GOSPEL AI) ===
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // <- AQUÍ PONES TU API KEY EN RENDER
});

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
  const canalBienvenida = bot.channels.cache.get("1440511721205661706"); 
  const canalReglas = bot.channels.cache.get("1440511929566232676");
  if (!canalBienvenida || !canalReglas) return;

  const embedBienvenida = new EmbedBuilder()
    .setTitle("🙌 ¡Dios te bendiga!")
    .setDescription(`Bienvenido/a **${member}** ✝️🔥\nEres parte de una familia en Cristo. ¡Nos alegra que estés aquí!`)
    .setColor("#2ECC71")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage("https://i.imgur.com/3ZQ3ZQp.jpeg")
    .setFooter({ text: "IPUL República Dominicana ✝️" });

  canalBienvenida.send({ embeds: [embedBienvenida] });

  canalBienvenida.send(
    `🙌 **Dios te bendiga, ${member}**\n¡Bienvenido/a a la familia de hermanos en Cristo! ✝️🔥`
  );

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

  const canalGeneral = bot.channels.cache.get("1440502884545462375");
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
bot.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  // ---- FILTRO DE PALABRAS ----
  const palabrasProhibidas = [
    "verga","vrg","puta","mierda","fuck","shit","pendejo","idiota","imbecil","cabron",
    "culero","maldito","penis","vagina","xxx","sex","sexo","puta madre","asshole","bitch",
    "mrd","hdp","maricon","callate","mamahuevo","mmg"
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
    msg.channel.send(respuestasCristianas[Math.floor(Math.random() * respuestasCristianas.length)]);
    return;
  }

  // --- GOSPEL AI: PREGUNTAS ---
  if (msg.content.startsWith("!preguntar")) {
    const pregunta = msg.content.replace("!preguntar", "").trim();

    if (!pregunta) {
      return msg.reply("✝️ Escribe una pregunta. Ejemplo: `!preguntar ¿Qué significa tener fe?`");
    }

    msg.channel.send("⏳ Orando y buscando sabiduría... ✝️");

    try {
      // ---- CHAT COMPLETIONS CON TEMPERATURE PARA RESPUESTAS DINÁMICAS ----
      const respuesta = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Responde como un consejero cristiano pentecostal amable de la IPULRD: ${pregunta}`
          }
        ],
        temperature: 0.8,
        top_p: 0.9
      });

      const texto = respuesta.choices[0].message.content;
      msg.reply("📖 **Respuesta basada en la Biblia:**\n" + texto);

    } catch (err) {
      console.error(err);
      msg.reply("❌ Hubo un error buscando la respuesta, mi hermano.");
    }
  }

  // --- COMANDOS YA EXISTENTES ---
  if (msg.content === "!versiculo") {
    const vers = [
      "📖 Jehová es mi pastor; nada me faltará. — Salmos 23:1",
      "📖 Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13",
      "📖 Jehová es mi luz y mi salvación; ¿de quién temeré? — Salmos 27:1",
      "📖 Clama a mí y yo te responderé. — Jeremías 33:3"
    ];
    msg.reply(vers[Math.floor(Math.random() * vers.length)]);
  }

  if (msg.content === "!oracion") {
    const oraciones = [
      "🙏 Señor, bendice a este joven, guíalo, fortalécelo y cúbrelo con tu paz.",
      "🙏 Padre Celestial, protégenos y acompáñanos cada día.",
      "🙏 Que Tu luz ilumine nuestro camino, Señor.",
      "🙏 Gracias por tu misericordia, Jesús."
    ];
    msg.reply(oraciones[Math.floor(Math.random() * oraciones.length)]);
  }

  if (msg.content === "!ipul") {
    msg.reply("🔥 La Iglesia Pentecostal Unida Latinoamericana (IPUL) enseña la importancia del bautismo en el Nombre de Jesús, la santidad personal y vivir guiados por el Espíritu Santo. Nuestra misión es compartir el evangelio y ayudar a todos a acercarse a Cristo.");
  }

  if (msg.content.startsWith("!limpiar")) {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return msg.reply("❌ No tienes permiso para limpiar mensajes.");

    const cantidad = parseInt(msg.content.split(" ")[1]);
    if (!cantidad || cantidad < 1)
      return msg.reply("Escribe cuántos mensajes borrar.");

    msg.channel.bulkDelete(cantidad, true);
    msg.channel.send(`🧹 Se borraron **${cantidad}** mensajes.`);
  }

  if (msg.content === "!cmds") {
    msg.reply("📜 **Comandos:**\n!versiculo\n!oracion\n!ipul\n!limpiar\n!saludo\n!ayuda\n!cmds\n!preguntar <tu pregunta>");
  }

  if (msg.content === "!saludo") {
    msg.reply("👋 ¡Dios te bendiga hoy y siempre! ✝️");
  }

  if (msg.content === "!ayuda") {
    msg.reply("💡 Usa !cmds para ver los comandos.");
  }
});

// ---- BOT LOGIN ----
bot.login(process.env.TOKEN || "AQUÍ_PARA_PROBAR_LOCAL");

// ==============================
// ⚠️ EXTRA AÑADIDO (SIN CAMBIAR NADA)
// Esto es SOLO para que Render no crashee
// ==============================
process.on("uncaughtException", err => console.log("Error controlado:", err));
process.on("unhandledRejection", err => console.log("Promesa rechazada:", err));
