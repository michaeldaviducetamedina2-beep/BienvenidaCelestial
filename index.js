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
      "📖 *Jehová es mi pastor; nada me faltará.* — Salmos 23:1",
      "📖 *Todo lo puedo en Cristo que me fortalece.* — Filipenses 4:13",
      "📖 *Jehová es mi luz y mi salvación; ¿de quién temeré?* — Salmos 27:1",
      "📖 *Clama a mí y yo te responderé.* — Jeremías 33:3"
    ];
    msg.reply(vers[Math.floor(Math.random() * vers.length)]);
  }

  // !oracion
  if (msg.content === "!oracion") {
    msg.reply(
      "🙏 *Señor, bendice a este joven. Guíalo, fortalécelo y cúbrelo con tu paz. Amén.*"
    );
  }

  // !ipul
  if (msg.content === "!ipul") {
    msg.reply(
      "🔥 *La Iglesia Pentecostal Unida Latinoamericana (IPUL) proclama el bautismo en el Nombre de Jesús, la santidad y el poder del Espíritu Santo.*"
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
