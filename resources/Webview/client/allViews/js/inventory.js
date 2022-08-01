for (let i = 0; i < 60; i++) {
  document.getElementById("InventoryBoxPlayerItems").innerHTML += `
<div class="InventoryBoxSubItemBox">
              <div class="InventoryBoxSubItemBoxTitles">
                <span>1x</span><span>16 | 20</span>
              </div>
              <div class="InventoryBoxSubItemBoxIconItem">
                <img src="./icons/inventory-icon/cuffs.png" alt="" />
              </div>
              <div class="InventoryBoxSubItemBoxProgressBar">
                <div class="progress" style="height: 3px">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style="background-color: var(--Special_Color); width: 50%"
                  ></div>
                </div>
              </div>
              <div class="InventoryBoxSubItemBoxItemName">Hand Cuffs</div>
            </div>`;
}
for (let i = 0; i < 60; i++) {
  document.getElementById("InventoryBoxDropItems").innerHTML += `
<div class="InventoryBoxSubItemBox">
              <div class="InventoryBoxSubItemBoxTitles">
                <span>1x</span><span>16 | 20</span>
              </div>
              <div class="InventoryBoxSubItemBoxIconItem">
                <img src="./icons/inventory-icon/cuffs.png" alt="" />
              </div>
              <div class="InventoryBoxSubItemBoxProgressBar">
                <div class="progress" style="height: 3px">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style="background-color: var(--Special_Color); width: 50%"
                  ></div>
                </div>
              </div>
              <div class="InventoryBoxSubItemBoxItemName">Hand Cuffs</div>
            </div>`;
}

// setTimeout(() => {
//   document.getElementById("InventoryBox").classList.add("InventoryBoxActive");
// }, 1000);
// setTimeout(() => {
//   document.getElementById("InventoryBox").classList.remove("InventoryBoxActive");
// }, 5000);
