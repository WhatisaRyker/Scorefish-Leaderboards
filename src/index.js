const { EmbedBuilder, Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config()
const { ScoreHandling } = require('./utils/scoreHandling.js')
const { ReadVariables, SaveVariables } = require('./utils/variableSaving.js')
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const token = process.env.FISHBOTCLIENT_TOKEN
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
]});

async function Connect() {
    var Scores = new WebSocket("wss://scoresaber.com/ws")

    Scores.on('message', async (data) => {
        try {
            if (data == 'Connected to the ScoreSaber WSS') {
                console.log('Connected to score service');
                return;
            }

            newData = JSON.parse(data)
            //newData = JSON.stringify(newData)

            if(newData["commandName"] != 'score') {
                return
            }

            ScoreHandling.HandleScore(client, newData)
        } catch(error) {
            console.log(error)
        }
    })

    Scores.on('close', async () => {
        try {
            console.log("Websocket was closed")

            Connect()
            return
        } catch(error) {
            console.log("WebSocket could not be restarted")
            console.log(error)
        }
    })

    Scores.on('error', async (data) => {
        try {
            newData = JSON.parse(data)

            console.log(data)

            Scores.close()
        } catch(error) {
            console.log(error)
            Scores.close()
        }
    })

    setInterval(function () {
		Scores.ping('Ping!');
	}, 120000);
}

client.on('ready', () =>{
    client.commands = new Collection();

    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    ReadVariables()

    for (const file of commandFiles) {
    	const filePath = path.join(commandsPath, file);
    	const command = require(filePath);
    	// Set a new item in the Collection with the key as the command name and the value as the exported module
    	if ('data' in command && 'execute' in command) {
    		client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
    	} else {
    		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    	}
    }

    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const guilds = client.guilds.cache.map(guild => guild.id)
            console.log(guilds)

            //The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands`);

        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();

    client.user.setActivity("Fishing up scores")

    console.log(`Bot has logged in as ${client.user.tag}! The user id is ${client.user.id}`)

    Connect()
});

client.on( 'interactionCreate' , async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);

        SaveVariables(ScoreHandling.playerWhitelist, ScoreHandling.usingWhitelist, ScoreHandling.playerBlacklist, ScoreHandling.usingBlacklist, ScoreHandling.ppThreshold, ScoreHandling.channelTargets, ScoreHandling.topTenRequired)
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);