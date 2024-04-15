const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-blacklist-member")
        .setDescription('Adds a member to the blacklist')
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
            const resp = ScoreHandling.AddBlacklist(ssID);

            if(resp) {
                let embed = new EmbedBuilder()
                    .addFields({name:'Added Player', value:'The player was now added to the blacklist'});
                ctx.reply({ embeds: [embed] });
            } else {
                let embed = new EmbedBuilder()
                    .addFields({name:'Adding Failed', value:'The player was not added as it may be in the blacklist already'});
                ctx.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Adding Failed', value:'The player was not able to be added to the blacklist'});
            ctx.reply({ embeds: [embed] });
        }
    }
}