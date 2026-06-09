var DRIVE_FOLDER_ID = '120k9meYdQ2njgJkkVTyA8AxZTC6NhOTx';   // Areas > Finance > Receipt Photos
var SHEET_ID        = '1AyxJw7YyaQAnc8Pz41BvoVOqEKXVqz89tr7PSJBMnUA'; // Areas > Finance > Receipt Tracker

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Save file to Drive
    var fileBytes  = Utilities.base64Decode(data.fileData);
    var blob       = Utilities.newBlob(fileBytes, data.mimeType, data.fileName);
    var folder     = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var driveFile  = folder.createFile(blob);

    // Make the file viewable by anyone with the link
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileUrl = driveFile.getUrl();

    // Append row to Sheet
    var sheet     = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var submitted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([
      data.date,
      data.company,
      Number(data.amount),
      data.description,
      fileUrl,
      submitted,
    ]);

    return buildResponse({ status: 'ok' });

  } catch (err) {
    return buildResponse({ status: 'error', message: err.message });
  }
}

// Required for CORS preflight — Apps Script needs a doGet to respond to OPTIONS.
function doGet(e) {
  return buildResponse({ status: 'ok', message: 'Receipt Tracker backend is running.' });
}

function buildResponse(obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
