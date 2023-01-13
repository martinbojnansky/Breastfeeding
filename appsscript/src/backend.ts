import { BreastFeedingCommand, BreastfeedingService } from "./services/breastfeeding.service";

const breastfeedingService: BreastfeedingService = new BreastfeedingService();

export default {
  
  doGet: () => {
    const template = HtmlService.createTemplateFromFile('index');
    template.result = breastfeedingService.getBreastfeedingReport();
    return template.evaluate();
  },

  doPost: (e: { parameter: { command: BreastFeedingCommand, raw?: boolean } }) => {
    const result = (() => {
      switch(e?.parameter?.command?.toLowerCase()) {
        case 'last breastfeeding':
        case 'breastfeeding report':
          return breastfeedingService.getBreastfeedingReport();
        case 'start breastfeeding':
          return breastfeedingService.startBreastfeeding();
        case 'stop breastfeeding':
        case 'end breastfeeding':
          return breastfeedingService.stopBreastfeeding();
        default:
          return `I don't understand.`;
      }
    })();
    
    return e?.parameter?.raw ? result : ContentService.createTextOutput(result);
  }
  
}


