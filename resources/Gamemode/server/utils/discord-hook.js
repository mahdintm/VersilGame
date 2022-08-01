import { Webhook, MessageBuilder } from 'discord-webhook-node'
import dotenv from 'dotenv'
dotenv.config();

export class DiscordHook {
    static newhook = {
        async login(obj) {
            const hook = new Webhook(process.env.Discord_Hook_Login);
            const embed = new MessageBuilder()
                .setTitle(`PlayerName: ${obj.username}`)
                .setColor('#00b0f4')
                .setDescription(`RefrallID: ${obj.sqlid}\nIP: ${obj.ip}\nDiscordID: ${obj.discordid}\nHWID: ${obj.hwid}\nLicense: ${obj.license}\nTime: ${new Date()}`)
            await hook.send(embed);
        },
        async register(obj) {
            const hook = new Webhook(process.env.Discord_Hook_Register);
            const embed = new MessageBuilder()
                .setTitle(`PlayerName: ${obj.username}`)
                .setColor('#00b0f4')
                .setDescription(`RefrallID: ${obj.sqlid}\nRealName: ${obj.firstname + " "+obj.lastname}\nIP: ${obj.ip}\nDiscordID: ${obj.discordid}\nHWID: ${obj.hwid}\nLicense: ${obj.license}\nTime: ${new Date()}`)
            await hook.send(embed);
        },
        async disconnect(obj) {
            const hook = new Webhook(process.env.Discord_Hook_Disconnect);
            const embed = new MessageBuilder()
                .setTitle(`PlayerName: ${obj.username}`)
                .setColor('#00b0f4')
                .setDescription(`RefrallID: ${obj.sqlid}\nTime: ${new Date()}`)
            await hook.send(embed);
        }
    }
}