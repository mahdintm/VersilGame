import * as alt from "alt";
import { GenerateCode } from "../utils/code_generator";
import { DiscordHook } from "../utils/discord-hook";
import { character } from "../utils/character";
import { PlayerData, playerIdGame } from "./account";
import { send_email } from "./email";
import { sms } from "./sms";

alt.on("playerConnect", async (player) => {
    player.spawn(-66.84395599365234, -802.20615234375, 44.2255859375);
    player.model = Object.values(character.skin)[0];
    player.setMeta("Gender", "male");
    player.dimension = 999;
    player.visible = true;
    player.setSyncedMeta("hasLogin", false);
});
alt.onClient("SyncData_LOCAL", (player, data) => {
    // player.setSyncedMeta("Discordid", data.DiscordID);
    player.setSyncedMeta("Language", data.Language);
});
alt.onClient("RequestCodeValidation", async (player, data) => {
    let codes = {
        EmailCode: await GenerateCode(6),
        PhoneCode: await GenerateCode(6),
    };
    sms.send(
        data.PhoneNumber,
        `سلام ${data.name.first + " " + data.name.last} عزیز
    کد تایید عضویت شما در مجموعه ورسیل گیم ${codes.PhoneCode} است.
    به جمع ورسیلی ها خوش آمدید!`
    );
    send_email.VerifyCode({
        firstname: data.name.first,
        lastname: data.name.last,
        email: data.Email,
        code: codes.EmailCode,
    });
    player.setMeta("ValidateCodes", codes);
    alt.emitClient(player, "CallBackRequestCodeValidation");
});
alt.onClient("RequestCodeValidationEntered", (player, data) => {
    console.log("Send " + data);
    let playerdata = player.getMeta("ValidateCodes");
    if (
        data.PhoneCode == playerdata.PhoneCode &&
        data.EmailCode == playerdata.EmailCode
    ) {
        return alt.emitClient(
            player,
            "CallBackRequestCodeValidationEntered",
            true,
            "WiaraServerIsBestServer"
        );
    }
    return alt.emitClient(
        player,
        "CallBackRequestCodeValidationEntered",
        false,
        ""
    );
});
await alt.on("playerDisconnect", async (player, reason) => {
    if (!player.getSyncedMeta("hasLogin")) return;
    DiscordHook.newhook.disconnect({
        sqlid: await PlayerData.get(player, "pId"),
        username: await PlayerData.get(player, "pName"),
    });
    PlayerData.delete(player);
    playerIdGame.delete(player);
});
await alt.onClient("Login_Account_To_Server", PlayerData.login);
await alt.onClient("Register_Account_To_Server", PlayerData.register);

setTimeout(() => {
    console.log(` 
    ............         .............
    ........                  ........
    .....                        .....
    ...                 ${"\x1b[31m"} @@@ ${"\x1b[37m"}      ...
    ..   ${"\x1b[31m"}@@          @@@@@@@@@@@${"\x1b[37m"}    ..
    ..   ${"\x1b[31m"} @@@       @@@         ${"\x1b[37m"}    ..
    .     ${"\x1b[31m"} @@@     @@@   @@@@@@@${"\x1b[37m"}     .
    ..     ${"\x1b[31m"} @@@   @@@        @@@${"\x1b[37m"}    ..
    ..      ${"\x1b[31m"} @@@@@@  @@@@@@@@@@@${"\x1b[37m"}    ..
    ...      ${"\x1b[31m"}   @        @@ ${"\x1b[37m"}       ...
    .....                        .....
    ........                  ........
    .............        .............`);
}, 2000);