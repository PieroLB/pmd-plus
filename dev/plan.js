const plan = () => {
  // document.getElementById("plan").addEventListener("click", (event) => {
  //   if (modules[2].displayMode) modules[2].displayMode = 0;
  // });
  const listLignes = {
    Metro: {
      img: null,
      lignes: {
        1: { img: null },
        2: { img: null },
        3: { img: null },
        "3bis": { img: null },
        4: { img: null },
        5: { img: null },
        6: { img: null },
        7: { img: null },
        "7bis": { img: null },
        8: { img: null },
        9: { img: null },
        10: { img: null },
        11: { img: null },
        12: { img: null },
        13: { img: null },
        14: { img: null },
      },
    },
    RER: {
      img: null,
      lignes: {
        A: { img: null },
        B: { img: null },
        C: { img: null },
        D: { img: null },
        E: { img: null },
      },
    },
    Transilien: {
      img: null,
      lignes: {
        H: { img: null },
        J: { img: null },
        K: { img: null },
        L: { img: null },
        N: { img: null },
        P: { img: null },
        R: { img: null },
        U: { img: null },
      },
    },
    Tramway: {
      img: null,
      lignes: {
        T1: { img: null },
        T2: { img: null },
        T3a: { img: null },
        T3b: { img: null },
        T4: { img: null },
        T5: { img: null },
        T6: { img: null },
        T7: { img: null },
        T8: { img: null },
        T9: { img: null },
        T10: { img: null },
        T11: { img: null },
        T12: { img: null },
        T13: { img: null },
      },
    },
    Autres: {
      img: null,
      lignes: {
        RoissyBus: { img: null },
        OrlyBus: { img: null },
        OrlyVal: { img: null },
        Tvm: { img: null },
        TER: { img: null },
      },
    },
  };
  var accessibleImg = null;
  var addImg = null;
  const urlAssets =
    "https://raw.githubusercontent.com/PieroLB/pmd-tools-assets/main/plan/";
  const refHeight = 190;
  var padX = 0;
  class PLANStation {
    static stations = [];
    static storage;
    static planIndex;
    static canvas;
    static ctx;
    static colorLine = "#FECE03";
    static photo = false;
    static logoImg = null;
    static closedImg = null;
    static widthTot = 40;
    static y = 90;
    static arc = { width: 20 };
    static rect = { width: 50, height: 7 };
    static bgText = { padding: { y: 3, x: 6 } };
    static text = { nom: 10, tourist: 9 };
    static rectCorres = { width: 2, height: 10 };
    static imgCorres = { width: 15 };
    static scrollValue = false;
    static loadingImg = () => {
      const promises = [];

      const accessibleImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}accessible.svg`;
        img.onload = () => {
          accessibleImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(accessibleImgPromise);
      const addImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}add.svg`;
        img.onload = () => {
          addImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(addImgPromise);
      const logoImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}PMD.svg`;
        img.onload = () => {
          PLANStation.logoImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(logoImgPromise);
      const closedImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}closed.svg`;
        img.onload = () => {
          PLANStation.closedImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(closedImgPromise);

      Object.keys(listLignes).forEach((type) => {
        if (type != "Autres") {
          const mainImgPromise = new Promise((resolve, reject) => {
            let img = new Image();
            img.src = `${urlAssets}${type}/${type}.svg`;
            img.onload = () => {
              listLignes[type].img = img;
              resolve();
            };
            img.onerror = () =>
              reject(new Error(`Failed to load image: ${type}`));
          });
          promises.push(mainImgPromise);
        }

        Object.keys(listLignes[type].lignes).forEach((ligne) => {
          const ligneImgPromise = new Promise((resolve, reject) => {
            let img = new Image();
            img.src = `${urlAssets}${type}/${ligne}.svg`;
            img.onload = () => {
              listLignes[type].lignes[ligne].img = img;
              listLignes[type].lignes[ligne].coef = null;
              if (img.naturalHeight != 0 && img.naturalHeight != 0)
                listLignes[type].lignes[ligne].coef =
                  img.naturalWidth / img.naturalHeight;
              resolve();
            };
            img.onerror = () =>
              reject(new Error(`Failed to load image: ${type}-${ligne}`));
          });
          promises.push(ligneImgPromise);
        });
      });

      return Promise.all(promises)
        .then(() => {
          return;
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors du chargement des images :",
            error
          );
          throw error;
        });
    };
    constructor(
      nom = `PLANStation n°${PLANStation.stations.length + 1}`,
      lieuTouristique = "",
      accessible = false,
      correspondances = [],
      stationInPMD = null,
      pos = PLANStation.stations.length
    ) {
      this.nom =
        nom == "" ? `PLANStation n°${PLANStation.stations.length + 1}` : nom;
      this.lieuTouristique = lieuTouristique;
      this.correspondances = correspondances;
      this.accessible = accessible;
      this.closed = closed;
      this.clignote = false;
      this.stationInPMD = stationInPMD;
      PLANStation.widthTot = Math.min(
        PLANStation.widthTot + PLANStation.arc.width + PLANStation.rect.width,
        1024
      );
      PLANStation.stations.splice(pos, 0, this);
      let x = 20;
      PLANStation.stations.forEach((station) => {
        station.x = x;
        x += PLANStation.arc.width + PLANStation.rect.width;
      });
    }
    render() {
      // LIGNE
      if (
        PLANStation.stations.indexOf(this) !=
        PLANStation.stations.length - 1
      ) {
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.rect(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y +
            PLANStation.arc.width / 2 -
            PLANStation.rect.height / 2,
          PLANStation.rect.width + (3 / 2) * PLANStation.arc.width,
          PLANStation.rect.height
        );
        PLANStation.ctx.fill();
        PLANStation.ctx.closePath();
      }
      // CORRESPONDANCES
      if (this.correspondances.length > 0) {
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "#15388D";
        PLANStation.ctx.rect(
          padX +
            this.x +
            PLANStation.arc.width / 2 -
            PLANStation.rectCorres.width / 2,
          PLANStation.y + PLANStation.arc.width - 2,
          PLANStation.rectCorres.width,
          PLANStation.rectCorres.height / 2
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        let y = 0;
        Object.keys(listLignes).forEach((type) => {
          if (
            this.correspondances.some((l) =>
              Object.keys(listLignes[type].lignes).includes(l)
            )
          ) {
            PLANStation.ctx.beginPath();
            PLANStation.ctx.fillStyle = "#15388D";
            PLANStation.ctx.rect(
              padX +
                this.x +
                PLANStation.arc.width / 2 -
                PLANStation.rectCorres.width / 2,
              PLANStation.y + (PLANStation.arc.width - 3) + y + 3,
              PLANStation.rectCorres.width,
              PLANStation.rectCorres.height - 3
            );
            PLANStation.ctx.closePath();
            PLANStation.ctx.fill();

            let X = 0;
            let n = 0;
            if (listLignes[type].img != null) {
              PLANStation.ctx.drawImage(
                listLignes[type].img,
                padX +
                  this.x +
                  PLANStation.arc.width / 2 -
                  PLANStation.imgCorres.width / 2,
                y +
                  PLANStation.y +
                  PLANStation.arc.width +
                  PLANStation.rectCorres.height,
                PLANStation.imgCorres.width,
                PLANStation.imgCorres.width
              );
            } else {
              y -= PLANStation.imgCorres.width + 3;
            }
            let yAvt = y;
            Object.keys(listLignes[type].lignes).forEach((ligne) => {
              if (this.correspondances.includes(ligne)) {
                if (listLignes[type].img != null && n != 0 && n % 3 == 0) {
                  y += PLANStation.imgCorres.width + 3;
                  X = 0;
                }
                if (listLignes[type].img != null) {
                  X += PLANStation.imgCorres.width + 3;
                } else {
                  y += PLANStation.imgCorres.width + 3;
                }
                let h = PLANStation.imgCorres.width;
                let w = PLANStation.imgCorres.width;
                if (
                  listLignes[type].lignes[ligne].coef != null &&
                  listLignes[type].lignes[ligne].coef != 1
                ) {
                  h -= 5;
                  w = h * listLignes[type].lignes[ligne].coef;
                }
                PLANStation.ctx.drawImage(
                  listLignes[type].lignes[ligne].img,
                  padX +
                    X +
                    this.x +
                    PLANStation.arc.width / 2 -
                    PLANStation.imgCorres.width / 2,
                  y +
                    PLANStation.y +
                    PLANStation.arc.width +
                    PLANStation.rectCorres.height,
                  w,
                  h
                );
                n++;
              }
            });
            if (listLignes[type].img != null) {
              PLANStation.ctx.beginPath();
              PLANStation.ctx.fillStyle = "#15388D";
              PLANStation.ctx.rect(
                padX +
                  this.x +
                  PLANStation.arc.width / 2 -
                  PLANStation.rectCorres.width / 2,
                PLANStation.y +
                  (PLANStation.arc.width - 3) +
                  yAvt +
                  3 +
                  2 * (PLANStation.imgCorres.width + 3),
                PLANStation.rectCorres.width,
                y - yAvt
              );
              PLANStation.ctx.closePath();
              PLANStation.ctx.fill();
            }
            y += 2 * PLANStation.imgCorres.width - 3;
          }
        });
      }
      // CERCLE
      if (
        this.correspondances.length > 0 &&
        (PLANStation.stations.indexOf(this) == 0 ||
          PLANStation.stations.indexOf(this) == PLANStation.stations.length - 1)
      ) {
        // Il y a au moins une correspondance et c'est un terminus
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "black";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "white";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 3,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 5,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      } else if (
        PLANStation.stations.indexOf(this) == 0 ||
        PLANStation.stations.indexOf(this) == PLANStation.stations.length - 1
      ) {
        // C'est un terminus
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "black";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 5,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      } else if (this.correspondances.length > 0) {
        // C'est une station avec au moins une correspondance
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "black";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "white";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 3,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      } else {
        // C'est une station sans rien
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      }
      if (this.closed) {
        PLANStation.ctx.drawImage(
          PLANStation.closedImg,
          padX + this.x - 7,
          PLANStation.y - 7,
          PLANStation.arc.width + 14,
          PLANStation.arc.width + 14
        );
      } else if (this.clignote) {
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "yellow";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 3,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      }
      // TEXT
      PLANStation.ctx.translate(
        padX + this.x + PLANStation.arc.width / 2,
        PLANStation.y - 5
      );
      PLANStation.ctx.rotate(-30 * (Math.PI / 180));
      PLANStation.ctx.beginPath();
      if (this.lieuTouristique != "") {
        PLANStation.ctx.font = `italic ${PLANStation.text.tourist}px Arial`;
        let widthText = PLANStation.ctx.measureText(this.lieuTouristique).width;
        PLANStation.ctx.fillStyle = "#865200";
        PLANStation.ctx.rect(
          -PLANStation.bgText.padding.x + 15,
          -PLANStation.text.tourist +
            PLANStation.text.nom / 2 +
            PLANStation.bgText.padding.y * 2 +
            1,
          widthText + PLANStation.bgText.padding.x * 2,
          PLANStation.text.tourist + PLANStation.bgText.padding.y * 2
        );
        PLANStation.ctx.fill();
        PLANStation.ctx.fillStyle = "white";
        PLANStation.ctx.fillText(
          this.lieuTouristique,
          15,
          PLANStation.text.nom / 2 + PLANStation.bgText.padding.y * 2 + 2
        );
      }
      PLANStation.ctx.closePath();
      PLANStation.ctx.beginPath();
      PLANStation.ctx.fillStyle = "#15388D";
      PLANStation.ctx.font = `bold ${PLANStation.text.nom}px Arial`;
      let y = 0;
      let widthText = PLANStation.ctx.measureText(this.nom).width;
      if (
        PLANStation.stations.indexOf(this) == 0 ||
        PLANStation.stations.indexOf(this) == PLANStation.stations.length - 1
      ) {
        PLANStation.ctx.rect(
          -PLANStation.bgText.padding.y,
          -PLANStation.text.nom - PLANStation.bgText.padding.x,
          widthText + PLANStation.bgText.padding.x * 2,
          PLANStation.text.nom + PLANStation.bgText.padding.y * 2
        );
        PLANStation.ctx.fill();
        PLANStation.ctx.fillStyle = "white";
        y = -PLANStation.bgText.padding.y - 1;
      }
      PLANStation.ctx.fillText(this.nom, PLANStation.bgText.padding.x / 4, y);
      if (this.accessible)
        PLANStation.ctx.drawImage(
          accessibleImg,
          padX + widthText + PLANStation.canvas.height * (10 / refHeight),
          -PLANStation.text.nom + PLANStation.bgText.padding.y,
          PLANStation.text.nom,
          PLANStation.text.nom
        );
      PLANStation.ctx.closePath();
      PLANStation.ctx.resetTransform();
    }
    event(type, x, y) {
      if (type == "click") {
        let arc = { x: this.x, y: PLANStation.y };
        console.log("lol");
        if (
          x >= arc.x &&
          x <= arc.x + PLANStation.arc.width &&
          y >= arc.y &&
          y <= arc.y + PLANStation.arc.width
        ) {
          // Click sur une station pour la modifier
          this.closed = !this.closed;
        }
      }
    }
  }

  let nextStationPLAN;
  let isInStation = UTILS.isStation() != undefined ? true : false;
  const update = () => {
    requestAnimationFrame(update);

    PLANStation.canvas.height = 200;
    PLANStation.canvas.width = PLANStation.widthTot;

    PLANStation.ctx.clearRect(
      0,
      0,
      PLANStation.canvas.width,
      PLANStation.canvas.height
    );
    // Background blanc
    PLANStation.ctx.beginPath();
    PLANStation.ctx.fillStyle = "white";
    PLANStation.ctx.rect(
      0,
      0,
      PLANStation.canvas.width,
      PLANStation.canvas.height
    );
    PLANStation.ctx.closePath();
    PLANStation.ctx.fill();
    // Rendus des stations
    // if (!modules[2].displayMode) {
    if (UTILS.isStation() == undefined && isInStation == true) {
      // Sortie de station
      document.getElementById("plan").style.display = "none";
      isInStation = false;
    } else if (UTILS.isStation() && isInStation == false) {
      // Entrée une station
      setTimeout(() => {
        document.getElementById("plan").style.display = "block";
        isInStation = true;
      }, 800);
    } else {
      isInStation = UTILS.isStation() != undefined ? true : false;
    }
    // }
    nextStationPLAN =
      getNextStation() == false ? nextStationPLAN : getNextStation();
    PLANStation.stations.forEach((station) => {
      if (station.nom == nextStationPLAN.name) {
        if (padX + station.x < 0) {
          padX = -Math.max(
            0,
            (PLANStation.stations.indexOf(station) + 1) *
              (PLANStation.arc.width + PLANStation.rect.width) -
              1024
          );
        } else if (padX + station.x > 1024) {
          padX = -1024;
        }
      }
      station.render();
    });
  };

  PLANStation.canvas = document.getElementById("canvasPlan");
  PLANStation.ctx = PLANStation.canvas.getContext("2d");
  PLANStation.loadingImg().then(() => {
    fetch(
      "https://raw.githubusercontent.com/PieroLB/pmd-tools-assets/main/plan/data.json"
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let line = new URLSearchParams(location.search).get("line");
        if (resp) {
          PLANStation.colorLine = resp[line].color;
          resp[line].stations.forEach((station) => {
            let stationInPMD = zoneStations.find(
              (s) =>
                s.name == station.nom ||
                s.name == station.nom + " v1" ||
                s.name == station.nom + " v2"
            );
            new PLANStation(
              station.nom,
              station.lieuTouristique,
              station.accessible,
              station.correspondances,
              stationInPMD
            );
          });
        }
        for (let station of zoneStations) {
          let stationPLAN = PLANStation.stations.find(
            (s) =>
              s.nom == station.name ||
              s.nom == station.name + " v1" ||
              s.nom == station.name + " v2"
          );
          if (stationPLAN) {
            padX = -Math.max(
              0,
              (PLANStation.stations.indexOf(stationPLAN) + 1) *
                (PLANStation.arc.width + PLANStation.rect.width) -
                1024
            );
            break;
          }
        }

        PLANStation.canvas.addEventListener("click", function (event) {
          PLANStation.stations.forEach((station) => {
            let arc = { x: station.x + padX, y: PLANStation.y };
            if (
              event.clientY - this.getBoundingClientRect().y >= arc.y &&
              event.clientY - this.getBoundingClientRect().y <=
                arc.y + PLANStation.arc.width &&
              event.clientX >= arc.x &&
              event.clientX <= arc.x + PLANStation.arc.width
            ) {
              station.closed = !station.closed;
              if (station.stationInPMD != null)
                station.stationInPMD.closed = station.closed;
              return;
            }
          });
        });

        let clignote = true;
        const intervalle = 500;
        setInterval(() => {
          PLANStation.stations.forEach((station) => {
            if (
              station.nom == nextStationPLAN.name ||
              station.nom + " v1" == nextStationPLAN.name ||
              station.nom + " v2" == nextStationPLAN.name
            ) {
              station.clignote = clignote;
              clignote = !clignote;
            } else if (
              zoneStations
                .slice(0, zoneStations.indexOf(nextStationPLAN) + 1)
                .find(
                  (s) =>
                    s.name == station.nom ||
                    s.name == station.nom + " v1" ||
                    s.name == station.nom + " v2"
                )
            ) {
              station.clignote = false;
            } else {
              station.clignote = true;
            }
          });
        }, intervalle);

        update();
      });
  });
};
