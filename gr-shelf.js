/* Graphics library: call-number block at the bottom of the page, page tools
   at the top, and the Top button. Reads the one shared shelf list in the Hive
   library (hive-shelves.js), so a call number from any Hive repo works here. */
(function () {
  var LIST_URL = "https://weber-county-hive.github.io/-weber-county-hive-index/hive-shelves.js";
  var ME = { callNumber: "GR 000.01", name: "Every Hive graphic, in one place" };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function ready(fn) {
    if (window.HIVE_SHELVES) return fn();
    var s = document.createElement("script"); s.src = LIST_URL + "?v=1"; s.onload = fn; s.onerror = fn; document.head.appendChild(s);
  }
  function shelves() { return window.HIVE_SHELVES || [{ prefix: "HL", name: "Hive library", url: "https://weber-county-hive.github.io/-weber-county-hive-index/index.html" }]; }

  var box = document.getElementById("gr-shelf");
  if (box) {
    box.innerHTML =
      '<div class="gr-cn-big">Call number <b>' + ME.callNumber + '</b> · Shelf GR 000 · Graphics library</div>' +
      '<div class="gr-nav"><a class="gr-nav-btn" href="https://weber-county-hive.github.io/-weber-county-hive-index/index.html">← <b>HL 000.00</b> The Hive library (every repo)</a><span class="gr-nav-btn gr-off">End of shelf →</span></div>' +
      '<details class="gr-list"><summary>See every page on this shelf, by call number</summary><ol><li class="gr-shelf-head">GR 000 · Graphics library</li><li class="gr-here"><a href="index.html"><span class="gr-cn">GR 000.01</span> ' + esc(ME.name) + ' <em>(you are here)</em></a></li></ol></details>' +
      '<form class="gr-find" id="gr-find" role="search"><label for="gr-q">Look up a call number, name or topic</label>' +
      '<div><input id="gr-q" type="search" placeholder="e.g. FD 200.03, UP 200.01 or Brammer"><button type="submit">Search</button></div></form>' +
      '<div class="gr-search" id="gr-find-out">Names and topics search the graphics on this page.</div>';
    ready(function () {
      var out = document.getElementById("gr-find-out");
      out.innerHTML = "Names and topics search the graphics on this page. Call numbers from every shelf work here: " + shelves().map(function (s) {
        return '<a href="' + s.url + '"><b>' + s.prefix + "</b> = " + esc(s.name) + "</a>";
      }).join(" · ") + ".";
    });
    document.getElementById("gr-find").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = document.getElementById("gr-q").value;
      var m = String(v).trim().toUpperCase().match(/^([A-Z]{1,5})\s*(\d{3}(?:\.\d{1,2})?)$/);
      if (m && m[1] !== "GR") {
        var hit = shelves().filter(function (s) { return s.prefix === m[1]; })[0];
        if (hit) { location.href = hit.url + "?q=" + encodeURIComponent(m[1] + " " + m[2]); return; }
        document.getElementById("gr-find-out").innerHTML = "Call number <b>" + esc(m[1] + " " + m[2]) + "</b>: that shelf doesn't have call numbers yet. Try a name or topic instead.";
        return;
      }
      var q = document.getElementById("q");
      q.value = m ? "" : v; q.dispatchEvent(new Event("input")); q.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* Page tools under the header */
  var hook = document.getElementById("gr-tools");
  if (hook) {
    var url = location.href.split("#")[0].split("?")[0];
    hook.innerHTML =
      '<a class="gr-tool gr-cnchip" href="#gr-shelf" title="Jump to the call number and search">Call number <b>' + ME.callNumber + '</b> ↓</a>' +
      '<a class="gr-tool" href="#gr-how">How to use a graphic</a>' +
      '<button type="button" class="gr-tool" id="gr-copy">Copy link</button>' +
      '<a class="gr-tool" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '">Share on Facebook</a>';
    var cb = document.getElementById("gr-copy");
    cb.addEventListener("click", function () {
      var done = function () { cb.textContent = "Link copied ✓"; setTimeout(function () { cb.textContent = "Copy link"; }, 2500); };
      try { navigator.clipboard.writeText(url).then(done, function () { window.prompt("Copy this link:", url); }); }
      catch (e) { window.prompt("Copy this link:", url); }
    });
  }
  var top = document.createElement("a");
  top.href = "#"; top.className = "gr-totop"; top.textContent = "↑ Top"; top.setAttribute("aria-label", "Back to top of page");
  top.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  document.body.appendChild(top);
  var showTop = function () { top.style.display = window.scrollY > 900 ? "block" : "none"; };
  window.addEventListener("scroll", showTop, { passive: true }); showTop();
})();
