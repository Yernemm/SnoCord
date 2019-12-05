'use strict';

function mergeDefault(def, given) {
  if (!given) return def;
  for (const key in def) {
      if (!{}.hasOwnProperty.call(given, key)) {
          given[key] = def[key];
      } else if (given[key] === Object(given[key])) {
          given[key] = mergeDefault(def[key], given[key]);
      }
  }

  return given;
}

function parseCommand(bot, message, prefixOverride) {
    if (message.author.bot) return null;

    const content = message.content.trim();
    
    // If the message starts with a prefix
    const prefixed = content.startsWith(prefixOverride || bot.config.prefix);
    const mentioned = bot.config.mentionAsPrefix ? bot.mention.test(content) : false;

    if (!prefixed && !mentioned) return null;

    const prefix = prefixed ? bot.config.prefix : content.match(bot.mention)[0];

    // Dissallow whitespace between the prefix and command name
    if (/^\s+/.test(content.slice(prefix.length))) return;

    let args = content.slice(prefix.length).trim().split(/\s+/g);
    const command = args.shift().toLowerCase();
    const argsText = content.slice(prefix.length + command.length).trim();

    return { bot, message, command, args, argsText };
}

module.exports = {
  mergeDefault,
  parseCommand
};
