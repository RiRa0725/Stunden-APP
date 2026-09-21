const entryDateInput =
  document.getElementById("entryDate");

const hoursInput =
  document.getElementById("hours");

const commissionInput =
  document.getElementById("commission");

const activityInput =
  document.getElementById("activity");

const addEntryButton =
  document.getElementById("addEntry");

const recordingSection =
  document.getElementById("recordingSection");

const evaluationSection =
  document.getElementById("evaluationSection");

const commissionSection =
  document.getElementById("commissionSection");

const settingsSection =
  document.getElementById("settingsSection");

const settingsButton =
  document.getElementById("settingsButton");

const navRecording =
  document.getElementById("navRecording");

const navEvaluation =
  document.getElementById("navEvaluation");

const navCommissions =
  document.getElementById("navCommissions");

const evaluationWeek =
  document.getElementById("evaluationWeek");

const evaluationMonth =
  document.getElementById("evaluationMonth");

const evaluationCommissions =
  document.getElementById(
    "evaluationCommissions"
  );

const commissionDetails =
  document.getElementById(
    "commissionDetails"
  );

const commissionDetailsTitle =
  document.getElementById(
    "commissionDetailsTitle"
  );

const commissionDetailsList =
  document.getElementById(
    "commissionDetailsList"
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

const exportDetails =
  document.getElementById(
    "exportDetails"
  );

const exportExcelButton =
  document.getElementById(
    "exportExcel"
  );

const resetExportFilterButton =
  document.getElementById(
    "resetExportFilter"
  );

const exportFromInput =
  document.getElementById(
    "exportFrom"
  );

const exportToInput =
  document.getElementById(
    "exportTo"
  );

const userNameInput =
  document.getElementById(
    "userName"
  );

const saveUserNameButton =
  document.getElementById(
    "saveUserName"
  );

const userNameStatus =
  document.getElementById(
    "userNameStatus"
  );

const userNameDisplay =
  document.getElementById(
    "userNameDisplay"
  );


const ENTRIES_KEY =
  "zeitpol_entries";

const COMMISSIONS_KEY =
  "zeitpol_commissions";

const USER_NAME_KEY =
  "zeitpol_user_name";


let timeEntries = [];

let commissions = [];

let selectedCommission = null;


/* =========================
   DATUM
========================= */

function getTodayString() {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );

  return (
    year +
    "-" +
    month +
    "-" +
    day
  );

}


function setDefaultEntryDate() {

  const today =
    getTodayString();

  entryDateInput.value =
    today;

  entryDateInput.max =
    today;

}


function formatDate(
  date
) {

  return date.toLocaleDateString(
    "de-CH",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );

}


function parseDateString(
  value
) {

  if (
    !value ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {

    return null;

  }


  const parts =
    value.split("-");


  return new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
    12,
    0,
    0,
    0
  );

}


/* =========================
   DATEN LADEN
========================= */

try {

  const savedEntries =
    localStorage.getItem(
      ENTRIES_KEY
    );


  if (savedEntries) {

    const parsedEntries =
      JSON.parse(
        savedEntries
      );


    if (
      Array.isArray(
        parsedEntries
      )
    ) {

      timeEntries =
        parsedEntries;

    }

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

    const parsedCommissions =
      JSON.parse(
        savedCommissions
      );


    if (
      Array.isArray(
        parsedCommissions
      )
    ) {

      commissions =
        parsedCommissions;

    }

  }

} catch (error) {

  commissions = [];

}


/* =========================
   BENUTZERNAME LADEN
========================= */

const savedUserName =
  localStorage.getItem(
    USER_NAME_KEY
  );


if (savedUserName) {

  userNameInput.value =
    savedUserName;

}


/* =========================
   STANDARD-KOMMISSIONEN
========================= */

if (
  commissions.length === 0
) {

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
    JSON.stringify(
      timeEntries
    )
  );

}


function saveCommissions() {

  localStorage.setItem(
    COMMISSIONS_KEY,
    JSON.stringify(
      commissions
    )
  );

}


/* =========================
   HILFSFUNKTIONEN
========================= */

function getHours(
  entry
) {

  return Number(
    String(
      entry.hours
    ).replace(
      ",",
      "."
    )
  ) || 0;

}


function getEntryDate(
  entry
) {

  if (
    !entry ||
    !entry.date
  ) {

    return null;

  }


  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      entry.date
    )
  ) {

    return parseDateString(
      entry.date
    );

  }


  const date =
    new Date(
      entry.date
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return date;

}


function getStartOfWeek(
  date
) {

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


function getStartOfMonth(
  date
) {

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


function formatHours(
  hours
) {

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


function calculateTotal(
  entries
) {

  let total =
    0;


  entries.forEach(
    function(entry) {

      total +=
        getHours(
          entry
        );

    }
  );


  return total;

}


/* =========================
   KOMMISSIONS-AUSWAHL
========================= */

function renderCommissionSelect() {

  commissionInput.innerHTML =
    "";


  if (
    commissions.length === 0
  ) {

    const option =
      document.createElement(
        "option"
      );


    option.value =
      "";


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
   KOMMISSIONEN VERWALTEN
========================= */

function renderCommissionList() {

  commissionList.innerHTML =
    "";


  if (
    commissions.length === 0
  ) {

    commissionList.className =
      "empty-state";


    commissionList.textContent =
      "Noch keine Kommissionen vorhanden.";


    return;

  }


  commissionList.className =
    "entries-list";


  commissions.forEach(
    function(
      commission,
      index
    ) {

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


      actions.className =
        "entry-actions";


      const renameButton =
        document.createElement(
          "button"
        );


      renameButton.type =
        "button";


      renameButton.className =
        "small-button";


      renameButton.textContent =
        "✏️ Umbenennen";


      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.type =
        "button";


      deleteButton.className =
        "small-button danger-button";


      deleteButton.textContent =
        "🗑️ Löschen";


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


  if (
    name === ""
  ) {

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


  newCommissionInput.value =
    "";


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

  item.innerHTML =
    "";


  const input =
    document.createElement(
      "input"
    );


  input.type =
    "text";


  input.value =
    oldName;


  input.autocomplete =
    "off";


  const actions =
    document.createElement(
      "div"
    );


  actions.className =
    "entry-actions";


  const saveButton =
    document.createElement(
      "button"
    );


  saveButton.type =
    "button";


  saveButton.className =
    "small-button";


  saveButton.textContent =
    "Speichern";


  const cancelButton =
    document.createElement(
      "button"
    );


  cancelButton.type =
    "button";


  cancelButton.className =
    "small-button";


  cancelButton.textContent =
    "Abbrechen";


  saveButton.addEventListener(
    "click",
    function() {

      const newName =
        input.value.trim();


      if (
        newName === ""
      ) {

        input.focus();

        return;

      }


      const exists =
        commissions.some(
          function(
            commission,
            i
          ) {

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


      if (
        selectedCommission ===
        oldName
      ) {

        selectedCommission =
          newName;

      }


      saveCommissions();

      saveEntries();


      renderCommissionSelect();

      renderCommissionList();

      renderEvaluation();

    }
  );


  cancelButton.addEventListener(
    "click",
    function() {

      renderCommissionList();

    }
  );


  input.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        saveButton.click();

      }

    }
  );


  item.appendChild(
    input
  );


  item.appendChild(
    actions
  );


  actions.appendChild(
    saveButton
  );


  actions.appendChild(
    cancelButton
  );


  input.focus();

}


/* =========================
   LÖSCHEN
========================= */

function deleteCommission(
  index
) {

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


  if (
    used
  ) {

    message =
      "Diese Kommission wird bereits bei Zeiteinträgen verwendet. Die bisherigen Einträge bleiben erhalten. Trotzdem löschen?";

  }


  const confirmed =
    confirm(
      message
    );


  if (
    !confirmed
  ) {

    return;

  }


  commissions.splice(
    index,
    1
  );


  if (
    selectedCommission ===
    commission
  ) {

    selectedCommission =
      null;


    commissionDetails.style.display =
      "none";

  }


  saveCommissions();


  renderCommissionSelect();


  renderCommissionList();

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


  const weekEntries =
    timeEntries.filter(
      function(entry) {

        const date =
          getEntryDate(
            entry
          );


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
          getEntryDate(
            entry
          );


        return (
          date &&
          date.getFullYear() ===
            now.getFullYear() &&

          date.getMonth() ===
            now.getMonth()
        );

      }
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


/* =========================
   KOMMISSIONSAUSWERTUNG
========================= */

function renderCommissionEvaluation() {

  evaluationCommissions.innerHTML =
    "";


  const commissionTotals =
    {};


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
      ] += getHours(
        entry
      );

    }
  );


  if (
    Object.keys(
      commissionTotals
    ).length ===
    0
  ) {

    evaluationCommissions.className =
      "empty-state";


    evaluationCommissions.textContent =
      "Noch keine Einträge vorhanden.";


    commissionDetails.style.display =
      "none";


    return;

  }


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
          "commission-summary-item";


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


        hours.className =
          "commission-summary-hours";


        hours.textContent =
          formatHours(
            commissionTotals[
              commission
            ]
          );


        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "secondary-button";


        button.textContent =
          "Details anzeigen";


        button.addEventListener(
          "click",
          function() {

            showCommissionDetails(
              commission
            );

          }
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


        item.appendChild(
          button
        );


        evaluationCommissions.appendChild(
          item
        );

      }
    );


  if (
    selectedCommission &&
    commissionTotals[
      selectedCommission
    ] !== undefined
  ) {

    showCommissionDetails(
      selectedCommission
    );

  }

}


/* =========================
   KOMMISSIONSDETAILS
========================= */

function showCommissionDetails(
  commission
) {

  selectedCommission =
    commission;


  commissionDetailsTitle.textContent =
    commission;


  commissionDetailsList.innerHTML =
    "";


  const details =
    timeEntries
      .filter(
        function(entry) {

          return (
            entry.commission ===
            commission
          );

        }
      )
      .map(
        function(entry) {

          return {
            entry: entry,
            date: getEntryDate(
              entry
            )
          };

        }
      )
      .sort(
        function(a, b) {

          const dateA =
            a.date
              ? a.date.getTime()
              : 0;


          const dateB =
            b.date
              ? b.date.getTime()
              : 0;


          return (
            dateB -
            dateA
          );

        }
      );


  if (
    details.length ===
    0
  ) {

    commissionDetailsList.className =
      "empty-state";


    commissionDetailsList.textContent =
      "Keine Details vorhanden.";


    commissionDetails.style.display =
      "";


    return;

  }


  commissionDetailsList.className =
    "entries-list";


  details.forEach(
    function(detail) {

      const entry =
        detail.entry;


      const item =
        document.createElement(
          "div"
        );


      item.className =
        "entry";


      const date =
        document.createElement(
          "strong"
        );


      date.textContent =
        detail.date
          ? formatDate(
              detail.date
            )
          : "Datum unbekannt";


      const hours =
        document.createElement(
          "div"
        );


      hours.textContent =
        entry.hours +
        " Std.";


      const activity =
        document.createElement(
          "small"
        );


      activity.textContent =
        entry.activity ||
        "Keine Tätigkeit angegeben";


      item.appendChild(
        date
      );


      item.appendChild(
        hours
      );


      item.appendChild(
        activity
      );


      commissionDetailsList.appendChild(
        item
      );

    }
  );


  const detailEntries =
    details.map(
      function(detail) {

        return detail.entry;

      }
    );


  const detailTotal =
    calculateTotal(
      detailEntries
    );


  const totalItem =
    document.createElement(
      "div"
    );


  totalItem.className =
    "entry total-entry";


  const totalLabel =
    document.createElement(
      "strong"
    );


  totalLabel.textContent =
    "Gesamt";


  const totalValue =
    document.createElement(
      "div"
    );


  totalValue.textContent =
    formatHours(
      detailTotal
    );


  totalItem.appendChild(
    totalLabel
  );


  totalItem.appendChild(
    totalValue
  );


  commissionDetailsList.appendChild(
    totalItem
  );


  const closeButton =
    document.createElement(
      "button"
    );


  closeButton.type =
    "button";


  closeButton.className =
    "text-button";


  closeButton.textContent =
    "Details schließen";


  closeButton.style.marginTop =
    "12px";


  closeButton.addEventListener(
    "click",
    function() {

      selectedCommission =
        null;


      commissionDetails.style.display =
        "none";

    }
  );


  commissionDetailsList.appendChild(
    closeButton
  );


  commissionDetails.style.display =
    "";

}


/* =========================
   BENUTZERNAME
========================= */

function renderUserName() {

  const name =
    userNameInput.value.trim();


  userNameDisplay.textContent =
    name;

}


function saveUserName() {

  const name =
    userNameInput.value.trim();


  if (
    name === ""
  ) {

    userNameStatus.textContent =
      "Bitte gib einen Namen ein.";


    userNameInput.focus();


    return;

  }


  localStorage.setItem(
    USER_NAME_KEY,
    name
  );


  renderUserName();


  userNameStatus.textContent =
    "Name gespeichert.";

}


/* =========================
   EXPORT FILTER
========================= */

function resetExportFilter() {

  exportFromInput.value =
    "";

  exportToInput.value =
    "";

}


/* =========================
   EXCEL EXPORT
========================= */

function exportToExcel() {

  if (
    timeEntries.length ===
    0
  ) {

    alert(
      "Es sind noch keine Zeiteinträge vorhanden."
    );


    return;

  }


  const fromValue =
    exportFromInput.value.trim();


  const toValue =
    exportToInput.value.trim();


  if (
    fromValue &&
    toValue &&
    fromValue > toValue
  ) {

    alert(
      "Das Startdatum darf nicht nach dem Enddatum liegen."
    );


    return;

  }


  const filteredEntries =
    timeEntries.filter(
      function(entry) {

        const entryDate =
          getEntryDate(
            entry
          );


        if (
          !entryDate
        ) {

          return false;

        }


        const entryDateString =
          entryDate.getFullYear() +
          "-" +
          String(
            entryDate.getMonth() + 1
          ).padStart(
            2,
            "0"
          ) +
          "-" +
          String(
            entryDate.getDate()
          ).padStart(
            2,
            "0"
          );


        if (
          fromValue &&
          entryDateString < fromValue
        ) {

          return false;

        }


        if (
          toValue &&
          entryDateString > toValue
        ) {

          return false;

        }


        return true;

      }
    );


  if (
    filteredEntries.length ===
    0
  ) {

    alert(
      "Für den gewählten Zeitraum wurden keine Einträge gefunden."
    );


    return;

  }


  function escapeCSV(
    value
  ) {

    const text =
      String(
        value ?? ""
      );


    if (
      text.includes(";") ||
      text.includes('"') ||
      text.includes("\n") ||
      text.includes("\r")
    ) {

      return (
        '"' +
        text.replace(
          /"/g,
          '""'
        ) +
        '"'
      );

    }


    return text;

  }


  const sortedEntries =
    [...filteredEntries].sort(
      function(a, b) {

        const dateA =
          getEntryDate(a);

        const dateB =
          getEntryDate(b);


        const timeA =
          dateA
            ? dateA.getTime()
            : 0;


        const timeB =
          dateB
            ? dateB.getTime()
            : 0;


        return (
          timeB -
          timeA
        );

      }
    );


  const userName =
    userNameInput.value.trim();


  const rows =
    [];


  if (
    userName
  ) {

    rows.push(
      [
        "Mitarbeiter",
        userName
      ]
        .map(
          escapeCSV
        )
        .join(";")
    );

  }


  if (
    fromValue ||
    toValue
  ) {

    const fromText =
      fromValue
        ? formatDate(
            parseDateString(
              fromValue
            )
          )
        : "Anfang";


    const toText =
      toValue
        ? formatDate(
            parseDateString(
              toValue
            )
          )
        : "heute";


    rows.push(
      [
        "Zeitraum",
        fromText,
        "bis",
        toText
      ]
        .map(
          escapeCSV
        )
        .join(";")
    );

  }


  rows.push("");


  rows.push(
    [
      "Datum",
      "Kommission",
      "Tätigkeit",
      "Stunden"
    ]
      .map(
        escapeCSV
      )
      .join(";")
  );


  sortedEntries.forEach(
    function(entry) {

      const date =
        getEntryDate(
          entry
        );


      const dateText =
        date
          ? formatDate(
              date
            )
          : "";


      rows.push(
        [
          dateText,
          entry.commission || "",
          entry.activity || "",
          entry.hours || ""
        ]
          .map(
            escapeCSV
          )
          .join(";")
      );

    }
  );


  const total =
    calculateTotal(
      sortedEntries
    );


  rows.push("");


  rows.push(
    [
      "",
      "",
      "Gesamt",
      total.toLocaleString(
        "de-CH",
        {
          maximumFractionDigits: 2
        }
      )
    ]
      .map(
        escapeCSV
      )
      .join(";")
  );


  const csv =
    "\uFEFF" +
    rows.join(
      "\r\n"
    );


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  let filename =
    "Ravo_Export_" +
    getTodayString();


  if (
    fromValue &&
    toValue
  ) {

    filename =
      "Ravo_Export_" +
      fromValue +
      "_bis_" +
      toValue;

  } else if (
    fromValue
  ) {

    filename =
      "Ravo_Export_ab_" +
      fromValue;

  } else if (
    toValue
  ) {

    filename =
      "Ravo_Export_bis_" +
      toValue;

  }


  filename +=
    ".csv";


  const file =
    new File(
      [blob],
      filename,
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({
      files: [file]
    })
  ) {

    navigator.share(
      {
        title:
          "Ravo Export",

        text:
          "Zeiterfassung aus Ravo",

        files: [file]

      }
    ).catch(
      function(error) {

        if (
          error.name !==
          "AbortError"
        ) {

          downloadCSV(
            blob,
            filename
          );

        }

      }
    );


    return;

  }


  downloadCSV(
    blob,
    filename
  );

}


/* =========================
   DOWNLOAD
========================= */

function downloadCSV(
  blob,
  filename
) {

  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    filename;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  setTimeout(
    function() {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}


/* =========================
   SEITENWECHSEL
========================= */

function clearSections() {

  recordingSection.style.display =
    "none";

  evaluationSection.style.display =
    "none";

  commissionSection.style.display =
    "none";

  settingsSection.style.display =
    "none";

}


function clearNavActive() {

  navRecording.classList.remove(
    "active"
  );

  navEvaluation.classList.remove(
    "active"
  );

  navCommissions.classList.remove(
    "active"
  );

}


function showRecording() {

  clearSections();

  clearNavActive();


  recordingSection.style.display =
    "";


  navRecording.classList.add(
    "active"
  );

}


function showEvaluation() {

  clearSections();

  clearNavActive();


  evaluationSection.style.display =
    "";


  navEvaluation.classList.add(
    "active"
  );


  /*
    Export bei jedem Öffnen
    geschlossen starten.
  */

  exportDetails.open =
    false;


  commissionDetails.style.display =
    "none";


  selectedCommission =
    null;


  renderEvaluation();

}


function showCommissions() {

  clearSections();

  clearNavActive();


  commissionSection.style.display =
    "";


  navCommissions.classList.add(
    "active"
  );


  renderCommissionList();

}


function showSettings() {

  clearSections();

  clearNavActive();


  settingsSection.style.display =
    "";


  renderUserName();


  userNameInput.focus();

}


/* =========================
   STUNDEN ERFASSEN
========================= */

addEntryButton.addEventListener(
  "click",
  function() {

    const selectedDate =
      entryDateInput.value.trim();


    const value =
      hoursInput.value
        .trim()
        .replace(
          ",",
          "."
        );


    const hours =
      Number(
        value
      );


    if (
      selectedDate === ""
    ) {

      alert(
        "Bitte wähle ein Datum aus."
      );


      entryDateInput.focus();


      return;

    }


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
      commissions.length ===
      0
    ) {

      alert(
        "Bitte lege zuerst eine Kommission an."
      );


      return;

    }


    const entry = {

      date:
        selectedDate,

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
        activityInput.value.trim()

    };


    timeEntries.push(
      entry
    );


    saveEntries();


    hoursInput.value =
      "";

    activityInput.value =
      "";


    setDefaultEntryDate();


    renderEvaluation();


    hoursInput.focus();

  }
);


/* =========================
   NAVIGATION
========================= */

navRecording.addEventListener(
  "click",
  showRecording
);


navEvaluation.addEventListener(
  "click",
  showEvaluation
);


navCommissions.addEventListener(
  "click",
  showCommissions
);


/* =========================
   EINSTELLUNGEN
========================= */

settingsButton.addEventListener(
  "click",
  showSettings
);


saveUserNameButton.addEventListener(
  "click",
  function() {

    saveUserName();

  }
);


userNameInput.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      saveUserName();

    }

  }
);


/* =========================
   KOMMISSION
========================= */

addCommissionButton.addEventListener(
  "click",
  function() {

    addCommission();

  }
);


newCommissionInput.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      addCommission();

    }

  }
);


/* =========================
   EXPORT
========================= */

exportExcelButton.addEventListener(
  "click",
  function() {

    exportToExcel();

  }
);


resetExportFilterButton.addEventListener(
  "click",
  function() {

    resetExportFilter();

  }
);


/* =========================
   START
========================= */

setDefaultEntryDate();

renderUserName();

renderCommissionSelect();

renderCommissionList();

renderEvaluation();

showRecording();
