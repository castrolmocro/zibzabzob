const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "image",
  version: "1.0.0",
  permission: 1,
  credits: "imran",
  prefix: true,
  description: "تغيير صورة الغروب",
  category: "admin",
  usages: "image change",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID, messageID, attachments, messageReply } = event;

  const botAdmins = [
    ...(global.config.ADMINBOT || []),
    ...(global.config.OPERATOR || []),
    ...(global.config.OWNER || [])
  ].map(String);

  if (!botAdmins.includes(String(senderID))) {
    return api.sendMessage("❌ هذا الأمر للأدمنز فقط.", threadID, messageID);
  }

  const sub = (args[0] || "").toLowerCase();

  if (sub === "change") {
    const replyAttachments = messageReply?.attachments;
    const directAttachments = attachments;

    let imageURL = null;

    if (replyAttachments && replyAttachments.length > 0 && replyAttachments[0].type === "photo") {
      imageURL = replyAttachments[0].url;
    } else if (directAttachments && directAttachments.length > 0 && directAttachments[0].type === "photo") {
      imageURL = directAttachments[0].url;
    } else if (args[1] && args[1].startsWith("http")) {
      imageURL = args[1];
    }

    if (!imageURL) {
      return api.sendMessage(
        "📸 أرسل الصورة المراد وضعها كصورة الغروب كرد على هذه الرسالة.",
        threadID,
        (err, info) => {
          if (err || !info) return;
          global.client.handleReply.push({
            name: module.exports.config.name,
            author: senderID,
            messageID: info.messageID,
            type: "change"
          });
        },
        messageID
      );
    }

    return changeGroupImage(api, threadID, imageURL);
  }

  return api.sendMessage(
    `📷 أوامر الصورة:\n!image change — تغيير صورة الغروب\n\nأرسل الصورة مرفقة مع الأمر أو كرد.`,
    threadID,
    messageID
  );
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  const { threadID, messageID, attachments, senderID } = event;

  if (handleReply.author !== String(senderID)) return;

  if (handleReply.type === "change") {
    if (!attachments || attachments.length === 0 || attachments[0].type !== "photo") {
      return api.sendMessage("❌ الرجاء إرسال صورة صالحة.", threadID, messageID);
    }
    const imageURL = attachments[0].url;
    return changeGroupImage(api, threadID, imageURL);
  }
};

async function changeGroupImage(api, threadID, imageURL) {
  try {
    const response = await axios.get(imageURL, { responseType: "arraybuffer", timeout: 15000 });
    const buffer = Buffer.from(response.data, "binary");

    const tempDir = path.join(__dirname, "temp_images");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const tempPath = path.join(tempDir, `img_${threadID}_${Date.now()}.jpg`);
    fs.writeFileSync(tempPath, buffer);

    await api.changeGroupImage(threadID, fs.createReadStream(tempPath));

    try { fs.unlinkSync(tempPath); } catch (e) {}

    return api.sendMessage("✅ تم تغيير صورة الغروب بنجاح!", threadID);
  } catch (e) {
    console.error("[image change]", e.message);
    return api.sendMessage("❌ حدث خطأ أثناء تغيير الصورة. تأكد أن البوت أدمن في الغروب.", threadID);
  }
}
