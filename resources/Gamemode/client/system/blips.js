import * as alt from "alt";

import * as native from "natives";
let UnicBlipArr = [],
  StaticBlipArr = [];
export class VGBlips {
  /**
   * Creates a new global blip
   *
   * @param {{pos: alt.Vector3, sprite: number, color: number, scale: number, shortRange: boolean, name: string}} blip
   * @param {UnicBlip: boolean} UnicBlip
   */
  static #CreateBlip(blip, UnicBlip = false) {
    const blipHandler = new alt.PointBlip(blip.pos.x, blip.pos.y, blip.pos.z);

    blipHandler.sprite = blip.sprite;
    blipHandler.color = blip.color;
    blipHandler.scale = blip.scale;
    blipHandler.shortRange = blip.shortRange;
    blipHandler.name = blip.name;

    if (UnicBlip) return (UnicBlipArr[blip.id] = blipHandler);
    return StaticBlipArr.push(blipHandler);
  }
  static async addStaticBlips(blip) {
    this.#CreateBlip(blip);
  }
  static async addUnicBlips(blip) {
    if (!blip.id) return;
    this.#CreateBlip(blip, true);
  }
  static #DeleteBlip(
    blipID = undefined,
    UnicBlips = false,
    StaticBlips = false
  ) {
    if (blipID != undefined) {
      try {
        UnicBlipArr[blipID].destroy();
        delete UnicBlipArr[blipID];
      } catch (e) {}
      return;
    }
    if (UnicBlips) {
      UnicBlipArr.forEach((UnicBlip) => {
        try {
          UnicBlip.destroy();
          UnicBlipArr.filter((element) => {
            return element == UnicBlip;
          });
        } catch (e) {}
      });
    }
    if (StaticBlips) {
      StaticBlipArr.forEach((StaticBlip) => {
        try {
          StaticBlip.destroy();
          StaticBlipArr.filter((element) => {
            return element == StaticBlip;
          });
        } catch (e) {}
      });
    }
  }
  static async deleteUnicBlip(blipID) {
    this.#DeleteBlip(blipID, false, false);
  }
  static async deleteAllBlips(UnicBlip = false, StaticBlip = false) {
    this.#DeleteBlip(undefined, UnicBlip, StaticBlip);
  }
  static #ModifyBlip(NewBlip) {
    try {
      UnicBlipArr[NewBlip.id].pos = new alt.Vector3(
        NewBlip.pos.x,
        NewBlip.pos.y,
        NewBlip.pos.z
      );
      UnicBlipArr[NewBlip.id].sprite = NewBlip.sprite;
      UnicBlipArr[NewBlip.id].color = NewBlip.color;
      UnicBlipArr[NewBlip.id].scale = NewBlip.scale;
      UnicBlipArr[NewBlip.id].shortRange = NewBlip.shortRange;
      UnicBlipArr[NewBlip.id].name = NewBlip.name;
    } catch (error) {}
  }
  static async modifyUnicBlip(ModifiedBlip) {
    this.#ModifyBlip(ModifiedBlip);
  }
}