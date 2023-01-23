const Discord = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser")
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
app.use(bodyParser.json());
//app.use(bodyParser.text());

var ready = false;

app.post("/upload", (req, res) => {
	if (!ready) {
		res.sendStatus(503).send("Bot is not ready");
		return;
	}
	client.channels.fetch(config.discord.channelId).then(channel => {
		if (!req.files || Object.keys(req.files).length === 0) {
			res.sendStatus(400).send("No files were uploaded.");
			return;
		}

		console.log(req.files.upload.data)
		const att = new Discord.AttachmentBuilder(req.files.upload.data).setName(req.files.upload.name);

		channel.send({
			files: [att]
		});
	});
	res.send("Uploaded");
});

app.post("/send", (req, res) => {
	if (!ready) {
		res.sendStatus(503).send("Bot is not ready");
		return;
	}
	client.channels.fetch(config.discord.channelId).then(channel => {
		channel.send(req.body.message);
		res.send("Sent");
	});
});

client.on("ready", () => {
	ready = true;
	console.log("Bot is ready");
});

client.login(config.discord.token);
app.listen(config.express.port, () => {
	console.log("Listening on port " + config.express.port);
});