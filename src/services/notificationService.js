const admin = require("../configs/firebase");

class NotificationService {
  static async sendNotification(deviceToken, title, body) {
    if (!deviceToken) return;

    const message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
    };

    try {
      await admin.messaging().send(message);
    } catch (error) {
      console.error("Notification error:", error);
    }
  }
}

module.exports = NotificationService;
