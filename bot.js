const Discord = require("discord.js");
const client = new Discord.Client(); 
const config = require("./config.json"); 


client.on("ready", () => {;
  
  let status = [
    {name: `Eu sou Open Source!`, type: 'WATCHING', url: 'https://twitch.tv/izael61'},
    {name: `comandos para voce`, type: 'PLAYING', url: 'https://twitch.tv/izael61'},
    {name: `use ?comandos`, type: 'STREAMING', url: 'https://twitch.tv/izael61'}, 
    {name: `atualmente estou em ${client.guilds.size} servidores.`, type: 'WATCHING', url: 'https://twitch.tv/izael61'},

    
  ];

  console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`); 


    function setStatus() {
        let randomStatus = status[Math.floor(Math.random() * status.length)];
        client.user.setPresence({game: randomStatus});
    };
  
    setStatus();
    setInterval(() => setStatus(), 10000); //{1000/1s}\{10000/10s}\{100000/1m}
});


client.on("guildCreate", guild => {
  console.log(`O bot entrou nos servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
  client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
});

client.on("guildDelete", guild => {
  console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
});


client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();

  if(comando === "comandos") {
    const embed = new Discord.RichEmbed()
    .setColor(0xffffff)  
    .setTitle("Comandos:")
    .addField("?ping:", "mostrará sua latência")
    .addField("?ban [Usuário]", "Para banir um usuário")
    .addField("?kick [Usuário]", "Para expulsar um usuário")
    .addField("?staff", "Para mostrar os Staffs")
    .addField("?bot", "mostra as informações do bot")
    .addField("?denunciar [@usuário] [motivo]", "para denunciar alguém aos Staffs" )
    message.channel.send({embed})
  } 

  if(comando === "staff") {
    const m = await message.channel.send("Staff?");
    m.edit(`Nossos Staffs são: <@454403513779355658>, <@375008848161013761> e <@190150595724705793>`);
  }

  if(comando === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms.`);
  }

  if(comando === "say") { 
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);
  }

  if(comando === "apagar") {
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Por favor, forneça um número entre 2 e 100 para o número de mensagens a serem excluídas");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Não foi possível deletar mensagens devido elas serem enviadas há mais de 2 semanas!`));
  }
  
  if(comando === "kick") {
// Cargos habilitados para o comando vv EX: ["Dono", "Moderador"]
    if(!message.member.roles.some(r=>[].includes(r.name)) )
      return message.reply("Desculpe, você não tem permissão para usar isto!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Por favor mencione um membro válido deste servidor");
    if(!member.kickable) 
      return message.reply("Eu não posso expulsar este usuário! Ele pode ter um cargo mais alto ou eu não tenho permissão para isso!");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    
    await member.kick(reason)
      .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
    message.reply(`${member.user.tag} foi kickado por ${message.author.tag} Motivo: ${reason}`);

  }
  
  if(comando === "ban") {
      // Cargos habilitados para o comando EX: ["Dono", "Moderador"]
      //                             vv
    if(!message.member.roles.some(r=>[].includes(r.name)) )
      return message.reply("Desculpe, você não tem permissão para usar isto!");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Por favor mencione um membro válido deste servidor");
    if(!member.bannable) 
      return message.reply("Eu não posso banir este usuário! Ele pode ter um cargo mais alto ou eu não tenho permissão para isso!");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    await member.ban(reason)
      .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
    message.reply(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
  }
  
    if(comando === "bot") {
      const embed = new Discord.RichEmbed()
      .setColor(0xffff00)  
      .setTitle("QwertBOT")
      .addField("Criador", "<@190150595724705793>")
      .addField("Quer um bot?", "contate <@190150595724705793>")
      .addField("Changelog", "[Clique](https://discord.gg/f5qJ2wz)")
      .addField("Me convide!", "[clique para me convidar](https://discordapp.com/oauth2/authorize?=&client_id=553707048202665984&scope=bot&permissions=8)", true)
      .addField("Quer entrar no meu servidor?", "[Clique para entrar](https://discord.gg/f5qJ2wz)", true)
      .addField("Fui feito em", "JavaScript (Discord.js)")
      message.channel.send({embed})
    }

    if(comando === "denunciar"){

      
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!rUser) return message.channel.send("Não consegui achar este usuário.");
      let rreason = args.join(" ").slice(22);
  
      let reportEmbed = new Discord.RichEmbed()
      .setDescription("Denúncias")
      .setColor("#0xff0000")
      .addField("Usuário reportado", `${rUser} com a ID: ${rUser.id}`)
      .addField("Reportado por", `${message.author} com a ID: ${message.author.id}`)
      .addField("Canal", message.channel)
      .addField("Hora", message.createdAt)
      .addField("Razão", rreason)
      
  
                                              //mude o canal aqui  vv
      let reportschannel = message.guild.channels.find(`name`, "denuncias");
      if(!reportschannel) return message.channel.send("Não achei o canal de denuncias.");
  
  
      message.delete().catch(O_o=>{});
      reportschannel.send(reportEmbed);
  
      return;
    }

  });

client.login(config.token);
