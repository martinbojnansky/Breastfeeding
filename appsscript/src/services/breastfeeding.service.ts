import { formatElapsedTimeInMinutes, getElapsedTimeInMinutes } from "../utils/datetime.utils";
import { returnWithLog } from "../utils/log.utils";

export type BreastFeedingCommand =
   'start breastfeeding' 
   | 'stop breastfeeding' 
   | 'end breastfeeding' 
   | 'last breastfeeding' 
   | 'breastfeeding report'
;

export class BreastfeedingService {

  public getBreastfeedingReport(): string {
    const sheet = this.getBreastfeedingSheet(); 
    
    // Find last breastfeeding
    const lastBreastfeeding = sheet.getRange(sheet.getMaxRows(), 1, 1, 3).getValues()[0];

    const startDate = new Date(lastBreastfeeding[0]);
    const now = new Date();
    if(lastBreastfeeding[1] === "") {
      const elapsedTimeStart = getElapsedTimeInMinutes(startDate, now);
      return returnWithLog(`Last breastfeeding started ${formatElapsedTimeInMinutes(elapsedTimeStart)} ago and is not yet ended.`);
    } else {
      const endDate = new Date(lastBreastfeeding[1]);
      const elapsedTimeEnd = getElapsedTimeInMinutes(endDate, now);
      const elapsedTimeFeeding = getElapsedTimeInMinutes(startDate, endDate);
      return returnWithLog(`Last breastfeeding ended ${formatElapsedTimeInMinutes(elapsedTimeEnd)} ago, took ${formatElapsedTimeInMinutes(elapsedTimeFeeding)}, and was on the ${lastBreastfeeding[2]} breast.`);
    }
  }

  public startBreastfeeding(): string {
    const sheet = this.getBreastfeedingSheet(); 
    
    // Find last breastfeeding
    const lastBreastfeeding = sheet.getRange(sheet.getMaxRows(), 1, 1, 3).getValues()[0];
    const lastBreastfeedingReport = this.getBreastfeedingReport();

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

  public stopBreastfeeding(): string {
    const sheet = this.getBreastfeedingSheet(); 
    
    // Find last breastfeeding
    const lastBreastfeeding = sheet.getRange(sheet.getMaxRows(), 1, 1, 3).getValues()[0];
    
    // Check if any breastfeeding is active
    if(lastBreastfeeding[1] !== "") {
      return this.getBreastfeedingReport();
    }

    // Add new record without end
    const now = new Date();
    sheet.getRange(sheet.getMaxRows(), 2).setValue(now.toISOString());
    const elapsedTime = getElapsedTimeInMinutes(new Date(lastBreastfeeding[0]), now);
    sheet.getRange(sheet.getMaxRows(), 4).setValue(formatElapsedTimeInMinutes(elapsedTime));

    return returnWithLog(`Breastfeeding stopped after ${formatElapsedTimeInMinutes(elapsedTime)}.`);
  }

  private getBreastfeedingSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const spreadsheet = SpreadsheetApp.openById("1LKlYrqYchOm6gw93O_6ACGPKd7dWnUZk3NF3qnpbRQg");
    const sheet = spreadsheet.getSheetByName("Breastfeeding");
    return sheet;
  }
}