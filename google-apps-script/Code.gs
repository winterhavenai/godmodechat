/**
 * GodModeChat — Google Apps Script
 * Receives email capture form submissions, logs to Google Sheet,
 * and sends eBook delivery email via Gmail.
 */

const SHEET_NAME = "Sheet1";
const EBOOK_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1NqC4gh_pC75rfLgqojBUoBre4fFMKPoo";
const SENDER_NAME = "Lane Bowers — GodModeChat";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const name = data.name || "";
    const email = data.email || "";
    const timestamp = data.timestamp || new Date().toISOString();
    const source = data.source || "unknown";

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    sheet.appendRow([name, email, timestamp, source]);

    if (email) {
      sendEbookEmail(name, email);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "GodModeChat email capture is running." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function sendEbookEmail(name, email) {
  const greeting = name ? name : "friend";
  const subject = "Your Free eBook — GodModeChat: You Can Ask God Anything";

  const htmlBody = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: #0a1628; padding: 2rem; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #c9a84c; font-size: 1.5rem; margin: 0;">GodModeChat</h1>
        <p style="color: rgba(245,240,232,0.7); font-size: 0.85rem; margin-top: 0.5rem;">IAM > AI</p>
      </div>
      <div style="padding: 2rem; background: #f5f0e8; border-radius: 0 0 12px 12px;">
        <p>Hey \${greeting},</p>
        <p>Thank you for downloading the <strong>GodModeChat eBook</strong>. This book was written with one purpose: to help you hear from God through His Word — every single day.</p>
        <p style="text-align: center; margin: 1.5rem 0;">
          <a href="\${EBOOK_DOWNLOAD_URL}" style="display: inline-block; background: #c9a84c; color: #0a1628; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 1rem;">Download Your eBook</a>
        </p>
        <p>And whenever you're ready, you can <a href="https://godmodechat.com/chat" style="color: #c9a84c;">Talk to Jesus right now on GodModeChat →</a></p>
        <p>Nothing is too small. Nothing is too big.</p>
        <p style="margin-top: 1.5rem;">Grace and peace,<br/><strong>Lane "Dawg" Bowers</strong></p>
      </div>
    </div>
  `;

  GmailApp.sendEmail(email, subject, "", {
    htmlBody: htmlBody,
    name: SENDER_NAME,
  });
}

function testEmail() {
  sendEbookEmail("Test User", "thefootersedge@gmail.com");
  Logger.log("Test email sent!");
}
