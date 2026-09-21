const hoursInput = document.getElementById("hours");
const commissionInput = document.getElementById("commission");
const activityInput = document.getElementById("activity");
const addEntryButton = document.getElementById("addEntry");

const entriesContainer = document.getElementById("entries");
const entryCount = document.getElementById("entryCount");
const totalHours = document.getElementById("totalHours");

const recordingSection =
  document.getElementById("recordingSection");

const todaySection =
  document.getElementById("todaySection");

const evaluationSection =
  document.getElementById("evaluationSection");

const navRecording =
  document.getElementById("navRecording");

const navEvaluation =
  document.getElementById("navEvaluation");

const evaluationToday =
  document.getElementById("evaluationToday");

const evaluationWeek =
  document.getElementById("evaluationWeek");

const evaluationMonth =
  document.getElementById("evaluationMonth");

const evaluationCommissions =
  document.getElementById("evaluationCommissions");

const STORAGE_KEY = "zeitpol_entries";

let timeEntries = [];

try {
  const savedEntries =
    localStorage.getItem(STORAGE_KEY);

  if (savedEntries) {
    timeEntries = JSON.parse(savedEntries);
  }
} catch (error) {
  timeEntries = [];
}

function saveEntries() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(timeEntries)
  );
}

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

function getStartOfWeek(date) {
  const start = new Date(date);

  const day = start.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  start.setDate(
    start.getDate() + difference
  );

  start.setHours(0, 0, 0, 0);

  return start;
}

function getStartOfMonth(date) {
  const start = new Date(date);

  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  return start;
}

function formatHours(hours) {
  return hours.toLocaleString("de-CH", {
    maximumFractionDigits: 2
  }) + " Stunden";
}

function calculateTotal(entries) {
  let total = 0;

  entries.forEach(function(entry) {
    total += getHours(entry);
  });

  return total;
}

function renderEntries() {
  entriesContainer.innerHTML = "";

  const today = new Date();

  const todayEntries =
    timeEntries.filter(function(entry) {
      const entryDate =
        getEntryDate(entry);

      if (!entryDate) {
        return false;
      }

      return isSameDay(
        entryDate,
        today
      );
    });

  if (todayEntries.length === 0) {
    entriesContainer.className =
      "empty-state";

    entriesContainer.textContent =
      "Noch keine Einträge vorhanden.";
  } else {
    entriesContainer.className =
      "entries-list";

    todayEntries.forEach(function(entry) {
      const entryElement =
        document.createElement("div");

      entryElement.className = "entry";

      const content =
        document.createElement("div");

      const hours =
        document.createElement("strong");

      hours.textContent =
        entry.hours + " Std.";

      const commission =
        document.createElement("div");

      commission.textContent =
        entry.commission;

      const activity =
        document.createElement("small");

      activity.textContent =
        entry.activity ||
        "Keine Tätigkeit angegeben";

      content.appendChild(hours);
      content.appendChild(commission);
      content.appendChild(activity);

      entryElement.appendChild(content);

      entriesContainer.appendChild(
        entryElement
      );
    });
  }

  if (todayEntries.length === 1) {
    entryCount.textContent =
      "1 Eintrag";
  } else {
    entryCount.textContent =
      todayEntries.length +
      " Einträge";
  }

  const todayTotal =
    calculateTotal(todayEntries);

  totalHours.textContent =
    formatHours(todayTotal);
}

function renderEvaluation() {
  const now = new Date();

  const startOfWeek =
    getStartOfWeek(now);

  const startOfMonth =
    getStartOfMonth(now);

  const todayEntries =
    timeEntries.filter(function(entry) {
      const entryDate =
        getEntryDate(entry);

      if (!entryDate) {
        return false;
      }

      return isSameDay(
        entryDate,
        now
      );
    });

  const weekEntries =
    timeEntries.filter(function(entry) {
      const entryDate =
        getEntryDate(entry);

      if (!entryDate) {
        return false;
      }

      return entryDate >= startOfWeek;
    });

  const monthEntries =
    timeEntries.filter(function(entry) {
      const entryDate =
        getEntryDate(entry);

      if (!entryDate) {
        return false;
      }

      return (
        entryDate.getFullYear() ===
          now.getFullYear() &&
        entryDate.getMonth() ===
          now.getMonth()
      );
    });

  evaluationToday.textContent =
    formatHours(
      calculateTotal(todayEntries)
    );

  evaluationWeek.textContent =
    formatHours(
      calculateTotal(weekEntries)
    );

  evaluationMonth.textContent =
    formatHours(
      calculateTotal(monthEntries)
    );

  renderCommissionEvaluation();
}

function renderCommissionEvaluation() {
  evaluationCommissions.innerHTML = "";

  if (timeEntries.length === 0) {
    evaluationCommissions.className =
      "empty-state";

    evaluationCommissions.textContent =
      "Noch keine Einträge vorhanden.";

    return;
  }

  const commissionTotals = {};

  timeEntries.forEach(function(entry) {
    const commission =
      entry.commission ||
      "Ohne Kommission";

    if (!commissionTotals[commission]) {
      commissionTotals[commission] = 0;
    }

    commissionTotals[commission] +=
      getHours(entry);
  });

  evaluationCommissions.className =
    "entries-list";

  Object.keys(commissionTotals)
    .sort()
    .forEach(function(commission) {
      const entryElement =
        document.createElement("div");

      entryElement.className = "entry";

      const content =
        document.createElement("div");

      const title =
        document.createElement("strong");

      title.textContent =
        commission;

      const hours =
        document.createElement("div");

      hours.textContent =
        formatHours(
          commissionTotals[commission]
        );

      content.appendChild(title);
      content.appendChild(hours);

      entryElement.appendChild(content);

      evaluationCommissions.appendChild(
        entryElement
      );
    });
}

function showRecording() {
  recordingSection.style.display = "";
  todaySection.style.display = "";
  evaluationSection.style.display = "none";

  navRecording.classList.add("active");
  navEvaluation.classList.remove("active");
}

function showEvaluation() {
  recordingSection.style.display = "none";
  todaySection.style.display = "none";
  evaluationSection.style.display = "";

  navRecording.classList.remove("active");
  navEvaluation.classList.add("active");

  renderEvaluation();
}

addEntryButton.addEventListener(
  "click",
  function() {
    const enteredValue =
      hoursInput.value
        .trim()
        .replace(",", ".");

    const hours =
      Number(enteredValue);

    if (
      enteredValue === "" ||
      !Number.isFinite(hours) ||
      hours <= 0
    ) {
      alert(
        "Bitte gib eine gültige Stundenzahl ein."
      );

      hoursInput.focus();

      return;
    }

    const entry = {
      hours: hours.toLocaleString(
        "de-CH",
        {
          maximumFractionDigits: 2
        }
      ),

      commission:
        commissionInput.value,

      activity:
        activityInput.value.trim(),

      date:
        new Date().toISOString()
    };

    timeEntries.push(entry);

    saveEntries();

    renderEntries();
    renderEvaluation();

    hoursInput.value = "";
    activityInput.value = "";

    hoursInput.focus();
  }
);

navRecording.addEventListener(
  "click",
  function() {
    showRecording();
  }
);

navEvaluation.addEventListener(
  "click",
  function() {
    showEvaluation();
  }
);

renderEntries();
renderEvaluation();
showRecording();
