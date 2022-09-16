import * as alt from "alt";
import * as native from "natives";
import { LocalStorage } from "../system/LocalStorage";
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

  function ValidateEmail(email) {
    const ValidRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(ValidRegex);
  }

  await VGView.emit(WebViewStatus.login.name, EventNames.login.clientWEB.SetDataWeb, {
    WebLanguage: (await LocalStorage.getPlayerDetails()).WebLanguage,
    WebDarkMode: (await LocalStorage.getPlayerDetails()).WebDarkMode,
    Remember: (await LocalStorage.getPlayerDetails()).Remember,
    LoginData: (await LocalStorage.getPlayerDetails()).LoginData,
  });
  VGView.on(EventNames.login.WEBclient.LoginAccount, async (obj) => {
    if (obj.Remember == true) {
      LocalStorage.setPlayerDetails("Remember", true);
      LocalStorage.setPlayerDetails("LoginData", {
        username: obj.Username,
        password: obj.Password,
      });
    } else {
      LocalStorage.setPlayerDetails("Remember", false);
      LocalStorage.setPlayerDetails("LoginData", {
        username: "",
        password: "",
      });
    }
    await alt.emitServer("Login_Account_To_Server", {
      username: obj.Username,
      password: obj.Password,
    });
  });
  VGView.on(EventNames.login.WEBclient.RegisterAccount, (Details) => {
    // {
    //     Username: RegisterUsername.value,
    //     Email: RegisterEmail.value,
    //     Password: RegisterPassword.value,
    //     RePassword: RegisterRePassword.value,
    //     CheckBox: RegisterCheckBox.checked
    // }
    let DataVerification = {
      Username: false,
      isUsernameExist: true,
      Email: false,
      Password: false,
      CheckBox: false,
    };
    if (Details.Username.length > 3 && Details.Username.length < 15) DataVerification.Username = true;

    if (ValidateEmail(Details.Email)) DataVerification.Email = true;

    if (Details.Password == Details.RePassword) DataVerification.Password = true;
    if (Details.CheckBox) DataVerification.CheckBox = true;

    return VGView.emit(WebViewStatus.login.name, EventNames.login.clientWEB.RegisterResult, DataVerification);
  });
  alt.onServer("CallBack_Login_Account_To_Server", async (state, Error = "") => {
    if (state == true) {
      await VGView.emit(WebViewStatus.login.name, EventNames.login.clientWEB.LoginSuccessfully);

      if (await VGView.unload(WebViewStatus.login.name)) {
        native.displayRadar(true);
        native.destroyAllCams(true);
        native.renderScriptCams(false, false, 0, false, false, 0);
        alt.emit(EventNames.allVue.localClient.loadWebviews);
      }
    } else if (Error == "UsernameError") {
      await VGView.emit(WebViewStatus.login.name, EventNames.login.clientWEB.UsernameError);
    } else if (Error == "PasswordError") {
      await VGView.emit(WebViewStatus.login.name, EventNames.login.clientWEB.PasswordError);
    } else if (Error == "AccountOnline") {
      await VGView.emit(WebViewStatus.login.name, EventNames.login.clientWEB.AccountOnline);
    } else {
      await VGView.emit(WebViewStatus.login.name, EventNames.login.clientWEB.AnotherError);
    }
  });
}
