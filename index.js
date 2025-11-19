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

// ---- LISTA DE PALABRAS PROHIBIDAS ----
const palabrasProhibidas = [
  // Español
  "mierda","puta","gilipollas","idiota","cabron","estupido","joder","verga",
  "pendejo","coño","culero","hijo de puta","malparido","zorra",
  // Inglés
  "fuck","shit","bitch","asshole","damn","bastard","dumb",
  // Francés
  "merde","pute","connard","idiot",
  // Alemán
  "scheisse","hurensohn","idiot",
  // Italiano
  "cazzo","stronzo","idiota","merda",
  // Portugués
  "merda","puta","idiota","caralho"
];

// ---- COMANDOS Y FILTRO DE PALABRAS ----
bot.on("messageCreate", msg => {
  if (msg.author.bot) return;

  const contenido = msg.content.toLowerCase();

  // ---- FILTRAR PALABRAS ----
  if (palabrasProhibidas.some(p => contenido.includes(p))) {
    msg.delete().catch(() => {});
    msg.channel.send(`❌ ${msg.author}, por favor no uses lenguaje vulgar.`).then(m => {
      setTimeout(() => m.delete().catch(() => {}), 5000);
    });
    return;
  }

  // ---- !versiculo ----
  if (contenido === "!versiculo") {
    const versiculos = [
      "📖 *Jehová es mi pastor; nada me faltará.* — Salmos 23:1",
      "📖 *Todo lo puedo en Cristo que me fortalece.* — Filipenses 4:13",
      "📖 *Jehová es mi luz y mi salvación; ¿de quién temeré?* — Salmos 27:1",
      "📖 *Clama a mí y yo te responderé.* — Jeremías 33:3",
      "📖 *El Señor es mi roca y mi salvador.* — Salmos 18:2",
      "📖 *El Señor es bueno, un refugio en tiempos de angustia.* — Nahúm 1:7",
      "📖 *Confía en el Señor con todo tu corazón.* — Proverbios 3:5",
      "📖 *No temas, porque yo estoy contigo.* — Isaías 41:10",
      "📖 *Porque yo sé los planes que tengo para ustedes.* — Jeremías 29:11",
      "📖 *El amor de Dios ha sido derramado en nuestros corazones.* — Romanos 5:5"
    ];
    msg.reply(versiculos[Math.floor(Math.random() * versiculos.length)]);
  }

  // ---- !oracion ----
  if (contenido === "!oracion") {
    const oraciones = [
      "🙏 *Señor, bendice a este joven. Guíalo, fortalécelo y cúbrelo con tu paz. Amén.*",
      "🙏 *Padre, protégelo de todo mal, y llénalo de sabiduría y alegría en Tu nombre.*",
      "🙏 *Dios, fortalece su fe, dale valor y haz que sea luz en su entorno.*",
      "🙏 *Señor Jesús, acompáñalo hoy y siempre, y que tu amor lo rodee.*"
    ];
    msg.reply(oraciones[Math.floor(Math.random() * oraciones.length)]);
  }

  // ---- !ipul ----
  if (contenido === "!ipul") {
    msg.reply(
      "🔥 *La Iglesia Pentecostal Unida Latinoamericana (IPUL) proclama el bautismo en el Nombre de Jesús, la santidad y el poder del Espíritu Santo.*"
    );
  }

  // ---- !limpiar ----
  if (contenido.startsWith("!limpiar")) {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return msg.reply("❌ No tienes permiso para limpiar mensajes.");

    const cantidad = parseInt(msg.content.split(" ")[1]);
    if (!cantidad || cantidad < 1)
      return msg.reply("Escribe cuántos mensajes borrar.");

    msg.channel.bulkDelete(cantidad, true);
    msg.channel.send(`🧹 Se borraron **${cantidad}** mensajes.`).then(m => {
      setTimeout(() => m.delete().catch(() => {}), 5000);
    });
  }
});

// ---- INICIAR BOT ----
bot.login(process.env.TOKEN || "AQUÍ_PARA_PROBAR_LOCAL");
