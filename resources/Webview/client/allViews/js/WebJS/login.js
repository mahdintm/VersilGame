const signUpBtn = document.getElementById("signUp");
const signInBtn1 = document.getElementById("signIn1");
const signInBtn2 = document.getElementById("signIn2");
const container = document.querySelector(".container");

signUpBtn.addEventListener("click", () => {
  container.classList.add("right-panel-active");
  setTimeout(() => {
    document.getElementById("UserFirstname").focus();
  }, 500);
});
signInBtn1.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
  setTimeout(() => {
    document.getElementById("Username").focus();
  }, 500);
});
signInBtn2.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
  setTimeout(() => {
    document.getElementById("Username").focus();
  }, 500);
});

function NextStep(GetCode) {
  //   Goto next step
  if (GetCode == "WiaraServerIsBestServer") {
    const CodeSendToEmaileInput = document.getElementById("CodeSendToEmail");
    const CodeSendToPhoneNumberInput = document.getElementById(
      "CodeSendToPhoneNumber"
    );
    //   Reset elements
    CodeSendToEmaileInput.classList.remove("error");
    CodeSendToPhoneNumberInput.classList.remove("error");

    StartCodeRunner(false);
    const SignUpForm = document.getElementById("Steps");
    const LineSteps = document.getElementById("current_status");
    const TabSteps = document.getElementsByClassName("section");
    SignUpForm.classList.remove("step2");
    SignUpForm.classList.add("step3");
    TabSteps[1].classList.add("visited");
    TabSteps[1].classList.remove("current");
    LineSteps.style.width = "100%";
    setTimeout(() => {
      if (LineSteps.style.width == "100%") {
        TabSteps[2].classList.add("current");
      }
    }, 1000);
    setTimeout(() => {
      document.getElementById("UsernameOOC").focus();
    }, 500);
  }
}

function validDate(date) {
  var d = new Date(date);
  Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
  };

  if (d.isValid()) {
    return d.getFullYear() + "/" + d.getMonth() + "/" + d.getDay();
  }
  return false;
}

function InputFocus(id, span1, span2) {
  if (id == "UserFirstname") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_FOR_EXAMPLE_ALIREZA"
    );
  }
  if (id == "UserLastname") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_FOR_EXAMPLE_AKBARI"
    );
  }
  if (id == "UserAge") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_FOR_EXAMPLE_AGE"
    );
  }
  if (id == "UserEmail") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_FOR_EXAMPLE_EMAIL"
    );
  }
  if (id == "UserPhoneNumber") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_FOR_EXAMPLE_PHONE_NUMBER"
    );
  }
  if (id == "CodeSendToEmail") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_VALIDATION_FOR_EXAMPLE_EMAIL"
    );
  }
  if (id == "CodeSendToPhoneNumber") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_VALIDATION_FOR_EXAMPLE_NUMBER"
    );
  }
  if (id == "NameIC") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_ACCOUNT_INFO_IC_RP_FOR_EXAMPLE_NAME"
    );
  }
  if (id == "LastNameIC") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_ACCOUNT_INFO_IC_RP_FOR_EXAMPLE_LASTNAME"
    );
  }
  if (id == "DateOfBirthIC") {
    document.getElementById(id).placeholder = language.getkey(
      "REGISTER_ACCOUNT_INFO_IC_RP_FOR_EXAMPLE_DATE_OF_BIRTH"
    );
  }
  document.getElementById(span1).classList.add("SpanFocusInputFocused");
  document.getElementById(span2).classList.add("ActiveSpan");
  document.getElementById(span2).classList.remove("NotActiveSpan");
}

function InputFocusout(id, span1, span2) {
  document.getElementById(id).placeholder = "";
  document.getElementById(span1).classList.remove("SpanFocusInputFocused");
  if (!document.getElementById(id).value) {
    document.getElementById(span2).classList.remove("ActiveSpan");
    document.getElementById(span2).classList.add("NotActiveSpan");
  }
}

function InputChange(id) {
  document.getElementById(id).classList.remove("error");
}
document.addEventListener("keydown", (event) => {
  if (!event.target.getAttribute("notChange")) return;
  if (event.keyCode === 9) {
    event.preventDefault();
  }
});
document.addEventListener("focusin", (s) => {
  if (
    s.target.getAttribute("inputform") == "true" &&
    s.target.getAttribute("type") != "radio"
  ) {
    let id = s.target.id;
    InputFocus(id, `${id}Focus`, `${id}Span`);
  }
});
document.addEventListener("focusout", (s) => {
  if (
    s.target.getAttribute("inputform") == "true" &&
    s.target.getAttribute("type") != "radio"
  ) {
    let id = s.target.id;
    InputFocusout(id, `${id}Focus`, `${id}Span`);
  }
});

document.addEventListener("keydown", (s) => {
  if (s.target.getAttribute("inputform") == "true") {
    let id = s.target.id;
    InputChange(id);
  }
});

document.addEventListener("change", (s) => {
  if (
    s.target.getAttribute("inputform") == "true" &&
    s.target.getAttribute("type") == "radio"
  ) {
    const checkmarkradioMark =
      document.getElementsByClassName("checkmarkradio");
    checkmarkradioMark[0].classList.remove("error");
    checkmarkradioMark[1].classList.remove("error");
  }
});

document.getElementById("ForgetPassword").addEventListener("click", () => {
  alert("123");
});

function login_Click() {
  const UsernameInput = document.getElementById("Username");
  const PasswordInput = document.getElementById("Password");
  const errorElement = document.getElementById("LoginFormError");
  //   Reset elements
  UsernameInput.classList.remove("error");
  PasswordInput.classList.remove("error");
  errorElement.classList.remove("ShowLoginFormError");
  errorElement.innerHTML = "";
  //   Check
  if (UsernameInput.value == "") {
    UsernameInput.classList.add("error");
    errorElement.innerHTML = language.getkey("LOGIN_ERROR_USERNAME");
    errorElement.classList.add("ShowLoginFormError");
    return;
  }
  if (PasswordInput.value == "") {
    PasswordInput.classList.add("error");
    errorElement.innerHTML = language.getkey("LOGIN_ERROR_PASSWORD");
    errorElement.classList.add("ShowLoginFormError");
    return;
  }
  //   Send login request
  const RememberInput = document.getElementById("Remember");
  LoginToServer({
    Username: UsernameInput.value,
    Password: PasswordInput.value,
    Remember: RememberInput.checked,
  });
}

function PasswordInputPressKey(e) {
  if (e.keyCode == 13) {
    // When click on enter
    login_Click();
  }
}

function RegisterInputsPressKey(e, where) {
  if (e.keyCode == 13) {
    // When click on enter
    if (where == "UserAge") {
      RegisterNextStep(2);
      return;
    }
    if (where == "UserPhoneNumber") {
      ValidationClick();
      return;
    }
    if (where == "CodeSendToEmail" || where == "CodeSendToPhoneNumber") {
      RegisterNextStep(3);
      return;
    }
    if (where == "RePasswordOOC") {
      RegisterNextStep(4);
      return;
    }
    if (where == "DateOfBirthIC") {
      RegisterNextStep(5);
      return;
    }
  }
}

function RegisterNextStep(Where) {
  if (Where == 2) {
    const UserFirstnameInput = document.getElementById("UserFirstname");
    const UserLastnameInput = document.getElementById("UserLastname");
    const UserAgeInput = document.getElementById("UserAge");
    const sexradioInput = document.getElementsByName("sexradio");
    const checkmarkradioMark =
      document.getElementsByClassName("checkmarkradio");
    //   Reset elements
    UserFirstnameInput.classList.remove("error");
    UserLastnameInput.classList.remove("error");
    UserAgeInput.classList.remove("error");
    checkmarkradioMark[0].classList.remove("error");
    checkmarkradioMark[1].classList.remove("error");
    //   Check
    if (UserFirstnameInput.value == "") {
      UserFirstnameInput.classList.add("error");
      return;
    }
    if (UserLastnameInput.value == "") {
      UserLastnameInput.classList.add("error");
      return;
    }
    if (UserAgeInput.value == "") {
      UserAgeInput.classList.add("error");
      return;
    }
    if (!validDate(UserAgeInput.value)) {
      UserAgeInput.classList.add("error");
      return;
    }
    console.log(validDate(UserAgeInput.value));
    if (!sexradioInput[0].checked && !sexradioInput[1].checked) {
      checkmarkradioMark[0].classList.add("error");
      checkmarkradioMark[1].classList.add("error");
      return;
    }
    //   Goto next step
    const SignUpForm = document.getElementById("Steps");
    const LineSteps = document.getElementById("current_status");
    const TabSteps = document.getElementsByClassName("section");
    SignUpForm.classList.add("step2");
    SignUpForm.classList.remove("step3");
    TabSteps[0].classList.add("visited");
    TabSteps[0].classList.remove("current");
    LineSteps.style.width = "50%";
    setTimeout(() => {
      if (LineSteps.style.width == "50%" || LineSteps.style.width == "75%") {
        TabSteps[1].classList.add("current");
      }
    }, 1000);
    setTimeout(() => {
      document.getElementById("UserEmail").focus();
    }, 500);
    return;
  }
  if (Where == 3) {
    const CodeSendToEmaileInput = document.getElementById("CodeSendToEmail");
    const CodeSendToPhoneNumberInput = document.getElementById(
      "CodeSendToPhoneNumber"
    );
    //   Reset elements
    CodeSendToEmaileInput.classList.remove("error");
    CodeSendToPhoneNumberInput.classList.remove("error");
    // Check
    if (CodeSendToEmaileInput.value == "") {
      CodeSendToEmaileInput.classList.add("error");
      return;
    }
    if (CodeSendToPhoneNumberInput.value == "") {
      CodeSendToPhoneNumberInput.classList.add("error");
      return;
    }
    SendValidationCodeToServer({
      EmailCode: CodeSendToEmaileInput.value,
      PhoneCode: CodeSendToPhoneNumberInput.value,
    });
    return;
  }
  if (Where == 4) {
    const UsernameOOC = document.getElementById("UsernameOOC");
    const PasswordOOC = document.getElementById("PasswordOOC");
    const RePasswordOOC = document.getElementById("RePasswordOOC");
    //   Reset elements
    UsernameOOC.classList.remove("error");
    PasswordOOC.classList.remove("error");
    RePasswordOOC.classList.remove("error");
    //  Check
    if (UsernameOOC.value.length < 3 || parseInt(UsernameOOC.value.charAt(0))) {
      UsernameOOC.classList.add("error");
      return;
    }
    if (PasswordOOC.value.length < 8) {
      PasswordOOC.classList.add("error");
      return;
    }
    if (RePasswordOOC.value != PasswordOOC.value) {
      RePasswordOOC.classList.add("error");
      return;
    }
    document
      .getElementById("Account_View_Register")
      .classList.add("NextAccountIntro");
    setTimeout(() => {
      document.getElementById("NameIC").focus();
    }, 500);
    return;
  }
  if (Where == 5) {
    const NameIC = document.getElementById("NameIC");
    const LastNameIC = document.getElementById("LastNameIC");
    const DateOfBirthIC = document.getElementById("DateOfBirthIC");
    //   Reset elements
    NameIC.classList.remove("error");
    LastNameIC.classList.remove("error");
    DateOfBirthIC.classList.remove("error");
    //  Check
    if (NameIC.value.length < 3) {
      NameIC.classList.add("error");
      return;
    }
    // Check that the number is not entered in NameIC
    for (let i = 0; i < NameIC.value.length; i++) {
      if (parseInt(NameIC.value.charAt(i))) {
        NameIC.classList.add("error");
        return;
      }
    }
    if (LastNameIC.value.length < 3) {
      LastNameIC.classList.add("error");
      return;
    }
    // Check that the number is not entered in LastNameIC
    for (let i = 0; i < LastNameIC.value.length; i++) {
      if (parseInt(LastNameIC.value.charAt(i))) {
        LastNameIC.classList.add("error");
        return;
      }
    }
    if (!validDate(DateOfBirthIC.value)) {
      DateOfBirthIC.classList.add("error");
      return;
    }
    // Registered
    const UserFirstnameInput = document.getElementById("UserFirstname");
    const UserLastnameInput = document.getElementById("UserLastname");
    const UserAgeInput = document.getElementById("UserAge");
    const sexradioInput = document.getElementsByName("sexradio");
    const UserEmailInput = document.getElementById("UserEmail");
    const UserPhoneNumberInput = document.getElementById("UserPhoneNumber");
    const SendToEmailInput = document.getElementById("SendToEmail");
    const SendToNumberInput = document.getElementById("SendToNumber");
    const UsernameOOCInput = document.getElementById("UsernameOOC");
    const PasswordOOCInput = document.getElementById("PasswordOOC");
    let SexRealUser;
    if (sexradioInput[0].checked) SexRealUser = 0;
    if (sexradioInput[1].checked) SexRealUser = 1;

    RegisterToServer({
      main: {
        RealFirstName: UserFirstnameInput.value,
        RealLastName: UserLastnameInput.value,
        RealDateOfBirth: UserAgeInput.value,
        RealSex: SexRealUser,
        Email: UserEmailInput.value,
        Phone: UserPhoneNumberInput.value,
        SendNotificationToEmail: SendToEmailInput.checked,
        SendNotificationToPhone: SendToNumberInput.checked,
        Username: UsernameOOCInput.value,
        Password: PasswordOOCInput.value,
      },
      rp: {
        FirstName: NameIC.value,
        LastName: LastNameIC.value,
        DateOfBirth: DateOfBirthIC.value,
      },
    });
    return;
  }
}

function RegisterPrevStep(Where) {
  if (Where == 2) {
    const SignUpForm = document.getElementById("Steps");
    const LineSteps = document.getElementById("current_status");
    const TabSteps = document.getElementsByClassName("section");
    SignUpForm.classList.remove("step2");
    SignUpForm.classList.remove("step3");
    TabSteps[1].classList.remove("current");
    LineSteps.style.width = "0%";
    setTimeout(() => {
      if (LineSteps.style.width == "0%") {
        TabSteps[0].classList.remove("visited");
        TabSteps[0].classList.add("current");
      }
    }, 1000);
    return;
  }
  if (Where == 3) {
    document
      .getElementById("Contact_View_Register")
      .classList.remove("NextContactIntro");
    const LineSteps = document.getElementById("current_status");
    LineSteps.style.width = "50%";
    return;
  }
  if (Where == 4) {
    const SignUpForm = document.getElementById("Steps");
    const LineSteps = document.getElementById("current_status");
    const TabSteps = document.getElementsByClassName("section");
    SignUpForm.classList.add("step2");
    SignUpForm.classList.remove("step3");
    TabSteps[2].classList.remove("current");
    LineSteps.style.width = "75%";
    setTimeout(() => {
      if (LineSteps.style.width == "75%" || LineSteps.style.width == "50%") {
        TabSteps[1].classList.remove("visited");
        TabSteps[1].classList.add("current");
      }
    }, 1000);
    return;
  }
  if (Where == 5) {
    document
      .getElementById("Account_View_Register")
      .classList.remove("NextAccountIntro");
  }
}

function CheckOtherInteger(ElementID) {
  const Element = document.getElementById(ElementID);
  var Value = Element.value;
  let regex = /^(09|9)(0[1-5]|[1 3]\d|2[0-2]|9[0 1 2 3 4 8 9]|4[1])\d{7}$/;
  if (ElementID == "UserPhoneNumber") {
    if (!Value.match(regex)) {
      Element.classList.add("error");
      return;
    }
    if (Value.length == 10) Value = "0" + Value;
    Element.value = Value;
  }
  return true;
}

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

function ValidationClick() {
  // Check values
  const Useremail = document.getElementById("UserEmail");
  if (!validateEmail(Useremail.value)) {
    Useremail.classList.add("error");
    return;
  }

  if (!CheckOtherInteger("UserPhoneNumber")) {
    return;
  }
  // Goto next

  const UserPhoneNumberInput = document.getElementById("UserPhoneNumber");
  const EmailBoxSpan = document.getElementById("EmailBox");
  const PhoneBoxSpan = document.getElementById("PhoneBox");
  EmailBoxSpan.innerHTML = Useremail.value;
  PhoneBoxSpan.innerHTML = UserPhoneNumberInput.value;
  SendCodeValidation(Useremail.value, UserPhoneNumberInput.value);
  document
    .getElementById("Contact_View_Register")
    .classList.add("NextContactIntro");
  const LineSteps = document.getElementById("current_status");
  LineSteps.style.width = "75%";
  setTimeout(() => {
    document.getElementById("CodeSendToEmail").focus();
  }, 500);
}

// function ShowLoginForm(Status = true) {
//     if (!Status) return (document.getElementById("body").style.display = "none");
//     document.getElementById("body").style.display = "block";
//     setTimeout(() => {
//         console.log("slm")
//         document.getElementById("Username").focus();
//     }, 500);
// }

function InvalidLoginInfo() {
  const errorElement = document.getElementById("LoginFormError");
  errorElement.innerHTML = language.getkey("LOGIN_ERROR_INFO");
  errorElement.classList.add("ShowLoginFormError");
}

let CodeStarted = false;
let Validate = false;
let TimerForCodes;

function ResendCodeClicked() {
  if (Validate == false) {
    const Useremail = document.getElementById("UserEmail");
    const UserPhoneNumberInput = document.getElementById("UserPhoneNumber");
    SendCodeValidation(Useremail.value, UserPhoneNumberInput.value);
  }
}
let CounterForValidationCode = 0;

function SetErrorClassForValidation() {
  CounterForValidationCode++;
  if (CounterForValidationCode >= 5) {
    CloseConnectionPlayerFromLoginForm();
  }
  const CodeSendToEmaileInput = document.getElementById("CodeSendToEmail");
  const CodeSendToPhoneNumberInput = document.getElementById(
    "CodeSendToPhoneNumber"
  );
  CodeSendToEmaileInput.classList.add("error");
  CodeSendToPhoneNumberInput.classList.add("error");
}

function StartCodeRunner(Start = true) {
  if (CodeStarted == true && Start == true) {
    // Reset timer
    clearInterval(TimerForCodes);
    CodeStarted = false;
    document.getElementById("TimerValue").innerHTML = "0:00";
  }
  if (CodeStarted == false && Start == true && Validate == false) {
    const ResendBox = document.getElementById(
      "ResendCodeBoxForValidationEmailAndPhoneNumber"
    );
    const PrevBTNValidation = document.getElementById(
      "PrevStepInValidationEmailAndPhoneNumber"
    );
    ResendBox.style.display = "none";
    PrevBTNValidation.style.display = "none";

    const TimerValue = document.getElementById("TimerValue");
    let NowTimeLeft;
    CodeStarted = true;
    var EndTime = new Date().getTime() + 50000;
    TimerForCodes = setInterval((Start) => {
      var current = new Date().getTime();

      if (EndTime <= current) {
        // CoolDown finished
        clearInterval(TimerForCodes);
        CodeStarted = false;
        NowTimeLeft = "0:00";
      } else {
        NowTimeLeft = EndTime - current;
        var minutes = Math.floor(
          (NowTimeLeft % (1000 * 60 * 60)) / (1000 * 60)
        );
        var seconds = Math.floor((NowTimeLeft % (1000 * 60)) / 1000);
        seconds = seconds.toString();
        if (seconds.length == 1) seconds = "0" + seconds;
        if (minutes == 0 && parseInt(seconds) <= 30) {
          ResendBox.style.display = "block";
          PrevBTNValidation.style.display = "inline-block";
        }
        NowTimeLeft = minutes + ":" + seconds;
      }
      TimerValue.innerHTML = NowTimeLeft;
    }, 1000);
  } else if (Start == false) {
    // User Validation and Finish Interval
    clearInterval(TimerForCodes);
    CodeStarted = false;
    Validate = true;
    document.getElementById("TimerValue").innerHTML = "0:00";
  }
}
