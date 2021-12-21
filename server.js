const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });



const express = require('express');
const app = express();
const crypto = require('crypto');
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);


bot.launch();


const mandaMessaggio = (message) => {
    return new Promise((resolve, reject) => {
        try {
            bot.telegram.sendMessage(process.env.CHAT_ID, message);
            resolve();
        } catch (err) {
            reject(err)
        }

    })

}

const baseUrl = '/var/www/';

const deploy = (prj) => {
    return new Promise(async (resolve, reject) => {
        try {
            const exec = require('child_process').exec;
            exec(`cd ${baseUrl + prj} && pm2 stop ${prj} && git pull && npm install && pm2 start ${prj}`, (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            });

        } catch (err) {
            reject(err)
        }
    })

}

app.post("/webhook", async (req, res) => {
    const evento = req.headers['x-github-event'];
    const secret = req.headers['x-hub-signature'];

    let payload;
    let sig;
    req.on('data', function (data) {
        sig = "sha1=" + crypto.createHmac('sha1', process.env.SECRET).update(data.toString()).digest('hex');

        payload = JSON.parse(data);

    });

    req.on('end', async () => {
        let timer = 0;

        setInterval(() => {
            timer++;
        }, 1000);
        if (sig == secret) {
            res.sendStatus(200);
            await mandaMessaggio(
                "AZIONE: " + evento.toUpperCase() +
                "\nDA: " + payload.pusher.name +
                "\nREPO: " + payload.repository.name +
                "\nCOMMIT: " + payload.commits[0].message + "\n\n" +
                "Deploy started..."
            )
            await deploy(payload.repository.name).then(async () => {
                await mandaMessaggio("Deployed " + payload.repository.name + " successfully! (" + timer + " secondi)");

            }).catch((err) => {
                console.log(err);
                return res.sendStatus(500);
            }
            )

        } else {
            await mandaMessaggio("Qualcosa è andato storto, non ho capito la tua azione!");

            return res.sendStatus(500);
        }

    });

})


app.listen(1234)