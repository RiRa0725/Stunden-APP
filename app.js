const hoursInput = document.querySelector("#hours");
const commissionInput = document.querySelector("#commission");
const activityInput = document.querySelector("#activity");
const button = document.querySelector("#addEntry");
const entries = document.querySelector("#entries");
const entryCount = document.querySelector("#entryCount");

const STORAGE_KEY = "zeitpol_entries";

let timeEntries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveEntries() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(timeEntries));
}

function getTodayEntries() {
const today = new Date().toDateString();

return timeEntries.filter((entry) => {
return new Date(entry.date).toDateString() === today;
});
}

function renderEntries() {
const todayEntries = getTodayEntries();

if (todayEntries.length === 0) {
entries.className = "empty-state";
entries.textContent = "Noch keine Einträge vorhanden.";
} else {
entries.className = "entries-list";

entries.innerHTML = todayEntries.map((entry) => `
  <div class="entry">
    <div>
      <strong>${entry.hours} Std.</strong>
      <div>${entry.commission}</div>
      <small>${entry.activity || "Keine Tätigkeit angegeben"}</small>
    </div>
  </div>
`).join("");

}

entryCount.textContent =
`${todayEntries.length} ${todayEntries.length === 1 ? "Eintrag" : "Einträge"}`;
}

function renderTotalHours() {
const todayEntries = getTodayEntries();

const total = todayEntries.reduce((sum, entry) => {
return sum + Number(String(entry.hours).replace(",", "."));
}, 0);

const totalElement = document.querySelector("#totalHours");

if (totalElement) {
totalElement.textContent =
`${total.toLocaleString("de-CH", {
        maximumFractionDigits: 2
      })} Stunden`;
}
}

button.addEventListener("click", () => {
const value = hoursInput.value.trim().replace(",", ".");
const hours = Number(value);

if (!Number.isFinite(hours) || hours <= 0) {
alert("Bitte gib eine gültige Stundenzahl ein.");
hoursInput.focus();
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
renderTotalHours();

hoursInput.value = "";
activityInput.value = "";
hoursInput.focus();
});

renderEntries();
renderTotalHours();
