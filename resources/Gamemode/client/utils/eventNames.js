// event clint be clinet "Local:"
// event server be server "Local:"
// event server be client "Server:"
// event client be server "Client:"
// event client be web "ClientWEB:"
// event web to client "WEBClient:"
export const EventNames = {
  player: {
    localClient: {
      startScriptConnection: "Local:WebView:startScriptConnection",
      webViewCompleteLoaded: "Local:WebView:WebViewCompleteLoaded",
    },
    localServer: {},
    server: {
      PlayerDetails: "Server:ManagePlayer:PlayerDetails",
      isFreezePlayer: "Server:ManagePlayer:isFreezePlayer",
    },
    client: {},
    clientWEB: {},
    WEBclient: {},
  },
  allVue: {
    localClient: {
      loadWebviews: "Local:allVue:loadWebviews",
    },
    localServer: {},
    server: {},
    client: {},
    clientWEB: {},
    WEBclient: {
      mountedAndReady: "WEBclient:allVue:mountedAndReady",
    },
  },

  login: {
    localClient: {
      LoginStartCam: "Local:Login:LoginStartCam",
    },
    localServer: {},
    server: {},
    client: {},
    clientWEB: {
      SetDataWeb: "ClientWEB:Login:SetDataWeb",
      LoginSuccessfully: "ClientWEB:Login:LoginSuccessfully",
    },
    WEBclient: {
      LoginAccount: "WEBclient:Login:LoginAccount",
    },
  },
  chat: {
    localClient: {
      KeySlashPressed: "Local:Chat:KeySlashPressed",
      KeyTPressed: "Local:Chat:KeyTPressed",
      KeyPageUpPressed: "Local:Chat:KeyPageUpPressed",
      KeyPageDownPressed: "Local:Chat:KeyPageDownPressed",
    },
    localServer: {},
    server: {
      TimeStamp: "Server:Chat:ShowTimeStampCHAT",
      Message: "Server:Chat:Message",
    },
    client: {
      Loaded: "Client:Chat:Loaded",
      Message: "Client:Chat:Message",
    },
    clientWEB: {
      TimeStamp: "ClientWEB:Chat:TimeStamp",
      AddMessage: "ClientWEB:Chat:AddMessage",
      InsertSlash: "ClientWEB:Chat:InsertSlash",
      OpenChat: "ClientWEB:Chat:OpenChat",
      CloseChat: "ClientWEB:Chat:CloseChat",
      Scroll: "ClientWEB:Chat:Scroll",
      KeyRowUpPressed: "ClientWEB:Chat:KeyRowUpPressed",
    },
    WEBclient: {
      CloseChat: "WEBClient:Chat:CloseChat",
      AddMessage: "WEBClient:Chat:AddMessage",
    },
  },
  clothes: {
    localClient: {},
    localServer: {},
    server: {},
    client: {},
    clientWEB: {
      OpenClothes: "ClientWEB:Clothes:OpenClothes",
      SexChanged: "ClientWEB:Clothes:SexChanged",
      KeyRowUpPressed: "ClientWEB:clothes:KeyRowUpPressed",
      KeyRowLeftPressed: "ClientWEB:clothes:KeyRowLeftPressed",
    },
    WEBclient: {
      ChangeClothes: "WEBclient:Clothes:ChangeClothes",
      ChangeSex: "WEBclient:Clothes:ChangeSex",
      CloseClothes: "WEBclient:Clothes:CloseClothes",
      Suggestion: "WEBclient:Clothes:Suggestion",
      OrderList: "WEBclient:Clothes:OrderList",
    },
  },
  eyeTracker: {
    localClient: {
      LeftClickMousePressed: "Local:eyeTracker:LeftClickMousePressed",
      Manager: "Local:eyeTracker:Manager",
    },
    localServer: {},
    server: {},
    client: {},
    clientWEB: {
      Status: "ClientWEB:eyeTracker:Status",
      MenuStatus: "ClientWEB:eyeTracker:MenuStatus",
    },
    WEBclient: {
      ButtonCloseMenuPressed: "WEBclient:eyeTracker:ButtonCloseMenuPressed",
      ObjectSelectedFromPlayer: "WEBclient:eyeTracker:ObjectSelectedFromPlayer",
    },
  },
  introMusic: {
    clientWEB: {
      changeVolume: "ClientWEB:introMusic:changeVolume",
    },
  },
};
