/* ============================================================
   OTTER — site interactivity
   Plain vanilla JS, no build step. Designed to be readable for
   future maintainers who may not be developers.
   ============================================================ */

// === EDIT ME — contact + form URLs ==========================
// Until a Google Form exists, leave the two form URLs empty ("") and the
// buttons fall back to a pre-filled email to CONTACT_EMAIL, so nothing on
// the page is ever a dead link. Once you create the forms, paste the
// forms.gle URLs here and the buttons switch over automatically.
const CONTACT_EMAIL   = "wu.6489@osu.edu";
const RSVP_FORM_URL   = "";   // e.g. "https://forms.gle/abc123"  — RSVP for a single talk
const SUBSCRIBE_URL   = "";   // e.g. "https://forms.gle/xyz789"  — monthly announcement list

const REPO_URL = "https://github.com/otter-osu/otter-osu.github.io";

// ============================================================
// Wire up RSVP / Subscribe buttons
// ============================================================
function mailtoLink(subject, body) {
  return "mailto:" + CONTACT_EMAIL +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);
}

// RSVP — one button per talk. Uses the talk's own date so the email
// says which session the sender means.
document.querySelectorAll("[data-rsvp]").forEach(el => {
  if (RSVP_FORM_URL) {
    el.setAttribute("href", RSVP_FORM_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
    return;
  }
  const card = el.closest("[data-title]");
  const which = card && card.dataset.title ? card.dataset.title : "an OTTER public talk";
  el.setAttribute("href", mailtoLink(
    "RSVP — " + which,
    "Hi OTTER team,\n\nI'd like to RSVP for " + which + ".\n\n" +
    "Name:\nProgram / department:\nOSU email:\n\nThanks!"
  ));
});

// Subscribe — monthly announcement list.
document.querySelectorAll("[data-subscribe]").forEach(el => {
  if (SUBSCRIBE_URL) {
    el.setAttribute("href", SUBSCRIBE_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
    return;
  }
  el.setAttribute("href", mailtoLink(
    "Subscribe — OTTER monthly announcements",
    "Hi OTTER team,\n\nPlease add me to the monthly announcement list.\n\n" +
    "Name:\nProgram / department / institution:\nEmail:\n\nThanks!"
  ));
});

// Wire up footer repo link
const repoLink = document.getElementById("repo-link");
if (repoLink) {
  repoLink.setAttribute("href", REPO_URL);
  repoLink.setAttribute("target", "_blank");
  repoLink.setAttribute("rel", "noopener");
}

// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Sticky nav: toggle .scrolled after a small scroll
// ============================================================
const navEl = document.getElementById("nav");
const onScroll = () => {
  navEl.classList.toggle("scrolled", window.scrollY > 40);
  bttBtn && bttBtn.classList.toggle("show", window.scrollY > 600);
};
window.addEventListener("scroll", onScroll, { passive: true });

// ============================================================
// Active nav link via IntersectionObserver
// ============================================================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const setActive = id => {
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });
};
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
sections.forEach(s => navObserver.observe(s));

// ============================================================
// Mobile hamburger
// ============================================================
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.classList.toggle("open");
    navMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  // Close on link click
  navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));
}

// ============================================================
// Fade-in on scroll
// ============================================================
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("vis");
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".fade").forEach(el => fadeObserver.observe(el));

// Safety net: if JS never triggers (e.g. very fast scroll), reveal everything after 1s.
window.setTimeout(() => {
  document.querySelectorAll(".fade:not(.vis)").forEach(el => el.classList.add("vis"));
}, 1500);

// ============================================================
// Schedule tabs
// ============================================================
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-tab");
    document.querySelectorAll(".tab").forEach(t => {
      const isActive = t === tab;
      t.classList.toggle("active", isActive);
      t.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll(".tab-panel").forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-panel") === target);
    });
  });
});

// ============================================================
// Back to top
// ============================================================
const bttBtn = document.querySelector(".btt");
if (bttBtn) {
  bttBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ============================================================
// Add-to-calendar — generate .ics from talk-card data attributes
// Each talk-card uses:
//   data-title, data-date (YYYY-MM-DD), data-time (HH:MM, 24h),
//   data-duration (minutes), data-location
// ============================================================
function pad2(n) { return String(n).padStart(2, "0"); }

// Talks are given in person in Columbus, so the .ics carries a *floating*
// local time (no trailing "Z"). A trailing Z would mean UTC and every
// calendar app would shift a 4:00pm talk to noon.
function fmtICS(dt) {
  return dt.getFullYear()
    + pad2(dt.getMonth() + 1)
    + pad2(dt.getDate())
    + "T"
    + pad2(dt.getHours())
    + pad2(dt.getMinutes())
    + "00";
}

function toICSDate(dateStr, timeStr) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = (timeStr || "12:00").split(":").map(Number);
  return fmtICS(new Date(y, mo - 1, d, h, mi));
}

function generateICS({ title, date, time, durationMin, location, description }) {
  const dtStart = toICSDate(date, time);
  // end = start + duration
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = (time || "12:00").split(":").map(Number);
  const dtEnd = fmtICS(new Date(y, mo - 1, d, h, mi + Number(durationMin || 60)));
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const uid = "otter-" + date + "-" + Math.random().toString(36).slice(2, 8) + "@otter-osu";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OTTER//OSU//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:" + uid,
    "DTSTAMP:" + stamp,
    "DTSTART:" + dtStart,
    "DTEND:" + dtEnd,
    "SUMMARY:" + (title || "OTTER Talk"),
    "LOCATION:" + (location || ""),
    "DESCRIPTION:" + (description || "OTTER public talk — otter-osu.github.io"),
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadICS(filename, content) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.querySelectorAll("[data-ics]").forEach(btn => {
  btn.addEventListener("click", () => {
    // the event data lives on the nearest ancestor carrying data-title —
    // .schedule-row in the schedule list, .next-talk in the hero
    const card = btn.closest("[data-title]");
    if (!card) return;
    const ics = generateICS({
      title: card.dataset.title,
      date: card.dataset.date,
      time: card.dataset.time,
      durationMin: card.dataset.duration,
      location: card.dataset.location,
      description: "OTTER public talk — otter-osu.github.io"
    });
    const safeName = (card.dataset.title || "otter-talk")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    downloadICS(safeName + ".ics", ics);
  });
});
