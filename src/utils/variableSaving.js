const fs = require('fs')
var path = require("path")
const { ScoreHandling } = require('./scoreHandling.js')

function SaveVariables(playerWhitelist, usingWhitelist, playerBlacklist, usingBlacklist, ppThreshold, channelTargets, topTenRequired) {

    let outputDict = {
        'playerWhitelist': playerWhitelist,
        'usingWhitelist': usingWhitelist,
        'playerBlacklist': playerBlacklist,
        'usingBlacklist': usingBlacklist,
        'ppThreshold': ppThreshold,
        'channelTargets': channelTargets,
        'topTenRequired': topTenRequired
    }

    console.log(outputDict)

    fs.writeFileSync(path.resolve(__dirname, './vars.json'), JSON.stringify(outputDict, null, 4), function writeFileCallback(err, data) {
        if (err) {
            console.log("There was a problem recording the data");
        }
    })

}

function ReadVariables() {
    try {
        vars = fs.readFileSync(path.resolve(__dirname, './vars.json'));
        vars = JSON.parse(vars)

        ScoreHandling.SetplayerWhitelist(vars['playerWhitelist'])
        ScoreHandling.SetusingWhitelist(vars['usingWhitelist'])
        ScoreHandling.SetplayerBlacklist(vars['playerBlacklist'])
        ScoreHandling.SetusingBlacklist(vars['usingBlacklist'])
        ScoreHandling.SetppThreshold(vars['ppThreshold'])
        ScoreHandling.SetchannelTargets(vars['channelTargets'])
        ScoreHandling.SetTopTenRequired(vars['topTenRequired'])

    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    ReadVariables,
    SaveVariables
}