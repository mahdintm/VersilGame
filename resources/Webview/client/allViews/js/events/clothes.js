// function AddClothesItems(Gender, ClothesUtils) {
//   let indexGenderItems, SexBTNBox;
//   if (Gender == "male") {
//     Gender = "Male";
//     SexBTNBox = `<div id="ClothesMaleBTN" class="ClothesSexBTN ClothesSexBTNActive" onclick="ChangeSex('male')">Male</div><div id="ClothesFemaleBTN" class="ClothesSexBTN" onclick="ChangeSex('female')">Female</div>`;
//     indexGenderItems = 1;
//   } else {
//     Gender = "Female";
//     SexBTNBox = `<div id="ClothesMaleBTN" class="ClothesSexBTN" onclick="ChangeSex('male')">Male</div><div id="ClothesFemaleBTN" class="ClothesSexBTN ClothesSexBTNActive" onclick="ChangeSex('female')">Female</div>`;
//     indexGenderItems = 2;
//   }
//   document.getElementById("SetClothesBox").innerHTML = `
//     <div class="ClothesBoxItem">
//       <div class="ClothesBoxClumns_2"><div>Select Sex</div><div id="SkinGender">${Gender}</div></div>
//       <div class="ClothesBoxClumns_2 ClothesBoxClumns_SexBTN">${SexBTNBox}</div>
//       <div class="ClothesBoxClumns_1 MarginTop10px"><div>Presents</div></div>
//       <div class="ClothesBoxClumns_6">
//         <div class="ClothesBox_BTN">1</div>
//         <div class="ClothesBox_BTN">2</div>
//         <div class="ClothesBox_BTN">3</div>
//         <div class="ClothesBox_BTN">4</div>
//         <div class="ClothesBox_BTN">5</div>
//         <div class="ClothesBox_BTN">6</div>
//       </div>
//     </div>
//     `;

//   for (let i = 0; i < ClothesUtils.length; i++) {
//     document.getElementById("SetClothesBox").innerHTML += `
//     <div class="ClothesBoxItem">
//       <div class="ClothesBoxClumns_2"><div>${
//         ClothesUtils[i][0]
//       }</div><div class="ClothesIndexAndLengh"><span id='ClothesShowItemValueID${i}'>1</span><span> | </span><span  id='ClothesMaximumItemValueID${i}'>${
//       ClothesUtils[i][indexGenderItems]
//     }</span></div></div>
//       <div class="ClothesBoxClumns_3 MarginTop10px">
//         <div class="ClothesBox_RBTN" id="LeftBTNClothesID${
//           i + 1
//         }" onclick="ChangeItemValue(false, '${i}', this)">&#10094;</div> 
//         <input type="number" min='1' class="ClothesItemValue" id='ClothesItemValueID${i}' onfocusout="CheckValueForChange(this, ${i})" onkeydown='ResetElem(this)' onchange="ChangeClothesItemValue(this, '${i}')" value="1"></input>
//         <div class="ClothesBox_RBTN" id="RightBTNClothesID${
//           i + 1
//         }" onclick="ChangeItemValue(true, '${i}', this)">&#10095;</div>
//       </div>
//     </div>`;
//   }
// }
// function ChangeItemValue(Front, elemID, elem) {
//   const ClothesItemValueID = document.getElementById(
//     "ClothesItemValueID" + elemID
//   );
//   const ClothesShowItemValueID = document.getElementById(
//     "ClothesShowItemValueID" + elemID
//   );
//   const ClothesMaximumItemValueID = document.getElementById(
//     "ClothesMaximumItemValueID" + elemID
//   );
//   ResetElem(ClothesItemValueID);
//   if (
//     parseInt(ClothesItemValueID.value) >
//       parseInt(ClothesMaximumItemValueID.innerHTML) ||
//     parseInt(ClothesItemValueID.value) <= 0
//   ) {
//     ClothesItemValueID.classList.add("ClothesItemValueIsInvalid");
//     ClothesItemValueID.focus();
//     return;
//   }
//   if (Front) {
//     const NumberValue = parseInt(ClothesItemValueID.value) + 1;
//     if (NumberValue > parseInt(ClothesMaximumItemValueID.innerHTML)) {
//       setTimeout(() => {
//         elem.classList.remove("ClothesBox_RBTNIsInvalid");
//       }, 1500);
//       return elem.classList.add("ClothesBox_RBTNIsInvalid");
//     }
//     ChangeValueClothesItem(elemID, NumberValue);
//     return;
//   }
//   const NumberValue = parseInt(ClothesItemValueID.value) - 1;
//   if (NumberValue <= 0) {
//     setTimeout(() => {
//       elem.classList.remove("ClothesBox_RBTNIsInvalid");
//     }, 1500);
//     return elem.classList.add("ClothesBox_RBTNIsInvalid");
//   }
//   ChangeValueClothesItem(elemID, NumberValue);
//   return;
// }
// function CheckValueForChange(elem, elemID) {
//   if (elem.classList.contains("ClothesItemValueIsInvalid")) {
//     elem.classList.remove("ClothesItemValueIsInvalid");
//     elem.value = 1;
//     document.getElementById("ClothesShowItemValueID" + elemID).innerHTML =
//       elem.value;
//   }
// }
// function ResetElem(elem) {
//   elem.classList.remove("ClothesItemValueIsInvalid");
// }
// function ChangeClothesItemValue(elem, elemID) {
//   elem.blur();
//   const ClothesShowItemValueID = document.getElementById(
//     "ClothesShowItemValueID" + elemID
//   );
//   const ClothesMaximumItemValueID = document.getElementById(
//     "ClothesMaximumItemValueID" + elemID
//   );
//   if (elem.value == "") elem.value = ClothesShowItemValueID.innerHTML;
//   elem.value = parseInt(elem.value);
//   if (
//     elem.value > parseInt(ClothesMaximumItemValueID.innerHTML) ||
//     elem.value <= 0
//   ) {
//     elem.classList.add("ClothesItemValueIsInvalid");
//     elem.focus();
//     return;
//   }

//   ChangeValueClothesItem(elemID, elem.value);
// }
// function ChangeValueClothesItem(elemID, value) {
//   const ClothesItemValueID = document.getElementById(
//     "ClothesItemValueID" + elemID
//   );
//   const ClothesShowItemValueID = document.getElementById(
//     "ClothesShowItemValueID" + elemID
//   );
//   ClothesItemValueID.value = value;
//   ClothesShowItemValueID.innerHTML = value;

//   // Send Values To Client Side
//   if ("alt" in window) alt.emit("CLIENT:ChangeClothes", elemID, value);
// }
// function ChangeSex(Sex) {
//   if (Sex == document.getElementById("SkinGender").innerHTML.toLowerCase())
//     return;
//   if ("alt" in window) alt.emit("CLIENT:ChangeSex", Sex);
// }
// function ClassController(elementID, className, action) {
//   if (action == "add")
//     return document.getElementById(elementID).classList.add(className);
//   return document.getElementById(elementID).classList.remove(className);
// }

// function ScrollTo(ScrollValue) {
//   return SetClothesBox.scrollTo({
//     top: ScrollValue,
//     behavior: "smooth",
//   });
// }

// let SelectedStatus = -1;

// function KeyRowPressed(Down) {
//   if (isChatOpened) return;
//   const ClothesBoxItem = document.getElementsByClassName("ClothesBoxItem");
//   for (let i = 0; i < ClothesBoxItem.length; i++) {
//     ClothesBoxItem[i].classList.remove("ActiveClothesItemBox");
//   }
//   if (Down) {
//     if (SelectedStatus >= ClothesBoxItem.length - 1) SelectedStatus = -1;
//     SelectedStatus++;
//     ClothesBoxItem[SelectedStatus].classList.add("ActiveClothesItemBox");
//     ClothesBoxItem[SelectedStatus].offsetTop - 100 >= 0
//       ? ScrollTo(ClothesBoxItem[SelectedStatus].offsetTop - 100)
//       : ScrollTo(0);
//     return;
//   }
//   if (SelectedStatus <= 0) SelectedStatus = ClothesBoxItem.length;
//   SelectedStatus--;
//   ClothesBoxItem[SelectedStatus].classList.add("ActiveClothesItemBox");
//   ClothesBoxItem[SelectedStatus].offsetTop - 100 >= 0
//     ? ScrollTo(ClothesBoxItem[SelectedStatus].offsetTop - 100)
//     : ScrollTo(0);
// }
// function KeyRowLeftPressed(Left) {
//   if (SelectedStatus <= 0) return; // For not selected item
//   if (Left) {
//     return document.getElementById("LeftBTNClothesID" + SelectedStatus).click();
//   }
//   return document.getElementById("RightBTNClothesID" + SelectedStatus).click();
// }
document.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 37:
      // Row Left pressed
      KeyRowLeftPressed(true);
      break;
    case 39:
      // Row Right pressed
      KeyRowLeftPressed(false);
      break;
    case 38:
      // Row up pressed
      KeyRowPressed(false);
      break;
    case 40:
      // Row down pressed
      KeyRowPressed(true);
      break;
    default:
      break;
  }
});

if ("alt" in window) {
  // alt.on("WEB:Clothes", (status, Gender, ClothesUtils) => {
  //   if (status) {
  //     AddClothesItems(Gender, ClothesUtils);
  //     return ClassController("ClothesBox", "ActiveBoxFromRight", "add");
  //   }
  //   return ClassController("ClothesBox", "ActiveBoxFromRight", "remove");
  // });
  // alt.on("WEB:SexChanged", (Sex, ClothesUtils) => {
  //   AddClothesItems(Sex, ClothesUtils);
  // });
} else {
  const ClothesUtils = [
    ["Masks", 198, 198],
    ["Hair Styles", 77, 81],
    ["Torsos", 197, 242],
    ["Legs", 144, 151],
    ["Bagsand Parachutes", 100, 100],
    ["Shoes", 102, 106],
    ["Accessories", 152, 121],
    ["Undershirts", 189, 234],
    ["Body Armors", 21, 23],
    ["Decals", 78, 79],
    ["Tops", 393, 415],
  ];

  // AddClothesItems("male", ClothesUtils);
  setTimeout(() => {
    // ClassController("ClothesBox", "ActiveBoxFromRight", "add");
  }, 1000);
}
