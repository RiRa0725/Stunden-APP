const hoursInput = document.querySelector("#hours");
const commissionInput = document.querySelector("#commission");
const activityInput = document.querySelector("#activity");
const button = document.querySelector("#addEntry");
const entries = document.querySelector("#entries");
const entryCount = document.querySelector("#entryCount");

let timeEntries = [];

function renderEntries() {
if (timeEntries.length === 0) {
entries.className = "empty-state";
entries.textContent = "Noch keine Einträge vorhanden.";
} else {
entries.className = "entries-list";

```
entries.innerHTML = timeEntries.map((entry) => `
  <div class="entry">
    <div>
      <strong>${entry.hours} Std.</strong>
      <div>${entry.commission}</div>
      <small>${entry.activity || "Keine Tätigkeit angegeben"}</small>
    </div>
  </div>
`).join("");
```

}

entryCount.textContent =
`${timeEntries.length} ${timeEntries.length === 1 ? "Eintrag" : "Einträge"}`;
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
activity: activityInput.value.trim()
};

timeEntries.push(entry);

renderEntries();

hoursInput.value = "";
activityInput.value = "";
hoursInput.focus();
});

renderEntries();
