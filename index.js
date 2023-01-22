const Discord = require("discord.js");
const express = require("express");
const app = express();
const client = new Discord.Client({
	intents: ["Guilds"]
});
const config = require("./config.json");
const fs = require("fs");

const fileUpload = require("express-fileupload");

app.use(fileUpload({
	limits: {
		fileSize: 8 * 1024 * 1024
	},
}));

var ready = false;

// Express app that takes a file through a post request and sends it to the discord channel

app.post("/upload", (req, res) => {
	if (!ready) {
		res.sendStatus(503).send("Bot is not ready");
		return;
	}
	client.channels.fetch(config.discord.channelId).then(channel => {
		// Check if the file is present, if not send a 400 error
		if (!req.files || Object.keys(req.files).length === 0) {
			res.sendStatus(400).send("No files were uploaded.");
			return;
		}
		// Generate attachment based on the file
		console.log(req.files.upload.data)
		const att = new Discord.AttachmentBuilder(req.files.upload.data).setName(req.files.upload.name);

		// Send the file to the channel
		channel.send({
			files: [att]
		});
	});
	res.send("Uploaded");
});

// Discord bot that sends a message to the channel when it's ready
client.on("ready", () => {
	ready = true;
	console.log("Bot is ready");
});

client.login(config.discord.token);

// Start the express app

app.listen(config.express.port, () => {
	console.log("Listening on port " + config.express.port);
});