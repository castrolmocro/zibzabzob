const fs = require("fs-extra");
const path = require("path");

const lockFilePath = path.join(__dirname, "../../main/configs/botlock.json");

function loadLockState() {
  try {
    if (fs.existsSync(lockFilePath)) {
      const data = fs.readJsonSync(lockFilePath);
      return data.locked === true;
    }
  } catch (e) {}
  return false;
}

function saveLockState(locked) {
  try {
    fs.writeJsonSync(lockFilePath, { locked }, { spaces: 2 });
  } catch (e) {}
}

module.exports.config = {
  name: "lock",
  version: "1.0.0",
  permission: 1,
  prefix: true,
  credits: "imran",
  description: "قفل البوت ومنع المستخدمين من استخدام الأوامر",
  category: "admin",
  usages: "lock on | lock off",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const { ADMINBOT, OWNER, OPERATOR } = global.config;

  const isAdmin =
    (ADMINBOT || []).includes(String(senderID)) ||
    (OWNER || []).includes(String(senderID)) ||
    (OPERATOR || []).includes(String(senderID));

  if (!isAdmin) {
    return api.sendMessage("❌ هذا الأمر للأدمنز فقط.", threadID, messageID);
  }

  const action = (args[0] || "").toLowerCase();

  if (action === "on") {
    global.ryuko.botLocked = true;
    saveLockState(true);
    return api.sendMessage(
      "🔒 تم قفل البوت.\nالآن فقط الأدمنز يمكنهم استخدام الأوامر.\nللفتح: !lock off",
      threadID,
      messageID
    );
  }

  if (action === "off") {
    global.ryuko.botLocked = false;
    saveLockState(false);
    return api.sendMessage(
      "🔓 تم فتح البوت.\nيمكن للجميع الآن استخدام الأوامر.",
      threadID,
      messageID
    );
  }

  const currentState = global.ryuko.botLocked ? "🔒 مقفول" : "🔓 مفتوح";
  return api.sendMessage(
    `حالة البوت الحالية: ${currentState}\n\nالاستخدام:\n!lock on — قفل البوت\n!lock off — فتح البوت`,
    threadID,
    messageID
  );
};

module.exports.onLoad = function () {
  if (!global.ryuko) global.ryuko = {};
  global.ryuko.botLocked = loadLockState();
};

if (global.ryuko && global.ryuko.botLocked === undefined) {
  global.ryuko.botLocked = loadLockState();
}
