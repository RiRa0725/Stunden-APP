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

const evaluationWeek =
  document.getElementById("evaluationWeek");

const evaluationMonth =
  document.getElementById("evaluationMonth");

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


/* =========================
   EINSTELLUNGEN
========================= */

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


/* =========================
   SPEICHER-SCHLÜSSEL
========================= */

const ENTRIES_KEY =
  "zeitpol_entries";

const COMMISSIONS_KEY =
  "zeitpol_commissions";

const USER_PROFILE_KEY =
  "zeitpol_user_profile";

const OLD_USER_NAME_KEY =
  "zeitpol_user_name";


let timeEntries = [];

let commissions = [];

let pendingEntry = null;


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
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
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


  if (
    savedEntries
  ) {

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


  if (
    savedCommissions
  ) {

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
   ALTE EINTRÄGE
========================= */

timeEntries.forEach(
  function(entry) {

    if (
      typeof entry.confirmed !==
      "boolean"
    ) {

      entry.confirmed =
        true;

    }

  }
);


/* =========================
   BENUTZERPROFIL LADEN
========================= */

function loadUserProfile() {

  let profile = {

    lastName:
      "",

    firstName:
      "",

    address:
      "",

    zip:
      "",

    city:
      "",

    party:
      ""

  };


  try {

    const savedProfile =
      localStorage.getItem(
        USER_PROFILE_KEY
      );


    if (
      savedProfile
    ) {

      const parsedProfile =
        JSON.parse(
          savedProfile
        );


      if (
        parsedProfile &&
        typeof parsedProfile ===
        "object"
      ) {

        profile = {

          ...profile,
          ...parsedProfile

        };

      }

    }

  } catch (error) {

    profile = {

      lastName:
        "",

      firstName:
        "",

      address:
        "",

      zip:
        "",

      city:
        "",

      party:
        ""

    };

  }


  /*
    Übernahme des bisherigen
    gespeicherten Namens.
  */

  const oldName =
    localStorage.getItem(
      OLD_USER_NAME_KEY
    );


  if (
    oldName &&
    !profile.lastName &&
    !profile.firstName
  ) {

    const parts =
      oldName.trim().split(/\s+/);


    if (
      parts.length >= 2
    ) {

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


loadUserProfile();


/* =========================
   STANDARD-KOMMISSIONEN
========================= */

if (
  commissions.length ===
  0
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
        maximumFractionDigits:
          2
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
        getHours(entry);

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
    commissions.length ===
    0
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
   KOMMISSIONEN
========================= */

function renderCommissionList() {

  commissionList.innerHTML =
    "";


  if (
    commissions.length ===
    0
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


  if (
    exists
  ) {

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
   KOMMISSION UMBENENNEN
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


      if (
        exists
      ) {

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
   KOMMISSION LÖSCHEN
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


  saveCommissions();


  renderCommissionSelect();

  renderCommissionList();

  renderEvaluation();

}


/* =========================
   NEUEN EINTRAG VORBEREITEN
========================= */

function prepareEntry() {

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
    !Number.isFinite(
      hours
    ) ||
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


  pendingEntry = {

    date:
      selectedDate,

    hours:
      hours.toLocaleString(
        "de-CH",
        {
          maximumFractionDigits:
            2
        }
      ),

    commission:
      commissionInput.value,

    activity:
      activityInput.value.trim()

  };


  showPendingSummary();

}


/* =========================
   ZUSAMMENFASSUNG
========================= */

function showPendingSummary() {

  if (
    !pendingEntry
  ) {

    entrySummary.style.display =
      "none";


    return;

  }


  const date =
    getEntryDate(
      pendingEntry
    );


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
    "";


  entryStatus.textContent =
    "";

}


/* =========================
   EINTRAG ÄNDERN
========================= */

function editPendingEntry() {

  if (
    !pendingEntry
  ) {

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


  entryStatus.textContent =
    "";


  hoursInput.focus();

}


/* =========================
   EINTRAG QUITTIEREN
========================= */

function confirmEntry() {

  if (
    !pendingEntry
  ) {

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


  timeEntries.push(
    entry
  );


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


  hoursInput.focus();

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


  const monthEntries =
    timeEntries.filter(
      function(entry) {

        if (
          entry.confirmed ===
          false
        ) {

          return false;

        }


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


  const weekEntries =
    timeEntries.filter(
      function(entry) {

        if (
          entry.confirmed ===
          false
        ) {

          return false;

        }


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


  const commissionGroups =
    {};


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
    ).sort();


  if (
    commissionNames.length ===
    0
  ) {

    evaluationCommissions.className =
      "empty-state";


    evaluationCommissions.textContent =
      "Noch keine Einträge vorhanden.";


    return;

  }


  evaluationCommissions.className =
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


      const commissionBlock =
        document.createElement(
          "section"
        );


      commissionBlock.className =
        "commission-block";


      const commissionHeader =
        document.createElement(
          "button"
        );


      commissionHeader.type =
        "button";


      commissionHeader.className =
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
          calculateTotal(
            entries.map(
              function(detail) {

                return detail.entry;

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
        hours
      );


      commissionHeader.appendChild(
        content
      );


      commissionHeader.appendChild(
        arrow
      );


      commissionBlock.appendChild(
        commissionHeader
      );


      const detailsList =
        document.createElement(
          "div"
        );


      detailsList.className =
        "commission-details-list";


      detailsList.style.display =
        "none";


      entries.forEach(
        function(detail) {

          createSwipeEntry(
            detail,
            detailsList
          );

        }
      );


      commissionBlock.appendChild(
        detailsList
      );


      commissionHeader.addEventListener(
        "click",
        function() {

          const currentlyOpen =
            detailsList.style.display !==
            "none";


          if (
            currentlyOpen
          ) {

            detailsList.style.display =
              "none";


            arrow.textContent =
              "＋";


            commissionHeader.classList.remove(
              "open"
            );

          } else {

            detailsList.style.display =
              "grid";


            arrow.textContent =
              "−";


            commissionHeader.classList.add(
              "open"
            );

          }

        }
      );


      evaluationCommissions.appendChild(
        commissionBlock
      );

    }
  );

}


/* =========================
   SWIPE-EINTRAG
========================= */

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


  const deleteAction =
    document.createElement(
      "button"
    );


  deleteAction.type =
    "button";


  deleteAction.className =
    "swipe-delete";


  deleteAction.textContent =
    "Löschen";


  deleteAction.setAttribute(
    "aria-label",
    "Eintrag löschen"
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
    detail.date
      ? formatDate(detail.date)
      : "Datum unbekannt";


  const hours =
    document.createElement(
      "div"
    );


  hours.textContent =
    detail.entry.hours +
    " Std.";


  const activity =
    document.createElement(
      "small"
    );


  activity.textContent =
    detail.entry.activity ||
    "Keine Tätigkeit angegeben";


  const status =
    document.createElement(
      "span"
    );


  status.className =
    "confirmed-badge";


  status.textContent =
    "Quittiert";


  content.appendChild(
    date
  );


  content.appendChild(
    hours
  );


  content.appendChild(
    activity
  );


  content.appendChild(
    status
  );


  wrapper.appendChild(
    deleteAction
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

      if (
        !dragging
      ) {

        return;

      }


      currentX =
        event.touches[0].clientX;


      const difference =
        currentX -
        startX;


      if (
        difference < 0
      ) {

        const offset =
          Math.max(
            -90,
            difference
          );


        content.style.transform =
          "translateX(" +
          offset +
          "px)";

      }

    },
    {
      passive: true
    }
  );


  content.addEventListener(
    "touchend",
    function() {

      if (
        !dragging
      ) {

        return;

      }


      dragging =
        false;


      const difference =
        currentX -
        startX;


      if (
        difference <= -50
      ) {

        content.classList.add(
          "swiped"
        );


        content.style.transform =
          "translateX(-90px)";

      } else {

        content.classList.remove(
          "swiped"
        );


        content.style.transform =
          "translateX(0)";

      }

    }
  );


  deleteAction.addEventListener(
    "click",
    function(event) {

      event.stopPropagation();


      deleteTimeEntry(
        detail.originalIndex
      );

    }
  );

}


/* =========================
   ZEITEINTRAG LÖSCHEN
========================= */

function deleteTimeEntry(
  index
) {

  if (
    index < 0 ||
    index >= timeEntries.length
  ) {

    return;

  }


  const confirmed =
    confirm(
      "Diesen quittierten Zeiteintrag wirklich löschen?"
    );


  if (
    !confirmed
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


/* =========================
   BENUTZERPROFIL
========================= */

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
    .filter(
      Boolean
    )
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


  if (
    lastName === ""
  ) {

    userNameStatus.textContent =
      "Bitte gib deinen Namen ein.";


    userLastNameInput.focus();


    return;

  }


  if (
    firstName === ""
  ) {

    userNameStatus.textContent =
      "Bitte gib deinen Vornamen ein.";


    userFirstNameInput.focus();


    return;

  }


  const profile =
    getUserProfile();


  localStorage.setItem(
    USER_PROFILE_KEY,
    JSON.stringify(
      profile
    )
  );


  /*
    Alten Schlüssel ebenfalls
    aktuell halten, damit ältere
    Versionen der App den Namen
    weiterhin finden.
  */

  localStorage.setItem(
    OLD_USER_NAME_KEY,
    getDisplayName()
  );


  renderUserName();


  userNameStatus.textContent =
    "Angaben gespeichert.";

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

  const confirmedEntries =
    timeEntries.filter(
      function(entry) {

        return (
          entry.confirmed !==
          false
        );

      }
    );


  if (
    confirmedEntries.length ===
    0
  ) {

    alert(
      "Es sind noch keine quittierten Zeiteinträge vorhanden."
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
    confirmedEntries.filter(
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


        const year =
          entryDate.getFullYear();


        const month =
          String(
            entryDate.getMonth() + 1
          ).padStart(
            2,
            "0"
          );


        const day =
          String(
            entryDate.getDate()
          ).padStart(
            2,
            "0"
          );


        const entryDateString =
          year +
          "-" +
          month +
          "-" +
          day;


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
      "Für den gewählten Zeitraum wurden keine quittierten Einträge gefunden."
    );


    return;

  }


  const sortedEntries =
    [...filteredEntries].sort(
      function(a, b) {

        const dateA =
          getEntryDate(
            a
          );


        const dateB =
          getEntryDate(
            b
          );


        const timeA =
          dateA
            ? dateA.getTime()
            : 0;


        const timeB =
          dateB
            ? dateB.getTime()
            : 0;


        return (
          timeA -
          timeB
        );

      }
    );


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


  const rows =
    [];


  /*
    Excel-Liste:
    Datum | Kommission | Tätigkeit | Stunden
  */

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
          ? formatDate(date)
          : "";


      const hours =
        getHours(
          entry
        );


      rows.push(
        [
          dateText,
          entry.commission || "",
          entry.activity || "",
          hours.toLocaleString(
            "de-CH",
            {
              maximumFractionDigits:
                2
            }
          )
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
          maximumFractionDigits:
            2
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
    "Ravo_Excel_" +
    getTodayString();


  if (
    fromValue &&
    toValue
  ) {

    filename =
      "Ravo_Excel_" +
      fromValue +
      "_bis_" +
      toValue;

  } else if (
    fromValue
  ) {

    filename =
      "Ravo_Excel_ab_" +
      fromValue;

  } else if (
    toValue
  ) {

    filename =
      "Ravo_Excel_bis_" +
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
          "Ravo Excel Export",

        text:
          "Zeiterfassung aus Ravo",

        files:
          [file]

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


  entryStatus.textContent =
    "";

}


function showEvaluation() {

  clearSections();

  clearNavActive();


  evaluationSection.style.display =
    "";


  navEvaluation.classList.add(
    "active"
  );


  exportDetails.open =
    false;


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


  userNameStatus.textContent =
    "";


  userLastNameInput.focus();

}


/* =========================
   BUTTONS
========================= */

addEntryButton.addEventListener(
  "click",
  function() {

    prepareEntry();

  }
);


editEntryButton.addEventListener(
  "click",
  function() {

    editPendingEntry();

  }
);


confirmEntryButton.addEventListener(
  "click",
  function() {

    confirmEntry();

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

    saveUserProfile();

  }
);


[
  userLastNameInput,
  userFirstNameInput,
  userAddressInput,
  userZipInput,
  userCityInput,
  userPartyInput
].forEach(
  function(input) {

    input.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          saveUserProfile();

        }

      }
    );

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
