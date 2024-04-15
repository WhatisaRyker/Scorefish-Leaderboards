const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-target-channel")
        .setDescription('Adds a channel to the target listf')
        .addStringOption(option =>
            option.setName('channel-id')
                .setDescription('enter the ID of the channel you want to use')
                .setRequired(true)),
    async execute(ctx){
        if(!ctx.member.permissionsIn(ctx.channel).has(PermissionsBitField.Flags.Administrator)) {
            return
        }

        const channelID = ctx.options.getString('channel-id')

        try {
            const resp = ScoreHandling.AddChannelTarget(channelID);

            if(resp) {
                let embed = new EmbedBuilder()
                    .addFields({name:'Added Channel', value:'The channel was now added to the targets'});
                ctx.reply({ embeds: [embed] });
            } else {
                let embed = new EmbedBuilder()
                    .addFields({name:'Adding Failed', value:'The channel was not added as it may be in the targets already'});
                ctx.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Adding Failed', value:'The channel was not able to be added to the targets'});
            ctx.reply({ embeds: [embed] });
        }
    }
}