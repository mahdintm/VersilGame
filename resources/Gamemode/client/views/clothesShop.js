/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";

import { VGPeds } from "../system/peds";
import { VGCameraClothes } from "./cameraClothes";
import { VGView } from "./webViewController";
import { ClothesDetails } from "../utils/ClothesDetails";
import { clothesShops } from "../utils/clothesShops";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";
import { VG } from "../system/functions";

const PartsName = {
  ComponentsPart: "ClothComponent",
  PropsPart: "ClothProp",
  DLCsPart: "ClothDLC",
};

let ClothesItems = [],
  PropsItems = [];

class VGClothes {
  static #CheckClientVariableForCloth(Part, ClothesInteriorID, Gender) {
    if (!clothesShops[ClothesInteriorID])
      // This ClothesInteriorID has undefined
      return false;
    if (!clothesShops[ClothesInteriorID][Part])
      // This Part has undefined
      return false;
    if (!clothesShops[ClothesInteriorID][Part][Gender])
      // This Gender has undefined
      return false;
    return true;
  }
  static #GetClothSuggestions(SuggestionID, ClothesInteriorID, Gender) {
    try {
      Gender = Gender.toLowerCase();
      return clothesShops[ClothesInteriorID]["Suggestions"][SuggestionID][
        Gender
      ];
    } catch (error) {
      return false;
    }
  }
  static async #ResetClothPed(PedName, ClothesInteriorID, Gender) {
    for await (const Component of clothesShops[ClothesInteriorID].ClothComponent
      .default[Gender]) {
      await VGPeds.SetComponentOnPedName(
        PedName,
        Component.ComponentID,
        Component.DrawableID,
        Component.textureID
      );
    }
    VGPeds.ClearPropsWithPedName(PedName);
  }
  static #GetClothComponents(ClothesInteriorID, Gender) {
    if (
      VGClothes.#CheckClientVariableForCloth(
        PartsName.ComponentsPart,
        ClothesInteriorID,
        Gender
      )
    )
      return clothesShops[ClothesInteriorID][PartsName.ComponentsPart][Gender];
  }
  static #GetClothProps(ClothesInteriorID, Gender) {
    if (
      VGClothes.#CheckClientVariableForCloth(
        PartsName.PropsPart,
        ClothesInteriorID,
        Gender
      )
    )
      return clothesShops[ClothesInteriorID][PartsName.PropsPart][Gender];
  }
  static #GetLengthClothComponents(ClothesInteriorID, Gender) {
    const ClothComponents = VGClothes.#GetClothComponents(
      ClothesInteriorID,
      Gender
    );
    if (!ClothComponents) return;
    let ClothComponentsLength = [];
    ClothComponents.forEach((ClothComponent) => {
      ClothComponentsLength.push({
        ComponentName: ClothComponent.ComponentName,
        DrawableLength: ClothComponent.Drawables.length,
      });
    });
    return ClothComponentsLength;
  }
  static #GetLengthClothProps(ClothesInteriorID, Gender) {
    const ClothProps = VGClothes.#GetClothProps(ClothesInteriorID, Gender);
    if (!ClothProps) return;
    let ClothPropsLength = [];
    ClothProps.forEach((ClothProp) => {
      ClothPropsLength.push({
        PropName: ClothProp.PropName,
        DrawableLength: ClothProp.Drawables.length,
      });
    });
    return ClothPropsLength;
  }
  static GetClothesWithInteriorID(ClothesInteriorID, Gender) {
    const ComponentsLength = VGClothes.#GetLengthClothComponents(
      ClothesInteriorID,
      Gender
    );
    const PropsLength = VGClothes.#GetLengthClothProps(
      ClothesInteriorID,
      Gender
    );

    const allClothes = [];

    ComponentsLength.forEach((Component) => {
      allClothes.push([Component.ComponentName, Component.DrawableLength]);
    });
    PropsLength.forEach((Prop) => {
      allClothes.push([Prop.PropName, Prop.DrawableLength]);
    });
    return allClothes;
  }
  static async GetSuggestionWithID(SuggestionID, ClothesInteriorID, Gender) {
    Gender = Gender.toLowerCase();
    const SuggestionDetails = VGClothes.#GetClothSuggestions(
      SuggestionID,
      ClothesInteriorID,
      Gender
    );
    if (!SuggestionDetails) return;
    if (SuggestionDetails.length == 0) return;
    await VGClothes.#ResetClothPed(
      ClothesDetails.ClothesPreviewNPCs.name,
      ClothesInteriorID,
      Gender
    );
    SuggestionDetails.forEach((SuggestionDetail) => {
      let BoxComponentIndex = undefined,
        DrawableIndex = undefined;
      clothesShops[ClothesInteriorID].ClothComponent[Gender].forEach(
        (Component, index) => {
          if (Component.ComponentID == SuggestionDetail.componentID) {
            BoxComponentIndex = index;
            Component.Drawables.forEach((Drawable, index) => {
              if (Drawable.DrawableID == SuggestionDetail.drawableID) {
                DrawableIndex = index + 1;
              }
            });
          }
        }
      );
      if (BoxComponentIndex == undefined && DrawableIndex == undefined)
        return false;

      VGView.emit(
        WebViewStatus.clothes.name,
        EventNames.clothes.clientWEB.SetDrawableIndex,
        BoxComponentIndex,
        DrawableIndex
      );
    });
    VGView.emit(
      WebViewStatus.clothes.name,
      EventNames.clothes.clientWEB.SetSuggestion,
      SuggestionID
    );
  }
  static SetClothesOnPed(Gender, indexID, DrawableIndex, TextureID = 0) {
    const ClothesShopID = native.getInteriorFromEntity(
      alt.Player.local.scriptID
    );
    Gender = Gender.toLowerCase();
    const AllClothesObject = VGClothes.GetClothesWithInteriorID(
      ClothesShopID,
      Gender
    );
    let FoundedComponentID = undefined;
    let FoundedComponentDrawableID = undefined;
    let FoundedPropID = undefined;
    let FoundedPropDrawableID = undefined;
    clothesShops[ClothesShopID].ClothComponent[Gender].forEach((Component) => {
      if (Component.ComponentName === AllClothesObject[indexID][0]) {
        FoundedComponentID = Component.ComponentID;
        FoundedComponentDrawableID =
          Component.Drawables[DrawableIndex - 1].DrawableID;
      }
    });
    clothesShops[ClothesShopID].ClothProp[Gender].forEach((Prop) => {
      if (Prop.PropName === AllClothesObject[indexID][0]) {
        FoundedPropID = Prop.PropID;
        FoundedPropDrawableID = Prop.Drawables[DrawableIndex - 1].DrawableID;
      }
    });
    if (FoundedComponentID == undefined && FoundedPropID == undefined)
      return false;
    if (FoundedComponentID && FoundedPropID) return false;

    if (FoundedComponentID != undefined) {
      VGPeds.SetComponentOnPedName(
        ClothesDetails.ClothesPreviewNPCs.name,
        FoundedComponentID,
        FoundedComponentDrawableID,
        TextureID
      );
      VGClothes.#SaveClothesItems(
        FoundedComponentID,
        FoundedComponentDrawableID,
        TextureID
      );
    } else if (FoundedPropID != undefined) {
      VGPeds.SetPropOnPedName(
        ClothesDetails.ClothesPreviewNPCs.name,
        FoundedPropID,
        FoundedPropDrawableID,
        TextureID
      );
      VGClothes.#SavePropsItems(
        FoundedPropID,
        FoundedPropDrawableID,
        TextureID
      );
    }
  }
  static #SaveClothesItems(ComponentID, DrawableID, TextureID) {
    ClothesItems.forEach((ClothesItem, index) => {
      if (ClothesItem.ComponentID == ComponentID) {
        ClothesItems.splice(index, 1);
      }
    });

    ClothesItems.push({
      ComponentID: ComponentID,
      DrawableID: DrawableID,
      TextureID: TextureID,
    });
  }
  static #SavePropsItems(PropID, DrawableID, TextureID) {
    PropsItems.forEach((PropsItem, index) => {
      if (PropsItem.PropID == PropID) {
        PropsItems.splice(index, 1);
      }
    });

    PropsItems.push({
      PropID: PropID,
      DrawableID: DrawableID,
      TextureID: TextureID,
    });
  }
  static CreateClothesPed(Gender) {
    if (Gender == "male") {
      VGPeds.CreateUnicPed({
        name: ClothesDetails.ClothesPreviewNPCs.name,
        ModelHash: ClothesDetails.ClothesPreviewNPCs.MaleModelHash,
        isNetwork: ClothesDetails.ClothesPreviewNPCs.isNetwork,
        bScriptHostPed: ClothesDetails.ClothesPreviewNPCs.bScriptHostPed,
        isFreezed: ClothesDetails.ClothesPreviewNPCs.isFreezed,
        pos: ClothesDetails.ClothesPreviewNPCs.Interior[
          native.getInteriorFromEntity(alt.Player.local.scriptID)
        ].pos,
      });
    } else {
      VGPeds.CreateUnicPed({
        name: ClothesDetails.ClothesPreviewNPCs.name,
        ModelHash: ClothesDetails.ClothesPreviewNPCs.FemaleModelHash,
        isNetwork: ClothesDetails.ClothesPreviewNPCs.isNetwork,
        bScriptHostPed: ClothesDetails.ClothesPreviewNPCs.bScriptHostPed,
        isFreezed: ClothesDetails.ClothesPreviewNPCs.isFreezed,
        pos: ClothesDetails.ClothesPreviewNPCs.Interior[
          native.getInteriorFromEntity(alt.Player.local.scriptID)
        ].pos,
      });
    }
    ClothesItems = [];
    PropsItems = [];
  }
  static GetSelectItemsFromClient(Gender) {
    Gender = Gender.toLowerCase();
    let AllClothesSelected = [];
    ClothesItems.forEach((ClothesItem) => {
      clothesShops[
        native.getInteriorFromEntity(alt.Player.local.scriptID)
      ].ClothComponent[Gender].forEach((clothesShopsDetails) => {
        if (clothesShopsDetails.ComponentID != ClothesItem.ComponentID) return;

        clothesShopsDetails.Drawables.forEach((Drawable) => {
          if (
            Drawable.DrawableID == ClothesItem.DrawableID &&
            Drawable.nameInInvoice != "Nothing"
          )
            AllClothesSelected.push({
              ComponentID: ClothesItem.ComponentID,
              TextureID: ClothesItem.TextureID,
              nameInInvoice: Drawable.nameInInvoice,
              DrawableID: Drawable.DrawableID,
              Price: Drawable.Price,
              isNeedTorsos: Drawable.isNeedTorsos,
            });
        });
      });
    });

    PropsItems.forEach((PropsItem) => {
      clothesShops[
        native.getInteriorFromEntity(alt.Player.local.scriptID)
      ].ClothProp[Gender].forEach((clothesShopsDetails) => {
        if (clothesShopsDetails.PropID != PropsItem.PropID) return;

        clothesShopsDetails.Drawables.forEach((Drawable) => {
          if (
            Drawable.DrawableID == PropsItem.DrawableID &&
            Drawable.nameInInvoice != "Nothing"
          )
            AllClothesSelected.push({
              PropID: PropsItem.PropID,
              TextureID: PropsItem.TextureID,
              nameInInvoice: Drawable.nameInInvoice,
              DrawableID: Drawable.DrawableID,
              Price: Drawable.Price,
              isNeedTorsos: Drawable.isNeedTorsos,
            });
        });
      });
    });

    return AllClothesSelected;
  }
}

alt.on(EventNames.allVue.localClient.loadWebviews, async () => {
  alt.on(EventNames.clothes.localClient.ActiveClothes, () => {
    alt.emitServer(EventNames.clothes.client.GetGender);
  });
  alt.onServer(EventNames.clothes.server.SendGender, async (Gender) => {
    await VGView.load(WebViewStatus.clothes.name);
    VGView.open(WebViewStatus.clothes.name);
    VGView.emit(
      WebViewStatus.clothes.name,
      EventNames.clothes.clientWEB.OpenClothes,
      Gender,
      VGClothes.GetClothesWithInteriorID(
        native.getInteriorFromEntity(alt.Player.local.scriptID),
        Gender
      )
    );
    VGCameraClothes.create();
    VGClothes.CreateClothesPed(Gender);

    return;
  });
  VGView.once(EventNames.clothes.WEBclient.ChangeSex, (Gender) => {
    VGPeds.DeleteUnicPed(ClothesDetails.ClothesPreviewNPCs.name);
    VGClothes.CreateClothesPed(Gender);

    VGView.emit(
      WebViewStatus.clothes.name,
      EventNames.clothes.clientWEB.SexChanged,
      Gender,
      VGClothes.GetClothesWithInteriorID(
        native.getInteriorFromEntity(alt.Player.local.scriptID),
        Gender
      )
    );
  });
  VGView.once(EventNames.clothes.WEBclient.CloseClothes, async () => {
    VGView.close(WebViewStatus.clothes.name);
    VGCameraClothes.delete();
    VGPeds.DeleteUnicPed(ClothesDetails.ClothesPreviewNPCs.name);
    setTimeout(async () => {
      await VGView.unload(WebViewStatus.clothes.name);
    }, 200);
  });
  VGView.once(EventNames.clothes.WEBclient.OrderList, (Gender) => {
    VG.serverLog(VGClothes.GetSelectItemsFromClient(Gender));
    // alt.Player.local.setMeta(
    //   "ClothesShopInvoice",
    //   VGClothes.GetSelectItemsFromClient("male")
    // );
  });
  VGView.once(
    EventNames.clothes.WEBclient.Suggestion,
    (Gender, SuggestionID) => {
      VGClothes.GetSuggestionWithID(
        SuggestionID,
        native.getInteriorFromEntity(alt.Player.local.scriptID),
        Gender
      );
      return;
    }
  );
  VGView.once(
    EventNames.clothes.WEBclient.ChangeClothes,
    VGClothes.SetClothesOnPed
  );
});
