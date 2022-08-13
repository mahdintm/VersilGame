// event clint be clinet "Local:"
// event server be server "Local:"
// event server be client "Server:"
// event client be server "Client:"
// event client be web "ClientWEB:"
// event web to client "WEBClient:"
export const EventNames = {
  player: {
    localClient: {
      webViewCompleteLoaded: "Local:WebView:WebViewCompleteLoaded",
    },
    localServer: {},
    server: {
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
      KeyRowUpPressed: "Local:Chat:KeyRowUpPressed",
      KeyRowDownPressed: "Local:Chat:KeyRowDownPressed",
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
      KeyRowPressed: "ClientWEB:Chat:KeyRowPressed",
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
    },
    WEBclient: {
      ChangeClothes: "WEBclient:Clothes:ChangeClothes",
      ChangeSex: "WEBclient:Clothes:ChangeSex",
      CloseClothes: "ClientWEB:Clothes:CloseClothes",
    },
  },
  eyeTracker: {
    localClient: {},
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
};
