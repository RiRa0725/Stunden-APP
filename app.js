const hoursInput = document.getElementById("hours");
const commissionInput = document.getElementById("commission");
const activityInput = document.getElementById("activity");
const addEntryButton = document.getElementById("addEntry");

const entriesContainer =
  document.getElementById("entries");

const entryCount =
  document.getElementById("entryCount");

const totalHours =
  document.getElementById("totalHours");

const recordingSection =
  document.getElementById("recordingSection");

const todaySection =
  document.getElementById("todaySection");

const evaluationSection =
  document.getElementById("evaluationSection");

const commissionSection =
  document.getElementById("commissionSection");

const navRecording =
  document.getElementById("navRecording");

const navEvaluation =
  document.getElementById("navEvaluation");

const navCommissions =
  document.getElementById("navCommissions");

const evaluationToday =
  document.getElementById("evaluationToday");

const evaluationWeek =
  document.getElementById("evaluationWeek");

const evaluationMonth =
  document.getElementById("evaluationMonth");

const evaluationCommissions =
  document.getElementById(
    "evaluationCommissions"
  );

const addCommissionButton =
  document.getElementById(
    "addCommission"
  );

const newCommissionInput =
  document.getElementById(
    "newCommission"
  );

const commissionList =
  document.getElementById(
    "commissionList"
  );


const ENTRIES_KEY =
  "zeitpol_entries";

const COMMISSIONS_KEY =
  "zeitpol_commissions";


let timeEntries = [];
let commissions = [];


/* =========================
   DATEN LADEN
========================= */

try {
  const savedEntries =
    localStorage.getItem(
      ENTRIES_KEY
    );

  if (savedEntries) {
    timeEntries =
      JSON.parse(savedEntries);
  }
} catch (error) {
  timeEntries = [];
}


try {
  const savedCommissions =
    localStorage.getItem(
      COMMISSIONS_KEY
    );

  if (savedCommissions) {
    commissions =
      JSON.parse(savedCommissions);
  }
} catch (error) {
  commissions = [];
}


/*
  Standard-Kommissionen nur anlegen,
  wenn noch keine vorhanden sind.
*/

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
    String(entry.hours)
      .replace(",", ".")
  ) || 0;

}


function getEntryDate(entry) {

  if (!entry.date) {
    return null;
  }

  const date =
    new Date(entry.date);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;

}


function isSameDay(
  date1,
  date2
) {

  return (
    date1.getFullYear() ===
      date2.getFullYear() &&

    date1.getMonth() ===
      date2.getMonth() &&

    date1.getDate() ===
      date2.getDate()
  );

}


function getStartOfWeek(date) {

  const start =
    new Date(date);

  const day =
    start.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  start.setDate(
    start.getDate() +
      difference
  );

  start.setHours(
    0,
    0,
    0,
    0
  );

  return start;

}


function getStartOfMonth(date) {

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    0,
    0,
    0,
    0
  );

}


function formatHours(hours) {

  return (
    hours.toLocaleString(
      "de-CH",
      {
        maximumFractionDigits: 2
      }
    ) +
    " Stunden"
  );

}


/* =========================
   KOMMISSIONS-AUSWAHL
========================= */

function renderCommissionSelect() {

  commissionInput.innerHTML = "";


  if (commissions.length === 0) {

    const option =
      document.createElement(
        "option"
      );

    option.value = "";

    option.textContent =
      "Keine Kommission vorhanden";

    commissionInput.appendChild(
      option
    );

    return;
  }


  commissions.forEach(
    function(commission) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        commission;

      option.textContent =
        commission;

      commissionInput.appendChild(
        option
      );

    }
  );

}


/* =========================
   KOMMISSIONEN ANZEIGEN
========================= */

function renderCommissionList() {

  commissionList.innerHTML = "";


  if (commissions.length === 0) {

    commissionList.className =
      "empty-state";

    commissionList.textContent =
      "Noch keine Kommissionen vorhanden.";

    return;
  }


  commissionList.className =
    "entries-list";


  commissions.forEach(
    function(commission, index) {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "entry";


      const name =
        document.createElement(
          "strong"
        );

      name.textContent =
        commission;


      const actions =
        document.createElement(
          "div"
        );

      actions.style.marginTop =
        "10px";


      const renameButton =
        document.createElement(
          "button"
        );

      renameButton.type =
        "button";

      renameButton.textContent =
        "✏️ Umbenennen";


      const deleteButton =
        document.createElement(
          "button"
        );

      deleteButton.type =
        "button";

      deleteButton.textContent =
        "🗑️ Löschen";

      deleteButton.style.marginLeft =
        "8px";


      renameButton.addEventListener(
        "click",
        function() {

          showRenameForm(
            item,
            commission,
            index
          );

        }
      );


      deleteButton.addEventListener(
        "click",
        function() {

          deleteCommission(
            index
          );

        }
      );


      actions.appendChild(
        renameButton
      );

      actions.appendChild(
        deleteButton
      );


      item.appendChild(
        name
      );

      item.appendChild(
        actions
      );


      commissionList.appendChild(
        item
      );

    }
  );

}


/* =========================
   NEUE KOMMISSION
========================= */

function addCommission() {

  const name =
    newCommissionInput.value.trim();


  if (name === "") {

    newCommissionInput.focus();

    return;
  }


  const exists =
    commissions.some(
      function(commission) {

        return (
          commission.toLowerCase() ===
          name.toLowerCase()
        );

      }
    );


  if (exists) {

    alert(
      "Diese Kommission gibt es bereits."
    );

    newCommissionInput.focus();

    return;
  }


  commissions.push(
    name
  );


  saveCommissions();

  renderCommissionSelect();

  renderCommissionList();


  newCommissionInput.value = "";

  newCommissionInput.focus();

}


/* =========================
   UMBENENNEN
========================= */

function showRenameForm(
  item,
  oldName,
  index
) {

  item.innerHTML = "";


  const input =
    document.createElement(
      "input"
    );

  input.type = "text";

  input.value =
    oldName;

  input.autocomplete =
    "off";


  const saveButton =
    document.createElement(
      "button"
    );

  saveButton.type =
    "button";

  saveButton.textContent =
    "Speichern";

  saveButton.style.marginTop =
    "8px";


  const cancelButton =
    document.createElement(
      "button"
    );

  cancelButton.type =
    "button";

  cancelButton.textContent =
    "Abbrechen";

  cancelButton.style.marginTop =
    "8px";

  cancelButton.style.marginLeft =
    "8px";


  saveButton.addEventListener(
    "click",
    function() {

      const newName =
        input.value.trim();


      if (newName === "") {

        input.focus();

        return;
      }


      const exists =
        commissions.some(
          function(commission, i) {

            return (
              i !== index &&
              commission.toLowerCase() ===
              newName.toLowerCase()
            );

          }
        );


      if (exists) {

        alert(
          "Diese Kommission gibt es bereits."
        );

        input.focus();

        return;
      }


      /*
        Bestehende Zeiteinträge
        ebenfalls umbenennen.
      */

      timeEntries.forEach(
        function(entry) {

          if (
            entry.commission ===
            oldName
          ) {

            entry.commission =
              newName;

          }

        }
      );


      commissions[index] =
        newName;


      saveCommissions();
      saveEntries();


      renderCommissionSelect();
      renderCommissionList();
      renderEntries();
      renderEvaluation();

    }
  );


  cancelButton.addEventListener(
    "click",
    function() {

      renderCommissionList();

    }
  );


  item.appendChild(
    input
  );

  item.appendChild(
    document.createElement("br")
  );

  item.appendChild(
    saveButton
  );

  item.appendChild(
    cancelButton
  );


  input.focus();

}


/* =========================
   LÖSCHEN
========================= */

function deleteCommission(index) {

  const commission =
    commissions[index];


  const used =
    timeEntries.some(
      function(entry) {

        return (
          entry.commission ===
          commission
        );

      }
    );


  let message =
    "Möchtest du diese Kommission wirklich löschen?";


  if (used) {

    message =
      "Diese Kommission wird bereits bei Zeiteinträgen verwendet. Trotzdem löschen?";

  }


  const confirmed =
    confirm(
      message
    );


  if (!confirmed) {
    return;
  }


  commissions.splice(
    index,
    1
  );


  saveCommissions();

  renderCommissionSelect();

  renderCommissionList();

}


/* =========================
   HEUTIGE EINTRÄGE
========================= */

function renderEntries() {

  entriesContainer.innerHTML =
    "";


  const today =
    new Date();


  const todayEntries =
    timeEntries.filter(
      function(entry) {

        const date =
          getEntryDate(entry);


        if (!date) {
          return false;
        }


        return isSameDay(
          date,
          today
        );

      }
    );


  if (
    todayEntries.length === 0
  ) {

    entriesContainer.className =
      "empty-state";

    entriesContainer.textContent =
      "Noch keine Einträge vorhanden.";

  } else {

    entriesContainer.className =
      "entries-list";


    todayEntries.forEach(
      function(entry) {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "entry";


        const hours =
          document.createElement(
            "strong"
          );

        hours.textContent =
          entry.hours +
          " Std.";


        const commission =
          document.createElement(
            "div"
          );

        commission.textContent =
          entry.commission;


        const activity =
          document.createElement(
            "small"
          );

        activity.textContent =
          entry.activity ||
          "Keine Tätigkeit angegeben";


        item.appendChild(
          hours
        );

        item.appendChild(
          commission
        );

        item.appendChild(
          activity
        );


        entriesContainer.appendChild(
          item
        );

      }
    );

  }


  entryCount.textContent =
    todayEntries.length === 1
      ? "1 Eintrag"
      : todayEntries.length +
        " Einträge";


  let total =
    0;


  todayEntries.forEach(
    function(entry) {

      total +=
        getHours(entry);

    }
  );


  totalHours.textContent =
    formatHours(
      total
    );

}


/* =========================
   AUSWERTUNG
========================= */

function renderEvaluation() {

  const now =
    new Date();


  const startOfWeek =
    getStartOfWeek(
      now
    );


  const startOfMonth =
    getStartOfMonth(
      now
    );


  const todayEntries =
    timeEntries.filter(
      function(entry) {

        const date =
          getEntryDate(entry);


        return (
          date &&
          isSameDay(
            date,
            now
          )
        );

      }
    );


  const weekEntries =
    timeEntries.filter(
      function(entry) {

        const date =
          getEntryDate(entry);


        return (
          date &&
          date >= startOfWeek
        );

      }
    );


  const monthEntries =
    timeEntries.filter(
      function(entry) {

        const date =
          getEntryDate(entry);


        return (
          date &&
          date.getFullYear() ===
            now.getFullYear() &&
          date.getMonth() ===
            now.getMonth()
        );

      }
    );


  evaluationToday.textContent =
    formatHours(
      calculateTotal(
        todayEntries
      )
    );


  evaluationWeek.textContent =
    formatHours(
      calculateTotal(
        weekEntries
      )
    );


  evaluationMonth.textContent =
    formatHours(
      calculateTotal(
        monthEntries
      )
    );


  /*
    HIER:
    Stunden pro Kommission
    werden über ALLE gespeicherten
    Einträge kumuliert.
  */

  renderCommissionEvaluation();

}


function calculateTotal(entries) {

  let total =
    0;


  entries.forEach(
    function(entry) {

      total +=
        getHours(entry);

    }
  );


  return total;

}


/* =========================
   AUSWERTUNG PRO KOMMISSION
   KUMULIERT
========================= */

function renderCommissionEvaluation() {

  evaluationCommissions.innerHTML =
    "";


  if (
    timeEntries.length === 0
  ) {

    evaluationCommissions.className =
      "empty-state";

    evaluationCommissions.textContent =
      "Noch keine Einträge vorhanden.";

    return;
  }


  const commissionTotals =
    {};


  /*
    Jede gespeicherte Stunde
    wird der jeweiligen
    Kommission zugerechnet.
  */

  timeEntries.forEach(
    function(entry) {

      const commission =
        entry.commission ||
        "Ohne Kommission";


      if (
        !commissionTotals[
          commission
        ]
      ) {

        commissionTotals[
          commission
        ] = 0;

      }


      commissionTotals[
        commission
      ] += getHours(entry);

    }
  );


  evaluationCommissions.className =
    "entries-list";


  Object.keys(
    commissionTotals
  )
    .sort()
    .forEach(
      function(commission) {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "entry";


        const content =
          document.createElement(
            "div"
          );


        const name =
          document.createElement(
            "strong"
          );

        name.textContent =
          commission;


        const hours =
          document.createElement(
            "div"
          );

        hours.textContent =
          formatHours(
            commissionTotals[
              commission
            ]
          );


        content.appendChild(
          name
        );

        content.appendChild(
          hours
        );


        item.appendChild(
          content
        );


        evaluationCommissions.appendChild(
          item
        );

      }
    );

}


/* =========================
   SEITENWECHSEL
========================= */

function showRecording() {

  recordingSection.style.display =
    "";

  todaySection.style.display =
    "";

  evaluationSection.style.display =
    "none";

  commissionSection.style.display =
    "none";


  navRecording.classList.add(
    "active"
  );

  navEvaluation.classList.remove(
    "active"
  );

  navCommissions.classList.remove(
    "active"
  );

}


function showEvaluation() {

  recordingSection.style.display =
    "none";

  todaySection.style.display =
    "none";

  evaluationSection.style.display =
    "";

  commissionSection.style.display =
    "none";


  navRecording.classList.remove(
    "active"
  );

  navEvaluation.classList.add(
    "active"
  );

  navCommissions.classList.remove(
    "active"
  );


  renderEvaluation();

}


function showCommissions() {

  recordingSection.style.display =
    "none";

  todaySection.style.display =
    "none";

  evaluationSection.style.display =
    "none";

  commissionSection.style.display =
    "";


  navRecording.classList.remove(
    "active"
  );

  navEvaluation.classList.remove(
    "active"
  );

  navCommissions.classList.add(
    "active"
  );


  renderCommissionList();

}


/* =========================
   STUNDEN ERFASSEN
========================= */

addEntryButton.addEventListener(
  "click",
  function() {

    const value =
      hoursInput.value
        .trim()
        .replace(",", ".");


    const hours =
      Number(value);


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


    if (
      commissions.length === 0
    ) {

      alert(
        "Bitte lege zuerst eine Kommission an."
      );

      return;
    }


    const entry = {

      hours:
        hours.toLocaleString(
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


    timeEntries.push(
      entry
    );


    saveEntries();

    renderEntries();

    renderEvaluation();


    hoursInput.value =
      "";

    activityInput.value =
      "";

    hoursInput.focus();

  }
);


/* =========================
   NAVIGATION
========================= */

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


navCommissions.addEventListener(
  "click",
  function() {

    showCommissions();

  }
);


/* =========================
   NEUE KOMMISSION
========================= */

addCommissionButton.addEventListener(
  "click",
  function() {

    addCommission();

  }
);


/* Enter im Kommissionsfeld */

newCommissionInput.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      addCommission();

    }

  }
);


/* =========================
   START
========================= */

renderCommissionSelect();

renderCommissionList();

renderEntries();

renderEvaluation();

showRecording();
