const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "2.2.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with a Simsimi-like bot (reply + trigger words support)",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// Cute/funny replies
const cuteReplies = [
  "I love you 💝",
  "এ বেডা তোগো GC এর C E O বাপ্পি কই😌",
  "তোর বাড়ি কি উগান্ডা এখানে হুম",
  "Bot না জানু,বল 😌",
  "বলো জানু 🌚",
  "তোর কি চোখে পড়ে না আমি ইমরান বস এর সাথে ব্যাস্ত আসি😒",
  "𝙏𝙢𝙧 𝙣𝙖𝙣𝙞 𝙧 𝐨𝐢 𝐭𝐚  😑🥺",
  "amr Jan lagbe,Tumi ki single aso?",
  "𝙏𝙪𝙢𝙖𝙧 BF 𝙣𝙖𝙞 ,𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤?😂😂😂",
  "babu khuda lagse🥺", "Hop beda😾,Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘", "🐒🐒🐒",
  "bye", "naw message daw m.me/Imran.Ahmed099", "mb ney bye", "meww", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
  "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘", "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏", "গোসল করে আসো যাও😑😩", "অ্যাসলামওয়ালিকুম", "কেমন আসো",
  "বলেন sir__😌", "বলেন ম্যাডাম__😌", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে", "🙂🙂🙂", "এটায় দেখার বাকি সিলো_🙂🙂🙂",
  "𝗕𝗼𝘁 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼,,😒😒", "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂", "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
  "𝗕𝗼𝘁 না জানু, বল 😌", "বেশি Bot Bot করলে leave নিবো কিন্তু 😒😒", "__বেশি বেবি বললে কামুর দিমু 🤭🤭", 
  "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂", "bolo baby😒", "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
  "আমি তো অন্ধ কিছু দেখি না🐸 😎", "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣", "𝗼𝗶𝗶 ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!🤔_নাহ মানে চুরি করতাম 😞😘",
  "𝗕𝗼𝘁 না বলে 𝗕𝗼𝘄 বলো 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু 𝗕𝗼𝘁 𝗕𝗼𝘁 করিস  😉😋🤣", "এই এই তোর পরীক্ষা কবে? শুধু 𝗕𝗼𝘁 𝗕𝗼𝘁 করিস 😾", 
  "তোরা যে হারে 𝗕𝗼𝘁 ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹😑", "আজব তো__😒", "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀️", "𝗕𝗼𝘁 বললে চাকরি থাকবে না", 
  "𝗕𝗼𝘁 𝗕𝗼𝘁 না করে আমার বস ইমরান এর লগে প্রেম করতে পারো😑?", "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈", "🍺 এই নাও জুস খাও..!𝗕𝗼𝘁 বলতে বলতে হাপায় গেছো না 🥲",
  "হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗼𝘁 বলে অসম্মান করচ্ছিছ,😰😿", "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁", "খাওয়া দাওয়া করসো 🙄", 
  "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈", "আরে আমি মজা করার mood এ নাই😒", "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁", "আরে Bolo আমার জান, কেমন আসো? 😚",
  "একটা BF খুঁজে দাও 😿", "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗", "oi mama ar dakis na pilis 😿", "🐤🐤", "__ভালো হয়ে  যাও 😑😒",
  "এমবি কিনে দাও না_🥺🥺", "ওই মামা_আর ডাকিস না প্লিজ", "৩২ তারিখ আমার বিয়ে 🐤", "হা বলো😒,কি করতে পারি😐😑?", "বলো ফুলটুশি_😘",
  "amr JaNu lagbe,Tumi ki single aso?", "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺", "তোর বিয়ে হয় নি 𝗕𝗼𝘁 হইলো কিভাবে,,🙄", 
  "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄", "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
  "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗", "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
  "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺", "বলো কি করতে পারি তোমার জন্য 😚", "কথা দেও আমাকে পটাবা...!! 😌", 
  "বার বার Disturb করেছিস কোনো 😾, আমার জানু এর সাথে ব্যাস্ত আসি 😋", "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺", 
  "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒", "ওই তুমি single না?🫵🤨 😑😒", "বলো জানু 😒", "Meow🐤", "আর কত বার ডাকবা ,শুনছি তো 🤷🏻‍♀️", 
  "কি হলো, মিস টিস করচ্ছো নাকি 🤣", "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈", "আজকে আমার মন ভালো নেই 🙉"
];
module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    const reply = cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
    return api.getUserInfo(senderID, (err, result) => {
      if (err) return console.error(err);

      const userName = result[senderID].name;

      api.sendMessage({
        body: `${userName}, ${reply}`,
        mentions: [{ tag: userName, id: senderID }]
      }, threadID, (err, info) => {
        if (err) return;
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID
        });
      }, messageID);
    });
  }

  try {
    const response = await axios.get(`https://www.noobs-api.rf.gd/dipto/baby?text=${encodeURIComponent(query)}&senderID=100075122837809&font=1`);
    const reply = response.data.reply || "I didn't get that. Try asking something else!";

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  } catch (error) {
    console.error("API Error:", error.message);
    api.sendMessage("Something went wrong while contacting the bot service.", threadID, messageID);
  }
};

module.exports.handleReply = async ({ api, event }) => {
  const { threadID, messageID, senderID, body } = event;

  try {
    const response = await axios.get(`https://www.noobs-api.rf.gd/dipto/baby?text=${encodeURIComponent(body)}&senderID=100075122837809&font=1`);
    const reply = response.data.reply || "I didn't get that. Try asking something else!";

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  } catch (error) {
    console.error("API Error:", error.message);
    api.sendMessage("Something went wrong while contacting the bot service.", threadID, messageID);
  }
};

module.exports.handleReaction = async ({ api, event }) => {
  const { reaction, messageReply } = event;

  if (reaction === '😡') {
    try {
      await api.unsendMessage(messageReply.messageID);
    } catch (err) {
      console.error("Failed to unsend message:", err.message);
    }
  }
};
