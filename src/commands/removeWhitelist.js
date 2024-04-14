const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove-whitelist-member")
        .setDescription('Removes a member to the whitelist')
        .addStringOption(option =>
            option.setName('scoresaber-id')
                .setDescription('enter the ID of the scoresaber player')
                .setRequired(true)),
    async execute(ctx){
        if(!ctx.member.permissionsIn(ctx.channel).has(PermissionsBitField.Flags.Administrator)) {
            return
        }
        
        const ssID = ctx.options.getString('scoresaber-id')

        try {
            const resp = ScoreHandling.RemoveWhitelist(ssID);
            
            if(resp) {
                let embed = new EmbedBuilder()
                    .addFields({name:'Added Player', value:'The player was now removed from the whitelist'});
                ctx.reply({ embeds: [embed] });
            } else {
                let embed = new EmbedBuilder()
                    .addFields({name:'Adding Failed', value:'The player was not removed as it may not be in the whitelist'});
                ctx.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Adding Failed', value:'The player was not able to be removed from the whitelist'});
            ctx.reply({ embeds: [embed] });
        }
    }
}