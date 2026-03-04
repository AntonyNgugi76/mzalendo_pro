const cron = require("node-cron");
const DailyRecord = require("../models/DailyRecord");

const runRolloverJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily rollover job...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await DailyRecord.find({
      date: today,
    });

    for (const record of records) {
      const deficit = record.requiredHours - record.workedHours;

      if (deficit <= 0) continue;

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      await DailyRecord.findOneAndUpdate(
        {
          employeeId: record.employeeId,
          date: tomorrow,
        },
        {
          employeeId: record.employeeId,
          companyId: record.companyId,
          date: tomorrow,
          requiredHours: 8 + deficit,
        },
        { upsert: true }
      );
    }
  });
};

module.exports = runRolloverJob;
