const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ScoreHandling } = require('../utils/scoreHandling.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove-target-channel")
        .setDescription('removes a channel from the targets list')
        .addStringOption(option =>
            option.setName('channel-id')
                .setDescription('enter the ID of the channel you want to remove')
                .setRequired(true)),
    async execute(ctx){
        if(!ctx.member.permissionsIn(ctx.channel).has(PermissionsBitField.Flags.Administrator)) {
            return
        }
        
        const channelID = ctx.options.getString('channel-id')

        try {
            const resp = ScoreHandling.RemoveChannelTarget(channelID);
            
            if(resp) {
                let embed = new EmbedBuilder()
                    .addFields({name:'Removed Channel', value:'The channel was removed from the targets'});
                ctx.reply({ embeds: [embed] });
            } else {
                let embed = new EmbedBuilder()
                    .addFields({name:'Removing Failed', value:'The channel was not removed as it may not be in the targets list'});
                ctx.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error)
            let embed = new EmbedBuilder()
                    .addFields({name:'Removing Failed', value:'The channel was not able to be removed from the targets list'});
            ctx.reply({ embeds: [embed] });
        }

        return
    }
}