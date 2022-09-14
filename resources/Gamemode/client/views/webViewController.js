import * as alt from "alt-client";
import * as native from "natives";
import { VG } from "../system/functions";
import { LocalStorage } from "../system/LocalStorage";
import { defaultPlayerDetails } from "../utils/defaultPlayerDetails";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";

// let _defaultURL = `http://192.168.93.10:8080`, // For Debug mode if you run Vue.js you can import IP in this Variable
let _defaultURL = `http://assets/Webview/client/allVue/index.html`,
  _loadingPageURL = `http://assets/Webview/client/loadingPageVue/index.html`,
  _PhoneURL = `http://assets/Webview/client/phoneVue/index.html`,
  _MusicURL = `http://assets/Webview/client/musicVue/index.html`,
  _isReadyLoading = false,
  _isReadyPhone = false,
  _isReadyMusic = false,
  _isReady = false,
  _Loadingwebview,
  _Phonewebview,
  _Musicwebview,
  _webview,
  isGameControlsStatus = false,
  isFirstTimeUseStartWebView = true,
  isLoadAllWebViewDoned = false,
  _currentEvents = [],
  SpawnDetails,
  PlayerDetails;

alt.onServer(EventNames.player.server.PlayerDetails, (spawnDetails) => {
  SpawnDetails = spawnDetails;
});
export class VGView {
  static async #getPlayerDetailsFromLocalStorage() {
    return new Promise((resolve) => {
      let attempts = 0;
      const interval = alt.setInterval(async () => {
        PlayerDetails = await LocalStorage.getPlayerDetails();
        if (attempts >= 5) {
          await LocalStorage.Delete("PlayerDetails");
          await LocalStorage.set("PlayerDetails", defaultPlayerDetails);
          attempts = 0;
          return;
        }
        if (!PlayerDetails) {
          attempts += 1;
          return;
        }
        if (!PlayerDetails.isCompleteLoaded) {
          attempts += 1;
          return;
        }

        alt.clearInterval(interval);
        return resolve(true);
      }, 100);
    });
  }
  static async #isLoadedPlayerDetailsAndSpawnPos() {
    if (await VGView.#getPlayerDetailsFromLocalStorage()) {
      return new Promise((resolve) => {
        const interval = alt.setInterval(() => {
          if (SpawnDetails.isCompleteLoaded) {
            alt.clearInterval(interval);
            return resolve(true);
          }
        }, 100);
      });
    }
  }
  static async #createWebView(url) {
    return new alt.WebView(url, false);
  }
  static async #loadingPage(isLoaded, isRestart = false) {
    // Loading Page Webview
    if (isRestart && _Loadingwebview) {
      await _Loadingwebview.destroy();
      _isReadyLoading = false;
      _Loadingwebview = undefined;
    }

    if (isLoaded) {
      if (!_Loadingwebview) {
        _Loadingwebview = await VGView.#createWebView(_loadingPageURL);
        _Loadingwebview.focus();
        _Loadingwebview.on(
          `${WebViewStatus.loadingPage.EventNames.ready}`,
          () => {
            VG.debugLog("----- Loading Page Webview has been mounted -----");

            _isReadyLoading = true;
          }
        );
      }
    } else {
      if (_Loadingwebview) {
        await _Loadingwebview.emit(
          `${WebViewStatus.loadingPage.EventNames.fullLoad}`
        );

        _Loadingwebview.on(
          `${WebViewStatus.loadingPage.EventNames.destroy}`,
          async () => {
            _Loadingwebview.unfocus();
            if (!isLoadAllWebViewDoned) {
              alt.emit(EventNames.player.localClient.webViewCompleteLoaded);
            }
            await _Loadingwebview.destroy();
            _Loadingwebview = undefined;
            _isReadyLoading = false;
            isLoadAllWebViewDoned = true;
            VG.debugLog("----- Loading Page Webview has been destroy -----");
          }
        );
      }
    }
  }
  static async #resetLoading() {
    await VGView.#loadingPage(true, true);
  }
  static async #getLoading() {
    return new Promise((resolve) => {
      let attempts = 0;
      let isNotFirstTime = true;
      const interval = alt.setInterval(() => {
        if (attempts >= 10 && isNotFirstTime) {
          isNotFirstTime = false;
          VGView.#resetLoading();
          attempts = 0;
          return;
        } else if (attempts >= 100) {
          VGView.#resetLoading();
          attempts = 0;
          return;
        }
        if (!_Loadingwebview) {
          attempts += 1;
          return;
        }
        if (!_isReadyLoading) {
          attempts += 1;
          return;
        }
        alt.clearInterval(interval);
        return resolve(_Loadingwebview);
      }, 100);
    });
  }
  static async #music(isRestart = false) {
    if (await VGView.#isLoadedPlayerDetailsAndSpawnPos()) {
      if (isRestart && _Musicwebview) {
        await _Musicwebview.destroy();
        _Musicwebview = undefined;
        _isReadyMusic = false;
      }

      if (!_Musicwebview) {
        _Musicwebview = await VGView.#createWebView(_MusicURL);
        if (PlayerDetails.isPlayIntroMusic) {
          _Musicwebview.emit(
            EventNames.introMusic.clientWEB.changeVolume,
            PlayerDetails.IntroMusicVolume
          );
          _Musicwebview.emit(WebViewStatus.IntroVue.EventNames.load);
        }
        _Musicwebview.on(`${WebViewStatus.musicVue.EventNames.ready}`, () => {
          isRestart
            ? VG.debugLog("MusicVue has been reseted, mounted & Ready to use!")
            : VG.debugLog("MusicVue has been mounted & Ready to use!");

          _isReadyMusic = true;
          return true;
        });
      }
    }
  }
  static async #resetMusic() {
    // Reset Loading Page Webview
    // Inja bayad yek logger injad beshe ta esme player ro sabt kone va
    // ma motevajeh beshim che kasi dar che zamani niyaz peyda karde ta reset beshe
    // Player zamani niyaz peyda mikone be reset shodan ke (404 - not found) begire
    // Va zamani ke az halate debug mode kharej beshim in mozu' dige nabayad pish biyad o
    // 100 dar 100 bayad logger, log bendaze ta irade kar ro dar biyarim

    VGView.#music(true);
  }
  static async #getMusic() {
    return new Promise((resolve) => {
      let attempts = 0;
      let isNotFirstTime = true;
      const interval = alt.setInterval(() => {
        if (attempts >= 10 && isNotFirstTime) {
          isNotFirstTime = false;
          VGView.#resetMusic();
          attempts = 0;
          return;
        } else if (attempts >= 50) {
          VGView.#resetMusic();
          attempts = 0;
          return;
        }
        if (!_Musicwebview) {
          attempts += 1;
          return;
        }
        if (!_isReadyMusic) {
          attempts += 1;
          return;
        }
        alt.clearInterval(interval);
        return resolve(_Musicwebview);
      }, 100);
    });
  }
  static async #phone(isRestart = false) {
    if (isRestart && _Phonewebview) {
      await _Phonewebview.destroy();
      _Phonewebview = undefined;
      _isReadyPhone = false;
    }

    if (!_Phonewebview) {
      _Phonewebview = await VGView.#createWebView(_PhoneURL);
      _Phonewebview.on(`${WebViewStatus.phone.EventNames.ready}`, () => {
        isRestart
          ? VG.debugLog("Phone has been reseted, mounted & Ready to use!")
          : VG.debugLog("Phone has been mounted & Ready to use!");

        _isReadyPhone = true;
        return true;
      });
    }
  }
  static async #resetPhone() {
    VGView.#phone(true);
  }
  static async #getPhone() {
    return new Promise((resolve) => {
      let attempts = 0;
      const interval = alt.setInterval(() => {
        if (attempts >= 255) {
          VGView.#resetPhone();
          attempts = 0;
          return;
        }
        if (!_Phonewebview) {
          attempts += 1;
          return;
        }
        if (!_isReadyPhone) {
          attempts += 1;
          return;
        }
        alt.clearInterval(interval);
        return resolve(_Phonewebview);
      }, 100);
    });
  }
  static async #create(url = _defaultURL, isRestart = false) {
    const isLoadingPageViewLoaded = await VGView.#getLoading();
    const isPhoneViewLoaded = await VGView.#getPhone();
    _defaultURL = url;

    if (isRestart && _webview) {
      await _webview.destroy();
      _webview = undefined;
      _isReady = false;
    }

    if (!_webview) {
      _webview = await VGView.#createWebView(_defaultURL);
      _webview.on(EventNames.allVue.WEBclient.mountedAndReady, () => {
        isRestart
          ? VG.debugLog("WebView has been reseted, mounted & Ready to use!")
          : VG.debugLog("WebView has been mounted & Ready to use!");

        _isReady = true;
        return true;
      });
    }
  }
  static async #reset() {
    // Reset Webview
    VGView.#create(_defaultURL, true);
  }
  static async #get() {
    return new Promise((resolve) => {
      let attempts = 0;
      const interval = alt.setInterval(() => {
        if (attempts >= 255) {
          VGView.#reset();
          attempts = 0;
          return;
        }
        if (!_webview) {
          attempts += 1;
          return;
        }
        if (!_isReady) {
          attempts += 1;
          return;
        }
        alt.clearInterval(interval);
        return resolve(_webview);
      }, 100);
    });
  }
  static async #isAllComponentsLoaded() {
    await _Loadingwebview.emit(
      WebViewStatus.loadingPage.EventNames.ProcessText,
      "Loading Game"
    );
    return new Promise((resolve) => {
      native.newLoadSceneStartSphere(
        SpawnDetails.SpawnPos.x,
        SpawnDetails.SpawnPos.y,
        SpawnDetails.SpawnPos.z,
        50.0,
        0
      );
      const interval = alt.setInterval(() => {
        if (native.isNewLoadSceneLoaded()) {
          alt.clearInterval(interval);
          return resolve(true);
        }
      }, 100);
    });
  }
  static async #GameControls(isGameControls) {
    if (_webview) {
      if (isGameControls && !isGameControlsStatus) {
        alt.toggleGameControls(false);
        alt.setCursorPos(new alt.Vector2(0.5, 0.5), true);
        alt.showCursor(true);
        _webview.focus();
        isGameControlsStatus = true;
      } else if (!isGameControls && isGameControlsStatus) {
        if (await VGView.#checkPriorityForDisableGameControls()) return;
        _webview.unfocus();
        alt.showCursor(false);
        alt.toggleGameControls(true);
        isGameControlsStatus = false;
      }
    } else {
      const view = await VGView.#get();

      if (isGameControls && !isGameControlsStatus) {
        alt.toggleGameControls(false);
        alt.setCursorPos(new alt.Vector2(0.5, 0.5), true);
        alt.showCursor(true);
        view.focus();
        isGameControlsStatus = true;
      } else if (!isGameControls && isGameControlsStatus) {
        if (await VGView.#checkPriorityForDisableGameControls()) return;
        view.unfocus();
        alt.showCursor(false);
        alt.toggleGameControls(true);
        isGameControlsStatus = false;
      }
    }
  }
  static async #loadWebView(ViewName) {
    // Load Webview
    try {
      if (!(await VGView.#checkViewPriority(WebViewStatus[ViewName].priority)))
        return false;
      const view = await VGView.#get();
      await view.emit(WebViewStatus[ViewName].EventNames.load);
      if (WebViewStatus[ViewName].isNeedGameControl) {
        await VGView.#GameControls(true);
      }
      WebViewStatus[ViewName].isActive = true;
      VG.debugLog(ViewName);
      return true;
    } catch (error) {
      return false;
    }
  }
  static async #closeWebView(ViewName) {
    // Close Webview
    try {
      if (!WebViewStatus[ViewName].isActive) return false;
      const view = await VGView.#get();
      await view.emit(WebViewStatus[ViewName].EventNames.unLoad);
      WebViewStatus[ViewName].isActive = false;
      WebViewStatus[ViewName].isOpen = false;
      await VGView.#GameControls(false);
      if (ViewName == "login")
        _Musicwebview.emit(WebViewStatus.IntroVue.EventNames.unLoad);
      return true;
    } catch (error) {
      return false;
    }
  }
  static async #checkPriorityForDisableGameControls() {
    let isNeedGameControl = false;

    Object.values(WebViewStatus).forEach((ViewStatus) => {
      if (ViewStatus.isActive) {
        if (ViewStatus.isNeedGameControl || ViewStatus.isOpen) {
          isNeedGameControl = true;
        }
      }
    });
    return isNeedGameControl;
  }
  static async #checkPriorityForisOpenItems() {
    let ViewName = null,
      priority = 0;
    Object.values(WebViewStatus).forEach((ViewStatus) => {
      if (ViewStatus.isOpen) {
        if (priority < ViewStatus.priority) {
          priority = ViewStatus.priority;
          ViewName = ViewStatus.name;
        }
      }
    });
    return ViewName;
  }
  static async #checkViewPriority(ViewPriority) {
    let UpperPriority = 0;
    Object.values(WebViewStatus).forEach((ViewStatus) => {
      if (
        (ViewStatus.isActive && !ViewStatus.isMultiView) ||
        (ViewStatus.isActive && ViewStatus.isOpen)
      ) {
        if (UpperPriority < ViewStatus.priority) {
          UpperPriority = ViewStatus.priority;
        }
      }
    });
    if (UpperPriority <= ViewPriority) {
      return true;
    } else {
      return false;
    }
  }
  static async #isFirstTimeCompeleteLoaded() {
    return new Promise((resolve) => {
      const interval = alt.setInterval(() => {
        if (!isLoadAllWebViewDoned) {
          return;
        }

        alt.clearInterval(interval);
        return resolve(isLoadAllWebViewDoned);
      }, 100);
    });
  }
  static async #isWebViewRequestEmitActive(viewName) {
    return new Promise((resolve) => {
      const interval = alt.setInterval(() => {
        try {
          if (!WebViewStatus[viewName].isActive) {
            return;
          }

          alt.clearInterval(interval);
          return resolve(WebViewStatus[viewName].isActive);
        } catch (error) {
          // If viewName is not defined
          alt.clearInterval(interval);
          return resolve(false);
        }
      }, 100);
    });
  }
  static async #isClosed(viewName) {
    return new Promise((resolve) => {
      const interval = alt.setInterval(() => {
        try {
          if (WebViewStatus[viewName].isActive) {
            return;
          }

          alt.clearInterval(interval);
          return resolve(true);
        } catch (error) {
          // If viewName is not define
          alt.clearInterval(interval);
          return resolve(false);
        }
      }, 100);
    });
  }
  static async #setEmit(eventName, ...args) {
    if (_webview) {
      _webview.emit(eventName, ...args);
    } else {
      const view = await VGView.#get();
      view.emit(eventName, ...args);
    }
    VG.debugLog("VGView.emit: ", eventName, ...args);
  }
  /**
   * This feature must be used when the player connects to the server,
   * You can use this in one time
   * @memberof VGView
   */
  static async startWebView() {
    if (!isFirstTimeUseStartWebView) return;
    isFirstTimeUseStartWebView = false;
    await VGView.#music();
    await VGView.#getMusic();
    await VGView.#loadingPage(true);
    await VGView.#phone();
    await VGView.#create();
    if (await VGView.#get())
      if (await VGView.#isAllComponentsLoaded()) {
        alt.emit(EventNames.player.localClient.startScriptConnection);
        await VGView.#loadingPage(false);
      }
  }
  /**
   * It is used to take control from player & give this to WebView.
   * @memberof VGView
   */
  static async requestGameControls() {
    await VGView.#GameControls(true);
  }
  static isGameControls() {
    return isGameControlsStatus;
  }
  /**
   * Manage loading page.
   * @static true
   * @param {boolean} Status
   * @memberof VGView
   */
  static async isOpenLoadingPage(Status = true) {
    if (await VGView.#isFirstTimeCompeleteLoaded()) {
      await VGView.#loadingPage(Status);
    }
  }
  /**
   * Manage loading page.
   * @param {string} AudioName
   * @memberof VGView
   */
  static async AudioRequest(AudioName) {
    VG.debugLog(AudioName, "This is not worked");
  }
  /**
   * This feature has not been created yet.
   * @static
   * @param {string} ViewName
   * @param {object} object
   * @return {boolean}
   * @memberof VGView
   */
  static async open(ViewName, object = {}) {
    try {
      if (!WebViewStatus[ViewName].isActive) return false;
      if (WebViewStatus[ViewName].isOpen) return false;
      if (!(await VGView.#checkViewPriority(WebViewStatus[ViewName].priority)))
        return false;

      switch (ViewName) {
        case WebViewStatus.chat.name:
          if (object.isUseSlash) {
            await VGView.emit(
              WebViewStatus.chat.name,
              EventNames.chat.clientWEB.InsertSlash
            );
          }
          await VGView.emit(
            WebViewStatus.chat.name,
            EventNames.chat.clientWEB.OpenChat
          );
          await VGView.#GameControls(true);
          WebViewStatus.chat.isOpen = true;
          break;
        case WebViewStatus.eyeTracker.name:
          if (!object.Status) return;
          if (!object.ObjectFoundedDetails) return;
          await VGView.emit(
            WebViewStatus.eyeTracker.name,
            "ClientWEB:eyeTracker:MenuStatus",
            object.Status,
            object.ObjectFoundedDetails
          );
          await VGView.#GameControls(true);
          WebViewStatus.eyeTracker.isOpen = true;
          break;
        case WebViewStatus.clothes.name:
          WebViewStatus.clothes.isOpen = true;
          break;
        case WebViewStatus.scoreBoard.name:
          WebViewStatus.scoreBoard.isOpen = true;
          VGView.#GameControls(true);
          break;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  /**
   * close items in WebViews.
   * @static
   * @param {string} ViewName
   * @return {boolean}
   * @memberof VGView
   */
  static async close(ViewName) {
    try {
      if (!WebViewStatus[ViewName].isActive) return false;
      if (!WebViewStatus[ViewName].isOpen) return false;

      switch (ViewName) {
        case WebViewStatus.chat.name:
          await VGView.emit(
            WebViewStatus.chat.name,
            EventNames.chat.clientWEB.CloseChat,
            false
          );
          WebViewStatus.chat.isOpen = false;
          await VGView.#GameControls(false);
          break;
        case WebViewStatus.eyeTracker.name:
          await VGView.emit(
            WebViewStatus.eyeTracker.name,
            EventNames.eyeTracker.clientWEB.MenuStatus,
            false
          );
          WebViewStatus.eyeTracker.isOpen = false;
          await VGView.#GameControls(false);
          break;
        case WebViewStatus.scoreBoard.name:
          await VGView.emit(
            WebViewStatus.scoreBoard.name,
            WebViewStatus.scoreBoard.EventNames.close
          );
          WebViewStatus.scoreBoard.isOpen = false;
          await VGView.#GameControls(false);
          break;
        case WebViewStatus.clothes.name:
          WebViewStatus.clothes.isOpen = false;
          break;
      }
      return true;
    } catch (error) {
      VG.debugLog(7);
      return false;
    }
  }
  /**
   * Manage ESC key in WebViews.
   * @memberof VGView
   */
  static async escPressed() {
    if (native.isPauseMenuActive()) return;
    let TopViewName = await VGView.#checkPriorityForisOpenItems();
    if (TopViewName != null) {
      try {
        VGView.emit(TopViewName, WebViewStatus[TopViewName].EventNames.close);
      } catch (error) {}
    }
  }
  /**
   * Load items in WebViews.
   * @static
   * @param {string} ViewName
   * @return {boolean}
   * @memberof VGView
   */
  static async load(ViewName) {
    if (isLoadAllWebViewDoned) {
      return await VGView.#loadWebView(ViewName);
    } else if (await VGView.#isFirstTimeCompeleteLoaded()) {
      return await VGView.#loadWebView(ViewName);
    }
  }
  /**
   * Unload items in WebViews.
   * @static
   * @param {string} ViewName
   * @return {boolean}
   * @memberof VGView
   */
  static async unload(ViewName) {
    VG.debugLog("unload", ViewName);
    if (await VGView.#isFirstTimeCompeleteLoaded()) {
      await VGView.#closeWebView(ViewName);
      if (await VGView.#isClosed(ViewName)) {
        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * Emit an event to the WebView.
   * @static
   * @param {string} viewName
   * @param {string} eventName
   * @param {...any[]} args
   * @memberof VGView
   */
  static async emit(viewName, eventName, ...args) {
    if (isLoadAllWebViewDoned) {
      try {
        if (WebViewStatus[viewName].isActive) {
          await VGView.#setEmit(eventName, ...args);
        } else {
          if (await VGView.#isWebViewRequestEmitActive(viewName)) {
            await VGView.#setEmit(eventName, ...args);
          }
        }
      } catch (error) {}
    } else if (await VGView.#isFirstTimeCompeleteLoaded()) {
      try {
        if (WebViewStatus[viewName].isActive) {
          await VGView.#setEmit(eventName, ...args);
        } else {
          if (await VGView.#isWebViewRequestEmitActive(viewName)) {
            await VGView.#setEmit(eventName, ...args);
          }
        }
      } catch (error) {}
    }
  }
  /**
   * is Open emit an event to the WebView.
   * @static
   * @param {string} viewName
   * @param {string} eventName
   * @param {...any[]} args
   * @memberof VGView
   */
  static async isOpenEmit(viewName, eventName, ...args) {
    if (isLoadAllWebViewDoned) {
      try {
        if (WebViewStatus[viewName].isOpen) {
          await VGView.#setEmit(eventName, ...args);
        }
      } catch (error) {}
    } else if (await VGView.#isFirstTimeCompeleteLoaded()) {
      try {
        if (WebViewStatus[viewName].isOpen) {
          await VGView.#setEmit(eventName, ...args);
        }
      } catch (error) {}
    }
  }
  /**
   * is Open emit an send keyLeft to the WebView.
   * @static
   * @param {boolean} StatusLeft
   * @memberof VGView
   */
  static async isOpenKeyLeftEmit(StatusLeft) {
    if (isLoadAllWebViewDoned) {
      if (native.isPauseMenuActive()) return;
      let TopViewName = await VGView.#checkPriorityForisOpenItems();
      if (TopViewName != null) {
        try {
          await VGView.emit(
            WebViewStatus[TopViewName].name,
            EventNames[TopViewName].clientWEB.KeyRowLeftPressed,
            StatusLeft
          );
        } catch (error) {}
      }
    } else if (await VGView.#isFirstTimeCompeleteLoaded()) {
      if (native.isPauseMenuActive()) return;
      let TopViewName = await VGView.#checkPriorityForisOpenItems();
      if (TopViewName != null) {
        try {
          await VGView.emit(
            WebViewStatus[TopViewName].name,
            EventNames[TopViewName].clientWEB.KeyRowLeftPressed,
            StatusLeft
          );
        } catch (error) {}
      }
    }
  }
  /**
   * is Opened WebView.
   * @static
   * @param {string} viewName
   * @returns {boolean}
   * @memberof VGView
   */
  static async isOpen(viewName) {
    if (isLoadAllWebViewDoned) {
      try {
        return WebViewStatus[viewName].isOpen;
      } catch (error) {}
    } else if (await VGView.#isFirstTimeCompeleteLoaded()) {
      try {
        return WebViewStatus[viewName].isOpen;
      } catch (error) {}
    }
  }
  /**
   * return top WebView.
   * @static
   * @returns {string}
   * @memberof VGView
   */
  static async getTopView() {
    return await VGView.#checkPriorityForisOpenItems();
  }
  /**
   * is Open emit an send keyUP to the WebView.
   * @static
   * @param {boolean} StatusUP
   * @memberof VGView
   */
  static async isOpenKeyUPEmit(StatusUP) {
    if (isLoadAllWebViewDoned) {
      if (native.isPauseMenuActive()) return;
      let TopViewName = await VGView.#checkPriorityForisOpenItems();
      if (TopViewName != null) {
        try {
          await VGView.emit(
            WebViewStatus[TopViewName].name,
            EventNames[TopViewName].clientWEB.KeyRowUpPressed,
            StatusUP
          );
        } catch (error) {}
      }
    } else if (await VGView.#isFirstTimeCompeleteLoaded()) {
      if (native.isPauseMenuActive()) return;
      let TopViewName = await VGView.#checkPriorityForisOpenItems();
      if (TopViewName != null) {
        try {
          await VGView.emit(
            WebViewStatus[TopViewName].name,
            EventNames[TopViewName].clientWEB.KeyRowUpPressed,
            StatusUP
          );
        } catch (error) {}
      }
    }
  }
  /**
   * Binds a WebView event on
   * @static
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   * @return {*}
   * @memberof VGView
   */
  static async on(eventName, listener) {
    const view = await VGView.#get();
    view.on(eventName, listener);
  }
  /**
   * Binds a WebView event once and ensures it is never bound again.
   * @static
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   * @return {*}
   * @memberof VGView
   */
  static async once(eventName, listener) {
    const view = await VGView.#get();
    const index = _currentEvents.findIndex((e) => e.eventName === eventName);
    if (index >= 0) {
      return;
    }
    view.on(eventName, listener);
    _currentEvents.push({
      eventName,
      callback: listener,
    });
  }
}
VGView.startWebView();

alt.on(EventNames.player.localClient.webViewCompleteLoaded, async () => {
  alt.emit(EventNames.player.localClient.LoginStartCam);
  VGView.load(WebViewStatus.login.name);
});
