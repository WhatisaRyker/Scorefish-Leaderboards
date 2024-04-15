const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist-toggle")
        .setDescription('Adds a member to the blacklist')
        .addStringOption(option =>
            option.setName('blacklist-active')
                .setDescription('t or f')
                .setRequired(true)),
    async execute(ctx){
        if(!ctx.member.permissionsIn(ctx.channel).has(PermissionsBitField.Flags.Administrator)) {
            return
        }

        const act = ctx.options.getString('blacklist-active')

        try {
            if(act == 't') {
                ScoreHandling.usingBlacklist = true;

                let embed = new EmbedBuilder()
                    .setTitle('Enabled Blacklist');
                ctx.reply({ embeds: [embed] });
            } else if (act == 'f') {
                ScoreHandling.usingBlacklist = false;

                let embed = new EmbedBuilder()
                    .setTitle('Disabled Blacklist');
                ctx.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Setting Failed', value:`Unable to set the blacklist to ${act}`});
            ctx.reply({ embeds: [embed] });
        }
    }
}