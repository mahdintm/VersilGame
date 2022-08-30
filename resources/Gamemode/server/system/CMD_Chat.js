import * as alt from 'alt'
import { findbadword } from '../utils/badword_detect';
import { EventNames } from '../utils/eventNames';
import { FindPlayerForCMD, PlayerData } from './account';
import { CheckMute_Chat, registerCmd, sendchat } from "./chat";
import { ServerSetting } from './server_settings';
import { StaffSystem } from "./staff";

class OtherChat {
    static async AdminChat(player, msg) {
        if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
        if (await CheckMute_Chat(player)) {
            msg = msg.toString().replaceAll(",", " ");
            if (!msg.length) return;
            let PlayerName = `[${await StaffSystem.GetRankName(player)}] ${await PlayerData.get(player, "pName")}`;
            let msgfilltered = findbadword(msg).replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34");
            const players = alt.Player.all;
            for await (let player_ of players) {
                if (!player_.getSyncedMeta('HasLogin')) continue;
                if (await StaffSystem.IsAdmin(player_)) continue;
                alt.emitClient(player_, EventNames.chat.server.Message, Date.now(), PlayerName, msgfilltered);
            }
            alt.emitClient(player, EventNames.chat.server.Message, Date.now(), PlayerName, msgfilltered);
        } else {
            sendchat(player, "You are muted.")
        }
    }
    static async HelperChat(player, msg) {
        if (!await StaffSystem.IsHelper(player)) return await StaffSystem.Send_NotAdmin(player)
        if (await CheckMute_Chat(player)) {
            msg = msg.toString().replaceAll(",", " ");
            if (!msg.length) return;
            let PlayerName = `[${await StaffSystem.GetRankName(player)}] ${await PlayerData.get(player, "pName")}`;
            let msgfilltered = findbadword(msg).replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34");
            const players = alt.Player.all;
            for await (let player_ of players) {
                if (!player_.getSyncedMeta('HasLogin')) continue;
                if (await StaffSystem.IsHelper(player_)) continue;
                alt.emitClient(player_, EventNames.chat.server.Message, Date.now(), PlayerName, msgfilltered);
            }
            alt.emitClient(player, EventNames.chat.server.Message, Date.now(), PlayerName, msgfilltered);
        } else {
            sendchat(player, "You are muted.")
        }
    }
    static async Wissper(player, args) {
        if (await CheckMute_Chat(player)) {
            if (args[0] == undefined)
                return sendchat(player, '(W)issper [PlayerName/PlayerID] [Your Message]');
            let taraf = await FindPlayerForCMD(player, args[0])
            if (taraf == undefined) return
            if (player == taraf) return sendchat(player, 'You cannot whisper to yourself')
            if (player.pos.distanceTo(taraf.pos) > await ServerSetting.get("Chat_Distance_Wissper")) return sendchat(player, `Player ${args[0]} not near you.`);
            let msgfilltered = findbadword(args.slice(1).join(" ")).replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34");
            sendchat(taraf, `[Wissper] ${await PlayerData.get(player, 'pName')}: ${msgfilltered}`)
            sendchat(player, `[Wissper] ${await PlayerData.get(player, 'pName')}: ${msgfilltered}`)
        } else {
            sendchat(player, "You are muted.")
        }
    }


}

registerCmd('helperchat', OtherChat.HelperChat)
registerCmd('h', OtherChat.HelperChat)
registerCmd('a', OtherChat.AdminChat)
registerCmd('adminchat', OtherChat.AdminChat)
registerCmd('Wissper', OtherChat.Wissper)
registerCmd('w', OtherChat.Wissper)
