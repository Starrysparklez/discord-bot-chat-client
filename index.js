// (c) NellyD3v 2019-2020

const Discord = require("discord.js");
const client = new Discord.Client();
const io = require("console-read-write");
const util = require("util");

var config = require("./config.json");
var channel;

client.on("ready", async () => {

  if (!config.channel_id) {
    config.channel_id = await io.ask("ID: ");
    channel = client.channels.get(config.channel_id);
  }
  if (!channel) return console.log(`${config.channel_id}: Невалидный канал, сорре`);
  
  console.log(`Вы в сети под ${client.user.tag} в канале ${channel.name}`);
  while (true) {
    let msg = await io.ask(">");
    await channel.startTyping();
    

    let args = msg.split(' ');
    args.forEach(arg => {
      if (arg.startsWith(":") && arg.endsWith(":"))
        args[args.indexOf(arg)] = client.emojis.find(e => e.name === `${arg.split(":").join("")}`) || arg;

      if (arg.startsWith("@"))
        args[args.indexOf(arg)] = client.users.find(u => u.id == `${arg.replace("@", "")}`) || "@Unknown";

    });
    msg = args.join(' ');

    await channel.stopTyping();
    
    if (msg.startsWith("//channel")) {
      config.channel_id = msg.slice(10).trim().split(/ +/g).join('')
      channel = client.channels.get(config.channel_id)
      console.log(`[?] Канал изменен на ${channel.name}`);
    }
    
    if (msg.startsWith("/")) {
      try {
	let output = eval(`${msg.slice(1).trim().split(/ +/g).join(' ')}`);
        output = util.inspect(`${output}`);
	console.log(output);
      } catch(err) {
        let output = util.inspect(`Шото не так: ${err}`);
	console.log(output);
      }
    } else {
      await channel.send(msg).catch(e => console.log("[!] Ты шо аферист??"));
    }

  }
});

if (!config.token) console.log('[!] Введите токен вашего бот-аккаунта в config.json');
else client.login(config.token);
