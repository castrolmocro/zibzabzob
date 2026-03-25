module.exports.config = {
  name: "help",
  version: "1.0.2",
  permission: 0,
  credits: "IMRAN",
  description: "beginners guide with imran style",
  prefix: true,
  premium: false,
  category: "guide",
  usages: "[page] or [command]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  en: {
    get moduleInfo() {
      const prefix = (global.config && global.config.PREFIX) || "!";
      return `⚡️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ⚡️\n━━━━━━━━━━━━━━━━━━\n🗡️ 𝗡𝗮𝗺𝗲 » %1\n📝 𝗗𝗲𝘀𝗰 » %2\n🧩 𝗨𝘀𝗮𝗴𝗲 » ${prefix}%3\n📦 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 » %4\n⏱️ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻 » %5s\n🔒 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 » %6\n✨ 𝗖𝗿𝗲𝗱𝗶𝘁𝘀 » %7`;
    },
    get helpList() {
      const prefix = (global.config && global.config.PREFIX) || "!";
      const botname = (global.config && global.config.BOTNAME) || "IMRAN";
      return `🗡️ ${botname} 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🗡️\n\n𝗧𝗼𝘁𝗮𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 » %1\n𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀 » %2\n\n𝗧𝘆𝗽𝗲 ${prefix}𝗵𝗲𝗹𝗽 𝗽𝗮𝗴𝗲𝗡𝘂𝗺 𝘁𝗼 𝘃𝗶𝗲𝘄 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀`;
    },
    user: "👤 User",
    adminGroup: "👑 Group Admin",
    adminBot: "🤖 Bot Admin",
  },
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;  

  if (!body || body.toLowerCase().indexOf("help") !== 0) return;

  const input = body.toLowerCase().split(" ");
  if (input.length < 2) return;

  const commandName = input[1];
  if (!commands.has(commandName)) return;

  const command = commands.get(commandName);
  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${command.config.name} ${command.config.usages || ""}`.trim(),
      command.config.category,
      command.config.cooldowns,
      command.config.permission === 0
        ? getText("user")
        : command.config.permission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const { autoUnsend, delayUnsend } = this.config.envConfig;

  // Single command help
  if (args[0]) {
    const command = commands.get(args[0].toLowerCase());
    if (command) {
      const info = getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${command.config.name} ${command.config.usages || ""}`.trim(),
        command.config.category,
        command.config.cooldowns,
        command.config.permission === 0
          ? getText("user")
          : command.config.permission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      );

      const sentMsg = await api.sendMessage(info, threadID);
      if (autoUnsend) {
        setTimeout(() => api.unsendMessage(sentMsg.messageID), delayUnsend * 1000);
      }
      return;
    }
  }

  // Full command list
  const commandList = Array.from(commands.values());
  const categories = [...new Set(commandList.map(cmd => cmd.config.category.toLowerCase()))];
  const itemsPerPage = 6;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  let currentPage = parseInt(args[0]) || 1;

  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, categories.length);
  const visibleCategories = categories.slice(startIdx, endIdx);

  // Create ASCII art header
  let msg = `\n🗡️ 𝗜 𝗠 𝗥 𝗔 𝗡   𝗖 𝗢 𝗠 𝗠 𝗔 𝗡 𝗗 𝗦 🗡️\n`;
  msg += `✧･ﾟ: *✧･ﾟ:* ༻ ༺ *:･ﾟ✧*:･ﾟ✧\n\n`;

  // Add categories with stylish formatting
  for (const category of visibleCategories) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const cmds = commandList
      .filter(cmd => cmd.config.category.toLowerCase() === category)
      .map(cmd => cmd.config.name);

    msg += `⦿ ━━━━『 ${categoryName} 』━━━━ ⦿\n`;
    msg += `│  ${cmds.join(', ')}\n`;
    msg += `✧･ﾟ: *✧･ﾟ:* *:･ﾟ✧*:･ﾟ✧\n\n`;
  }

  // Add pagination footer
  msg += `📄 𝗣𝗮𝗴𝗲 ${currentPage}/${totalPages}\n`;
  msg += `🔰 𝗧𝗶𝗽: 𝗧𝘆𝗽𝗲 ${global.config.PREFIX}𝗵𝗲𝗹𝗽 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗡𝗮𝗺𝗲\n\n`;
  msg += getText("helpList", commands.size, categories.length);

  // Send message with visual effects
  const formattedMsg = {
    body: msg,
    mentions: [{
      tag: global.config.BOTNAME,
      id: api.getCurrentUserID(),
    }]
  };

  const sentMsg = await api.sendMessage(formattedMsg, threadID);
  if (autoUnsend) {
    setTimeout(() => api.unsendMessage(sentMsg.messageID), delayUnsend * 1000);
  }
};