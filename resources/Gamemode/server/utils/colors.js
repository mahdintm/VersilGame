import { ServerSetting } from "../system/server_settings";

export class Colors {
  static chat = {
    AdminWarn: ServerSetting.get("AdminWarn_Color"),
    HelperWarn: ServerSetting.get("HelperWarn_Color"),
    LeaderWarn: ServerSetting.get("LeaderWarn_Color"),
    StaffWarn: ServerSetting.get("StaffWarn_Color"),
    Default: "ffffff",
  };
  static faction = {};
}
