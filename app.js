const hoursInput = document.getElementById("hours");
const commissionInput = document.getElementById("commission");
const activityInput = document.getElementById("activity");
const addEntryButton = document.getElementById("addEntry");
const entriesContainer = document.getElementById("entries");
const entryCount = document.getElementById("entryCount");
const totalHours = document.getElementById("totalHours");

const STORAGE_KEY = "zeitpol_entries";

let timeEntries = [];

try {
  const savedEntries = localStorage.getItem(STORAGE_KEY);

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

function renderEntries() {
  entriesContainer.innerHTML = "";

  if (timeEntries.length === 0) {
    entriesContainer.className = "empty-state";
    entriesContainer.textContent =
      "Noch keine Einträge vorhanden.";
  } else {
    entriesContainer.className = "entries-list";

    timeEntries.forEach(function(entry) {
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

      entriesContainer.appendChild(entryElement);
    });
  }

  if (timeEntries.length === 1) {
    entryCount.textContent = "1 Eintrag";
  } else {
    entryCount.textContent =
      timeEntries.length + " Einträge";
  }

  let total = 0;

  timeEntries.forEach(function(entry) {
    total += getHours(entry);
  });

  totalHours.textContent =
    total.toLocaleString("de-CH", {
      maximumFractionDigits: 2
    }) + " Stunden";
}

addEntryButton.addEventListener("click", function() {
  const enteredValue =
    hoursInput.value
      .trim()
      .replace(",", ".");

  const hours = Number(enteredValue);

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
    hours: hours.toLocaleString("de-CH", {
      maximumFractionDigits: 2
    }),

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

  hoursInput.value = "";
  activityInput.value = "";

  hoursInput.focus();
});

renderEntries();
