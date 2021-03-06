class ExampleCommand
{
    constructor()
    {
        this.metadata = {
            commandWord: 'sample',
            aliases: [],
            description: 'Adds num1 and num2 and pings you in return that many times. Requires ban permission for no reason!',
            usage: 'num1 num2',
            permissions: ['BAN_MEMBERS'],
            ownerOnly: false
        };
    }

    run(sno)
    {
        //sno contains { bot, message, command, args, argsText, respond }
        let num1 = sno.args[0] * 1;
        let num2 = sno.args[1] * 1;
        let sum = Math.floor(num1 + num2);
        if(sum > 0){
            if (sum > 1000){sum = 1000;}
            let message = "";
            for(let i = 0; i < sum; i++){
                message += sno.message.author + " "; 
            }
            sno.respond(message);
        }else{
            sno.respond("I can't ping you less than 0 times!");
        }

    }
}
module.exports = ExampleCommand;