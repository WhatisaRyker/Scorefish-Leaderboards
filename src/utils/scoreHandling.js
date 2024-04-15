const { EmbedBuilder } = require("discord.js")
const { round2 } = require("./otherUtils.js")

class ScoreHand {
    playerWhitelist = []
    usingWhitelist = false
    playerBlacklist = []
    usingBlacklist = true
    ppThreshold = 600.00
    topTenRequired = false

    channelTargets = []

    maxVerstappen = ['76561199081029968', '76561198313983208']

    async HandleScore(client, scoreJson) {
        try {

            let pp = round2(parseFloat(scoreJson.commandData.score.pp)) //['commandData']['score']['pp']
            let rank = parseInt(scoreJson.commandData.score.rank) //['commandData']['score']['rank']
            let playerID = scoreJson.commandData.score.leaderboardPlayerInfo.id //['commandData']['score']['leaderboardPlayerInfo']['id']
            let playerName = scoreJson.commandData.score.leaderboardPlayerInfo.name //['commandData']['score']['leaderboardPlayerInfo']['name']
            let playerPFP = scoreJson.commandData.score.leaderboardPlayerInfo.profilePicture//['commandData']['score']['leaderboardPlayerInfo']['profilePicture']

            let songName = scoreJson.commandData.leaderboard.songName //['commandData']['leaderboard']['songName']
            let songID = scoreJson.commandData.leaderboard.id //['commandData']['leaderboard']['id']
            let songDiff = scoreJson.commandData.leaderboard.difficulty.difficulty
            let acc = round2(scoreJson.commandData.score.modifiedScore / scoreJson.commandData.leaderboard.maxScore * 100) //['commandData']['score']['modifiedScore'] ['commandData']['leaderboard']['maxScore']
            let leaderboardCover = scoreJson.commandData.leaderboard.coverImage//['commandData']['leaderboard']['coverImage']
            let starRating = scoreJson.commandData.leaderboard.stars //['commandData']['leaderboard']['stars']
            let maxCombo = scoreJson.commandData.score.maxCombo //['commandData']['score']['maxCombo']
            let misses = parseInt(scoreJson.commandData.score.missedNotes) + parseInt(scoreJson.commandData.score.badCuts) //['commandData']['score']['missedNotes'] ['commandData']['score']['badCuts']

            switch (songDiff) {
                case 1:
                    songDiff = "Easy";
                    break;
                case 3:
                    songDiff = "Normal";
                    break;
                case 5:
                    songDiff = "Hard";
                    break;
                case 7:
                    songDiff = "Expert";
                    break;
                case 9:
                    songDiff = "Expert Plus";
                    break;
            }

            if(pp <= this.ppThreshold) { return }
            if((rank > 10) && this.topTenRequired) { return }

            if(this.usingWhitelist && !this.playerWhitelist.includes(playerID)) {return}
            if(this.usingBlacklist && this.playerBlacklist.includes(playerID)) {return}

            const embed = new EmbedBuilder()
                .setTitle(`**${playerName}** scored on **${songName}** [${songDiff}]`)
                .setURL(`https://scoresaber.com/leaderboard/${songID}`)
                .setDescription(`# **🐟 #${rank}** / **${acc}%** / **${pp}pp**`)
                .setThumbnail(`${leaderboardCover}`)
                .setAuthor({ name: playerName, iconURL: playerPFP, url: `https://scoresaber.com/u/${playerID}`})
                // .addFields(
                //     { name: "🐟 Play Rank 🐟", value: `${scoreJson['commandData']['score']['rank']}`, inline: true},
                //     { name: "🍤 PP 🍤", value: `${scoreJson['commandData']['score']['pp']}`, inline: true},
                //     { name: "🎣 Play Combo 🎣", value: `${scoreJson['commandData']['score']['maxCombo']}`, inline: true}
                // )
                .addFields(
                    { name: `⭐ ${starRating}`, value: `\u200B`, inline: true},
                    { name: `Combo 🎣 ${maxCombo}`, value: `\u200B`, inline: true},
                    { name: `Misses ❌ ${misses}`, value: `\u200B`, inline: true},
                )

            console.log(`${playerName} scored on ${songName} | #${rank} / ${acc}% / ${pp}pp`)

            this.channelTargets.forEach( (channelID) => {
                let channel = client.channels.cache.get(channelID)
                if(this.maxVerstappen.includes(playerID)) {
                    channel.send('https://tenor.com/view/max-verstappen-f1-formule-1-gif-15087359750872636720')
                }
                channel.send({ embeds: [embed] }).then(message => {
                    // if(`${scoreJson['commandData']['leaderboard']['id']}` == `2169974796454690`) {
                    //     message.react('<:oermerHYPE:1226951903418650688>')
                    // }
                    message.react('🔥')
                    message.react('⁉️')
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    AddChannelTarget(channelID) {
        if(!this.channelTargets.includes(`${channelID}`)) {
            this.channelTargets.push(`${channelID}`)
            console.log("add")
            return true
        } else {
            return false
        }
    }

    RemoveChannelTarget(channelID) {
        if(this.channelTargets.includes(`${channelID}`)) {
            let index = this.channelTargets.indexOf(`${channelID}`)
            this.channelTargets.splice(index, index)
            return true
        } else {
            return false
        }
    }

    AddWhitelist(playerID) {
        if(!this.playerWhitelist.includes(`${playerID}`)) {
            this.playerWhitelist.push(`${playerID}`)
            return true
        } else {
            return false
        }
    }

    RemoveWhitelist(playerID) {
        if(this.playerWhitelist.includes(`${playerID}`)) {
            let index = this.playerWhitelist.indexOf(`${playerID}`)
            this.playerWhitelist.splice(index, index)
            return true
        } else {
            return false
        }
    }

    AddBlacklist(playerID) {
        if(!this.playerBlacklist.includes(`${playerID}`)) {
            this.playerBlacklist.push(`${playerID}`)
            return true
        } else {
            return false
        }
    }

    RemoveBlacklist(playerID) {
        if(this.playerBlacklist.includes(`${playerID}`)) {
            let index = this.playerBlacklist.indexOf(`${playerID}`)
            this.playerBlacklist.splice(index, index)
            return true
        } else {
            return false
        }
    }

    ChangePPThresh(thresh) {
        this.ppThreshold = parseFloat(thresh)
    }

    GetplayerWhitelist () {
        return this.playerWhitelist
    }

    GetusingWhitelist () {
        return this.usingWhitelist
    }

    GetplayerBlacklist () {
        return this.playerBlacklist
    }

    GetusingBlacklist () {
        return this.usingBlacklist
    }

    GetppThreshold () {
        return this.ppThreshold
    }

    GetchannelTargets () {
        return this.channelTargets
    }

    SetplayerWhitelist (value) {
        this.playerWhitelist = value
    }
    SetusingWhitelist (value) {
        this.usingWhitelist = value
    }
    SetplayerBlacklist (value) {
        this.playerBlacklist = value
    }
    SetusingBlacklist (value) {
        this.usingBlacklist = value
    }
    SetppThreshold (value) {
        this.ppThreshold = value
    }
    SetchannelTargets (value) {
        this.channelTargets = value
    }
    SetTopTenRequired (value) {
        this.topTenRequired = value
    }

}

const ScoreHandling = new ScoreHand()

module.exports = {
    ScoreHandling
}