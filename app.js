const hoursInput = document.querySelector("#hours");
const commissionInput = document.querySelector("#commission");
const activityInput = document.querySelector("#activity");
const button = document.querySelector("#addEntry");
const entries = document.querySelector("#entries");
const entryCount = document.querySelector("#entryCount");
const totalHours = document.querySelector("#totalHours");

const STORAGE_KEY = "zeitpol_entries";

let timeEntries = JSON.parse(
localStorage.getItem(STORAGE_KEY) || "[]"
);

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

if (timeEntries.length === 0) {

entries.className = "empty-state";

entries.textContent =
  "Noch keine Einträge vorhanden.";

} else {

entries.className = "entries-list";

entries.innerHTML = timeEntries
  .map((entry) => {

    return `
      <div class="entry">

        <div>

          <strong>
            ${entry.hours} Std.
          </strong>

          <div>
            ${entry.commission}
          </div>

          <small>
            ${entry.activity || "Keine Tätigkeit angegeben"}
          </small>

        </div>

      </div>
    `;

  })
  .join("");

}

entryCount.textContent =
${timeEntries.length} ${ timeEntries.length === 1 ? "Eintrag" : "Einträge" };

const total = timeEntries.reduce(
(sum, entry) => {
return sum + getHours(entry);
},
0
);

totalHours.textContent =
${total.toLocaleString("de-CH", { maximumFractionDigits: 2 })} Stunden;
}

button.addEventListener("click", function () {

const value =
hoursInput.value
.trim()
.replace(",", ".");

const hours = Number(value);

if (
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

hoursInput.value = "";

activityInput.value = "";

hoursInput.focus();
});

renderEntries();
