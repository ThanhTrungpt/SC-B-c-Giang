/**
 * Entry point for the web application.
 * Returns the HTML output for the repair management interface.
 * @returns {HtmlOutput} The HTML interface for repair management
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('HTML_1BAOSUA')
    .setTitle('Phần mềm quản lý sửa chữa - Bệnh viện Đa khoa Bắc Giang')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
} 