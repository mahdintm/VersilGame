let isTimeStamp = true;
var indexmem = 0;
var memory = [];
var TimeStampStatus = false;
var ChatItemBox = document.getElementById("ChatItemBox");
var i_chat = 0;
var isChatOpened = false;
const ChatLimit = 50;

function colorify(text) {
  let matches = [];
  let m = null;
  let curPos = 0;
  do {
    m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));
    if (!m) break;
    matches.push({
      found: m[0],
      index: m["index"] + curPos,
    });
    curPos = curPos + m["index"] + m[0].length;
  } while (m != null);
  if (matches.length > 0) {
    text += "</span>";
    for (let i = matches.length - 1; i >= 0; --i) {
      let color = matches[i].found.substring(1, matches[i].found.length - 1);
      let insertHtml =
        (i != 0 ? "</span>" : "") + '<span style="color: #' + color + '">';
      text =
        text.slice(0, matches[i].index) +
        insertHtml +
        text.slice(matches[i].index + matches[i].found.length, text.length);
    }
  }

  return text.replaceAll("\n", "<br>");
}

function addchat(tt, text) {
  let TimeStamp = new Date(tt);
  i_chat++;
  let time = `${addziro(TimeStamp.getHours())}:${addziro(
    TimeStamp.getMinutes()
  )}:${addziro(TimeStamp.getSeconds())}`;
  if (TimeStampStatus) {
    ChatItemBox.innerHTML += `<div class="Chat" id="ChatText_${i_chat}">
    <span class="TimeStampBox ActiveTimeStamp">${colorify(
      `{ff0000}[${time}]`
    )}</span> <span>${colorify(text)}</span>
    </div>`;
  } else {
    ChatItemBox.innerHTML += `<div class="Chat" id="ChatText_${i_chat}">
      <span class="TimeStampBox">${colorify(
        `{ff0000}[${time}]`
      )}</span> <span>${colorify(text)}</span>
      </div>`;
  }
  if (i_chat >= ChatLimit) {
    document.getElementById(`ChatText_${i_chat - (ChatLimit - 1)}`).outerHTML =
      "";
  }
  ChatItemBox.scrollTo(0, ChatItemBox.scrollHeight);
}

if ("alt" in window)
  alt.on("CLIENT:AddMessage", (TimeStamp, text) => {
    addchat(TimeStamp, text);
  });

function GetDataFromMemory(Up = true) {
  if (Up) {
    if (indexmem - 1 < 0) return;
    indexmem--;
    inputChat.value = memory[indexmem];
  } else {
    if (memory[indexmem] == undefined) return;
    indexmem++;
    if (memory[indexmem] == undefined) return (inputChat.value = "");
    inputChat.value = memory[indexmem];
  }
}

function memorysystem() {
  if (document.getElementById("inputChat").value != "") {
    if (memory.length < 20) {
      memory.push(document.getElementById("inputChat").value);
    } else {
      memory.shift();
      memory.push(document.getElementById("inputChat").value);
    }
    indexmem = memory.length;
  }
}

function addziro(adad) {
  if (adad < 10) {
    return `0${adad}`;
  } else {
    return adad;
  }
}
const InputBox = document.getElementById("InputChatBox");
const inputChat = document.getElementById("inputChat");

document.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 13:
      // Enter pressed
      if (!InputBox.classList.contains("ActiveInput")) return;
      if (inputChat.value == "") return CloseChat();

      alt.emit("WEB:AddMessage", inputChat.value);
      memorysystem();
      inputChat.value = "";
      CloseChat();
      break;
    case 27:
      // Esc pressed
      CloseChat();
      break;
    case 38:
      // Row up pressed
      if (!InputBox.classList.contains("ActiveInput")) return;
      GetDataFromMemory(true);
      break;
    case 40:
      // Row down pressed
      if (!InputBox.classList.contains("ActiveInput")) return;
      GetDataFromMemory(false);
      break;
    default:
      break;
  }
});
function RowPressed(Where) {}
function TimeStampActiver(type) {
  const timeDiv = document.getElementsByClassName("TimeStampBox");
  if (type) {
    TimeStampStatus = true;
    for (let i = 0; i < timeDiv.length; i++) {
      timeDiv[i].classList.add("ActiveTimeStamp");
    }
  } else {
    TimeStampStatus = false;
    for (let i = 0; i < timeDiv.length; i++) {
      timeDiv[i].classList.remove("ActiveTimeStamp");
    }
  }
}

function OpenChat() {
  if (InputBox.classList.contains("ActiveInput")) return;
  InputBox.classList.add("ActiveInput");
  inputChat.focus();
  ChatItemBox.classList.add("ChatItemActive");
  document.getElementById("UpperChatBox").classList.add("ChatItemActive");
  isChatOpened = true;
}

function CloseChat() {
  inputChat.blur();
  InputBox.classList.remove("ActiveInput");
  ChatItemBox.classList.remove("ChatItemActive");
  document.getElementById("UpperChatBox").classList.remove("ChatItemActive");
  if ("alt" in window) alt.emit("CLIENT:CloseChat");
  isChatOpened = false;
}

if ("alt" in window) {
  alt.on("CLIENT:OpenChat", OpenChat);
  alt.on("CLIENT:Scroll", (Where) => {
    Where ? ChatItemBox.scrollBy(0, -200) : ChatItemBox.scrollBy(0, 200);
  });
  alt.on("ShowTimeStampCHAT", TimeStampActiver);
  alt.on("CLIENT:InsertSlash", () => {
    inputChat.value = "/";
  });
}
