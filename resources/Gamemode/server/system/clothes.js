/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { registerCmd } from "./chat";
import { character } from "../utils/character";

export class clothes {
  static GetClothesUtils() {
    var ClothesUtils = [];
    for (let i = 0; i < Object.keys(character.Components).length; i++) {
      let ComponentsName = "";
      Object.keys(character.Components)
        [i].split("")
        .forEach((char) => {
          if (char === char.toUpperCase()) char = " " + char;
          ComponentsName += char;
        });
      ClothesUtils.push([
        ComponentsName,
        Object.values(character.Components)[i]["male"].length,
        Object.values(character.Components)[i]["female"].length,
      ]);
    }
    return ClothesUtils;
  }
  static async SetClothes(player, ComponentID, Gender, Value) {
    const drawable = Object.values(character.Components)[ComponentID][Gender][
      Value
    ];
    const component = Object.values(character.Components)[ComponentID]
      .ComponentID;
    await player.setClothes(component, drawable, 0);
  }
}

alt.onClient("SERVER:ChangeClothes", async (player, ID, Value) => {
  clothes.SetClothes(player, ID, player.getMeta("Gender"), Value - 1); // -1 for started as number 1

  return;
});

alt.onClient("SERVER:ChangeSex", (player, Sex) => {
  if (Sex == "male") {
    alt.emitClient(
      player,
      "CLIENT:SexChanged",
      "male",
      clothes.GetClothesUtils()
    );
    return;
  }
  alt.emitClient(
    player,
    "CLIENT:SexChanged",
    "female",
    clothes.GetClothesUtils()
  );
  return;
});
alt.onClient("SERVER:ClothesUiBoxStatus", (player, Status) => {
  if (Status) {
    alt.emitClient(
      player,
      "CLIENT:Clothes",
      player.getMeta("Gender"),
      clothes.GetClothesUtils()
    );
  }
});
