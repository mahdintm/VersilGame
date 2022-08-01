/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import { view, PlayerController, View } from "./viewCreator";

alt.on("CLIENT_CHAT:KeySlashPressed", () => {
  if (View.Info("Login") || View.Info("Chat")) return;
  PlayerController(true);
  View.Add("Chat");
  view.emit("CLIENT:InsertSlash");
  view.emit("CLIENT:OpenChat", false);
});
alt.on("CLIENT_CHAT:KeyTPressed", () => {
  if (View.Info("Login") || View.Info("Chat")) return;
  PlayerController(true);
  View.Add("Chat");
  view.emit("CLIENT:OpenChat", false);
});
alt.on("CLIENT_CHAT:KeyPageUpPressed", () => {
  if (View.Info("Login")) return;
  view.emit("CLIENT:Scroll", true);
});
alt.on("CLIENT_CHAT:KeyPageDownPressed", () => {
  if (View.Info("Login")) return;
  view.emit("CLIENT:Scroll", false);
});
alt.on("CLIENT_CLOTHES:KeyESCPressed", async () => {
  if (View.Info("Login")) return;
  alt.emit("CLIENT_CLOTHES:Close");
});
