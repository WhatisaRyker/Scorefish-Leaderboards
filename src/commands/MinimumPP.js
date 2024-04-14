const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("change-minimum-pp")
        .setDescription('Minimum PP to be posted to feed')
        .addStringOption(option =>
            option.setName('min-pp')
                .setDescription('Minimum value for pp')
                .setRequired(true)),
    async execute(ctx){
        if(!ctx.member.permissionsIn(ctx.channel).has(PermissionsBitField.Flags.Administrator)) {
            return
        }
        
        const pp = ctx.options.getString('min-pp')

        try {
            ScoreHandling.ChangePPThresh(pp)

            let embed = new EmbedBuilder()
                    .addFields({name:'Changed PP Thresh', value:`New PP thresh is ${pp}`});
            ctx.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Setting Failed', value:`Unable to set the whitelist to ${pp}`});
            ctx.reply({ embeds: [embed] });
        }
    }
}