/* shahwarsends: lead capture (popup + contact form) -> your Google Sheet CRM
   Paste your CRM web app link below (it ends in /exec). Nothing else needs changing. */
var SS_CRM_URL = "https://script.google.com/macros/s/AKfycbyAwcYiThzACNQ3KT1d5BZ3w6gCoJH7OroACB08HDMbgovaOJQk73dBO-F9LlC4k4vW4Q/exec";

(function () {
  "use strict";

  /* ---------- sending a lead to the CRM ---------- */
  window.ssSendLead = function (data) {
    if (!SS_CRM_URL) return Promise.reject(new Error("not-connected"));
    data.page = location.pathname;
    var body = JSON.stringify(data);
    return fetch(SS_CRM_URL, { method: "POST", body: body })   // plain text: no preflight
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j.ok) throw new Error(j.error || "crm"); return j; },
        function () {
          // Google can answer through a redirect the browser won't let us read; send again without reading the reply
          return fetch(SS_CRM_URL, { method: "POST", mode: "no-cors", body: body }).then(function () { return { ok: true }; });
        });
  };

  /* ---------- popup ---------- */
  var KEY = "ss_pop_v1";
  function seen() { try { var t = +localStorage.getItem(KEY); return t && Date.now() - t < 7 * 864e5; } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  if (/contact\.html|thank-you/.test(location.pathname) || seen()) return;

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var css = `
.ssp-veil{position:fixed;inset:0;z-index:200;background:rgba(26,18,22,.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .35s ease}
.ssp-veil.on{opacity:1}
.ssp{position:relative;width:min(460px,100%);background:#fff;border-radius:28px;overflow:hidden;font-family:'Work Sans',system-ui,sans-serif;color:#1A1A1A;box-shadow:0 50px 100px -30px rgba(80,10,35,.55);transform:translateY(30px) scale(.96);transition:transform .7s cubic-bezier(.18,1.6,.4,1)}
.ssp-veil.on .ssp{transform:none;animation:sspbob 3.4s ease-in-out .7s infinite}
.ssp-veil.on .ssp:hover,.ssp-veil.on .ssp:focus-within{animation-play-state:paused}
@keyframes sspbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.ssp-yes[data-a]{position:relative;animation:sspbtn 2.4s ease-in-out 1.2s infinite}
@keyframes sspbtn{0%,100%{transform:scale(1);box-shadow:0 12px 24px -12px rgba(209,24,79,.7),0 0 0 0 rgba(209,24,79,.35)}50%{transform:scale(1.04);box-shadow:0 12px 24px -12px rgba(209,24,79,.7),0 0 0 9px rgba(209,24,79,0)}}
@keyframes sspwig{0%,86%,100%{transform:rotate(0) scale(1)}90%{transform:rotate(-5deg) scale(1.08)}94%{transform:rotate(4deg) scale(1.08)}}
.ssp-top{position:relative;height:150px;background:linear-gradient(140deg,#D1184F,#A8123F);overflow:hidden}
.ssp-top::before,.ssp-top::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}
.ssp-top::before{width:220px;height:220px;left:-70px;top:-110px}
.ssp-top::after{width:160px;height:160px;right:-40px;bottom:-90px}
.ssp-top{height:170px}
.ssp-chart{position:absolute;left:32px;right:66px;top:30px;bottom:34px;display:flex;align-items:flex-end;gap:14px;border-bottom:2px solid rgba(255,255,255,.45)}
.ssp-col{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;position:relative}
.ssp-col i{display:block;width:100%;max-width:52px;border-radius:9px 9px 0 0;background:rgba(255,255,255,.32);transform-origin:bottom;animation:sspg 1s cubic-bezier(.2,.9,.3,1) both}
.ssp-col:nth-child(2) i{animation-delay:.1s}.ssp-col:nth-child(3) i{animation-delay:.2s}.ssp-col.hi i{background:#fff;animation-delay:.3s}
.ssp-col small{position:absolute;bottom:-22px;font-size:12px;font-weight:600;color:rgba(255,255,255,.85)}
.ssp-col.hi small{color:#fff}
.ssp-col em{font-style:normal;font-size:15px;font-weight:700;color:#D1184F;background:#fff;border-radius:999px;padding:3px 10px;margin-bottom:6px;box-shadow:0 6px 14px -6px rgba(0,0,0,.35);animation:sspwig 3.4s ease-in-out 1.2s infinite;white-space:nowrap}
.ssp-cap{position:absolute;left:32px;top:10px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.8)}
@keyframes sspg{from{transform:scaleY(.05)}}
.ssp-x{position:absolute;right:12px;top:12px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:20px;line-height:36px;cursor:pointer;z-index:2}
.ssp-x:hover{background:rgba(255,255,255,.3)}
.ssp-b{padding:26px 28px 28px}
.ssp-step{display:none;animation:sspi .4s ease both}.ssp-step.on{display:block}
@keyframes sspi{from{opacity:0;transform:translateX(14px)}}
.ssp-k{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#D1184F}
.ssp h3{margin:8px 0 0;font-size:25px;font-weight:600;letter-spacing:-.025em;line-height:1.2}
.ssp h3.ssp-q{margin:4px 0 0;font-size:38px;line-height:1.06;letter-spacing:-.04em}
.ssp h3.ssp-q span{color:#D1184F;display:inline-block;animation:sspwig 3.4s ease-in-out 1s infinite}
.ssp h3.ssp-q2{margin:2px 0 0;font-size:30px;line-height:1.1;letter-spacing:-.035em}
.ssp-row .ssp-btn{font-size:18px;padding:17px 18px}
.ssp p{margin:10px 0 0;font-size:15.5px;line-height:1.55;color:#56575C}
.ssp-row{display:flex;gap:10px;margin-top:22px}
.ssp-btn{flex:1;font:600 15px 'Work Sans',system-ui,sans-serif;border:0;border-radius:999px;padding:14px 18px;cursor:pointer;transition:transform .2s,background .2s,box-shadow .2s}
.ssp-yes{background:#D1184F;color:#fff;box-shadow:0 12px 24px -12px rgba(209,24,79,.7)}
.ssp-yes:hover{background:#A8123F;transform:translateY(-1px)}
.ssp-no{background:#F4F4F5;color:#1A1A1A}.ssp-no:hover{background:#ECE7E9}
.ssp-chips{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
.ssp-chip{font:500 15px 'Work Sans',system-ui,sans-serif;border:1.5px solid #ECE7E9;background:#fff;border-radius:14px;padding:13px 12px;cursor:pointer;transition:all .2s;color:#1A1A1A}
.ssp-chip:hover{border-color:#D1184F;color:#D1184F;transform:translateY(-1px)}
.ssp-f{display:grid;gap:10px;margin-top:18px}
.ssp,.ssp *{color-scheme:light}
.ssp-f input::placeholder{color:#8E8F95;opacity:1}
.ssp-f input{background:#fff!important;color:#1A1A1A!important;-webkit-text-fill-color:#1A1A1A;font:400 16px 'Work Sans',system-ui,sans-serif;border:1.5px solid #E2DDDF;border-radius:12px;padding:13px 14px;width:100%;box-sizing:border-box;color:#1A1A1A}
.ssp-f input:focus{outline:0;border-color:#D1184F;box-shadow:0 0 0 4px #FBE9EF}
.ssp-f input.bad{border-color:#C62828}
.ssp-f .ssp-btn{margin-top:4px}
.ssp-err{font-size:13.5px;color:#C62828;min-height:1em;margin:2px 0 0}
.ssp-fine{font-size:12.5px;color:#8E8F95;margin-top:10px;text-align:center}
.ssp-ok{text-align:center;padding:6px 0}
.ssp-tick{width:62px;height:62px;border-radius:50%;background:#FBE9EF;display:grid;place-items:center;margin:0 auto 14px}
.ssp-tick svg{width:30px;height:30px;stroke:#D1184F;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:32;stroke-dashoffset:32;animation:sspd .6s .2s ease forwards}
@keyframes sspd{to{stroke-dashoffset:0}}
.ssp-prog{display:flex;gap:6px;margin-bottom:16px}.ssp-prog i{flex:1;height:4px;border-radius:4px;background:#F4F4F5;transition:background .4s}.ssp-prog i.on{background:#D1184F}
.ssp-link{display:inline-block;margin-top:16px;font-weight:600;color:#D1184F;text-decoration:none}
@media (max-width:520px){.ssp h3.ssp-q{font-size:32px}.ssp h3.ssp-q2{font-size:26px}.ssp-veil{align-items:flex-end;padding:0}.ssp{border-radius:26px 26px 0 0;width:100%}.ssp-top{height:150px}.ssp h3{font-size:22px}}
@media (prefers-reduced-motion:reduce){.ssp h3.ssp-q span,.ssp-yes[data-a],.ssp,.ssp-veil,.ssp-col i,.ssp-col em,.ssp-step,.ssp-tick svg{animation:none!important;transition:none!important}.ssp-tick svg{stroke-dashoffset:0}}
`;

  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var v = document.createElement("div");
    v.className = "ssp-veil";
    v.innerHTML =
      '<div class="ssp" role="dialog" aria-modal="true" aria-labelledby="ssp-h">' +
      '<div class="ssp-top" aria-hidden="true"><div class="ssp-chart">' +
      '<div class="ssp-col"><i style="height:22%"></i><small>Month 1</small></div>' +
      '<div class="ssp-col"><i style="height:38%"></i><small>Month 2</small></div>' +
      '<div class="ssp-col"><i style="height:58%"></i><small>Month 3</small></div>' +
      '<div class="ssp-col hi"><em>30%+</em><i style="height:92%"></i><small>Goal</small></div>' +
      '</div><span class="ssp-cap">Revenue from email</span></div>' +
      '<button class="ssp-x" type="button" aria-label="Close">&times;</button>' +
      '<div class="ssp-b">' +
      '<div class="ssp-prog" aria-hidden="true"><i class="on"></i><i></i></div>' +
      // step 1
      '<div class="ssp-step on" data-s="1">' +
      '<h3 id="ssp-h" class="ssp-q">Want <span>30%+</span> of your revenue from email?</h3>' +
      '<div class="ssp-row"><button class="ssp-btn ssp-yes" data-a="yes" type="button">Yes</button><button class="ssp-btn ssp-no" data-a="no" type="button">No</button></div></div>' +
      // step 3
      '<div class="ssp-step" data-s="3">' +
      '<h3 class="ssp-q2">Where should we send your free audit?</h3>' +
      '<form class="ssp-f" novalidate>' +
      '<input name="email" type="email" autocomplete="email" placeholder="Your email, e.g. emma@yourbrand.com" aria-label="Work email" required>' +
      '<p class="ssp-err" aria-live="polite"></p>' +
      '<button class="ssp-btn ssp-yes" type="submit">Send it</button></form>' +
      '</div>' +
      // done
      '<div class="ssp-step ssp-ok" data-s="ok"><div class="ssp-tick"><svg viewBox="0 0 30 30"><path d="M7 15.5l5.5 5.5L23 10"/></svg></div>' +
      '<h3 class="ssp-q2">You&rsquo;re in!</h3></div>' +
      // no thanks
      '<div class="ssp-step ssp-ok" data-s="no"><span class="ssp-k">No problem</span><h3>Here&rsquo;s a quick read for later</h3>' +
      '<p>What share of revenue email should bring in, with real benchmarks.</p>' +
      '<a class="ssp-link" href="what-percentage-of-revenue-should-come-from-email.html">Read the guide &rarr;</a></div>' +
      '</div></div>';
    document.body.appendChild(v);
    return v;
  }

  function open() {
    if (seen()) return;
    mark();
    var v = build(), box = v.querySelector(".ssp"), last = document.activeElement, answer = "";
    var bars = v.querySelectorAll(".ssp-prog i");
    function go(s) {
      v.querySelectorAll(".ssp-step").forEach(function (e) { e.classList.toggle("on", e.dataset.s === s); });
      var n = { "1": 1, "3": 2, ok: 2, no: 1 }[s];
      bars.forEach(function (b, i) { b.classList.toggle("on", i < n); });
      var f = v.querySelector('.ssp-step.on input, .ssp-step.on button, .ssp-step.on a');
      if (f) f.focus({ preventScroll: true });
    }
    function close() {
      v.classList.remove("on");
      document.removeEventListener("keydown", onKey);
      setTimeout(function () { v.remove(); }, reduce ? 0 : 350);
      if (last && last.focus) last.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        var f = [].slice.call(box.querySelectorAll("button,input,a")).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    v.addEventListener("click", function (e) { if (e.target === v) close(); });
    v.querySelector(".ssp-x").onclick = close;
    v.querySelector('[data-a="yes"]').onclick = function () { answer = "Yes"; go("3"); };
    v.querySelector('[data-a="no"]').onclick = function () { answer = "No"; go("3"); };
    var form = v.querySelector("form"), err = v.querySelector(".ssp-err");
    form.addEventListener("input", function (e) { e.target.classList.remove("bad"); err.textContent = ""; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = form.email, ok = true;
      em.classList.remove("bad");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) { em.classList.add("bad"); ok = false; }
      if (!ok) { err.textContent = "Please add a valid email."; return; }
      err.textContent = "";
      var btn = form.querySelector("button"); btn.disabled = true; btn.textContent = "Sending…";
      window.ssSendLead({ source: "Popup", email: em.value.trim(), answer: answer }).then(function () {
        go("ok"); setTimeout(close, 6000);
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Send my free audit";
        err.textContent = "Sorry, that didn't send. Please try again, or email hello@shahwarsends.com.";
      });
    });
    requestAnimationFrame(function () { v.classList.add("on"); go("1"); });
  }

  function start() { setTimeout(open, 4000); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
