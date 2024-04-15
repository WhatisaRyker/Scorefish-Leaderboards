const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("topten-required")
        .setDescription('Changes whether a top 10 score is required to post')
        .addStringOption(option =>
            option.setName('topten-req')
                .setDescription('t or f')
                .setRequired(true)),
    async execute(ctx){
        if(!ctx.member.permissionsIn(ctx.channel).has(PermissionsBitField.Flags.Administrator)) {
            return
        }

        const act = ctx.options.getString('topten-req')

        try {
            if(act == 't') {
                ScoreHandling.topTenRequired = true;

                let embed = new EmbedBuilder()
                    .setTitle('Enabled Top Ten Requirement');
                ctx.reply({ embeds: [embed] });
            } else if (act == 'f') {
                ScoreHandling.topTenRequired = false;

                let embed = new EmbedBuilder()
                    .setTitle('Disabled Top Ten Requirement');
                ctx.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Setting Failed', value:`Unable to set the Top Ten Requirement to ${act}`});
            ctx.reply({ embeds: [embed] });
        }
    }
}