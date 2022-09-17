// event clint be clinet "Local:
// event server be server "Local:
// event server be client "Server:
// event client be server "Client:
// event client be web "ClientWEB:
// event web to client "WEBClient:
export const EventNames = {
  player: {
    localClient: {
      startScriptConnection: "Local:WebView:startScriptConnection",
      webViewCompleteLoaded: "Local:WebView:WebViewCompleteLoaded",
      KeyManagment: "Local:Keys:KeyManagment",
    },
    localServer: {},
    server: {
      PlayerDetails: "Server:ManagePlayer:PlayerDetails",
      isFreezePlayer: "Server:ManagePlayer:isFreezePlayer",
      isFreezeGameControlPlayer: "Server:ManagePlayer:isFreezeGameControlPlayer",
      Add3DText: "Server:ManagePlayer:Add3DText",
      Remove3DText: "Server:ManagePlayer:Remove3DText",
      Modify3DText: "Server:ManagePlayer:Modify3DText",
      RequestIPL: "Server:ManagePlayer:RequestIPL",
      RemoveIPL: "Server:ManagePlayer:RemoveIPL",
      SeatBelt: "Client:VehicleDetails:SeatBelt",
      Cruse: "Client:VehicleDetails:Cruse",
    },
    client: {
      ServerLog: "Client:DebugMode:ConsoleLogInServer",
      SeatBelt: "Client:VehicleDetails:SeatBelt",
      Cruse: "Client:VehicleDetails:Cruse",
      StreamMeta: {
        Vehicle: {
          Indicator: "Client:Vehicle:IndicatorChange",
          Cruise: "Client:Vehicle:Cruise",
          HandBrake: "Client:Vehicle:HandBrake",
        },
      },
    },
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
      UsernameError: "ClientWEB:Login:UsernameError",
      PasswordError: "ClientWEB:Login:PasswordError",
      AccountOnline: "ClientWEB:Login:AccountOnline",
      AnotherError: "ClientWEB:Login:AnotherError",
      RegisterResult: "ClientWEB:Login:RegisterResult",
    },
    WEBclient: {
      LoginAccount: "WEBclient:Login:LoginAccount",
      RegisterAccount: "WEBclient:Login:RegisterAccount",
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
    localClient: {
      ActiveClothes: "local:Clothes:ActiveClothes",
    },
    localServer: {},
    server: {
      SendGender: "Server:Clothes:SendGender",
    },
    client: {
      GetGender: "Client:Clothes:GetGender",
    },
    clientWEB: {
      OpenClothes: "ClientWEB:Clothes:OpenClothes",
      SexChanged: "ClientWEB:Clothes:SexChanged",
      KeyRowUpPressed: "ClientWEB:clothes:KeyRowUpPressed",
      KeyRowLeftPressed: "ClientWEB:clothes:KeyRowLeftPressed",
      SetSuggestion: "ClientWEB:clothes:SetSuggestion",
      SetDrawableIndex: "ClientWEB:clothes:SetDrawableIndex",
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
  scoreBoard: {
    localClient: {
      ActiveScoreBoard: "local:ScoreBoard:ActiveScoreBoard",
      LeftClickMousePressed: "Local:ScoreBoard:LeftClickMousePressed",
    },
    server: {
      SetScoreBoardDetails: "Server:ScoreBoard:SetScoreBoardDetails",
    },
    client: {
      GetScoreBoardDetails: "Client:ScoreBoard:GetScoreBoardDetails",
    },
    clientWEB: {
      SetScoreBoardDetails: "ClientWEB:ScoreBoard:SetScoreBoardDetails",
    },
    WEBclient: {
      CloseScoreBoard: "WEBclient:ScoreBoard:CloseScoreBoard",
    },
  },
  HUD: {
    localClient: {
      IndicatorLeft: "localClient:HUD:IndicatorLeft",
      IndicatorRight: "localClient:HUD:IndicatorRight",
      HandBrake: "localClient:HUD:HandBrake",
      SeatBelt: "localClient:HUD:SeatBelt",
      Cruse: "localClient:HUD:Cruse",
      APressed: "localClient:HUD:APressed",
      DPressed: "localClient:HUD:DPressed",
      SPressed: "localClient:HUD:SPressed",
    },
    clientWEB: {
      SetPlayerCashDetails: "ClientWEB:HUD:SetPlayerCashDetails",
      SetCarHUDDetails: "ClientWEB:HUD:SetCarHUDDetails",
      SetVeniceHUDDetails: "ClientWEB:HUD:SetVeniceHUDDetails",
    },
    WEBclient: {},
  },
};
