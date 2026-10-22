/* ============================================================
   tutorial-ot.js : ระบบสอนใช้งาน OT Calculator ProMax
   วิธีใส่: เพิ่มบรรทัดนี้ "หลัง </script> ตัวสุดท้าย" และก่อน </body>
            <script src="tutorial-ot.js"></script>
   - กด "ข้าม" ได้ทุกขั้นตอน / ติ๊ก "ไม่ต้องแสดงอัตโนมัติอีก" ได้
   - มีปุ่ม ❓ มุมขวาล่างสำหรับดูซ้ำ
   - แก้ข้อความ/ขั้นตอนที่ TOUR_STEPS เท่านั้น
   ============================================================ */
(function () {
  const STORAGE_KEY = "ot_tutorial_done_v1"; // เปลี่ยนเป็น v2 เมื่ออยากให้ทุกคนเห็นทัวร์ใหม่
  const T = "my-ot";                          // ทัวร์สอนในแท็บ My OT
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s) => document.querySelector(s);

  // ---------- ตัวช่วยควบคุม UI ของเว็บด้วยการ "คลิกจริง" ----------
  const sidebarEl = () => $("#appSidebar");
  async function ensureSidebar(open) {
    const el = sidebarEl();
    if (!el) return;
    if (el.classList.contains("open") !== open) {
      $("#sidebarToggleBtn")?.click();
      await wait(420);
    }
  }
  const modalOpen = () => $("#dayModal")?.classList.contains("is-open");
  async function ensureModal(open) {
    if (open && !modalOpen()) {
      $(`#calendarBody_${T} .cal-cell[data-action="open-day"]`)?.click();
      await wait(250);
    } else if (!open && modalOpen()) {
      $("#modalCancelBtn")?.click();
      await wait(200);
    }
  }
  async function ensureTab() {
    const tab = $(`.tab[data-tab-target="${T}"]`);
    if (tab && !tab.classList.contains("active")) { tab.click(); await wait(200); }
  }

  // ---------- ขั้นตอนการสอน ----------
  // sidebar: true/false = เปิด/ปิดเมนูด้านข้างก่อนแสดงขั้นตอนนี้ / modal: true = เปิดหน้าต่างแก้ไขวัน
  const TOUR_STEPS = [
    {
      sidebar: false, modal: false,
      title: "👋 มาเรียนรู้การใช้งานกัน",
      text: "จะพาไปดูทีละส่วนตั้งแต่ใส่เงินเดือน กรอก OT ในปฏิทิน จนถึงดูสรุปรายได้ กด <b>ข้าม</b> ได้ทุกเมื่อ",
    },
    {
      sidebar: false, modal: false,
      target: () => $("#sidebarToggleBtn"),
      title: "☰ เมนูด้านข้าง",
      text: "กดเพื่อ <b>เปิด/ปิด</b> เมนูตั้งค่า (เงินเดือน, ชั่วโมง OT, รายจ่ายประจำ)",
    },
    {
      sidebar: false, modal: false,
      target: () => $(".tab-container"),
      title: "🗂️ สองแท็บแยกข้อมูลกัน",
      text: "<b>My OT</b> ใช้บันทึกของจริง ส่วน <b>Forecast / Other</b> ไว้ลองคำนวณสมมติ ข้อมูลของสองแท็บไม่ปนกัน",
    },
    {
      sidebar: true, modal: false,
      target: () => $(`#salary_${T}`)?.closest(".form-group"),
      title: "💰 ใส่เงินเดือน",
      text: "กรอกเงินเดือนของคุณ ระบบจะคำนวณอัตรา OT ต่อชั่วโมงให้อัตโนมัติ",
    },
    {
      sidebar: true, modal: false,
      target: () => $(`#plant_${T}`)?.closest(".form-group"),
      title: "🏭 โรงงาน & เกรด",
      text: "เลือก <b>BANPHO / GATEWAY</b> และเกรด G1-G6 ระบบจะใช้กำหนด <b>วันหยุดบริษัท</b> ในปฏิทิน และเงินช่วยเหลือตามสถานที่ทำงานให้",
    },
    {
      sidebar: true, modal: false,
      target: () => $(`#month_${T}`)?.closest(".date-row"),
      title: "📆 เลือกเดือน / ปี",
      text: "เปลี่ยนเดือนหรือปี ปฏิทินและยอด OT จะอัปเดตตาม",
    },
    {
      sidebar: true, modal: false,
      target: () => $(`#gaugeContainer_${T}`),
      title: "⚡ ระดับพลังเงินเดือน",
      text: "แสดงว่าเงินเดือนอยู่กี่ % ของเพดานเกรด และเหลืออีกกี่ปีจะตัน (คิดที่ 4.5% ต่อปี)",
    },
    {
      sidebar: true, modal: false,
      target: () => $(`[data-action="reset"][data-tab="${T}"]`),
      title: "🔄 Reset All",
      text: "ล้างข้อมูลทั้งหมดของแท็บนี้กลับเป็นค่าเริ่มต้น (มีให้ยืนยันก่อน)",
    },
    {
      sidebar: true, modal: false,
      target: () => $(`#sliders-content_${T}`)?.parentElement,
      title: "🎚️ ปรับชั่วโมง OT",
      text: "ปรับสไลเดอร์หรือกด <b>+ / -</b> ได้ทีละ 0.5 ชม. ปุ่ม <b>Sync</b> ดึงตัวเลขจากปฏิทินมาใส่ ถ้าสไลเดอร์น้อยกว่าปฏิทินจะมี <span style='color:#ef4444'>แถบแดง</span> บอกส่วนที่ขาด",
    },
    {
      sidebar: true, modal: false,
      target: () => $(`#fix-cost-content_${T}`)?.parentElement,
      title: "🧾 Fix Cost (รายจ่ายประจำ)",
      text: "ใส่รายจ่ายประจำเดือน เช่น ผ่อนรถ สหกรณ์ ประกันสังคม กด <b>+ เพิ่มรายการ</b> หรือกด ✕ เพื่อลบ ระบบนำไปหักจากรายรับให้",
    },
    {
      sidebar: false, modal: false,
      target: () => $(`#calendarBody_${T}`)?.closest(".card"),
      title: "🗓️ ปฏิทิน OT",
      text: "แตะ <b>วันที่</b> เพื่อกรอก OT ของวันนั้น พื้นสีชมพู = วันหยุด 📝 = วันนั้นมีโน้ตรายละเอียดงาน 🍚 = ได้ค่าอาหาร OT",
    },
    {
      sidebar: false, modal: true,
      target: () => $("#dayModal .modal"),
      title: "✏️ กรอก OT ของวัน",
      text: "ติ๊ก <b>No OT</b> ถ้าไม่มี OT หรือกรอกชั่วโมงแต่ละเรทแล้ว <b>Save</b> ช่อง 📝 Detail ไว้จดรายละเอียดงาน จะไปแสดงในรายงาน Export ด้วย",
    },
    {
      sidebar: false, modal: false,
      target: () => $(`#calendarSummary_${T}`),
      title: "📈 สรุปจากปฏิทิน",
      text: "รวมชั่วโมง OT แต่ละเรท และจำนวนมื้ออาหาร OT ของทั้งเดือน",
    },
    {
      sidebar: false, modal: false,
      target: () => $(`#exportArea_${T}`),
      title: "💵 Final Summary",
      text: "สรุปรายรับรวม หักรายจ่ายประจำ เหลือ <b>Net Income</b> สุทธิ (ติดลบจะขึ้นสีแดง)",
    },
    {
      sidebar: false, modal: false,
      target: () => $(`.export-btn[data-tab="${T}"]`),
      title: "📸 Export Report",
      text: "บันทึกรายงานทั้งเดือนเป็นรูป JPEG ขนาด A3 พร้อมตารางวันและเวลา OT ใช้อินเทอร์เน็ตตอนกด",
    },
    {
      sidebar: false, modal: false,
      title: "🎉 พร้อมใช้งานแล้ว!",
      text: "ลืมวิธีใช้ตอนไหน กดปุ่ม <b>❓</b> มุมขวาล่างเพื่อดูอีกครั้งได้เลย",
    },
  ];

  // ---------- สไตล์ (โทนพาสเทลเข้ากับเว็บ) ----------
  const style = document.createElement("style");
  style.textContent = `
  #tt-overlay{position:fixed;inset:0;z-index:9998;background:transparent}
  #tt-spot{position:fixed;z-index:9999;border-radius:12px;pointer-events:none;
    box-shadow:0 0 0 9999px rgba(31,41,55,.72),0 0 0 3px #FFAFCC,0 0 22px 4px rgba(255,175,204,.7);
    transition:top .3s ease,left .3s ease,width .3s ease,height .3s ease,opacity .2s}
  #tt-box{position:fixed;z-index:10000;width:min(92vw,350px);background:#fff;border-radius:16px;
    padding:16px 16px 12px;box-shadow:0 20px 50px rgba(0,0,0,.35);border-top:5px solid #CDB4DB;
    font-family:'Kanit',sans-serif;color:#1f2937;transition:top .3s ease,left .3s ease}
  #tt-box h4{font-weight:700;font-size:1.05rem;margin:0 0 4px;color:#1f2937}
  #tt-box p{font-size:.9rem;line-height:1.6;color:#4b5563;margin:0}
  #tt-bar{height:5px;background:#e5e7eb;border-radius:99px;margin:10px 0;overflow:hidden}
  #tt-bar i{display:block;height:100%;background:linear-gradient(90deg,#A2D2FF,#CDB4DB,#FFAFCC);transition:width .3s}
  #tt-row{display:flex;gap:6px;align-items:center;justify-content:space-between}
  #tt-box button{font-family:inherit;font-weight:600;font-size:.85rem;border-radius:8px;padding:8px 12px;cursor:pointer;border:0}
  #tt-skip{background:#f1f5f9;color:#6b7280}
  #tt-prev{background:#BDE0FE;color:#1f2937}
  #tt-next{background:#CDB4DB;color:#1f2937}
  #tt-chk{display:flex;gap:6px;align-items:center;font-size:.75rem;color:#6b7280;margin-top:8px;cursor:pointer}
  #tt-help{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:120;width:44px;height:44px;
    border-radius:50%;background:#CDB4DB;color:#1f2937;font-size:20px;font-weight:700;border:3px solid #fff;
    box-shadow:0 6px 16px rgba(179,146,198,.6);cursor:pointer;font-family:inherit}
  `;
  document.head.appendChild(style);

  // ---------- ตัวควบคุมทัวร์ ----------
  let idx = 0, overlay, spot, box, running = false, curTarget = null;

  const isDone = () => { try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; } };
  const markDone = () => { try { localStorage.setItem(STORAGE_KEY, "1"); } catch {} };
  const clearDone = () => { try { localStorage.removeItem(STORAGE_KEY); } catch {} };

  function build() {
    overlay = document.createElement("div"); overlay.id = "tt-overlay";
    spot = document.createElement("div"); spot.id = "tt-spot";
    box = document.createElement("div"); box.id = "tt-box"; box.setAttribute("role", "dialog");
    document.body.append(overlay, spot, box);
  }

  function place() {
    if (!box) return;
    const pad = 6, vw = innerWidth, vh = innerHeight;
    const bw = box.offsetWidth, bh = box.offsetHeight;
    if (!curTarget) {
      spot.style.opacity = "0";
      overlay.style.background = "rgba(31,41,55,.72)";
      box.style.left = (vw - bw) / 2 + "px";
      box.style.top = (vh - bh) / 2 + "px";
      return;
    }
    overlay.style.background = "transparent";
    const r = curTarget.getBoundingClientRect();
    spot.style.opacity = "1";
    spot.style.top = r.top - pad + "px";
    spot.style.left = r.left - pad + "px";
    spot.style.width = r.width + pad * 2 + "px";
    spot.style.height = r.height + pad * 2 + "px";

    const below = vh - r.bottom, above = r.top;
    let top = below >= bh + 16 || below >= above ? r.bottom + 14 : r.top - bh - 14;
    top = Math.max(8, Math.min(top, vh - bh - 8));
    let left = r.left + r.width / 2 - bw / 2;
    left = Math.max(8, Math.min(left, vw - bw - 8));
    box.style.top = top + "px";
    box.style.left = left + "px";
  }

  async function show(i) {
    idx = i;
    const s = TOUR_STEPS[i];
    if (typeof s.modal === "boolean") await ensureModal(s.modal);
    if (typeof s.sidebar === "boolean") await ensureSidebar(s.sidebar);
    curTarget = typeof s.target === "function" ? s.target() : null;
    if (curTarget) {
      curTarget.scrollIntoView({ block: "center", behavior: "smooth" });
      await wait(380);
    }
    const last = i === TOUR_STEPS.length - 1;
    box.innerHTML = `
      <h4>${s.title}</h4><p>${s.text}</p>
      <div id="tt-bar"><i style="width:${((i + 1) / TOUR_STEPS.length) * 100}%"></i></div>
      <div id="tt-row">
        <button id="tt-skip">${last ? "ปิด" : "ข้าม"}</button>
        <span style="display:flex;gap:6px">
          ${i > 0 ? '<button id="tt-prev">◀ ย้อน</button>' : ""}
          <button id="tt-next">${last ? "เสร็จสิ้น ✓" : "ถัดไป ▶"}</button>
        </span>
      </div>
      <label id="tt-chk"><input type="checkbox" id="tt-never" ${isDone() ? "checked" : ""}> ไม่ต้องแสดงอัตโนมัติอีก</label>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px;text-align:right">${i + 1} / ${TOUR_STEPS.length}</div>`;
    box.querySelector("#tt-skip").onclick = () => stop(false);
    box.querySelector("#tt-next").onclick = () => (last ? stop(true) : show(i + 1));
    const prev = box.querySelector("#tt-prev");
    if (prev) prev.onclick = () => show(i - 1);
    place();
  }

  async function stop(finished) {
    const never = box && box.querySelector("#tt-never");
    if (finished || (never && never.checked)) markDone();
    else if (never && !never.checked) clearDone();
    [overlay, spot, box].forEach((e) => e && e.remove());
    removeEventListener("resize", place);
    removeEventListener("keydown", onKey);
    running = false;
    // คืนสถานะหน้าจอ: ปิดหน้าต่างวัน / มือถือปิดเมนู / คอมเปิดเมนูตามปกติ
    await ensureModal(false);
    await ensureSidebar(innerWidth >= 900);
    window.scrollTo(0, 0);
  }

  function onKey(e) {
    if (e.key === "Escape") { e.stopPropagation(); stop(false); }
    else if (e.key === "ArrowRight" && idx < TOUR_STEPS.length - 1) show(idx + 1);
    else if (e.key === "ArrowLeft" && idx > 0) show(idx - 1);
  }

  async function start() {
    if (running) return;
    running = true;
    await ensureTab();
    build();
    addEventListener("resize", place);
    addEventListener("keydown", onKey, true);
    show(0);
  }
  window.startOtTutorial = start;

  // ---------- ปุ่ม ❓ ----------
  const help = document.createElement("button");
  help.id = "tt-help"; help.title = "วิธีใช้งาน"; help.textContent = "❓";
  help.onclick = start;
  document.body.appendChild(help);

  // ---------- เริ่มอัตโนมัติเมื่อเปิดครั้งแรก ----------
  const boot = () => { if (!isDone()) setTimeout(start, 700); };
  if (document.readyState === "complete") boot();
  else addEventListener("load", boot);
})();
