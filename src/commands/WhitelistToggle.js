const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whitelist-toggle")
        .setDescription('Adds a member to the whitelist')
        .addStringOption(option =>
            option.setName('whitelist-active')
                .setDescription('t or f')
                .setRequired(true)),
    async execute(ctx){
        if(!ctx.member.permissionsIn(ctx.channel).has(PermissionsBitField.Flags.Administrator)) {
            return
        }

        const act = ctx.options.getString('whitelist-active')

        try {
            if(act == 't') {
                ScoreHandling.usingWhitelist = true;

                let embed = new EmbedBuilder()
                    .setTitle('Enabled Whitelist');
                ctx.reply({ embeds: [embed] });
            } else if (act == 'f') {
                ScoreHandling.usingWhitelist = false;

                let embed = new EmbedBuilder()
                    .setTitle('Disabled whitelist');
                ctx.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Setting Failed', value:`Unable to set the whitelist to ${act}`});
            ctx.reply({ embeds: [embed] });
        }
    }
}