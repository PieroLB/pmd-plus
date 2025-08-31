const timer = () => {
  const moduleTime = UTILS.getModule("Time");
  let loopWaitingStart = setInterval(() => {
    if (moduleTime.lastTimeDelay + moduleTime.timeDelay > 0) {
      clearInterval(loopWaitingStart);
      var avtStation = zoneStations[0];
      var station = false;
      var tempsMax;
      var nextStation;
      setInterval(() => {
        if (
          zoneStations.find(
            (a) => -globalTranslate > a.start && -globalTranslate < a.end
          ) != undefined &&
          zoneStations.indexOf(
            zoneStations.find(
              (a) => -globalTranslate > a.start && -globalTranslate < a.end
            )
          ) !=
            zoneStations.length - 1
        ) {
          // SI DANS STATION
          if (station == false) {
            // SI ON ETAIT PAS DANS STATION AVT
            tempsMax = moduleTime.lastTimeDelay + moduleTime.timeDelay;
            console.log(
              tempsMax,
              moduleTime.lastTimeDelay,
              moduleTime.timeDelay
            );
          }
          nextStation =
            zoneStations[
              zoneStations.indexOf(
                zoneStations.find(
                  (a) => -globalTranslate > a.start && -globalTranslate < a.end
                )
              ) + 1
            ];
          avtStation = nextStation;
          station = true;
        } else {
          station = false;
          nextStation = avtStation;
        }
        timeBeforeArriving = moduleTime.lastTimeDelay + moduleTime.timeDelay;
        document.getElementById("time").textContent = timeBeforeArriving;
        document.getElementById("nextStation").textContent = nextStation.name;
        let pourcentage = (timeBeforeArriving / tempsMax) * 100;
        if (pourcentage >= 0) {
          const angle = 360 * (pourcentage / 100);
          const radius = 30;
          const x =
            30 + radius * Math.cos(-Math.PI / 2 + (angle * Math.PI) / 180);
          const y =
            30 + radius * Math.sin(-Math.PI / 2 + (angle * Math.PI) / 180);
          const largeArcFlag = angle <= 180 ? "0" : "1";
          const pathData =
            "M 30,30 L 30,0 A 30,30 0 " +
            largeArcFlag +
            ",1 " +
            x +
            "," +
            y +
            " Z";
          document.getElementById("sector").setAttribute("d", pathData);
        }
        let rouge = 255 - (pourcentage * 255) / 100;
        let vert = (pourcentage * 255) / 100;
        let bleu = 0;
        document
          .getElementById("sector")
          .setAttribute("fill", "rgb(" + rouge + "," + vert + "," + bleu + ")");
        let distance = (nextStation.start - -globalTranslate) / 75; // en mètres
        document.getElementById("distance").textContent =
          Math.round(distance) + "m";
      });
    }
  });
};
