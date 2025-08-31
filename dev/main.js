(function () {
  "use strict";
  if (location.pathname === "/game") {
    const orignialLoad = _load;
    _load = () => {
      orignialLoad();

      displayUI();
      settings();
      plan();
      timer();
      auto();
    };
  }
})();
