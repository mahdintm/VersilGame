import * as alt from "alt";
import { GenerateCode } from "../utils/code_generator";
import { DiscordHook } from "../utils/discord-hook";
import { character } from "../utils/character";
import { PlayerData, playerIdGame } from "./account";
import { send_email } from "./email";
import { sms } from "./sms";
import { StaffSystem } from "./staff";
import { LoadedVehicels, VehicleClass } from "./vehicles";
import { playerDetails } from "../utils/playerDetails";
import { EventNames } from "../utils/eventNames";
import { sql } from "../database/mysql";
import { GasStation } from "./gas_station";
import { license } from "./license";
import { vehicleObject } from "../utils/VehicleList";
import { sendchat } from "./chat";
import { Ban } from "./ban";
await sql('update Account set pOnline = "0"');

let ban_ip = "::ffff:192.168.90.100";

alt.on("beforePlayerConnect", (player) => {
  player.setSyncedMeta("hasLogin", false);
});

alt.onClient("Fill_GAS", async (player) => {
  await GasStation.Fill(player);
});
alt.on("connectionQueueAdd", async (info) => {
  let hwban = await Ban.hwban.check(info.hwidHash);
  if (await hwban) {
    if (hwban.Is_permanet) {
      return info.decline("HWID shoma vase hamishe ban shode");
    } else {
      return info.decline("problem Of Login00000000000");
    }
  }

  // let License = await Ban.license.check(info.license)
  // if (await License) {
  //   if (License.Is_permanet) {
  //     return info.decline("License shoma vase hamishe ban shode");
  //   } else {
  //     return info.decline("problem Of Login00000000000");
  //   }
  // }

  // if (info.discordUserID == "") return info.decline("Please open the Discord App then TryAgain.");
  // if (!LoadedVehicels) return info.decline("Please Try Again then 1 Minutes.")
  info.accept();
});
alt.on("playerEnteringVehicle", async (player, vehicle, seat) => {
  let datain_vehileObject = vehicleObject.filter(async (v, i) => v.name == (await VehicleClass.data.get(vehicle, "model")))[0];
  switch (datain_vehileObject.type) {
    case "driving":
      if ((await license.check(player, "driving")) == false && seat == 1) {
        sendchat(player, "govahiname nadari baba");
        return (player.pos = await player.pos);
      }
      break;
    default:
      break;
  }
});
alt.on("vehicleDestroy", async (vehicle) => {
  switch (await VehicleClass.data.get(vehicle, "type")) {
    case "static":
      setTimeout(async () => {
        await VehicleClass.respawn.DestryedVehicle(vehicle);
      }, 10000);
      break;
    case "faction":
      setTimeout(async () => {
        await VehicleClass.respawn.DestryedVehicle(vehicle);
      }, 10000);
      break;
    case "admin":
      setTimeout(async () => {
        await VehicleClass.delete.admin(vehicle);
      }, 10000);
      break;
    default:
      break;
  }
});
alt.on("playerConnect", async (player) => {
  alt.emitClient(player, EventNames.player.server.PlayerDetails, playerDetails);
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
  if (data.PhoneCode == playerdata.PhoneCode && data.EmailCode == playerdata.EmailCode) {
    return alt.emitClient(player, "CallBackRequestCodeValidationEntered", true, "WiaraServerIsBestServer");
  }
  return alt.emitClient(player, "CallBackRequestCodeValidationEntered", false, "");
});
await alt.on("playerDisconnect", async (player, reason) => {
  if (!player.getSyncedMeta("hasLogin")) return;
  DiscordHook.newhook.disconnect({
    sqlid: await PlayerData.Get(player, "pId"),
    username: await PlayerData.Get(player, "pName"),
  });
  PlayerData.Set(player, "pOnline", 0, true);
  StaffSystem.sarOFF(player);
  PlayerData.delete(player);
  playerIdGame.delete(player);
});
await alt.onClient("Login_Account_To_Server", PlayerData.login);
await alt.onClient("Register_Account_To_Server", PlayerData.register);

setTimeout(() => {
  console.log(` 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@&@@@@@                      @@@@@@@@@@@@@@
@@@@@@@            @@@@@@@@@@@@           @@@@@@@@
@@@        @@@@@@@@@@@@@@@@@@@@@@@@@@@@       @@@@
@@    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    @@
@@    @@@@@@@@@@@                 @@@@@@@@@@@@@@@@
@@    @@@@@         @@@@@@@@@@@         @@@@@@@@@@
@@@    @@@@@    @@@@@@@@@@@@@@@@@@@@@       @@@@@@
@@@    @@@@@     @@@@@@@@@@@@@@@@@@@@@@@@     @@@@
@@@@   @@@@@    @@@@@@         @@@@@@@@@@@@   @@@@
@@@@    @@@@      @@@@@@ @@          @@@@@@@@@@@@@
@@@@@         @    @@@@@@@@@@@           @@@@@@@@@
@@@@@@     @@@@@    @@@@@@@@@    @@@@@     @@@@@@@
@@@@@@@     @@@@@@    @@@@@@    @@@@@@    @@@@@@@@
@@@@@@@@@    @@@@@@@    @@    @@@@@@     @@@@@@@@@
@@@@@@@@@@     @@@@@@@       @@@@@@    @@@@@@@@@@@
@@@@@@@@@@@@    @@@@@@@@  @@@@@@@     @@@@@@@@@@@@
@@@@@@@@@@@@@@    @@@@@@@@@@@@@     @@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@   @@@@@@@@@@     @@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@      @@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@      @@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@@`);
}, 2000);
