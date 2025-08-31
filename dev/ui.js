const displayUI = () => {
  // Create time-box div
  let timeBox = document.createElement("div");
  timeBox.id = "time-box";
  timeBox.style.cssText =
    "position: absolute; right: 0px; bottom: 0px; height:100%; width:134px; background-color: black;";
  document.getElementById("pupitre").appendChild(timeBox);

  // Create time-boxClosed div
  let timeBoxClosed = document.createElement("div");
  timeBoxClosed.id = "time-boxClosed";
  timeBoxClosed.style.cssText =
    "z-index:3; position: absolute; left: 0px; top: 0px; height:100%; width:19px; background-color: #3E3C44; border-top-right-radius:10px;";
  timeBox.appendChild(timeBoxClosed);

  // Create the SVG arrow button inside time-boxClosed
  let arrowButton = document.createElement("div");
  arrowButton.style.cssText =
    "background-color: #929497; border-radius:100%; display:flex; align-items:center; justify-content:center; cursor:pointer";
  arrowButton.onclick = () => {
    document.getElementById("time-boxOpened").style.display = "";
    document.getElementById("time-boxClosed").style.display = "none";
  };
  timeBoxClosed.appendChild(arrowButton);

  let arrowSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrowSvg.setAttribute("width", "19");
  arrowSvg.setAttribute("height", "19");
  arrowSvg.setAttribute("viewBox", "0 0 19 19");
  arrowSvg.setAttribute("fill", "none");

  let arrowPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  arrowPath.setAttribute(
    "d",
    "M6 13.7075L10.3266 9.5L6 5.2925L7.33198 4L13 9.5L7.33198 15L6 13.7075Z"
  );
  arrowPath.setAttribute("fill", "black");

  arrowSvg.appendChild(arrowPath);
  arrowButton.appendChild(arrowSvg);

  // Create time-boxOpened div
  let timeBoxOpened = document.createElement("div");
  timeBoxOpened.id = "time-boxOpened";
  timeBoxOpened.style.cssText =
    "z-index:2; position: absolute; left: 0px; top: 0px; height:100%; width:250px; background-color: #3E3C44; border-top-right-radius:10px; display:none";
  timeBox.appendChild(timeBoxOpened);

  // Create the SVG circle in time-boxOpened
  let circleContainer = document.createElement("div");
  circleContainer.style.cssText =
    "position:absolute; top:0px; left:0px; width:100%; height:70px; display:flex; align-items:center; justify-content:center";
  timeBoxOpened.appendChild(circleContainer);

  let circleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  circleSvg.id = "circle";
  circleSvg.setAttribute("width", "60");
  circleSvg.setAttribute("height", "60");
  circleSvg.setAttribute("viewBox", "0 0 60 60");
  circleSvg.setAttribute("fill", "none");

  let sectorPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  sectorPath.id = "sector";
  sectorPath.setAttribute("d", "M30,30 L30,0 A30,30 0 0,1 30,0 Z");
  sectorPath.setAttribute("fill", "green");

  circleSvg.appendChild(sectorPath);
  circleContainer.appendChild(circleSvg);

  // Create time display text
  let timeTextContainer = document.createElement("div");
  timeTextContainer.className = "text-time";
  timeTextContainer.style.cssText =
    "position:absolute; top:70px; left:0px; width: 100%; height:20px; display:flex; align-items:center; justify-content:center; font-size: 20px; color:#929497; text-align:center";

  let timeText = document.createElement("div");
  timeText.innerHTML = '<strong id="time">--</strong> secondes';
  timeTextContainer.appendChild(timeText);
  timeBoxOpened.appendChild(timeTextContainer);

  // Create next station display
  let nextStationContainer = document.createElement("div");
  nextStationContainer.className = "text-time";
  nextStationContainer.style.cssText =
    "position:absolute; top:80px; left:0px; width:100%; height:63px; display:flex; align-items:center; justify-content:center; font-size: 15px; color:#929497; text-align:center";

  let nextStationText = document.createElement("div");
  nextStationText.innerHTML =
    'Prochaine station :<br><strong id="nextStation">---</strong>';
  nextStationContainer.appendChild(nextStationText);
  timeBoxOpened.appendChild(nextStationContainer);

  // Create distance display
  let distanceContainer = document.createElement("div");
  distanceContainer.className = "text-time";
  distanceContainer.style.cssText =
    "position:absolute; top:108px; left:0px; width:100%; height:63px; display:flex; align-items:center; justify-content:center; font-size: 15px; color:#929497; text-align:center";

  let distanceText = document.createElement("div");
  distanceText.innerHTML = 'Distance : <strong id="distance">--m</strong>';
  distanceContainer.appendChild(distanceText);
  timeBoxOpened.appendChild(distanceContainer);

  // Create close button in time-boxOpened
  let closeButton = document.createElement("div");
  closeButton.style.cssText =
    "position:absolute; top:0px; right:0px; width:19px; height:19px; background-color: #929497; border-radius:100%; display:flex; align-items:center; justify-content:center; cursor:pointer";
  closeButton.onclick = () => {
    document.getElementById("time-boxClosed").style.display = "";
    document.getElementById("time-boxOpened").style.display = "none";
  };
  timeBoxOpened.appendChild(closeButton);

  let closeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeSvg.setAttribute("width", "19");
  closeSvg.setAttribute("height", "19");
  closeSvg.setAttribute("viewBox", "0 0 19 19");
  closeSvg.setAttribute("fill", "none");

  let line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line1.setAttribute("x1", "5.35355");
  line1.setAttribute("y1", "5.64645");
  line1.setAttribute("x2", "13.35");
  line1.setAttribute("y2", "13.6429");
  line1.setAttribute("stroke", "#B81111");

  let line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line2.setAttribute("x1", "5.17959");
  line2.setAttribute("y1", "13.6464");
  line2.setAttribute("x2", "13.1761");
  line2.setAttribute("y2", "5.64996");
  line2.setAttribute("stroke", "#B81111");

  closeSvg.appendChild(line1);
  closeSvg.appendChild(line2);
  closeButton.appendChild(closeSvg);

  // Create auto button div
  let autoButton = document.createElement("div");
  autoButton.id = "auto";
  const styles = getComputedStyle(document.getElementById("emergencyStop"));
  for (const prop of styles) {
    autoButton.style.setProperty(prop, styles.getPropertyValue(prop));
  }
  autoButton.style.marginTop = `${
    document.getElementById("emergencyStop").offsetHeight + 10
  }px`;
  autoButton.innerHTML = '<span class="center">AUTO</span>';
  autoButton.onmouseover = function () {
    this.style.border = "solid #EE5757 3px";
  };
  autoButton.onmouseout = function () {
    this.style.border = "solid transparent 3px";
  };
  document.getElementById("pupitre").appendChild(autoButton);

  // Create canvas element
  let canvasPlan = document.createElement("canvas");
  canvasPlan.id = "canvasPlan";
  canvasPlan.style.cssText = `position:absolute; top:0px; left: ${
    document.getElementById("display").offsetWidth
  }px;`;
  document.body.appendChild(canvasPlan);

  if (
    document.getElementById("mf01_bfdg") ||
    document.getElementById("mp89_kfu")
  ) {
    document.getElementById("time-box").style.left = "1023px";
    if (document.getElementById("mf01_bfdg")) {
      document.getElementById("auto").style.left = "953px";
      document.getElementById("auto").style.bottom = "20px";
      document.getElementById("time-box").style.height = "152px";
      document.getElementById("time-boxClosed").style.backgroundColor =
        document.getElementById("time-boxOpened").style.backgroundColor =
          "#00398E";
    } else if (document.getElementById("mp89_kfu")) {
      document.getElementById("auto").style.left = "830px";
      document.getElementById("auto").style.bottom = "95px";
      document.getElementById("time-boxClosed").style.backgroundColor =
        document.getElementById("time-boxOpened").style.backgroundColor =
          "#61777B";
      Object.values(document.getElementsByClassName("text-time")).forEach(
        (element) => {
          element.style.color = "#B0B2B4";
        }
      );
    }
  }
};
