/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { EventNames } from "../utils/eventNames";

alt.onClient(EventNames.player.client.ServerLog, (player, ...args) => {
  console.log(`${"\x1b[32m"}Client LOG:${"\x1b[33m"}`, ...args, "\x1b[37m");
});
