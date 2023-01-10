function doPost(request) {
  const command = `${request.parameter.command}`.toLowerCase();
  return ContentService.createTextOutput(runCommand(command));
}

function runCommand(command) {
  switch(command) {
    case 'start feeding':
      return startBreastfeeding();
    case 'stop feeding':
    case 'end feeding':
      return stopBreastfeeding();
    case 'last feeding':
      return reportBreastfeeding();
    default:
      return `I don't understand.`;
  }
}

function getBreastfeedingSheet() {
    const spreadsheet = SpreadsheetApp.openById("1LKlYrqYchOm6gw93O_6ACGPKd7dWnUZk3NF3qnpbRQg");
    const sheet = spreadsheet.getSheetByName("Breastfeeding");
    return sheet;
}

function startBreastfeeding() {
  const sheet = getBreastfeedingSheet(); 
  
  // Find last breast
  const lastBreastfeeding = sheet.getRange(sheet.getMaxRows(), 1, 1, 3).getValues()[0];
  const lastBreastfeedingReport = reportBreastfeeding();

  // Check if previous breastfeeding ended
  if(lastBreastfeeding[1] === "") {
    return lastBreastfeedingReport;
  }
  
  // Figure out which breast is next
  let nextBreast = 'left'
  if(lastBreastfeeding[2] === "left") {
    nextBreast = 'right';
  }

  // Add new record without end
  const now = new Date();
  sheet.appendRow([now.toISOString(),"", nextBreast]);

  return returnWithLog(`Start breastfeeding on the ${nextBreast} breast. ${lastBreastfeedingReport}`);
}

function stopBreastfeeding() {
  const sheet = getBreastfeedingSheet(); 
  
  // Find last breastfeeding
  const lastBreastfeeding = sheet.getRange(sheet.getMaxRows(), 1, 1, 3).getValues()[0];
  
  // Check if any breastfeeding is active
  if(lastBreastfeeding[1] !== "") {
    return reportBreastfeeding();
  }

  // Add new record without end
  const now = new Date();
  sheet.getRange(sheet.getMaxRows(), 2).setValue(now.toISOString());
  const elapsedTime = getElapsedTime(new Date(lastBreastfeeding[0]), now);
  sheet.getRange(sheet.getMaxRows(), 4).setValue(formatElapsedTime(elapsedTime));

  return returnWithLog(`Breastfeeding stopped after ${formatElapsedTime(elapsedTime)}.`);
}

function reportBreastfeeding() {
  const sheet = getBreastfeedingSheet(); 
  
  // Find last breastfeeding
  const lastBreastfeeding = sheet.getRange(sheet.getMaxRows(), 1, 1, 3).getValues()[0];

  const startDate = new Date(lastBreastfeeding[0]);
  const now = new Date();
  if(lastBreastfeeding[1] === "") {
    const elapsedTimeStart = getElapsedTime(startDate, now);
    return returnWithLog(`Last breastfeeding started ${formatElapsedTime(elapsedTimeStart)} ago and is not yet ended.`);
  } else {
    const endDate = new Date(lastBreastfeeding[1]);
    const elapsedTimeEnd = getElapsedTime(endDate, now);
    const elapsedTimeFeeding = getElapsedTime(startDate, endDate);
    return returnWithLog(`Last breastfeeding ended ${formatElapsedTime(elapsedTimeEnd)} ago and took ${formatElapsedTime(elapsedTimeFeeding)}.`);
  }
}

function getElapsedTime(start, end) {
  return (end.getTime()-(start.getTime())) / 60000;
}

function formatElapsedTime(time) {
  return `${Math.floor(time)} minutes and ${Math.floor((time - Math.floor(time)) *60 )} seconds`
}

function returnWithLog(msg) {
  Logger.log(msg);
  return msg;
}
