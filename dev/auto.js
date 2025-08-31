const auto = () => {
  var auto = false;
  const TIME_RINGING_DOORS = 3000; // en millisecondes
  const TIME_MIN_DOORS_OPENED = 3000; // en millisecondes
  const TIME_CLOSING_OPENING_DOORS = 3000; // en millisecondes
  const TIME_MIN_DEPARTURE = 70; // en secondes
  const SPEED_PADDING_BOTTOM = 2; // en km/h
  const TIME_IN_STATION = 40;
  var eventInStation = false;
  var depart = false;
  var deceleration = 0;
  var limiteMaxDecelerationAtteinte = false;
  var limiteMinDecelerationAtteinte = false;
  var decelerationComplete = false;
  var decelerationAvtStation = false;
  const getTime = (station1, station2) => {
    let t = 0;
    let listSpeedLimits = {};
    if (typeof speedLimitNG !== "undefined") {
      listSpeedLimits = speedLimitNG;
    } else if (typeof speedLimits !== "undefined") {
      speedLimits.forEach((l) => {
        listSpeedLimits[l.start] = l.limit;
      });
    }
    let listPos = Object.keys(listSpeedLimits);
    let posAvt = listPos[0];
    if (station1.end < posAvt && station2.start < posAvt) {
      // Permet de gérer les garages qui nont pas de speedLimit (elles arrivent après). Ex : ligne 3
      let v = localSpeedLimit / 3.6;
      let d = (station2.start - station1.end) / 75;
      t = d / v;
    } else if (station1.end < posAvt) {
      let v = localSpeedLimit / 3.6;
      let d = (posAvt - station1.end) / 75;
      t += d / v;
    } else if (listPos.length == 1) {
      // Permet de gérer sil y a quune seule speedLimit sur toute la ligne. Ex : ligne 7bis et 9
      let v = listSpeedLimits[posAvt] / 3.6;
      let d = (station2.start - Math.max(station1.end, posAvt)) / 75;
      t = d / v;
    } else if (listPos.length == 0) {
      // Permet de gérer sil y a aucune speedLimit sur toute la ligne. Ex : ligne 13 et 12
      let v = localSpeedLimit / 3.6;
      let d = (station2.start - station1.end) / 75;
      t = d / v;
    } else {
      for (let i = 1; i < listPos.length; i++) {
        if (listPos[i] >= station1.end && listPos[i] <= station2.start) {
          let v = listSpeedLimits[posAvt] / 3.6;
          let d = (listPos[i] - Math.max(station1.end, posAvt)) / 75;
          t += d / v;
        } else if (listPos[i] > station2.start) {
          let v = listSpeedLimits[posAvt] / 3.6;
          let d = (station2.start - posAvt) / 75;
          t += d / v;
          break;
        }
        posAvt = listPos[i];
      }
    }
    return t;
  };
  var timeToGoNextStation = null;
  var lastStation = null;
  var terminus = false;
  var isDoorOpened = false;
  const AUTOcloseDoor = (t = TIME_RINGING_DOORS) => {
    isDoorOpened = false;
    if (NADOMAS) {
      KEYBOARD_DOWN["KeyO"] = false;
      KEYBOARD_DOWN["KeyF"] = true;
      t = TIME_RINGING_DOORS;
    } else {
      closeDoor();
    }
    setTimeout(() => {
      if (areDoorFullyClosed() == false) {
        // ECHEC DE LA FERMETURE => REOUVERTURE
        isDoorOpened = true;
        if (NADOMAS) {
          KEYBOARD_DOWN["KeyF"] = false;
          KEYBOARD_DOWN["KeyO"] = true;
        } else {
          doorOpen();
        }
        AUTOcloseDoor(0);
      } else {
        if (NADOMAS) {
          KEYBOARD_DOWN["KeyF"] = false;
          KEYBOARD_DOWN["KeyO"] = false;
        }
        decelerationAvtStation = false;
        depart = true;
      }
    }, t);
  };
  setInterval(() => {
    if (auto) {
      if (!eventInStation) {
        // ON EST DANS UNE STATION ET IL NE FAUT PAS PARTIR
        if (
          !depart &&
          UTILS.isStation() &&
          ((!UTILS.isStation().closed &&
            UTILS.isStation().allowPassengers &&
            UTILS.isStation().freq > 0) ||
            zoneStations.indexOf(UTILS.isStation()) == zoneStations.length - 1)
        ) {
          if (
            zoneStations.indexOf(UTILS.isStation()) ==
            zoneStations.length - 1
          )
            terminus = true;
          if (!terminus && lastStation != UTILS.isStation()) {
            timeToGoNextStation = getTime(
              UTILS.isStation(),
              zoneStations[zoneStations.indexOf(UTILS.isStation()) + 1]
            );
            lastStation = UTILS.isStation();
          }

          // A LARRET
          if (currentSpeed == 0) {
            if (!isDoorOpened) {
              console.log("OUVERTURE DES PORTES");
              console.log(KEYBOARD_DOWN);
              isDoorOpened = true;
              eventInStation = true;
              if (NADOMAS) {
                KEYBOARD_DOWN["KeyF"] = false;
                KEYBOARD_DOWN["KeyO"] = true;
                // let loop = setInterval(()=>{
                //   if (doorOpened){
                //     KEYBOARD_DOWN["KeyO"] = false;
                //     clearInterval(loop)
                //   }
                // });
              } else {
                doorOpen();
              }
              setTimeout(() => {
                eventInStation = false;
              }, TIME_CLOSING_OPENING_DOORS + TIME_MIN_DOORS_OPENED); // TEMPS MINIMUM DE LOUVERTURE A LA FERMETURE DES PORTES
            } else if (
              (terminus && UTILS.getModule("Passagers").onBoard.length == 0) ||
              (!terminus &&
                timeBeforeArriving <=
                  timeToGoNextStation +
                    (TIME_CLOSING_OPENING_DOORS + TIME_RINGING_DOORS) / 1000 +
                    8)
            ) {
              console.log("FERMETURE DES PORTES");
              eventInStation = true;
              AUTOcloseDoor();
              setTimeout(() => {
                eventInStation = false;
              }, TIME_RINGING_DOORS + TIME_CLOSING_OPENING_DOORS + 1000); // TEMPS MINIMUM DE LOUVERTURE A LA FERMETURE DES PORTES
            }
          }
          // IL FAUT RALENTIR POUR SARRETER EN STATION
          else {
            let virtualSpeed = currentSpeed;
            let virtualPosition = 0;
            while (virtualSpeed > 0) {
              virtualSpeed += 1 * ((-13 / 80) * 1.2) * 1.2;
              virtualPosition += (virtualSpeed / 3) * 1.3 * 1;
            }
            virtualPosition = -globalTranslate + virtualPosition;

            if (virtualPosition >= UTILS.isStation().end) {
              currentThrottle = -11;
              limiteMaxDecelerationAtteinte = true;
            } else if (
              limiteMaxDecelerationAtteinte &&
              !limiteMinDecelerationAtteinte &&
              currentSpeed <= 33
            ) {
              currentThrottle = 0;
              limiteMinDecelerationAtteinte = true;
            } else if (!limiteMaxDecelerationAtteinte) {
              currentThrottle = 0;
            }
          }
        } else {
          // ON SORT DUNE STATION
          if (!UTILS.isFullyInStation() && depart)
            depart =
              limiteMinDecelerationAtteinte =
              limiteMaxDecelerationAtteinte =
                false;
          // ON RALENTIT AVANT LA STATION TELLEMENT ON VA VITE
          if (
            decelerationAvtStation ||
            (currentSpeed > 80 && nextStation.start + globalTranslate <= 10000)
          ) {
            currentThrottle = -5;
            decelerationAvtStation = true;
          }
          // ADAPTION DE LA VITESSE DE ROULEMENT
          else {
            let speedLim = UTILS.currentSpeedLimit();
            if (currentSpeed < speedLim - SPEED_PADDING_BOTTOM) {
              currentThrottle = 5;
            }
            if (currentSpeed >= speedLim + 1) {
              currentThrottle = -9;
            }
            if (currentSpeed < speedLim + 1 && currentSpeed > speedLim) {
              if (speedLim > 80) {
                currentThrottle = 3;
              } else if (speedLim > 50) {
                currentThrottle = 1;
              } else {
                currentThrottle = 0;
              }
            }
          }
        }
      }
    }
  });

  document.getElementById("auto").addEventListener("click", () => {
    auto = !auto;
    if (!auto) {
      if (currentThrottle > 0) currentThrottle = 0;
      KEYBOARD_DOWN["KeyF"] = KEYBOARD_DOWN["KeyO"] = false;
    }
    document.getElementById("auto").style.backgroundColor = auto
      ? "green"
      : "darkred";
  });
};
