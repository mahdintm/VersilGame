let loaded = 20;
let Boxheight = 105;
const ImageURL = "./img/vesil.png";

document.body.innerHTML = `
<div id="#&^$123$#aa$$WiaraTeam**">
    <div class="loadingBoxForLoadingInThisPage123555" id="loadingBoxForLoadingInThisPage123555">
        <div class="SubloadingBoxForLoadingInThisPage123yys555">
            <div class="loadingImgForLoadingInThisPage123yysslllhhs555"><img src="${ImageURL}" alt="" /></div>
            <div class="loadingHoverForLoadingInThisPage123yhjyuisdxcvys555" id="LoadingHeightForLoadingInThisPage7777123yhjyuisdxcvys555"><img src="${ImageURL}" alt="" /></div>
            <div class="TextBoxForLoadingInThisPage123"><span id="NumberTextForLoadingInThisPage">0</span><span>%</span></div>
        </div>
    </div>
</div>`;

const SetNumber = setInterval(() => {
  if (
    document.getElementById("NumberTextForLoadingInThisPage").innerHTML == 100
  ) {
    document.getElementById(
      "loadingBoxForLoadingInThisPage123555"
    ).style.opacity = "0";
    setTimeout(() => {
      document.getElementById("#&^$123$#aa$$WiaraTeam**").innerHTML = "";
    }, 700);
    StartCam();
    return clearInterval(SetNumber);
  }
  if (
    document.getElementById("NumberTextForLoadingInThisPage").innerHTML >=
    loaded
  ) {
    return;
  }
  document.getElementById("NumberTextForLoadingInThisPage").innerHTML =
    parseInt(
      document.getElementById("NumberTextForLoadingInThisPage").innerHTML
    ) + 1;

  Boxheight--;
  document.getElementById(
    "LoadingHeightForLoadingInThisPage7777123yhjyuisdxcvys555"
  ).style.height = Boxheight + "px";
}, 10);

function SetNum(num) {
  loaded = num;
}

function SetLoader(num) {
  if (loaded != 100) {
    let number = `${num}${Math.floor(Math.random() * 10)}`;
    loaded = parseInt(number);
  }
}

setTimeout(() => {
  SetLoader(5);
}, 1500);
setTimeout(() => {
  SetLoader(7);
}, 3000);
setTimeout(() => {
  SetLoader(8);
}, 4000);
setTimeout(() => {
  SetLoader(9);
}, 5000);
