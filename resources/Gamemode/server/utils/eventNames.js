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
      PlayerDetails: "Server:ManagePlayer:PlayerDetails",
      isFreezePlayer: "Server:ManagePlayer:isFreezePlayer",
      Add3DText: "Server:ManagePlayer:Add3DText",
      Remove3DText: "Server:ManagePlayer:Remove3DText",
      Modify3DText: "Server:ManagePlayer:Modify3DText",
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
  clothes: {
    localServer: {},
    server: {
      SendGender: "Server:Clothes:SendGender",
    },
    client: {
      GetGender: "Client:Clothes:GetGender",
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
      Scroll: "ClientWEB:Chat:Scroll",
    },
    WEBclient: {
      CloseChat: "WEBClient:Chat:CloseChat",
      AddMessage: "WEBClient:Chat:AddMessage",
    },
  },
  scoreBoard: {
    localClient: {
      ActiveScoreBoard: "local:Clothes:ActiveScoreBoard",
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
  },
};
