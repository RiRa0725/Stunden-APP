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
const value = String(entry.hours)
.replace(",", ".")
.trim();

const number = Number(value);

if (Number.isFinite(number)) {
return number;
}

return 0;
}

function renderEntries() {
if (timeEntries.length === 0) {
entriesContainer.className = "empty-state";
entriesContainer.textContent =
"Noch keine Einträge vorhanden.";
} else {
entriesContainer.className = "entries-list";
entriesContainer.innerHTML = "";
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

addEntryButton.addEventListener(
"click",
function() {
  }
);

renderEntries();
