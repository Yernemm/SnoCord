const Discord = require('discord.js');
class HelpCommand
{
    constructor()
    {
        this.metadata = {
            commandWord: 'help',
            aliases: [],
            description: 'Lists all commands or displays usage info for a specific command.',
            usage: '[command]',
            category: "core"
        };
    }

    run(sno)
    {
        //sno contains { bot, message, command, args, argsText, respond }

        let embed = new Discord.MessageEmbed()
        .setColor('#34eb8f')

        if(sno.args.length < 1){

            //list commands

            let cmds = {};

            sno.bot.getAllCommands().forEach(cmd => {
                if(cmd.isRunnableBy(sno.message.member)){
                    if(!cmds[cmd.metadata.category]) cmds[cmd.metadata.category] = [];
    
                    cmds[cmd.metadata.category].push(cmd.commandWord);
    
                }
            });



        } else {


        }




    }
}
module.exports = HelpCommand;