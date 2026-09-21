const hoursInput = document.getElementById("hours");
const commissionInput = document.getElementById("commission");
const activityInput = document.getElementById("activity");
const addEntryButton = document.getElementById("addEntry");

const entriesContainer = document.getElementById("entries");
const entryCount = document.getElementById("entryCount");
const totalHours = document.getElementById("totalHours");

const recordingSection = document.getElementById("recordingSection");
const todaySection = document.getElementById("todaySection");
const evaluationSection = document.getElementById("evaluationSection");
const commissionSection = document.getElementById("commissionSection");

const navRecording = document.getElementById("navRecording");
const navEvaluation = document.getElementById("navEvaluation");
const navCommissions = document.getElementById("navCommissions");

const evaluationToday = document.getElementById("evaluationToday");
const evaluationWeek = document.getElementById("evaluationWeek");
const evaluationMonth = document.getElementById("evaluationMonth");
const evaluationCommissions = document.getElementById("evaluationCommissions");

const addCommissionButton = document.getElementById("addCommission");
const commissionList = document.getElementById("commissionList");

const ENTRIES_KEY = "zeitpol_entries";
const COMMISSIONS_KEY = "zeitpol_commissions";

let timeEntries = [];
let commissions = [];


/* =========================
   DATEN LADEN
========================= */

try {
  const savedEntries =
    localStorage.getItem(ENTRIES_KEY);

  if (savedEntries) {
    timeEntries = JSON.parse(savedEntries);
  }
} catch (error) {
  timeEntries = [];
}


try {
  const savedCommissions =
    localStorage.getItem(COMMISSIONS_KEY);

  if (savedCommissions) {
    commissions = JSON.parse(savedCommissions);
  }
} catch (error) {
  commissions = [];
}


if (commissions.length === 0) {
  commissions = [
    "Kommission 001",
    "Kommission 002",
    "Kommission 003"
  ];

  saveCommissions();
}


/* =========================
   SPEICHERN
========================= */

function saveEntries() {
  localStorage.setItem(
    ENTRIES_KEY,
    JSON.stringify(timeEntries)
  );
}


function saveCommissions() {
  localStorage.setItem(
    COMMISSIONS_KEY,
    JSON.stringify(commissions)
  );
}


/* =========================
   HILFSFUNKTIONEN
========================= */

function getHours(entry) {
  return Number(
    String(entry.hours).replace(",", ".")
  ) || 0;
}


function getEntryDate(entry) {
  if (!entry.date) {
    return null;
  }

  const date = new Date(entry.date);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}


function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}


function formatHours(hours) {
  return (
    hours.toLocaleString("de-CH", {
      maximumFractionDigits: 2
    }) + " Stunden"
  );
}


/* =========================
   KOMMISSION AUSWAHL
========================= */

function renderCommissionSelect() {
  commissionInput.innerHTML = "";

  commissions.forEach(function(commission) {
    const option = document.createElement("option");

    option.value = commission;
    option.textContent = commission;

    commissionInput.appendChild(option);
  });
}


/* =========================
   KOMMISSIONEN ANZEIGEN
========================= */

function renderCommissionList() {
  commissionList.innerHTML = "";

  if (commissions.length === 0) {
    commissionList.className = "empty-state";
    commissionList.textContent =
      "Noch keine Kommissionen vorhanden.";

    return;
  }

  commissionList.className = "entries-list";

  commissions.forEach(function(commission, index) {

    const item = document.createElement("div");
    item.className = "entry";

    const name = document.createElement("strong");
    name.textContent = commission;

    const renameButton = document.createElement("button");
    renameButton.type = "button";
    renameButton.textContent = "✏️ Umbenennen";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "🗑️ Löschen";

    renameButton.style.marginTop = "8px";
    deleteButton.style.marginTop = "8px";
    deleteButton.style.marginLeft = "8px";

    renameButton.addEventListener("click", function() {
      renameCommission(index);
    });

    deleteButton.addEventListener("click", function() {
      deleteCommission(index);
    });

    item.appendChild(name);
    item.appendChild(document.createElement("br"));
    item.appendChild(renameButton);
    item.appendChild(deleteButton);

    commissionList.appendChild(item);
  });
}


/* =========================
   KOMMISSION HINZUFÜGEN
========================= */

function addCommission() {

  const name = prompt(
    "Name der neuen Kommission:"
  );

  if (name === null) {
    return;
  }

  const newName = name.trim();

  if (newName === "") {
    alert("Bitte gib einen Namen ein.");
    return;
  }

  const exists = commissions.some(function(commission) {
    return commission.toLowerCase() === newName.toLowerCase();
  });

  if (exists) {
    alert("Diese Kommission gibt es bereits.");
    return;
  }

  commissions.push(newName);

  saveCommissions();

  renderCommissionSelect();
  renderCommissionList();
}


/* =========================
   KOMMISSION UMBENENNEN
========================= */

function renameCommission(index) {

  const oldName = commissions[index];

  const newName = prompt(
    "Neuer Name:",
    oldName
  );

  if (newName === null) {
    return;
  }

  const trimmedName = newName.trim();

  if (trimmedName === "") {
    alert("Bitte gib einen Namen ein.");
    return;
  }

  const exists = commissions.some(function(commission, i) {
    return (
      i !== index &&
      commission.toLowerCase() === trimmedName.toLowerCase()
    );
  });

  if (exists) {
    alert("Diese Kommission gibt es bereits.");
    return;
  }

  timeEntries.forEach(function(entry) {
    if (entry.commission === oldName) {
      entry.commission = trimmedName;
    }
  });

  commissions[index] = trimmedName;

  saveCommissions();
  saveEntries();

  renderCommissionSelect();
  renderCommissionList();
  renderEntries();
  renderEvaluation();
}


/* =========================
   KOMMISSION LÖSCHEN
========================= */

function deleteCommission(index) {

  const commission = commissions[index];

  const used = timeEntries.some(function(entry) {
    return entry.commission === commission;
  });

  let message =
    "Möchtest du diese Kommission wirklich löschen?";

  if (used) {
    message =
      "Diese Kommission wird bereits bei Zeiteinträgen verwendet. Trotzdem löschen?";
  }

  const confirmed = confirm(message);

  if (!confirmed) {
    return;
  }

  commissions.splice(index, 1);

  saveCommissions();

  renderCommissionSelect();
  renderCommissionList();
}


/* =========================
   ZEITEINTRÄGE
========================= */

function renderEntries() {

  entriesContainer.innerHTML = "";

  const today = new Date();

  const todayEntries = timeEntries.filter(function(entry) {

    const date = getEntryDate(entry);

    if (!date) {
      return false;
    }

    return isSameDay(date, today);
  });


  if (todayEntries.length === 0) {

    entriesContainer.className = "empty-state";

    entriesContainer.textContent =
      "Noch keine Einträge vorhanden.";

  } else {

    entriesContainer.className = "entries-list";

    todayEntries.forEach(function(entry) {

      const item = document.createElement("div");
      item.className = "entry";

      const hours = document.createElement("strong");
      hours.textContent = entry.hours + " Std.";

      const commission = document.createElement("div");
      commission.textContent = entry.commission;

      const activity = document.createElement("small");
      activity.textContent =
        entry.activity || "Keine Tätigkeit angegeben";

      item.appendChild(hours);
      item.appendChild(commission);
      item.appendChild(activity);

      entriesContainer.appendChild(item);
    });
  }


  entryCount.textContent =
    todayEntries.length === 1
      ? "1 Eintrag"
      : todayEntries.length + " Einträge";


  let total = 0;

  todayEntries.forEach(function(entry) {
    total += getHours(entry);
  });

  totalHours.textContent =
    formatHours(total);
}


/* =========================
   AUSWERTUNG
========================= */

function renderEvaluation() {

  const now = new Date();

  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();

  startOfWeek.setDate(
    startOfWeek.getDate() +
    (day === 0 ? -6 : 1 - day)
  );

  startOfWeek.setHours(0, 0, 0, 0);


  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );


  const todayEntries = timeEntries.filter(function(entry) {

    const date = getEntryDate(entry);

    return date && isSameDay(date, now);
  });


  const weekEntries = timeEntries.filter(function(entry) {

    const date = getEntryDate(entry);

    return date && date >= startOfWeek;
  });


  const monthEntries = timeEntries.filter(function(entry) {

    const date = getEntryDate(entry);

    return (
      date &&
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  });


  evaluationToday.textContent =
    formatHours(
      todayEntries.reduce(function(total, entry) {
        return total + getHours(entry);
      }, 0)
    );


  evaluationWeek.textContent =
    formatHours(
      weekEntries.reduce(function(total, entry) {
        return total + getHours(entry);
      }, 0)
    );


  evaluationMonth.textContent =
    formatHours(
      monthEntries.reduce(function(total, entry) {
        return total + getHours(entry);
      }, 0)
    );


  evaluationCommissions.innerHTML = "";

  const totals = {};

  timeEntries.forEach(function(entry) {

    const commission =
      entry.commission || "Ohne Kommission";

    if (!totals[commission]) {
      totals[commission] = 0;
    }

    totals[commission] += getHours(entry);
  });


  Object.keys(totals)
    .sort()
    .forEach(function(commission) {

      const item = document.createElement("div");
      item.className = "entry";

      const name = document.createElement("strong");
      name.textContent = commission;

      const hours = document.createElement("div");
      hours.textContent = formatHours(
        totals[commission]
      );

      item.appendChild(name);
      item.appendChild(hours);

      evaluationCommissions.appendChild(item);
    });
}


/* =========================
   SEITENWECHSEL
========================= */

function showRecording() {

  recordingSection.style.display = "";
  todaySection.style.display = "";
  evaluationSection.style.display = "none";
  commissionSection.style.display = "none";

  navRecording.classList.add("active");
  navEvaluation.classList.remove("active");
  navCommissions.classList.remove("active");
}


function showEvaluation() {

  recordingSection.style.display = "none";
  todaySection.style.display = "none";
  evaluationSection.style.display = "";
  commissionSection.style.display = "none";

  navRecording.classList.remove("active");
  navEvaluation.classList.add("active");
  navCommissions.classList.remove("active");

  renderEvaluation();
}


function showCommissions() {

  recordingSection.style.display = "none";
  todaySection.style.display = "none";
  evaluationSection.style.display = "none";
  commissionSection.style.display = "";

  navRecording.classList.remove("active");
  navEvaluation.classList.remove("active");
  navCommissions.classList.add("active");

  renderCommissionList();
}


/* =========================
   BUTTONS
========================= */

addEntryButton.addEventListener("click", function() {

  const value =
    hoursInput.value.trim().replace(",", ".");

  const hours = Number(value);

  if (
    value === "" ||
    !Number.isFinite(hours) ||
    hours <= 0
  ) {
    alert(
      "Bitte gib eine gültige Stundenzahl ein."
    );

    hoursInput.focus();

    return;
  }

  if (commissions.length === 0) {
    alert(
      "Bitte lege zuerst eine Kommission an."
    );

    return;
  }

  const entry = {
    hours: hours.toLocaleString("de-CH", {
      maximumFractionDigits: 2
    }),

    commission: commissionInput.value,

    activity: activityInput.value.trim(),

    date: new Date().toISOString()
  };

  timeEntries.push(entry);

  saveEntries();

  renderEntries();
  renderEvaluation();

  hoursInput.value = "";
  activityInput.value = "";

  hoursInput.focus();
});


/* ERFASSUNG */

navRecording.addEventListener("click", function() {
  showRecording();
});


/* AUSWERTUNG */

navEvaluation.addEventListener("click", function() {
  showEvaluation();
});


/* KOMMISSIONEN */

navCommissions.addEventListener("click", function() {
  showCommissions();
});


/* NEUE KOMMISSION */

addCommissionButton.addEventListener("click", function() {
  addCommission();
});


/* =========================
   START
========================= */

renderCommissionSelect();
renderCommissionList();
renderEntries();
renderEvaluation();
showRecording();
