const Discord = require('discord.js');
const util = require('./../utils.js');
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
        .setColor('#34eb8f');
        

        if(sno.args.length < 1){

            //list commands

            let cmds = {};

            sno.bot.getAllCommands().forEach(cmd => {
                if(cmd.isRunnableBy(sno.message.member)){
                    if(!cmds[cmd.metadata.category]) cmds[cmd.metadata.category] = [];
    
                    cmds[cmd.metadata.category].push(cmd.metadata.commandWord);
    
                }
            });

            embed
            .setTitle(`${sno.bot.config.name} Help`)
            .setDescription(sno.bot.config.description);

           cmds = util.sortJson(cmds);

            for(const cat in cmds){
                cmds[cat].sort();
                embed.addField(util.capitaliseFirstLetter(cat), `> \`\`\`${cmds[cat].join(' ')}\`\`\``);
            }

        } else {

            let foundcmd = null;

            sno.bot.getAllCommands().forEach(cmd => {
                if(cmd.isRunnableBy(sno.message.member)){

                    if (cmd.metadata.commandWord === sno.args[0]) foundcmd = cmd;
    
                }
            });

            if(foundcmd !== null){
                embed
                .setTitle(`Help for ${foundcmd.metadata.commandWord}`)
                .addField('Description', `> ${foundcmd.metadata.description}`)
                .addField('Uasge', `> ${foundcmd.metadata.commandWord} ${foundcmd.metadata.usage}`);
                if(foundcmd.metadata.aliases.length > 0)
                embed.addField('Aliases', `> ${foundcmd.metadata.aliases.join(' ')}`);
            }else{
                embed.setTitle(`Command not found.`);
            }


        }

        sno.respond("   ",{embed: embed});




    }
}
module.exports = HelpCommand;