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

const commissionList =
  document.getElementById(
    "commissionList"
  );


const ENTRIES_STORAGE_KEY =
  "zeitpol_entries";

const COMMISSIONS_STORAGE_KEY =
  "zeitpol_commissions";


let timeEntries = [];

let commissions = [];


try {
  const savedEntries =
    localStorage.getItem(
      ENTRIES_STORAGE_KEY
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
      COMMISSIONS_STORAGE_KEY
    );

  if (savedCommissions) {
    commissions =
      JSON.parse(savedCommissions);
  }
} catch (error) {
  commissions = [];
}


/*
  Falls noch keine Kommissionen
  gespeichert sind, legen wir die
  bisherigen drei als Startwerte an.
*/

if (commissions.length === 0) {

  commissions = [
    "Kommission 001",
    "Kommission 002",
    "Kommission 003"
  ];

  saveCommissions();
}


function saveEntries() {

  localStorage.setItem(
    ENTRIES_STORAGE_KEY,
    JSON.stringify(timeEntries)
  );

}


function saveCommissions() {

  localStorage.setItem(
    COMMISSIONS_STORAGE_KEY,
    JSON.stringify(commissions)
  );

}


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

  const start =
    new Date(date);

  start.setDate(1);

  start.setHours(
    0,
    0,
    0,
    0
  );

  return start;

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


function calculateTotal(entries) {

  let total = 0;

  entries.forEach(
    function(entry) {

      total +=
        getHours(entry);

    }
  );

  return total;

}


/*
  Kommissions-Auswahl bei
  der Zeiterfassung aufbauen.
*/

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


/*
  Kommissionsverwaltung anzeigen.
*/

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

      const entry =
        document.createElement(
          "div"
        );

      entry.className =
        "entry";


      const content =
        document.createElement(
          "div"
        );


      const title =
        document.createElement(
          "strong"
        );

      title.textContent =
        commission;


      content.appendChild(
        title
      );


      const actions =
        document.createElement(
          "div"
        );

      actions.style.marginTop =
        "8px";


      const renameButton =
        document.createElement(
          "button"
        );

      renameButton.type =
        "button";

      renameButton.textContent =
        "✏️ Umbenennen";


      renameButton.addEventListener(
        "click",
        function() {

          renameCommission(
            index
          );

        }
      );


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


      content.appendChild(
        actions
      );

      entry.appendChild(
        content
      );

      commissionList.appendChild(
        entry
      );

    }
  );

}


/*
  Neue Kommission hinzufügen.
*/

function addCommission() {

  const name =
    prompt(
      "Name der neuen Kommission:"
    );


  if (name === null) {
    return;
  }


  const trimmedName =
    name.trim();


  if (trimmedName === "") {

    alert(
      "Bitte gib einen Namen ein."
    );

    return;

  }


  const alreadyExists =
    commissions.some(
      function(commission) {

        return (
          commission.toLowerCase() ===
          trimmedName.toLowerCase()
        );

      }
    );


  if (alreadyExists) {

    alert(
      "Diese Kommission gibt es bereits."
    );

    return;

  }


  commissions.push(
    trimmedName
  );

  saveCommissions();

  renderCommissionSelect();

  renderCommissionList();

}


/*
  Kommission umbenennen.
*/

function renameCommission(index) {

  const oldName =
    commissions[index];


  const newName =
    prompt(
      "Neuer Name:",
      oldName
    );


  if (newName === null) {
    return;
  }


  const trimmedName =
    newName.trim();


  if (trimmedName === "") {

    alert(
      "Bitte gib einen Namen ein."
    );

    return;

  }


  const alreadyExists =
    commissions.some(
      function(commission, i) {

        return (
          i !== index &&
          commission.toLowerCase() ===
          trimmedName.toLowerCase()
        );

      }
    );


  if (alreadyExists) {

    alert(
      "Diese Kommission gibt es bereits."
    );

    return;

  }


  /*
    Auch bestehende Zeiteinträge
    bekommen den neuen Namen.
  */

  timeEntries.forEach(
    function(entry) {

      if (
        entry.commission ===
        oldName
      ) {

        entry.commission =
          trimmedName;

      }

    }
  );


  commissions[index] =
    trimmedName;


  saveCommissions();

  saveEntries();

  renderCommissionSelect();

  renderCommissionList();

  renderEntries();

  renderEvaluation();

}


/*
  Kommission löschen.
*/

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


  if (used) {

    const confirmed =
      confirm(
        "Diese Kommission wird bereits in Zeiteinträgen verwendet. Soll sie trotzdem gelöscht werden?"
      );


    if (!confirmed) {
      return;
    }

  } else {

    const confirmed =
      confirm(
        "Möchtest du diese Kommission wirklich löschen?"
      );


    if (!confirmed) {
      return;
    }

  }


  commissions.splice(
    index,
    1
  );


  saveCommissions();

  renderCommissionSelect();

  renderCommissionList();

}


/*
  Zeiteinträge für heute anzeigen.
*/

function renderEntries() {

  entriesContainer.innerHTML = "";


  const today =
    new Date();


  const todayEntries =
    timeEntries.filter(
      function(entry) {

        const entryDate =
          getEntryDate(entry);


        if (!entryDate) {
          return false;
        }


        return isSameDay(
          entryDate,
          today
        );

      }
    );


  if (
    todayEntries.length ===
    0
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

        const entryElement =
          document.createElement(
            "div"
          );

        entryElement.className =
          "entry";


        const content =
          document.createElement(
            "div"
          );


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


        content.appendChild(
          hours
        );

        content.appendChild(
          commission
        );

        content.appendChild(
          activity
        );


        entryElement.appendChild(
          content
        );


        entriesContainer.appendChild(
          entryElement
        );

      }
    );

  }


  if (
    todayEntries.length ===
    1
  ) {

    entryCount.textContent =
      "1 Eintrag";

  } else {

    entryCount.textContent =
      todayEntries.length +
      " Einträge";

  }


  const todayTotal =
    calculateTotal(
      todayEntries
    );


  totalHours.textContent =
    formatHours(
      todayTotal
    );

}


/*
  Auswertung berechnen.
*/

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

        const entryDate =
          getEntryDate(entry);


        if (!entryDate) {
          return false;
        }


        return isSameDay(
          entryDate,
          now
        );

      }
    );


  const weekEntries =
    timeEntries.filter(
      function(entry) {

        const entryDate =
          getEntryDate(entry);


        if (!entryDate) {
          return false;
        }


        return (
          entryDate >=
          startOfWeek
        );

      }
    );


  const monthEntries =
    timeEntries.filter(
      function(entry) {

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


  renderCommissionEvaluation();

}


/*
  Auswertung nach Kommission.
*/

function renderCommissionEvaluation() {

  evaluationCommissions.innerHTML = "";


  if (
    timeEntries.length ===
    0
  ) {

    evaluationCommissions.className =
      "empty-state";

    evaluationCommissions.textContent =
      "Noch keine Einträge vorhanden.";

    return;

  }


  const commissionTotals = {};


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

        const entryElement =
          document.createElement(
            "div"
          );

        entryElement.className =
          "entry";


        const content =
          document.createElement(
            "div"
          );


        const title =
          document.createElement(
            "strong"
          );

        title.textContent =
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
          title
        );

        content.appendChild(
          hours
        );


        entryElement.appendChild(
          content
        );


        evaluationCommissions.appendChild(
          entryElement
        );

      }
    );

}


/*
  Erfassungsseite anzeigen.
*/

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


/*
  Auswertung anzeigen.
*/

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


/*
  Kommissionsseite anzeigen.
*/

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


/*
  Stunden erfassen.
*/

addEntryButton.addEventListener(
  "click",
  function() {

    const enteredValue =
      hoursInput.value
        .trim()
        .replace(",", ".");


    const hours =
      Number(
        enteredValue
      );


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


    hoursInput.value = "";

    activityInput.value = "";

    hoursInput.focus();

  }
);


/*
  Navigation.
*/

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


/*
  Neue Kommission.
*/

addCommissionButton.addEventListener(
  "click",
  function() {

    addCommission();

  }
);


/*
  Startzustand.
*/

renderCommissionSelect();

renderCommissionList();

renderEntries();

renderEvaluation();

showRecording();
