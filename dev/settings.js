const settings = () => {
  var toolsStatus = {
    timer: { nom: "le timer", elementID: "time-box", status: true },
    auto: { nom: "le mode auto", elementID: "auto", status: true },
    plan: { nom: "le plan", elementID: "canvasPlan", status: true },
  };
  const styleId = "dynamic-important-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .hidden-important {
        display: none !important;
      }
      .flex-important {
        display: flex !important;
      }
    `;
    document.head.appendChild(style);
  }
  if (localStorage.getItem("toolsStatus")) {
    let storage = JSON.parse(localStorage.getItem("toolsStatus"));
    Object.keys(toolsStatus).forEach((tool) => {
      toolsStatus[tool].status = storage[tool] == null ? true : storage[tool];
    });
  } else {
    let storage = {};
    Object.keys(toolsStatus).forEach((tool) => {
      storage[tool] = toolsStatus[tool].status;
    });
    localStorage.setItem("toolsStatus", JSON.stringify(storage));
  }
  Object.keys(toolsStatus).forEach((tool) => {
    if (document.getElementById(toolsStatus[tool].elementID)) {
      if (toolsStatus[tool].status) {
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.remove("hidden-important");
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.add("flex-important");
      } else {
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.remove("flex-important");
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.add("hidden-important");
      }
    }
    if (tool == "plan") {
      if (toolsStatus[tool].status) {
        document.getElementById("plan").classList.remove("flex-important");
        document.getElementById("plan").classList.add("hidden-important");
      } else {
        document.getElementById("plan").classList.remove("hidden-important");
        document.getElementById("plan").classList.add("flex-important");
      }
    }
  });

  let loop = setInterval(() => {
    if (document.querySelectorAll("#extra").length == 2) {
      clearInterval(loop);
      let params = document.querySelectorAll("#extra")[1];
      let lastParam =
        params.querySelectorAll(".menubtn.parambtn")[
          params.querySelectorAll(".menubtn.parambtn").length - 1
        ];
      let paramPMDTools = document.createElement("div");
      paramPMDTools.className = "menubtn parambtn";
      paramPMDTools.textContent = "Paramètres PMD+";
      lastParam.after(paramPMDTools);
      paramPMDTools.addEventListener("click", () => {
        let extra = document.createElement("div");
        extra.id = "extra";
        extra.style.opacity = "1";
        document.body.appendChild(extra);
        let popup = document.createElement("div");
        popup.id = "popup";
        extra.appendChild(popup);
        let menuButtonList = document.createElement("div");
        menuButtonList.id = "menuButtonList";
        menuButtonList.className = "scrollbar-invisible";
        popup.appendChild(menuButtonList);
        Object.keys(toolsStatus).forEach((tool) => {
          let button = document.createElement("div");
          button.className = "menubtn parambtn";
          button.textContent = `Afficher ${toolsStatus[tool].nom} : ${
            toolsStatus[tool].status ? "Oui" : "Non"
          }`;
          menuButtonList.appendChild(button);
          button.addEventListener("click", () => {
            toolsStatus[tool].status = !toolsStatus[tool].status;
            let storage = JSON.parse(localStorage.getItem("toolsStatus"));
            storage[tool] = toolsStatus[tool].status;
            localStorage.setItem("toolsStatus", JSON.stringify(storage));
            button.textContent = `Afficher ${toolsStatus[tool].nom} : ${
              toolsStatus[tool].status ? "Oui" : "Non"
            }`;
            if (toolsStatus[tool].status) {
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.remove("hidden-important");
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.add("flex-important");
            } else {
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.remove("flex-important");
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.add("hidden-important");
            }
            if (tool == "plan") {
              if (toolsStatus[tool].status) {
                document
                  .getElementById("plan")
                  .classList.remove("flex-important");
                document
                  .getElementById("plan")
                  .classList.add("hidden-important");
              } else {
                document
                  .getElementById("plan")
                  .classList.remove("hidden-important");
                document.getElementById("plan").classList.add("flex-important");
              }
            }
          });
        });
        let fermer = document.createElement("div");
        fermer.className = "menubtn parambtn";
        fermer.textContent = "Fermer";
        menuButtonList.appendChild(fermer);
        fermer.addEventListener("click", () => extra.remove());
      });
    }
  });
};
