const Discord = require('discord.js');
const util = require('../utils.js');
class PrefixCommand
{
    constructor()
    {
        this.metadata = {
            commandWord: 'resetprefix',
            aliases: [''],
            description: `Reset the bot's prefix to the default value`,
            usage: '',
            category: "core-config",
            permissions: [Discord.Permissions.FLAGS.MANAGE_GUILD]
        };
    }

    run(sno)
    {
        //sno contains { bot, message, command, args, argsText, respond }


         sno.bot.setCustomGuildPrefix(sno.message.guild.id, false)
            .then(()=>{sno.respond(`Prefix has been reset to default.`, {disableMentions: 'all'})})
            .catch(()=>{sno.respond(`Some error occured when attempting to set prefix.`)});


    }
}
module.exports = PrefixCommand;