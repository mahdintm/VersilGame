import * as alt from "alt";
import * as native from "natives";
import { webview_tools } from "./webviewscontroler";
import { LocalStorage } from "../system/LocalStorage";
import { View } from "./viewCreator";
import { VGView } from "./webViewController";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";

export async function LoadLoginPage() {
  function LoginCamera() {
    native.displayRadar(false);
    const camera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(camera, 0, 0, 100);
    native.setCamRot(camera, 0, 0, 0, 2);
    native.setCamFov(camera, 90);
    const camera2 = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(camera2, 100, 1000, 1000);
    native.setCamRot(camera2, 0, 0, 500, 2);
    native.setCamFov(camera2, 90);
    const camera3 = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(camera3, -1000, -1000, 1000);
    native.setCamRot(camera3, 0, 0, 1, 2);
    native.setCamFov(camera3, 90);

    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 16, true, false, 0);

    alt.on(EventNames.player.localClient.LoginStartCam, () => {
      alt.setTimeout(async () => {
        native.setCamActiveWithInterp(camera2, camera, 10000, 1, 1);
      }, 1000);
      alt.setTimeout(async () => {
        native.setCamActiveWithInterp(camera3, camera2, 10000, 1, 1);
      }, 15000);
    });
  }
  setTimeout(LoginCamera, 10); // Agar in nabashad camera e'mal nemishavad
  await VGView.emit(
    WebViewStatus.login.name,
    EventNames.login.clientWEB.SetDataWeb,
    {
      WebLanguage: await LocalStorage.get("WebLanguage"),
      WebDarkMode: await LocalStorage.get("WebDarkMode"),
      Remember: await LocalStorage.get("Remember"),
      LoginData: await LocalStorage.get("LoginData"),
    }
  );
  VGView.on(EventNames.login.WEBclient.LoginAccount, async (obj) => {
    if (obj.Remember == true) {
      LocalStorage.set("Remember", true);
      LocalStorage.set("LoginData", {
        password: obj.Password,
        username: obj.Username,
      });
    } else {
      if ((await LocalStorage.get("LoginData")) != undefined) {
        LocalStorage.set("Remember", false);
        LocalStorage.set("LoginData", undefined);
      }
    }
    await alt.emitServer("Login_Account_To_Server", {
      password: obj.Password,
      username: obj.Username,
    });
  });

  alt.onServer("CallBack_Login_Account_To_Server", async (state) => {
    if (state == true) {
      await VGView.emit(
        WebViewStatus.login.name,
        EventNames.login.clientWEB.LoginSuccessfully
      );

      if (await VGView.unload(WebViewStatus.login.name)) {
        native.displayRadar(true);
        native.destroyAllCams(true);
        native.renderScriptCams(false, false, 0, false, false, 0);
        alt.emit(EventNames.allVue.localClient.loadWebviews);
      }
    }
  });
}

// In OldLoadLoginPage() ghadimi ast va faghat be dalile dashtane asamiye event ha negah dashte shode ast
// Baad az etmame kar ba event name ha in ghesmat bayad hazf gardad
async function OldLoadLoginPage() {
  View.Add("Login");
  const view = new webview_tools(
    "http://assets/Webview/client/login/index.html",
    "login"
  );
  view.setchange(true);
  view.web.focus();

  view.web.emit("SetDataWeb", {
    WebLanguage: await LocalStorage.get("WebLanguage"),
    WebDarkMode: await LocalStorage.get("WebDarkMode"),
    Remember: await LocalStorage.get("Remember"),
    LoginData: await LocalStorage.get("LoginData"),
  });
  view.web.on("Login_Account", async (obj) => {
    if (obj.Remember == true) {
      LocalStorage.set("Remember", true);
      LocalStorage.set("LoginData", {
        password: obj.Password,
        username: obj.Username,
      });
    } else {
      if ((await LocalStorage.get("LoginData")) != undefined) {
        LocalStorage.set("Remember", false);
        LocalStorage.set("LoginData", undefined);
      }
    }
    await alt.emitServer("Login_Account_To_Server", {
      password: obj.Password,
      username: obj.Username,
    });
  });

  view.web.on("Register_Account", async (obj) => {
    await alt.emitServer("Register_Account_To_Server", obj);
  });

  alt.onServer("CallBack_Login_Account_To_Server", (state) => {
    if (state == true) {
      //hide
      view.web.emit("Login_Successfully");
      view.web.unfocus();
      alt.toggleGameControls(true);
      alt.showCursor(false);
      native.destroyAllCams(true);
      native.renderScriptCams(false, false, 0, false, false, 0);
      view.setchange(false);
      View.Remove("Login");
      alt.emit("loadWebviews");
    } else {
      //error
    }
  });
  view.web.on("ChangeTheme", async (state) => {
    await LocalStorage.set("WebDarkMode", state);
  });
  view.web.on("ChangeLanguage", async (state) => {
    await LocalStorage.set("WebLanguage", state);
  });
  view.web.on("SendCodeValidation", async (data) => {
    alt.emitServer("RequestCodeValidation", data);
  });
  alt.onServer("CallBackRequestCodeValidation", () => {
    view.web.emit("CodeValidationIsReady");
  });
  view.web.on("SendValidationCodeToServer", (data) => {
    alt.emitServer("RequestCodeValidationEntered", data);
  });
  alt.onServer("CallBackRequestCodeValidationEntered", (state, data) => {
    if (state == true)
      return view.web.emit("CallBackValidationCodeServerSide", true, data);
    return view.web.emit("CallBackValidationCodeServerSide", false, ":D");
  });

  view.web.on("StartCamera", () => {
    alt.toggleGameControls(false);
    alt.showCursor(true);
    const camera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(camera, 0, 0, 100);
    native.setCamRot(camera, 0, 0, 0, 2);
    native.setCamFov(camera, 90);
    const camera2 = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(camera2, 100, 1000, 1000);
    native.setCamRot(camera2, 0, 0, 500, 2);
    native.setCamFov(camera2, 90);
    const camera3 = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(camera3, -1000, -1000, 1000);
    native.setCamRot(camera3, 0, 0, 1, 2);
    native.setCamFov(camera3, 90);

    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 16, true, false, 0);

    alt.setTimeout(async () => {
      native.setCamActiveWithInterp(camera2, camera, 10000, 1, 1);
    }, 1000);
    alt.setTimeout(async () => {
      native.setCamActiveWithInterp(camera3, camera2, 10000, 1, 1);
    }, 15000);
  });
}
