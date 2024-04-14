# Scorefish-Leaderboards
    The Scorefish leaderboard bot allowes for score posting to any specific channel requested by the user. 

    The user is also able to define specific thresholds that a score needs to meet in order to be posted.


## How to run Scorefish

Running Scorefish with no prior knowledge may be a little difficult. But these are the basic steps to getting started.

### You will need some dependencies before you attempt to run Scorefish. You will need:
- NodeJS
- Docker Desktop (Optionally for advanced deployment methods)

> Docker will allow you to pack the bot into a "tiny" VM made to run on another computer. This is best for ease of deployment and for the ability to not worry about platform issues.

1. Go to <a href="https://discord.com/developers/applications">Discord's dev page</a> where you can create an application that your new Scorefish bot will run on.

2. Once you have created an application you will need the secret token that can be found on your applications page under the bot subpage. You will need to reset this token every time you want to view it on Discord, so save this somewhere you can (Preferably within a .env file within the newly cloned repo)

3. You will need to invite your application to the server, there are many resources that can tell you how to do this.

4. Clone this repo to your local machine in a location you know. Extract the zip file and in the newly extracted folder add a new file called ``.env``. This is where you will put your token that you got from Discord's developers page. In this file put simply in text ``FISHBOTCLIENT_TOKEN = "Your app token here"`` and replace the placeholder text with your new token.

5. In the folder open up a command prompt and run ``npm install`` 
This will install all of the libraries and dependancies that you need for the bot to function. 

6. After this you should be able to run the command ``npm run start`` which will start running the bot.

Alternitavely for docker you can run 
```docker compose up --build --force-recreate -d``` Which will deploy your newly built image to a container and run it locally on the machine you execute this command on. 
