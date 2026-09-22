"use strict";


/* =========================
   KONSTANTEN
========================= */

const COMMISSION_KEY =
  "zeitpol_commissions";

const TIME_ENTRIES_KEY =
  "zeitpol_time_entries";

const USER_PROFILE_KEY =
  "zeitpol_user_profile";

const OLD_USER_NAME_KEY =
  "zeitpol_user_name";

const THEME_KEY =
  "ravo_theme";


/* =========================
   ELEMENTE
========================= */

const evaluationSection =
  document.getElementById("evaluationSection");

const entrySection =
  document.getElementById("entrySection");

const commissionSection =
  document.getElementById("commissionSection");

const settingsSection =
  document.getElementById("settingsSection");


const evaluationNav =
  document.getElementById("evaluationNav");

const entryNav =
  document.getElementById("entryNav");

const commissionNav =
  document.getElementById("commissionNav");

const settingsButton =
  document.getElementById("settingsButton");


const evaluationCommissions =
  document.getElementById("evaluationCommissions");

const evaluationSessions =
  document.getElementById("evaluationSessions");

const evaluationYear =
  document.getElementById("evaluationYear");


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


const entryDate =
  document.getElementById("entryDate");

const entryHours =
  document.getElementById("entryHours");

const entryCommission =
  document.getElementById("entryCommission");

const entryActivity =
  document.getElementById("entryActivity");

const saveEntryButton =
  document.getElementById("saveEntryButton");

const editEntryButton =
  document.getElementById("editEntryButton");

const confirmEntryButton =
  document.getElementById("confirmEntryButton");

const entryStatus =
  document.getElementById("entryStatus");


const commissionName =
  document.getElementById("commissionName");

const addCommissionButton =
  document.getElementById("addCommissionButton");

const commissionList =
  document.getElementById("commissionList");


const profileLastName =
  document.getElementById("profileLastName");

const profileFirstName =
  document.getElementById("profileFirstName");

const profileAddress =
  document.getElementById("profileAddress");

const profileZip =
  document.getElementById("profileZip");

const profileCity =
  document.getElementById("profileCity");

const profileParty =
  document.getElementById("profileParty");

const saveProfileButton =
  document.getElementById("saveProfileButton");

const profileStatus =
  document.getElementById("profileStatus");

const userNameDisplay =
  document.getElementById("userNameDisplay");


const lightModeButton =
  document.getElementById("lightModeButton");

const darkModeButton =
  document.getElementById("darkModeButton");


const exportButton =
  document.getElementById("exportButton");

const exportResetButton =
  document.getElementById("exportResetButton");

const exportFrom =
  document.getElementById("exportFrom");

const exportTo =
  document.getElementById("exportTo");


/* =========================
   DATEN
========================= */

let commissions = [];

let timeEntries = [];

let pendingEntry = null;


/* =========================
   DATUM
========================= */

function getTodayString() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
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


function parseDateString(value) {

  if (!value) {
    return null;
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {

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

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;

}


function getEntryDate(entry) {

  if (!entry) {
    return null;
  }

  return parseDateString(
    entry.date
  );

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


function formatDate(date) {

  if (!date) {
    return "–";
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


/* =========================
   STUNDEN
========================= */

function calculateTotal(entries) {

  return entries.reduce(
    function(total, entry) {

      const hours =
        Number(entry.hours);

      if (
        Number.isNaN(hours)
      ) {
        return total;
      }

      return total + hours;

    },
    0
  );

}


function formatHours(hours) {

  const value =
    Number(hours) || 0;

  return (
    value.toLocaleString(
      "de-CH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ) +
    " Stunden"
  );

}


function countSessions(entries) {

  return entries.length;

}


/* =========================
   LOCAL STORAGE
========================= */

function loadData() {

  try {

    const storedCommissions =
      localStorage.getItem(
        COMMISSION_KEY
      );

    commissions =
      storedCommissions
        ? JSON.parse(
            storedCommissions
          )
        : [];

  } catch (error) {

    commissions = [];

  }


  try {

    const storedEntries =
      localStorage.getItem(
        TIME_ENTRIES_KEY
      );

    timeEntries =
      storedEntries
        ? JSON.parse(
            storedEntries
          )
        : [];

  } catch (error) {

    timeEntries = [];

  }


  /*
    Alte Einträge gelten
    als bereits quittiert.
  */

  timeEntries =
    timeEntries.map(
      function(entry) {

        if (
          typeof entry.confirmed ===
          "undefined"
        ) {

          return {
            ...entry,
            confirmed: true
          };

        }

        return entry;

      }
    );


  localStorage.setItem(
    TIME_ENTRIES_KEY,
    JSON.stringify(timeEntries)
  );

}


function saveCommissions() {

  localStorage.setItem(
    COMMISSION_KEY,
    JSON.stringify(commissions)
  );

}


function saveTimeEntries() {

  localStorage.setItem(
    TIME_ENTRIES_KEY,
    JSON.stringify(timeEntries)
  );

}


/* =========================
   PROFIL
========================= */

function getProfile() {

  try {

    const stored =
      localStorage.getItem(
        USER_PROFILE_KEY
      );

    if (!stored) {
      return {};
    }

    const profile =
      JSON.parse(stored);

    return profile || {};

  } catch (error) {

    return {};

  }

}


function loadProfile() {

  const profile =
    getProfile();

  profileLastName.value =
    profile.lastName || "";

  profileFirstName.value =
    profile.firstName || "";

  profileAddress.value =
    profile.address || "";

  profileZip.value =
    profile.zip || "";

  profileCity.value =
    profile.city || "";

  profileParty.value =
    profile.party || "";


  updateUserNameDisplay();

}


function saveProfile() {

  const lastName =
    profileLastName.value.trim();

  const firstName =
    profileFirstName.value.trim();

  if (!lastName) {

    profileStatus.textContent =
      "Bitte Name eingeben.";

    return;

  }

  if (!firstName) {

    profileStatus.textContent =
      "Bitte Vorname eingeben.";

    return;

  }


  const profile = {

    lastName:
      lastName,

    firstName:
      firstName,

    address:
      profileAddress.value.trim(),

    zip:
      profileZip.value.trim(),

    city:
      profileCity.value.trim(),

    party:
      profileParty.value.trim()

  };


  localStorage.setItem(
    USER_PROFILE_KEY,
    JSON.stringify(profile)
  );


  localStorage.setItem(
    OLD_USER_NAME_KEY,
    firstName +
    " " +
    lastName
  );


  updateUserNameDisplay();


  profileStatus.textContent =
    "Angaben gespeichert.";

}


function updateUserNameDisplay() {

  const profile =
    getProfile();

  const firstName =
    (profile.firstName || "").trim();

  const lastName =
    (profile.lastName || "").trim();

  const fullName =
    (
      firstName +
      " " +
      lastName
    ).trim();

  userNameDisplay.textContent =
    fullName;

}


/* =========================
   NAVIGATION
========================= */

function hideAllSections() {

  evaluationSection.style.display =
    "none";

  entrySection.style.display =
    "none";

  commissionSection.style.display =
    "none";

  settingsSection.style.display =
    "none";


  evaluationNav.classList.remove(
    "active"
  );

  entryNav.classList.remove(
    "active"
  );

  commissionNav.classList.remove(
    "active"
  );

}


function showEvaluation() {

  hideAllSections();

  evaluationSection.style.display =
    "block";

  evaluationNav.classList.add(
    "active"
  );

  renderEvaluation();

}


function showEntry() {

  hideAllSections();

  entrySection.style.display =
    "block";

  entryNav.classList.add(
    "active"
  );

  populateCommissionSelect();

}


function showCommissions() {

  hideAllSections();

  commissionSection.style.display =
    "block";

  commissionNav.classList.add(
    "active"
  );

  renderCommissions();

}


function showSettings() {

  hideAllSections();

  settingsSection.style.display =
    "block";

  loadProfile();

}


/* =========================
   KOMMISSION SELECT
========================= */

function populateCommissionSelect() {

  const currentValue =
    entryCommission.value;

  entryCommission.innerHTML =
    "";


  const placeholder =
    document.createElement(
      "option"
    );

  placeholder.value =
    "";

  placeholder.textContent =
    "Kommission auswählen";

  entryCommission.appendChild(
    placeholder
  );


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

      entryCommission.appendChild(
        option
      );

    }
  );


  if (
    commissions.includes(
      currentValue
    )
  ) {

    entryCommission.value =
      currentValue;

  }

}


/* =========================
   KOMMISSIONEN
========================= */

function renderCommissions() {

  commissionList.innerHTML =
    "";


  if (
    commissions.length === 0
  ) {

    const empty =
      document.createElement(
        "div"
      );

    empty.className =
      "empty-state";

    empty.textContent =
      "Noch keine Kommissionen vorhanden.";

    commissionList.appendChild(
      empty
    );

    populateCommissionSelect();

    return;

  }


  commissions.forEach(
    function(commission, index) {

      const entry =
        document.createElement(
          "div"
        );

      entry.className =
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
        "Umbenennen";


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

      deleteButton.className =
        "small-button danger-button";

      deleteButton.textContent =
        "Löschen";


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


      entry.appendChild(
        name
      );

      entry.appendChild(
        actions
      );


      commissionList.appendChild(
        entry
      );

    }
  );


  populateCommissionSelect();

}


function addCommission() {

  const name =
    commissionName.value.trim();

  if (!name) {
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


  commissions.push(
    name
  );

  saveCommissions();

  commissionName.value =
    "";

  renderCommissions();

}


function renameCommission(index) {

  const oldName =
    commissions[index];

  const newName =
    prompt(
      "Neuer Name:",
      oldName
    );


  if (
    newName === null
  ) {
    return;
  }


  const trimmed =
    newName.trim();

  if (!trimmed) {
    return;
  }


  const duplicate =
    commissions.some(
      function(commission, i) {

        return (
          i !== index &&
          commission.toLowerCase() ===
          trimmed.toLowerCase()
        );

      }
    );


  if (duplicate) {

    alert(
      "Diese Kommission gibt es bereits."
    );

    return;

  }


  commissions[index] =
    trimmed;


  timeEntries =
    timeEntries.map(
      function(entry) {

        if (
          entry.commission ===
          oldName
        ) {

          return {
            ...entry,
            commission:
              trimmed
          };

        }

        return entry;

      }
    );


  saveCommissions();
  saveTimeEntries();

  renderCommissions();

  renderEvaluation();

}


function deleteCommission(index) {

  const name =
    commissions[index];


  const confirmed =
    confirm(
      'Kommission "' +
      name +
      '" wirklich löschen?'
    );


  if (!confirmed) {
    return;
  }


  commissions.splice(
    index,
    1
  );


  saveCommissions();

  renderCommissions();

}


/* =========================
   EINTRAG
========================= */

function resetEntryForm() {

  entryDate.value =
    getTodayString();

  entryHours.value =
    "";

  entryCommission.value =
    "";

  entryActivity.value =
    "";

  entrySummary.style.display =
    "none";

  pendingEntry =
    null;

  entryStatus.textContent =
    "";

}


function validateEntry() {

  const date =
    entryDate.value;

  const hours =
    Number(
      entryHours.value
    );

  const commission =
    entryCommission.value;

  const activity =
    entryActivity.value.trim();


  if (!date) {

    entryStatus.textContent =
      "Bitte Datum auswählen.";

    return false;

  }


  if (
    !Number.isFinite(hours) ||
    hours <= 0
  ) {

    entryStatus.textContent =
      "Bitte gültige Stunden eingeben.";

    return false;

  }


  if (!commission) {

    entryStatus.textContent =
      "Bitte Kommission auswählen.";

    return false;

  }


  if (!activity) {

    entryStatus.textContent =
      "Bitte Tätigkeit eingeben.";

    return false;

  }


  return true;

}


function createPendingEntry() {

  if (
    !validateEntry()
  ) {
    return;
  }


  pendingEntry = {

    date:
      entryDate.value,

    hours:
      Number(
        entryHours.value
      ),

    commission:
      entryCommission.value,

    activity:
      entryActivity.value.trim(),

    confirmed:
      false

  };


  summaryDate.textContent =
    formatDate(
      getEntryDate(
        pendingEntry
      )
    );

  summaryHours.textContent =
    formatHours(
      pendingEntry.hours
    );

  summaryCommission.textContent =
    pendingEntry.commission;

  summaryActivity.textContent =
    pendingEntry.activity;


  entrySummary.style.display =
    "block";


  entryStatus.textContent =
    "Bitte prüfen und anschließend quittieren.";

}


function editPendingEntry() {

  if (!pendingEntry) {
    return;
  }


  entryDate.value =
    pendingEntry.date;

  entryHours.value =
    pendingEntry.hours;

  entryCommission.value =
    pendingEntry.commission;

  entryActivity.value =
    pendingEntry.activity;


  pendingEntry =
    null;


  entrySummary.style.display =
    "none";


  entryStatus.textContent =
    "Eintrag kann geändert werden.";

}


function confirmPendingEntry() {

  if (!pendingEntry) {
    return;
  }


  const savedEntry = {

    ...pendingEntry,

    confirmed:
      true

  };


  timeEntries.push(
    savedEntry
  );


  saveTimeEntries();


  pendingEntry =
    null;


  entrySummary.style.display =
    "none";


  entryDate.value =
    getTodayString();

  entryHours.value =
    "";

  entryCommission.value =
    "";

  entryActivity.value =
    "";


  entryStatus.textContent =
    "Eintrag gespeichert.";

}


/* =========================
   AUSWERTUNG
========================= */

function renderEvaluation() {

  const now =
    new Date();

  const startOfYear =
    getStartOfYear(
      now
    );

  const endOfYear =
    getEndOfYear(
      now
    );


  /*
    Sitzungen dieses Jahr:
    nur quittierte Einträge
    vom 01.01. bis 31.12.
  */

  const yearEntries =
    timeEntries.filter(
      function(entry) {

        if (
          entry.confirmed === false
        ) {
          return false;
        }


        const date =
          getEntryDate(
            entry
          );


        return (
          date &&
          date >= startOfYear &&
          date <= endOfYear
        );

      }
    );


  /*
    Anzahl Sitzungen
    des aktuellen Kalenderjahres.
  */

  evaluationSessions.textContent =
    countSessions(
      yearEntries
    );


  /*
    Stunden des aktuellen
    Kalenderjahres.
  */

  evaluationYear.textContent =
    formatHours(
      calculateTotal(
        yearEntries
      )
    );


  renderCommissionEvaluation();

}


function renderCommissionEvaluation() {

  evaluationCommissions.innerHTML =
    "";


  const commissionGroups =
    {};


  timeEntries.forEach(
    function(entry) {

      if (
        entry.confirmed === false
      ) {
        return;
      }


      const commission =
        entry.commission ||
        "Ohne Kommission";


      if (
        !commissionGroups[
          commission
        ]
      ) {

        commissionGroups[
          commission
        ] = [];

      }


      commissionGroups[
        commission
      ].push(
        entry
      );

    }
  );


  const commissionNames =
    Object.keys(
      commissionGroups
    ).sort(
      function(a, b) {

        return a.localeCompare(
          b,
          "de"
        );

      }
    );


  if (
    commissionNames.length === 0
  ) {

    evaluationCommissions.textContent =
      "Noch keine Einträge vorhanden.";

    return;

  }


  const list =
    document.createElement(
      "div"
    );

  list.className =
    "commission-evaluation-list";


  commissionNames.forEach(
    function(commission) {

      const entries =
        commissionGroups[
          commission
        ]
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
                getEntryDate(
                  entry
                )

            };

          }
        )
        .sort(
          function(a, b) {

            if (
              !a.date &&
              !b.date
            ) {
              return 0;
            }

            if (!a.date) {
              return 1;
            }

            if (!b.date) {
              return -1;
            }

            return (
              b.date.getTime() -
              a.date.getTime()
            );

          }
        );


      const block =
        document.createElement(
          "div"
        );

      block.className =
        "commission-block";


      const summary =
        document.createElement(
          "button"
        );

      summary.type =
        "button";

      summary.className =
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


      /*
        ZUERST SITZUNGEN
      */

      const sessions =
        document.createElement(
          "div"
        );

      sessions.className =
        "commission-summary-sessions";


      const sessionCount =
        countSessions(
          entries
        );


      sessions.textContent =
        sessionCount +
        (
          sessionCount === 1
            ? " Sitzung"
            : " Sitzungen"
        );


      /*
        DANACH STUNDEN
      */

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
              function(detail) {

                return detail.entry;

              }
            )
          )
        );


      content.appendChild(
        name
      );

      content.appendChild(
        sessions
      );

      content.appendChild(
        hours
      );


      const arrow =
        document.createElement(
          "span"
        );

      arrow.className =
        "commission-arrow";

      arrow.textContent =
        "＋";


      summary.appendChild(
        content
      );

      summary.appendChild(
        arrow
      );


      const details =
        document.createElement(
          "div"
        );

      details.className =
        "commission-details-list";


      /*
        Details zunächst
        geschlossen.
      */

      details.style.display =
        "none";


      entries.forEach(
        function(detail) {

          const swipeEntry =
            createSwipeEntry(
              detail.entry,
              detail.originalIndex
            );


          details.appendChild(
            swipeEntry
          );

        }
      );


      summary.addEventListener(
        "click",
        function() {

          const isOpen =
            details.style.display !==
            "none";


          if (isOpen) {

            details.style.display =
              "none";

            summary.classList.remove(
              "open"
            );

            arrow.textContent =
              "＋";

          } else {

            details.style.display =
              "grid";

            summary.classList.add(
              "open"
            );

            arrow.textContent =
              "−";

          }

        }
      );


      block.appendChild(
        summary
      );

      block.appendChild(
        details
      );


      list.appendChild(
        block
      );

    }
  );


  evaluationCommissions.appendChild(
    list
  );

}


function createSwipeEntry(
  entry,
  originalIndex
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


  deleteButton.addEventListener(
    "click",
    function() {

      deleteTimeEntry(
        originalIndex
      );

    }
  );


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
    formatDate(
      getEntryDate(
        entry
      )
    );


  const activity =
    document.createElement(
      "div"
    );

  activity.textContent =
    entry.activity ||
    "Keine Tätigkeit";


  const hours =
    document.createElement(
      "small"
    );

  hours.textContent =
    formatHours(
      Number(entry.hours)
    );


  const badge =
    document.createElement(
      "span"
    );

  badge.className =
    "confirmed-badge";

  badge.textContent =
    "Quittiert";


  content.appendChild(
    date
  );

  content.appendChild(
    activity
  );

  content.appendChild(
    hours
  );

  content.appendChild(
    badge
  );


  wrapper.appendChild(
    deleteButton
  );

  wrapper.appendChild(
    content
  );


  enableSwipe(
    content
  );


  return wrapper;

}


function enableSwipe(element) {

  let startX =
    0;

  let currentX =
    0;

  let dragging =
    false;


  element.addEventListener(
    "touchstart",
    function(event) {

      if (
        !event.touches ||
        !event.touches[0]
      ) {
        return;
      }

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


  element.addEventListener(
    "touchmove",
    function(event) {

      if (
        !dragging ||
        !event.touches ||
        !event.touches[0]
      ) {
        return;
      }


      currentX =
        event.touches[0].clientX;


      const distance =
        currentX -
        startX;


      if (
        distance < 0
      ) {

        const limited =
          Math.max(
            distance,
            -90
          );

        element.style.transform =
          "translateX(" +
          limited +
          "px)";

      }

    },
    {
      passive: true
    }
  );


  element.addEventListener(
    "touchend",
    function() {

      if (!dragging) {
        return;
      }

      dragging =
        false;


      const distance =
        currentX -
        startX;


      if (
        distance < -45
      ) {

        element.style.transform =
          "translateX(-90px)";

      } else {

        element.style.transform =
          "translateX(0)";

      }

    }
  );

}


function deleteTimeEntry(index) {

  if (
    index < 0 ||
    index >= timeEntries.length
  ) {
    return;
  }


  const confirmed =
    confirm(
      "Diesen Eintrag wirklich löschen?"
    );


  if (!confirmed) {
    return;
  }


  timeEntries.splice(
    index,
    1
  );


  saveTimeEntries();

  renderEvaluation();

}


/* =========================
   EXPORT
========================= */

function csvEscape(value) {

  const text =
    String(
      value ?? ""
    );


  if (
    text.includes(";") ||
    text.includes('"') ||
    text.includes("\n")
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


function formatExportHours(hours) {

  return Number(
    hours
  ).toLocaleString(
    "de-CH",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );

}


function exportCsv() {

  const from =
    exportFrom.value
      ? parseDateString(
          exportFrom.value
        )
      : null;


  const to =
    exportTo.value
      ? parseDateString(
          exportTo.value
        )
      : null;


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
    timeEntries
      .filter(
        function(entry) {

          if (
            entry.confirmed === false
          ) {
            return false;
          }


          const date =
            getEntryDate(
              entry
            );


          if (!date) {
            return false;
          }


          if (
            from &&
            date < from
          ) {
            return false;
          }


          if (
            to
          ) {

            const endDate =
              new Date(
                to.getFullYear(),
                to.getMonth(),
                to.getDate(),
                23,
                59,
                59,
                999
              );


            if (
              date > endDate
            ) {
              return false;
            }

          }


          return true;

        }
      )
      .sort(
        function(a, b) {

          const dateA =
            getEntryDate(
              a
            );

          const dateB =
            getEntryDate(
              b
            );


          if (!dateA && !dateB) {
            return 0;
          }

          if (!dateA) {
            return 1;
          }

          if (!dateB) {
            return -1;
          }


          return (
            dateA.getTime() -
            dateB.getTime()
          );

        }
      );


  const profile =
    getProfile();


  const rows = [];


  rows.push([
    "Name",
    profile.lastName || ""
  ]);

  rows.push([
    "Vorname",
    profile.firstName || ""
  ]);

  rows.push([
    "Adresse",
    profile.address || ""
  ]);

  rows.push([
    "PLZ",
    profile.zip || ""
  ]);

  rows.push([
    "Ort",
    profile.city || ""
  ]);

  rows.push([
    "Partei",
    profile.party || ""
  ]);


  if (
    from ||
    to
  ) {

    rows.push([
      "Zeitraum",
      (
        from
          ? formatDate(from)
          : "–"
      ) +
      " bis " +
      (
        to
          ? formatDate(to)
          : "–"
      )
    ]);

  }


  rows.push([]);

  rows.push([
    "Datum",
    "Kommission",
    "Tätigkeit",
    "Stunden"
  ]);


  filtered.forEach(
    function(entry) {

      rows.push([
        formatDate(
          getEntryDate(
            entry
          )
        ),
        entry.commission ||
          "Ohne Kommission",
        entry.activity || "",
        formatExportHours(
          Number(
            entry.hours
          )
        )
      ]);

    }
  );


  const total =
    calculateTotal(
      filtered
    );


  rows.push([
    "",
    "",
    "Gesamt",
    formatExportHours(
      total
    )
  ]);


  const csv =
    rows
      .map(
        function(row) {

          return row
            .map(
              csvEscape
            )
            .join(";");

        }
      )
      .join("\r\n");


  const blob =
    new Blob(
      [
        "\uFEFF" +
        csv
      ],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


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
    "Ravo_Stunden.csv";

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  URL.revokeObjectURL(
    url
  );

}


function resetExportFilter() {

  exportFrom.value =
    "";

  exportTo.value =
    "";

}


/* =========================
   THEME
========================= */

function applyTheme(theme) {

  if (
    theme !== "dark"
  ) {

    theme =
      "light";

  }


  document.body.dataset.theme =
    theme;


  localStorage.setItem(
    THEME_KEY,
    theme
  );


  updateThemeButtons();

}


function loadTheme() {

  const stored =
    localStorage.getItem(
      THEME_KEY
    );


  if (
    stored === "dark"
  ) {

    applyTheme(
      "dark"
    );

  } else {

    applyTheme(
      "light"
    );

  }

}


function updateThemeButtons() {

  const theme =
    document.body.dataset.theme;


  lightModeButton.classList.toggle(
    "selected",
    theme === "light"
  );


  darkModeButton.classList.toggle(
    "selected",
    theme === "dark"
  );

}


/* =========================
   EVENTS
========================= */

evaluationNav.addEventListener(
  "click",
  showEvaluation
);


entryNav.addEventListener(
  "click",
  showEntry
);


commissionNav.addEventListener(
  "click",
  showCommissions
);


settingsButton.addEventListener(
  "click",
  showSettings
);


saveEntryButton.addEventListener(
  "click",
  createPendingEntry
);


editEntryButton.addEventListener(
  "click",
  editPendingEntry
);


confirmEntryButton.addEventListener(
  "click",
  confirmPendingEntry
);


addCommissionButton.addEventListener(
  "click",
  addCommission
);


commissionName.addEventListener(
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


saveProfileButton.addEventListener(
  "click",
  saveProfile
);


lightModeButton.addEventListener(
  "click",
  function() {

    applyTheme(
      "light"
    );

  }
);


darkModeButton.addEventListener(
  "click",
  function() {

    applyTheme(
      "dark"
    );

  }
);


exportButton.addEventListener(
  "click",
  exportCsv
);


exportResetButton.addEventListener(
  "click",
  resetExportFilter
);


/* =========================
   START
========================= */

loadData();

loadProfile();

loadTheme();

entryDate.value =
  getTodayString();

renderCommissions();

renderEvaluation();

/*
  App startet immer
  auf Auswertung.
*/

showEvaluation();
