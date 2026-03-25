# replit.md

## Overview

IMRAN BOT V4 is a fully customizable Facebook Messenger bot built on Node.js. It provides automated messaging, group management, AI chat capabilities, image generation, and various entertainment features. The bot uses the unofficial Facebook Chat API (fca-ws3) to interact with Messenger and supports modular command/event systems for extensibility.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Application Structure

The bot follows a modular architecture with clear separation of concerns:

- **Entry Point**: `index.js` → `main/catalogs/IMRANA.js` (spawns the main bot process)
- **Main Bot Logic**: `main/catalogs/IMRANB.js` (obfuscated core bot handler)
- **Event Listener**: `main/system/listen.js` (handles incoming Facebook events)
- **Logger Utility**: `main/catalogs/IMRANC.js` (custom console logging with chalk/gradient styling)
- **Helper Utilities**: `main/catalogs/IMRAND.js` (encryption, GUID generation, utility functions)

### Command System

Commands are stored in `scripts/commands/` as individual JavaScript modules. Each command exports:
- `config`: Metadata (name, version, permission level, prefix requirement, cooldown, etc.)
- `run`: Main execution function
- `handleReply` (optional): For multi-step conversations
- `handleEvent` (optional): For event-based triggers
- `handleReaction` (optional): For reaction-based interactions

### Permission Levels
- **0**: All users
- **1**: Group admins
- **2**: Bot admins (defined in Config.json ADMINBOT array)
- **3**: Bot operators (defined in Config.json OPERATOR array)

### Configuration Files

| File | Purpose |
|------|---------|
| `Config.json` | Bot name, prefix, admin/operator UIDs, disabled commands |
| `main/configs/Config.json` | Facebook login options, API keys, feature toggles |
| `main/configs/api.json` | External API endpoints |
| `main/configs/console.json` | Console output styling configuration |
| `appstate.json` | Encrypted Facebook session state |

### Data Storage

- **SQLite**: Used via Sequelize ORM for persistent data (users, threads, settings)
- **JSON Files**: 
  - `main/botdata/approvedlists.json`: Approved group IDs
  - `main/botdata/premiumlists.json`: Premium user IDs
- **Global State**: In-memory Maps for runtime data (threadData, userBanned, threadBanned)

### Auto-Management Features (IMRAN.js)

- Auto bio update
- Scheduled greetings (morning/afternoon/evening) — interval fixed to 60s (was 1s)
- Auto cache deletion — paths made absolute using `__dirname`
- Auto restart intervals
- Auto-accept pending messages

### Web Server

Express.js server runs on port 5000 serving a status page at `main/catalogs/website/ryuko.html`.

## External Dependencies

### Facebook Integration
- **fca-ws3**: Unofficial Facebook Chat API client for Messenger interactions
- **appstate.json**: Encrypted session cookies for authentication (AES encryption)

### External APIs
- `masterapi.fun`: Primary API for various bot features
- `canvas-api-imran.vercel.app`: Image generation/manipulation
- `love-api-imran-smco.onrender.com`: Love-themed image generation
- `openweathermap.org`: Weather data
- `kaiz-apis.gleeze.com`: AI chat (GPT-4.1)
- `simsimi-fun.vercel.app`: Simsimi-style chat bot
- `ephoto360.com`: Text-to-image effects
- `imgur`: Image hosting/upload

### Key NPM Dependencies
- **axios**: HTTP requests
- **express**: Web server
- **sequelize + sqlite3**: Database ORM
- **moment-timezone**: Time handling (Asia/Dhaka, Asia/Manila)
- **chalk + gradient-string**: Console styling
- **jimp**: Image processing
- **nodemailer**: Email notifications
- **node-cron**: Scheduled tasks
- **openai**: OpenAI API integration
- **fs-extra**: Enhanced file system operations

### Email Notifications
- Nodemailer configured for box approval notifications (configurable via Config.json)

## Bug Fixes & Improvements

### Fix 1: utils.warn / utils.error / utils.log (TypeError after 3+ hours)
- **Problem**: `listenMqtt.js` called `utils.warn(...)`, `utils.error(...)`, `utils.log(...)` but these were not exported from `utils.js`, causing a `TypeError: utils.warn is not a function` crash after MQTT connection errors.
- **Fix**: Added `warn`, `error`, and `log` as proper exports in `main/system/ws3-fca/utils.js`, delegating to the existing IMRANC logger.

### Fix 2: handleCommand.js - All Regular Users Blocked (CRITICAL)
- **Problem**: Lines 19-22 had a block that returned early if the sender was not ADMINBOT/OWNER/OPERATOR and the message started with PREFIX. This meant regular users (permission: 0) could NEVER use any commands at all.
- **Fix**: Removed the incorrectly placed early-return block. Permission checking is already correctly handled later in the function.

### Fix 3: bot.js - `this.config.name` in Arrow Functions
- **Problem**: Three uses of `this.config.name` inside arrow functions. Arrow functions don't have their own `this`, so `this` could be wrong depending on the call context.
- **Fix**: Replaced all `this.config.name` with `module.exports.config.name` for reliable access.

### Fix 4: handleCreateDatabase.js - Implicit Global Variable
- **Problem**: `for (singleData of threadIn4.userInfo)` - `singleData` was not declared with `let`/`const`/`var`, creating a global variable leak that could cause cross-request data corruption.
- **Fix**: Changed to `for (let singleData of threadIn4.userInfo)`.

### Fix 5: handleCommandEvent.js - Typo Causes ReferenceError
- **Problem**: Line referenced `messengeID` (typo) instead of `messageID`. This would throw a `ReferenceError` if a command was used without having a matching language file.
- **Fix**: Removed the undefined `messengeID` from the `api.sendMessage` call.

### Improvement: Cookie Keep-Alive & Auto-Save System
- **Previous behavior**: Pinged Facebook every 30 min (HTTP request only), saved appstate every 2 min.
- **New behavior**:
  - Appstate auto-saved every **5 minutes**.
  - Cookie refresh ping runs every **20 minutes**: fetches Facebook homepage, applies new `Set-Cookie` headers to the jar via `saveCookies`, then writes updated appstate to `appstate.json`.
  - Also saves on process exit / SIGINT / SIGTERM signals.

### Improvement: Periodic fb_dtsg Token Refresh
- **Problem**: The `fb_dtsg` token was never refreshed after login. Facebook invalidates this token, causing API failures after ~48 hours with "Please try closing and re-opening your browser window" errors.
- **Fix**: Added a scheduled task in `index.js` that calls `api.refreshFb_dtsg()` every 24 hours to keep the token valid.

### Fix 6: handleReply.js - Same messengeID Typo
- **Problem**: `handleReply.js` line 18 also had `messengeID` typo (same as `handleCommandEvent.js`). This caused a ReferenceError when a handleReply command used a language that wasn't found.
- **Fix**: Removed the undefined `messengeID` from the `api.sendMessage` call.

### Fix 7: setgroupimage.js - Critical API Spam Bug
- **Problem**: The protection interval ran every 15 seconds and compared `info.imageSrc` (an https URL) with `tempFilePath` (a local file path like `/home/.../group_xxx.jpg`). These are NEVER equal, so it always tried to change the image every 15 seconds, spamming Facebook's API and risking account bans.
- **Fix**: The command now stores the image's URL (after setting it) alongside the file path. The interval now correctly compares `info.imageSrc` against the stored URL. Also increased interval to 30 seconds.

### New Command: !image change
- **File**: `scripts/commands/image.js`
- **Usage**: `!image change` (with photo attached or as reply) to change the group profile picture.
- **Admins only**: ADMINBOT/OWNER/OPERATOR only.
- **Features**: Handles reply-to-photo, direct attachment, or URL as second argument. Supports handleReply flow for prompting user to send a photo.