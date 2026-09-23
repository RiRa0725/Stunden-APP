/* =========================================================
   RAVO – APP.JS
   Zeiterfassung / Kommissionen / Auswertung / Export
   / Tag-Nacht-Modus / Daten sichern & wiederherstellen
========================================================= */


/* =========================================================
   ELEMENTE
========================================================= */

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

const entryStatus =
  document.getElementById("entryStatus");

const entrySummary =
  document.getElementById("entrySummary");

const summaryDate =
  document.getElementById("summaryDate");

const summaryHours =
  document.getElementById("summaryHours");

const summaryCommission =
  document.getElementById("summaryCommission");

const summaryActivity =
  document.getElementById("summaryActivity");

const editEntryButton =
  document.getElementById("editEntry");

const confirmEntryButton =
  document.getElementById("confirmEntry");

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

const evaluationSessions =
  document.getElementById("evaluationSessions");

const evaluationYear =
  document.getElementById("evaluationYear");

const evaluationCommissions =
  document.getElementById("evaluationCommissions");

const addCommissionButton =
  document.getElementById("addCommission");

const newCommissionInput =
  document.getElementById("newCommission");

const commissionList =
  document.getElementById("commissionList");

const exportDetails =
  document.getElementById("exportDetails");

const exportExcelButton =
  document.getElementById("exportExcel");

const resetExportFilterButton =
  document.getElementById("resetExportFilter");

const exportFromInput =
  document.getElementById("exportFrom");

const exportToInput =
  document.getElementById("exportTo");


/* =========================================================
   EINSTELLUNGEN
========================================================= */

const userLastNameInput =
  document.getElementById("userLastName");

const userFirstNameInput =
  document.getElementById("userFirstName");

const userAddressInput =
  document.getElementById("userAddress");

const userZipInput =
  document.getElementById("userZip");

const userCityInput =
  document.getElementById("userCity");

const userPartyInput =
  document.getElementById("userParty");

const saveUserNameButton =
  document.getElementById("saveUserName");

const userNameStatus =
  document.getElementById("userNameStatus");

const userNameDisplay =
  document.getElementById("userNameDisplay");

const lightModeButton =
  document.getElementById("lightModeButton");

const darkModeButton =
  document.getElementById("darkModeButton");


/* =========================================================
   BACKUP
========================================================= */

const backupDataButton =
  document.getElementById("backupDataButton");

const restoreDataButton =
  document.getElementById("restoreDataButton");

const restoreFileInput =
  document.getElementById("restoreFileInput");

const backupStatus =
  document.getElementById("backupStatus");


/* =========================================================
   SPEICHER-SCHLÜSSEL
========================================================= */

const ENTRIES_KEY =
  "zeitpol_entries";

const COMMISSIONS_KEY =
  "zeitpol_commissions";

const USER_PROFILE_KEY =
  "zeitpol_user_profile";

const OLD_USER_NAME_KEY =
  "zeitpol_user_name";

const THEME_KEY =
  "ravo_theme";


/* =========================================================
   DATEN
========================================================= */

let timeEntries = [];

let commissions = [];

let pendingEntry = null;


/* =========================================================
   DATEN LADEN
========================================================= */

function loadStoredData() {

  try {

    const savedEntries =
      localStorage.getItem(ENTRIES_KEY);

    if (savedEntries) {

      const parsed =
        JSON.parse(savedEntries);

      if (Array.isArray(parsed)) {

        timeEntries = parsed;

      }

    }

  } catch (error) {

    timeEntries = [];

  }


  try {

    const savedCommissions =
      localStorage.getItem(COMMISSIONS_KEY);

    if (savedCommissions) {

      const parsed =
        JSON.parse(savedCommissions);

      if (Array.isArray(parsed)) {

        commissions = parsed;

      }

    }

  } catch (error) {

    commissions = [];

  }


  timeEntries.forEach(function(entry) {

    if (
      typeof entry.confirmed !==
      "boolean"
    ) {

      entry.confirmed = true;

    }

  });


  if (commissions.length === 0) {

    commissions = [
      "Kommission 001",
      "Kommission 002",
      "Kommission 003"
    ];

    saveCommissions();

  }

}


/* =========================================================
   SPEICHERN
========================================================= */

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


/* =========================================================
   DATUM
========================================================= */

function getTodayString() {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

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


function parseDateString(value) {

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


function getEntryDate(entry) {

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


function formatDate(date) {

  if (!date) {

    return "";

  }

  return date.toLocaleDateString(
    "de-CH",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );

}


/* =========================================================
   JAHR
========================================================= */

function getStartOfYear(date) {

  return new Date(
    date.getFullYear(),
    0,
    1,
    0,
    0,
    0,
    0
  );

}


function getEndOfYear(date) {

  return new Date(
    date.getFullYear(),
    11,
    31,
    23,
    59,
    59,
    999
  );

}


/* =========================================================
   STUNDEN
========================================================= */

function getHours(entry) {

  return Number(
    String(
      entry.hours
    ).replace(",", ".")
  ) || 0;

}


function calculateTotal(entries) {

  return entries.reduce(
    function(total, entry) {

      return (
        total +
        getHours(entry)
      );

    },
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


function countSessions(entries) {

  return entries.length;

}


/* =========================================================
   BENUTZERPROFIL
========================================================= */

function loadUserProfile() {

  let profile = {

    lastName: "",
    firstName: "",
    address: "",
    zip: "",
    city: "",
    party: ""

  };


  try {

    const saved =
      localStorage.getItem(
        USER_PROFILE_KEY
      );

    if (saved) {

      const parsed =
        JSON.parse(saved);

      if (
        parsed &&
        typeof parsed === "object"
      ) {

        profile = {
          ...profile,
          ...parsed
        };

      }

    }

  } catch (error) {

    profile = {
      lastName: "",
      firstName: "",
      address: "",
      zip: "",
      city: "",
      party: ""
    };

  }


  const oldName =
    localStorage.getItem(
      OLD_USER_NAME_KEY
    );


  if (
    oldName &&
    !profile.firstName &&
    !profile.lastName
  ) {

    const parts =
      oldName.trim().split(/\s+/);

    if (parts.length >= 2) {

      profile.firstName =
        parts.shift();

      profile.lastName =
        parts.join(" ");

    } else {

      profile.lastName =
        oldName.trim();

    }

  }


  userLastNameInput.value =
    profile.lastName;

  userFirstNameInput.value =
    profile.firstName;

  userAddressInput.value =
    profile.address;

  userZipInput.value =
    profile.zip;

  userCityInput.value =
    profile.city;

  userPartyInput.value =
    profile.party;

}


function getUserProfile() {

  return {

    lastName:
      userLastNameInput.value.trim(),

    firstName:
      userFirstNameInput.value.trim(),

    address:
      userAddressInput.value.trim(),

    zip:
      userZipInput.value.trim(),

    city:
      userCityInput.value.trim(),

    party:
      userPartyInput.value.trim()

  };

}


function getDisplayName() {

  const profile =
    getUserProfile();

  return [
    profile.firstName,
    profile.lastName
  ]
    .filter(Boolean)
    .join(" ");

}


function renderUserName() {

  userNameDisplay.textContent =
    getDisplayName();

}


function saveUserProfile() {

  const lastName =
    userLastNameInput.value.trim();

  const firstName =
    userFirstNameInput.value.trim();


  if (!lastName) {

    userNameStatus.textContent =
      "Bitte gib deinen Namen ein.";

    userLastNameInput.focus();

    return;

  }


  if (!firstName) {

    userNameStatus.textContent =
      "Bitte gib deinen Vornamen ein.";

    userFirstNameInput.focus();

    return;

  }


  const profile =
    getUserProfile();


  localStorage.setItem(
    USER_PROFILE_KEY,
    JSON.stringify(profile)
  );


  localStorage.setItem(
    OLD_USER_NAME_KEY,
    getDisplayName()
  );


  renderUserName();


  userNameStatus.textContent =
    "Angaben gespeichert.";

}


/* =========================================================
   KOMMISSIONS-AUSWAHL
========================================================= */

function renderCommissionSelect() {

  commissionInput.innerHTML =
    "";

  if (commissions.length === 0) {

    const option =
      document.createElement("option");

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


/* =========================================================
   KOMMISSIONEN LISTE
========================================================= */

function renderCommissionList() {

  commissionList.innerHTML =
    "";


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
        document.createElement("div");

      item.className =
        "entry";


      const name =
        document.createElement("strong");

      name.textContent =
        commission;


      const actions =
        document.createElement("div");

      actions.className =
        "entry-actions";


      const renameButton =
        document.createElement("button");

      renameButton.type =
        "button";

      renameButton.className =
        "small-button";

      renameButton.textContent =
        "✏️ Umbenennen";


      const deleteButton =
        document.createElement("button");

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

          deleteCommission(index);

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


/* =========================================================
   NEUE KOMMISSION
========================================================= */

function addCommission() {

  const name =
    newCommissionInput.value.trim();


  if (!name) {

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

    return;

  }


  commissions.push(name);

  saveCommissions();

  renderCommissionSelect();

  renderCommissionList();

  newCommissionInput.value =
    "";

}


/* =========================================================
   KOMMISSION UMBENENNEN
========================================================= */

function showRenameForm(
  item,
  oldName,
  index
) {

  item.innerHTML =
    "";


  const input =
    document.createElement("input");

  input.type =
    "text";

  input.value =
    oldName;

  input.autocomplete =
    "off";


  const actions =
    document.createElement("div");

  actions.className =
    "entry-actions";


  const saveButton =
    document.createElement("button");

  saveButton.type =
    "button";

  saveButton.className =
    "small-button";

  saveButton.textContent =
    "Speichern";


  const cancelButton =
    document.createElement("button");

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

      if (!newName) {

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


      saveEntries();

      saveCommissions();

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

      if (event.key === "Enter") {

        event.preventDefault();

        saveButton.click();

      }

    }
  );


  actions.appendChild(
    saveButton
  );

  actions.appendChild(
    cancelButton
  );

  item.appendChild(
    input
  );

  item.appendChild(
    actions
  );

  input.focus();

}


/* =========================================================
   KOMMISSION LÖSCHEN
========================================================= */

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
      "Diese Kommission wird bereits bei Zeiteinträgen verwendet. Die bisherigen Einträge bleiben erhalten. Trotzdem löschen?";

  }


  if (!confirm(message)) {

    return;

  }


  commissions.splice(
    index,
    1
  );


  saveCommissions();

  renderCommissionSelect();

  renderCommissionList();

  renderEvaluation();

}


/* =========================================================
   EINTRAG VORBEREITEN
========================================================= */

function prepareEntry() {

  const selectedDate =
    entryDateInput.value.trim();


  const value =
    hoursInput.value
      .trim()
      .replace(",", ".");


  const hours =
    Number(value);


  if (!selectedDate) {

    alert(
      "Bitte wähle ein Datum aus."
    );

    entryDateInput.focus();

    return;

  }


  if (
    !value ||
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


  pendingEntry = {

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


  showPendingSummary();

}


/* =========================================================
   ZUSAMMENFASSUNG
========================================================= */

function showPendingSummary() {

  if (!pendingEntry) {

    entrySummary.style.display =
      "none";

    return;

  }


  const date =
    getEntryDate(pendingEntry);


  summaryDate.textContent =
    date
      ? formatDate(date)
      : "Datum unbekannt";


  summaryHours.textContent =
    pendingEntry.hours +
    " Std.";


  summaryCommission.textContent =
    pendingEntry.commission;


  summaryActivity.textContent =
    pendingEntry.activity ||
    "Keine Tätigkeit angegeben";


  entrySummary.style.display =
    "block";


  entryStatus.textContent =
    "";

}


/* =========================================================
   EINTRAG ÄNDERN
========================================================= */

function editPendingEntry() {

  if (!pendingEntry) {

    return;

  }


  entryDateInput.value =
    pendingEntry.date;

  hoursInput.value =
    pendingEntry.hours;

  commissionInput.value =
    pendingEntry.commission;

  activityInput.value =
    pendingEntry.activity;


  pendingEntry =
    null;


  entrySummary.style.display =
    "none";


  hoursInput.focus();

}


/* =========================================================
   EINTRAG SPEICHERN
========================================================= */

function confirmEntry() {

  if (!pendingEntry) {

    return;

  }


  const entry = {

    id:
      Date.now().toString() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2),

    date:
      pendingEntry.date,

    hours:
      pendingEntry.hours,

    commission:
      pendingEntry.commission,

    activity:
      pendingEntry.activity,

    confirmed:
      true

  };


  timeEntries.push(entry);

  saveEntries();


  pendingEntry =
    null;


  entrySummary.style.display =
    "none";


  hoursInput.value =
    "";

  activityInput.value =
    "";


  setDefaultEntryDate();


  entryStatus.textContent =
    "✓ Stunden quittiert und gespeichert.";


  renderEvaluation();

}


/* =========================================================
   AUSWERTUNG
========================================================= */

function renderEvaluation() {

  const now =
    new Date();


  const startOfYear =
    getStartOfYear(now);


  const endOfYear =
    getEndOfYear(now);


  const yearEntries =
    timeEntries.filter(
      function(entry) {

        if (
          entry.confirmed ===
          false
        ) {

          return false;

        }


        const date =
          getEntryDate(entry);


        return (
          date &&
          date >= startOfYear &&
          date <= endOfYear
        );

      }
    );


  evaluationSessions.textContent =
    countSessions(
      yearEntries
    );


  evaluationYear.textContent =
    formatHours(
      calculateTotal(
        yearEntries
      )
    );


  renderCommissionEvaluation();

}


/* =========================================================
   KOMMISSIONSAUSWERTUNG
========================================================= */

function renderCommissionEvaluation() {

  evaluationCommissions.innerHTML =
    "";


  const groups = {};


  timeEntries.forEach(
    function(entry) {

      if (
        entry.confirmed ===
        false
      ) {

        return;

      }


      const commission =
        entry.commission ||
        "Ohne Kommission";


      if (!groups[commission]) {

        groups[commission] =
          [];

      }


      groups[commission].push(
        entry
      );

    }
  );


  const names =
    Object.keys(groups)
      .sort();


  if (names.length === 0) {

    evaluationCommissions.className =
      "empty-state";

    evaluationCommissions.textContent =
      "Noch keine Einträge vorhanden.";

    return;

  }


  evaluationCommissions.className =
    "commission-evaluation-list";


  names.forEach(
    function(commission) {

      const entries =
        groups[commission]
          .map(
            function(entry) {

              return {

                entry:
                  entry,

                originalIndex:
                  timeEntries.indexOf(
                    entry
                  ),

                date:
                  getEntryDate(entry)

              };

            }
          )
          .sort(
            function(a, b) {

              const aTime =
                a.date
                  ? a.date.getTime()
                  : 0;

              const bTime =
                b.date
                  ? b.date.getTime()
                  : 0;

              return (
                bTime -
                aTime
              );

            }
          );


      const block =
        document.createElement(
          "section"
        );

      block.className =
        "commission-block";


      const header =
        document.createElement(
          "button"
        );

      header.type =
        "button";

      header.className =
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


      const sessions =
        document.createElement(
          "div"
        );

      sessions.className =
        "commission-summary-sessions";

      sessions.textContent =
        entries.length +
        (
          entries.length === 1
            ? " Sitzung"
            : " Sitzungen"
        );


      const hours =
        document.createElement(
          "div"
        );

      hours.className =
        "commission-summary-hours";

      hours.textContent =
        formatHours(
          calculateTotal(
            entries.map(
              function(item) {
                return item.entry;
              }
            )
          )
        );


      const arrow =
        document.createElement(
          "span"
        );

      arrow.className =
        "commission-arrow";

      arrow.textContent =
        "＋";


      content.appendChild(
        name
      );

      content.appendChild(
        sessions
      );

      content.appendChild(
        hours
      );


      header.appendChild(
        content
      );

      header.appendChild(
        arrow
      );


      const details =
        document.createElement(
          "div"
        );

      details.className =
        "commission-details";


      details.style.display =
        "none";


      entries.forEach(
        function(detail) {

          createSwipeEntry(
            detail,
            details
          );

        }
      );


      header.addEventListener(
        "click",
        function() {

          const open =
            details.style.display !==
            "none";


          if (open) {

            details.style.display =
              "none";

            arrow.textContent =
              "＋";

            header.classList.remove(
              "open"
            );

          } else {

            details.style.display =
              "grid";

            arrow.textContent =
              "−";

            header.classList.add(
              "open"
            );

          }

        }
      );


      block.appendChild(
        header
      );

      block.appendChild(
        details
      );


      evaluationCommissions.appendChild(
        block
      );

    }
  );

}


/* =========================================================
   EINTRAG IN AUSWERTUNG
========================================================= */

function createSwipeEntry(
  detail,
  parent
) {

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "swipe-entry";


  const deleteButton =
    document.createElement(
      "button"
    );

  deleteButton.type =
    "button";

  deleteButton.className =
    "swipe-delete";

  deleteButton.textContent =
    "Löschen";


  const content =
    document.createElement(
      "div"
    );

  content.className =
    "swipe-content";


  const date =
    document.createElement(
      "strong"
    );

  date.textContent =
    detail.date
      ? formatDate(detail.date)
      : "Datum unbekannt";


  const activity =
    document.createElement(
      "small"
    );

  activity.textContent =
    detail.entry.activity ||
    "Keine Tätigkeit angegeben";


  const hours =
    document.createElement(
      "span"
    );

  hours.textContent =
    detail.entry.hours +
    " Std.";


  content.appendChild(
    date
  );

  content.appendChild(
    activity
  );

  content.appendChild(
    hours
  );


  wrapper.appendChild(
    deleteButton
  );

  wrapper.appendChild(
    content
  );


  parent.appendChild(
    wrapper
  );


  let startX =
    0;

  let currentX =
    0;

  let dragging =
    false;


  content.addEventListener(
    "touchstart",
    function(event) {

      startX =
        event.touches[0].clientX;

      currentX =
        startX;

      dragging =
        true;

    },
    {
      passive: true
    }
  );


  content.addEventListener(
    "touchmove",
    function(event) {

      if (!dragging) {

        return;

      }


      currentX =
        event.touches[0].clientX;


      const difference =
        currentX -
        startX;


      if (difference < 0) {

        const offset =
          Math.max(
            -90,
            difference
          );

        content.style.transform =
          "translateX(" +
          offset +
          "px";

        content.style.transform +=
          ")";

      }

    },
    {
      passive: true
    }
  );


  content.addEventListener(
    "touchend",
    function() {

      if (!dragging) {

        return;

      }


      dragging =
        false;


      const difference =
        currentX -
        startX;


      if (difference <= -50) {

        content.style.transform =
          "translateX(-90px)";

      } else {

        content.style.transform =
          "translateX(0)";

      }

    }
  );


  deleteButton.addEventListener(
    "click",
    function(event) {

      event.stopPropagation();

      deleteTimeEntry(
        detail.originalIndex
      );

    }
  );

}


/* =========================================================
   ZEITEINTRAG LÖSCHEN
========================================================= */

function deleteTimeEntry(index) {

  if (
    index < 0 ||
    index >= timeEntries.length
  ) {

    return;

  }


  if (
    !confirm(
      "Diesen Zeiteintrag wirklich löschen?"
    )
  ) {

    return;

  }


  timeEntries.splice(
    index,
    1
  );


  saveEntries();

  renderEvaluation();

}


/* =========================================================
   TAG / NACHT
========================================================= */

function applyTheme(theme) {

  if (theme === "dark") {

    document.body.dataset.theme =
      "dark";

  } else {

    document.body.dataset.theme =
      "light";

  }


  localStorage.setItem(
    THEME_KEY,
    theme
  );


  updateThemeButtons();

}


function loadTheme() {

  const theme =
    localStorage.getItem(
      THEME_KEY
    );


  if (theme === "dark") {

    document.body.dataset.theme =
      "dark";

  } else {

    document.body.dataset.theme =
      "light";

  }


  updateThemeButtons();

}


function updateThemeButtons() {

  const dark =
    document.body.dataset.theme ===
    "dark";


  lightModeButton.classList.toggle(
    "selected",
    !dark
  );

  darkModeButton.classList.toggle(
    "selected",
    dark
  );

}


/* =========================================================
   DATEN SICHERN
========================================================= */

function getBackupData() {

  return {

    app:
      "Ravo",

    backupVersion:
      1,

    createdAt:
      new Date().toISOString(),

    entries:
      timeEntries,

    commissions:
      commissions,

    userProfile:
      getUserProfile(),

    theme:
      document.body.dataset.theme ===
      "dark"
        ? "dark"
        : "light"

  };

}


function createBackupFilename() {

  return (
    "Ravo-Backup-" +
    getTodayString() +
    ".json"
  );

}


function downloadBackup(
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


async function backupData() {

  try {

    const data =
      getBackupData();


    const json =
      JSON.stringify(
        data,
        null,
        2
      );


    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json;charset=utf-8"
        }
      );


    const filename =
      createBackupFilename();


    const file =
      new File(
        [blob],
        filename,
        {
          type:
            "application/json"
        }
      );


    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file]
      })
    ) {

      await navigator.share({

        title:
          "Ravo Backup",

        text:
          "Ravo-Datensicherung",

        files:
          [file]

      });


      backupStatus.textContent =
        "✓ Backup wurde zum Teilen geöffnet.";

    } else {

      downloadBackup(
        blob,
        filename
      );

      backupStatus.textContent =
        "✓ Backup wurde erstellt.";

    }

  } catch (error) {

    if (
      error &&
      error.name ===
      "AbortError"
    ) {

      backupStatus.textContent =
        "Backup wurde nicht geteilt.";

      return;

    }


    backupStatus.textContent =
      "Das Backup konnte nicht erstellt werden.";

  }

}


/* =========================================================
   BACKUP WIEDERHERSTELLEN
========================================================= */

function restoreBackup(file) {

  if (!file) {

    return;

  }


  const reader =
    new FileReader();


  reader.onload =
    function(event) {

      try {

        const backup =
          JSON.parse(
            event.target.result
          );


        if (
          !backup ||
          backup.app !==
          "Ravo"
        ) {

          throw new Error(
            "Dies ist keine gültige Ravo-Backup-Datei."
          );

        }


        if (
          !Array.isArray(
            backup.entries
          )
        ) {

          throw new Error(
            "Im Backup fehlen die Zeiteinträge."
          );

        }


        if (
          !Array.isArray(
            backup.commissions
          )
        ) {

          throw new Error(
            "Im Backup fehlen die Kommissionen."
          );

        }


        const confirmed =
          confirm(
            "Beim Wiederherstellen werden die aktuell gespeicherten Ravo-Daten ersetzt. Möchtest du fortfahren?"
          );


        if (!confirmed) {

          backupStatus.textContent =
            "Wiederherstellung abgebrochen.";

          return;

        }


        timeEntries =
          backup.entries.map(
            function(entry) {

              return {

                ...entry,

                confirmed:
                  typeof entry.confirmed ===
                  "boolean"
                    ? entry.confirmed
                    : true

              };

            }
          );


        commissions =
          backup.commissions
            .filter(
              function(item) {

                return (
                  typeof item ===
                  "string" &&
                  item.trim() !== ""
                );

              }
            );


        if (
          commissions.length ===
          0
        ) {

          commissions = [
            "Kommission 001"
          ];

        }


        const profile =
          backup.userProfile || {

            lastName: "",
            firstName: "",
            address: "",
            zip: "",
            city: "",
            party: ""

          };


        localStorage.setItem(
          ENTRIES_KEY,
          JSON.stringify(
            timeEntries
          )
        );


        localStorage.setItem(
          COMMISSIONS_KEY,
          JSON.stringify(
            commissions
          )
        );


        localStorage.setItem(
          USER_PROFILE_KEY,
          JSON.stringify(
            profile
          )
        );


        localStorage.setItem(
          OLD_USER_NAME_KEY,
          (
            profile.firstName +
            " " +
            profile.lastName
          ).trim()
        );


        const theme =
          backup.theme ===
          "dark"
            ? "dark"
            : "light";


        localStorage.setItem(
          THEME_KEY,
          theme
        );


        backupStatus.textContent =
          "✓ Backup erfolgreich wiederhergestellt.";


        setTimeout(
          function() {

            window.location.reload();

          },
          700
        );


      } catch (error) {

        backupStatus.textContent =
          error.message ||
          "Das Backup konnte nicht gelesen werden.";

      }

    };


  reader.onerror =
    function() {

      backupStatus.textContent =
        "Die Backup-Datei konnte nicht gelesen werden.";

    };


  reader.readAsText(
    file
  );

}


/* =========================================================
   EXPORT
========================================================= */

function escapeCSV(value) {

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


function exportToExcel() {

  const entries =
    timeEntries.filter(
      function(entry) {

        return (
          entry.confirmed !==
          false
        );

      }
    );


  if (entries.length === 0) {

    alert(
      "Es sind noch keine quittierten Zeiteinträge vorhanden."
    );

    return;

  }


  const from =
    exportFromInput.value;

  const to =
    exportToInput.value;


  if (
    from &&
    to &&
    from > to
  ) {

    alert(
      "Das Startdatum darf nicht nach dem Enddatum liegen."
    );

    return;

  }


  const filtered =
    entries.filter(
      function(entry) {

        const date =
          getEntryDate(entry);


        if (!date) {

          return false;

        }


        const y =
          date.getFullYear();

        const m =
          String(
            date.getMonth() + 1
          ).padStart(2, "0");

        const d =
          String(
            date.getDate()
          ).padStart(2, "0");


        const value =
          y +
          "-" +
          m +
          "-" +
          d;


        if (
          from &&
          value < from
        ) {

          return false;

        }


        if (
          to &&
          value > to
        ) {

          return false;

        }


        return true;

      }
    );


  if (filtered.length === 0) {

    alert(
      "Für den gewählten Zeitraum wurden keine quittierten Einträge gefunden."
    );

    return;

  }


  filtered.sort(
    function(a, b) {

      const dateA =
        getEntryDate(a);

      const dateB =
        getEntryDate(b);


      return (
        dateA.getTime() -
        dateB.getTime()
      );

    }
  );


  const profile =
    getUserProfile();


  const rows = [];


  rows.push(
    [
      "Name",
      profile.lastName
    ]
      .map(escapeCSV)
      .join(";")
  );


  rows.push(
    [
      "Vorname",
      profile.firstName
    ]
      .map(escapeCSV)
      .join(";")
  );


  rows.push(
    [
      "Adresse",
      profile.address
    ]
      .map(escapeCSV)
      .join(";")
  );


  rows.push(
    [
      "PLZ",
      profile.zip
    ]
      .map(escapeCSV)
      .join(";")
  );


  rows.push(
    [
      "Ort",
      profile.city
    ]
      .map(escapeCSV)
      .join(";")
  );


  rows.push(
    [
      "Partei",
      profile.party
    ]
      .map(escapeCSV)
      .join(";")
  );


  rows.push("");


  rows.push(
    [
      "Datum",
      "Kommission",
      "Tätigkeit",
      "Stunden"
    ]
      .map(escapeCSV)
      .join(";")
  );


  filtered.forEach(
    function(entry) {

      const date =
        getEntryDate(entry);


      rows.push(
        [
          date
            ? formatDate(date)
            : "",

          entry.commission ||
            "",

          entry.activity ||
            "",

          getHours(entry)
            .toLocaleString(
              "de-CH",
              {
                maximumFractionDigits: 2
              }
            )

        ]
          .map(escapeCSV)
          .join(";")
      );

    }
  );


  rows.push("");


  rows.push(
    [
      "",
      "",
      "Gesamt",
      calculateTotal(filtered)
        .toLocaleString(
          "de-CH",
          {
            maximumFractionDigits: 2
          }
        )
    ]
      .map(escapeCSV)
      .join(";")
  );


  const csv =
    "\uFEFF" +
    rows.join("\r\n");


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const filename =
    "Ravo_Excel_" +
    getTodayString() +
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

    navigator.share({

      title:
        "Ravo Excel Export",

      text:
        "Zeiterfassung aus Ravo",

      files:
        [file]

    }).catch(
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

  } else {

    downloadCSV(
      blob,
      filename
    );

  }

}


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


/* =========================================================
   NAVIGATION
========================================================= */

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


  if (exportDetails) {

    exportDetails.open =
      false;

  }


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

  updateThemeButtons();

}


/* =========================================================
   BUTTONS
========================================================= */

addEntryButton.addEventListener(
  "click",
  prepareEntry
);


editEntryButton.addEventListener(
  "click",
  editPendingEntry
);


confirmEntryButton.addEventListener(
  "click",
  confirmEntry
);


/* =========================================================
   NAVIGATION BUTTONS
========================================================= */

navEvaluation.addEventListener(
  "click",
  showEvaluation
);


navRecording.addEventListener(
  "click",
  showRecording
);


navCommissions.addEventListener(
  "click",
  showCommissions
);


/* =========================================================
   EINSTELLUNGEN
========================================================= */

settingsButton.addEventListener(
  "click",
  showSettings
);


saveUserNameButton.addEventListener(
  "click",
  saveUserProfile
);


/* =========================================================
   TAG / NACHT
========================================================= */

lightModeButton.addEventListener(
  "click",
  function() {

    applyTheme("light");

  }
);


darkModeButton.addEventListener(
  "click",
  function() {

    applyTheme("dark");

  }
);


/* =========================================================
   KOMMISSIONEN
========================================================= */

addCommissionButton.addEventListener(
  "click",
  addCommission
);


newCommissionInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      event.preventDefault();

      addCommission();

    }

  }
);


/* =========================================================
   EXPORT
========================================================= */

exportExcelButton.addEventListener(
  "click",
  exportToExcel
);


resetExportFilterButton.addEventListener(
  "click",
  function() {

    exportFromInput.value =
      "";

    exportToInput.value =
      "";

  }
);


/* =========================================================
   DATENSICHERUNG
========================================================= */

backupDataButton.addEventListener(
  "click",
  backupData
);


restoreDataButton.addEventListener(
  "click",
  function() {

    restoreFileInput.click();

  }
);


restoreFileInput.addEventListener(
  "change",
  function() {

    const file =
      restoreFileInput.files &&
      restoreFileInput.files[0];


    restoreBackup(file);

  }
);


/* =========================================================
   START
========================================================= */

loadStoredData();

loadUserProfile();

loadTheme();

setDefaultEntryDate();

renderUserName();

renderCommissionSelect();

renderCommissionList();

renderEvaluation();


/*
  Ravo startet immer
  mit der Auswertung.
*/

showEvaluation();
