let darktheme = true;
let language_use = "en";
function StartCam() {
  if ("alt" in window) alt.emit("StartCamera");
}
if ("alt" in window) {
  alt.on("SetDataWeb", SetDataWeb);
  alt.on("CallBackValidationCodeServerSide", CallBackValidationCodeServerSide);
  alt.on("CodeValidationIsReady", CodeValidationIsReady);
  alt.on("Login_Successfully", Login_Successfully);

  function SetDataWeb(data) {
    if (data.Remember) {
      let spanUsername = document.getElementById("UsernameSpan");
      spanUsername.classList.remove("NotActiveSpan");
      spanUsername.classList.add("ActiveSpan");
      document.getElementById("Username").value = data.LoginData.username;
      let spanpassword = document.getElementById("PasswordSpan");
      spanpassword.classList.remove("NotActiveSpan");
      spanpassword.classList.add("ActiveSpan");
      document.getElementById("Password").value = data.LoginData.password;
      document.getElementById("Remember").checked = true;
    }
    darktheme = data.WebDarkMode;
    language_use = data.WebLanguage;
    setTheme(darktheme);
    language.set(language_use);
    document.getElementById("body").style.display = "block";
    document.getElementById("Username").focus();
  }

  function Login_Successfully(params) {
    return (document.getElementById("body").style.display = "none");
  }

  function LoginToServer(obj) {
    alt.emit("Login_Account", obj);
  }

  function RegisterToServer(obj) {
    return alt.emit("Register_Account", obj);
  }

  function SendCodeValidation(email, phone) {
    let firstname = document.getElementById("UserFirstname").value;
    let lastname = document.getElementById("UserLastname").value;
    return alt.emit("SendCodeValidation", {
      Email: email,
      PhoneNumber: phone,
      name: { first: firstname, last: lastname },
    });
  }

  function CodeValidationIsReady() {
    return StartCodeRunner();
  }

  function SendValidationCodeToServer(obj) {
    return alt.emit("SendValidationCodeToServer", obj);
  }

  function CallBackValidationCodeServerSide(state, data) {
    if (state) {
      return NextStep(data);
    } else {
      return SetErrorClassForValidation();
    }
  }

  function CodeSendToEmaileInput(a1, a2, a3) {
    console.log(a1, a2, a3);
  }
}

function setTheme(darktheme) {
  let body = document.getElementById("body");
  darktheme ? body.classList.add("dark") : body.classList.remove("dark");
}

function ChangeTheme() {
  darktheme ? (darktheme = false) : (darktheme = true);
  setTheme(darktheme);
  alt.emit("ChangeTheme", darktheme);
}

function ChangeLanguage() {
  // Set null innerHTML in error box when login
  document.getElementById("LoginFormError").innerHTML = "";
  if (language_use == "en") {
    language_use = "fa";
  } else if (language_use == "fa") {
    language_use = "en";
  }
  language.set(language_use);
  alt.emit("ChangeLanguage", language_use);
}
class language {
  static getkey(key) {
    return languagekey[language_use][key];
  }
  static set(lang) {
    language_use = lang;
    switch (lang) {
      case "fa":
        if (body.classList.contains("en")) {
          body.classList.remove("en");
        }
        body.classList.add("fa");
        break;
      default:
        if (body.classList.contains("fa")) {
          body.classList.remove("fa");
        }
        body.classList.add("en");
        break;
    }
    var allelemnt = document.querySelectorAll("[lang_value]");
    for (let index = 0; index < allelemnt.length; index++) {
      let val = allelemnt[index].getAttribute("lang_value");
      let key = allelemnt[index].getAttribute("lang_type");
      switch (key) {
        case "innerHTML":
          allelemnt[index].innerHTML = this.getkey(val);
          break;
        case "value":
          allelemnt[index].value = this.getkey(val);
          break;
        case "placeholder":
          allelemnt[index].placeholder = this.getkey(val);
          break;
      }
    }
  }
}
