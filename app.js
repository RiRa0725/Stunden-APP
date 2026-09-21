const enteredValue =
  hoursInput.value
    .trim()
    .replace(",", ".");

const hours =
  Number(enteredValue);

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
