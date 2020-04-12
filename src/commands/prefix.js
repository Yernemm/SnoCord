const Discord = require('discord.js');
const util = require('../utils.js');
class PrefixCommand
{
    constructor()
    {
        this.metadata = {
            commandWord: 'prefix',
            aliases: ['setprefix'],
            description: 'Set a custom prefix for this server.',
            usage: '<prefix>',
            category: "core-config",
            permissions: [Discord.Permissions.FLAGS.MANAGE_GUILD]
        };
    }

    run(sno)
    {
        //sno contains { bot, message, command, args, argsText, respond }

        if(sno.args.length > 0){
            sno.bot.setCustomGuildPrefix(sno.message.guild.id, sno.args[0])
            .then(()=>{sno.respond(`Custom prefix set to ${sno.args[0]}`, {disableMentions: 'all'})})
            .catch(()=>{sno.respond(`Some error occured when attempting to set prefix.`)});
        }else{
            sno.respond('Please specify a custom prefix.')
        }

    }
}
module.exports = PrefixCommand;