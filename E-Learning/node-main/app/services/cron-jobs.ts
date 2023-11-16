import moment from "moment";
import {
  StudentTest,
  User,
  op as Op,
  Student,
  StudentAssignment,
} from "../../sequelize";
import { Logger } from "../../sequelize/utils/logger";
import { Email } from "./email";
import { generateEmailFormat } from "./email/email-templates";
import { PaymentPlansUtil } from "./payment/payment-plans";
import { GetStripeAccount } from "./payment/stripe-account";
import cron from "node-cron";
import nodemailer, { Transporter } from "nodemailer";

export async function initializeNotifyCronJobs() {
  cron.schedule("0 */30 * * * *", () => {
    SendMailsForUpcomingScheduleTest();
    SendMailsForUpcomingScheduleAssignment();
    SendMailsForEndingScheduleTest();
    SendMailsForEndingScheduleAssignment();
  });
}

export async function PaySubscriptions() {
  try {
    let stripeAccount = GetStripeAccount();
    let expiringPlans = await PaymentPlansUtil.getExpiringSubscriptions();
    for (let plan of expiringPlans) {
      try {
        let planUtil = await PaymentPlansUtil.init(
          plan.user.userId,
          stripeAccount
        );
        let source = await planUtil.sources.getUserDefaultCard();
        if (source) {
          let currentDate = moment(new Date()).set({ h: 0, m: 0, s: 0 });
          let paymentPlanActivate = {
            source, // Stripe Source
            startDate: currentDate.toDate(), // Current Date
            // Current Date + Plan Duration to get Expiry
            endDate: currentDate.add(plan.planDurationInDays, "days").toDate(),
          };

          let activatedPlan = await planUtil.activatePlan(
            paymentPlanActivate as any
          );
        }
      } catch (error) {}
    }
  } catch (error) {
    Logger.error(error);
  }
}

export async function SendMailsForUpcomingScheduleTest() {
  try {
    let scheduleTest = await StudentTest.findAll({
      include: [
        {
          model: Student,
          include: [User],
        },
      ],
      where: {
        startTime: {
          [Op.between]: [
            moment().format("YYYY-MM-DD HH:mm:ss"),
            moment().add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      } as any,
    });

    scheduleTest.forEach(async (st) => {
      let student = st.user.user;
      let emailFormat = generateEmailFormat(
        "Exam coming soon",
        `Bună, ${student.name}!,Te anunțăm că în scurt timp vei avea un test. Verifică-ți contul acum pentru mai multe detalii.`,
        "",
        {
          text: "Go to test",
          href: `https://student.noName.ro/tests`,
        }
      );

      let sentMail = await Email.getInstance("NoReply").sendEmail(
        student.email,
        "Test",
        emailFormat
      );
    });
  } catch (error) {
    Logger.error(error);
  }
}

export async function SendMailsForUpcomingScheduleAssignment() {
  try {
    let scheduleAssignment = await StudentAssignment.findAll({
      include: [
        {
          model: Student,
          include: [User],
        },
      ],
      where: {
        startDate: {
          [Op.between]: [
            moment().format("YYYY-MM-DD HH:mm:ss"),
            moment().add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      } as any,
    });

    scheduleAssignment.forEach(async (sA) => {
      let student = sA.student.user;
      let emailFormat = generateEmailFormat(
        "Assignment coming soon",
        `Bună, ${student.name}!, Te anunțăm că mai ai puțin timp rămas la dispoziție pentru completarea temelor tale.`,
        "",
        {
          text: "Go to assignment",
          href: `https://student.noName.ro/assignments`,
        }
      );

      let sentMail = await Email.getInstance("NoReply").sendEmail(
        student.email,
        "Assignment",
        emailFormat
      );
    });
  } catch (error) {
    Logger.error(error);
  }
}

export async function SendMailsForEndingScheduleTest() {
  try {
    let scheduleTest = await StudentTest.findAll({
      include: [
        {
          model: Student,
          include: [User],
        },
      ],
      where: {
        endTime: {
          [Op.between]: [
            moment().format("YYYY-MM-DD HH:mm:ss"),
            moment().add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      } as any,
    });

    scheduleTest.forEach(async (st) => {
      let student = st.user.user;
      let emailFormat = generateEmailFormat(
        "Exam ending soon",
        `Hello ${student.name}, Vă anunțăm că testul dvs. va expira în curând. Verificați-vă contul acum pentru mai multe detalii`,
        "",
        {
          text: "Go to test",
          href: `https://student.noName.ro/tests`,
        }
      );

      let sentMail = await Email.getInstance("NoReply").sendEmail(
        student.email,
        "Test",
        emailFormat
      );
    });
  } catch (error) {
    Logger.error(error);
  }
}

export async function SendMailsForEndingScheduleAssignment() {
  try {
    let scheduleAssignment = await StudentAssignment.findAll({
      include: [
        {
          model: Student,
          include: [User],
        },
      ],
      where: {
        endDate: {
          [Op.between]: [
            moment().format("YYYY-MM-DD HH:mm:ss"),
            moment().add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      } as any,
    });

    scheduleAssignment.forEach(async (sA) => {
      let student = sA.student.user;
      let emailFormat = generateEmailFormat(
        "Assignment ending soon",
        `Bună, ${student.name}!, Te anunțăm că mai ai puțin timp rămas la dispoziție pentru completarea temelor tale.`,
        "",
        {
          text: "Go to assignment",
          href: `https://student.noName.ro/assignments`,
        }
      );

      let sentMail = await Email.getInstance("NoReply").sendEmail(
        student.email,
        "Assignment",
        emailFormat
      );
    });
  } catch (error) {
    Logger.error(error);
  }
}

export async function testMailsByGmail() {
  let UPTestEMAIL = generateEmailFormat(
    "Exam coming soon",
    `Bună, SHAHZAIB_SULTAN!,Te anunțăm că în scurt timp vei avea un test. Verifică-ți contul acum pentru mai multe detalii.`,
    "",
    {
      text: "Go to test",
      href: `https://student.noName.ro/tests`,
    }
  );

  let sentMail1 = await Email.getInstance("NoReply").sendEmail(
    "shahzaibsultan110@outlook.com",
    "Test",
    UPTestEMAIL
  );

  let ASSemailFormatENDS = generateEmailFormat(
    "Assignment ending soon",
    `Bună, SHAHZAIB_SULTAN!, Te anunțăm că mai ai puțin timp rămas la dispoziție pentru completarea temelor tale.`,
    "",
    {
      text: "Go to assignment",
      href: `https://student.noName.ro/assignments`,
    }
  );

  let sentMail2 = await Email.getInstance("NoReply").sendEmail(
    "shahzaibsultan110@outlook.com",
    "Assignment",
    ASSemailFormatENDS
  );

  let emailFormatENDTEST = generateEmailFormat(
    "Exam ending soon",
    `Hello SHAHZAIB_SULTAN, Vă anunțăm că testul dvs. va expira în curând. Verificați-vă contul acum pentru mai multe detalii`,
    "",
    {
      text: "Go to test",
      href: `https://student.noName.ro/tests`,
    }
  );

  let sentMail3 = await Email.getInstance("NoReply").sendEmail(
    "shahzaibsultan110@outlook.com",
    "Test",
    emailFormatENDTEST
  );

  let emailFormat = generateEmailFormat(
    "Assignment coming soon",
    `Bună, SHAHZAIB_SULTAN!, Te anunțăm că mai ai puțin timp rămas la dispoziție pentru completarea temelor tale.`,
    "",
    {
      text: "Go to assignment",
      href: `https://student.noName.ro/assignments`,
    }
  );

  let sentMail4 = await Email.getInstance("NoReply").sendEmail(
    "shahzaibsultan110@outlook.com",
    "Assignment",
    emailFormat
  );

  let emailFormatE = generateEmailFormat(
    "Welcome",
    `Bună, SHAHZAIB_SULTAN!, Îți mulțumim că te-ai alăturat comunității noastre și că vrei să faci parte din mișcarea noastră de a îmbunătăți serviciile de educație.
        Pasul următor este să verifici pașii din contul tău, să te obișnuiești cu platforma și să intri în grupul nostru de Facebook pentru a ajuta alți membri sau a fi ajutat, dacă întampini exerciții dificile.
        Am pregătit multe pentru tine, însă te așteptăm pe contul tău proaspăt configurat pe noName.ro`,
    "",
    {
      text: "Go to website",
      href: `https://student.noName.ro/`,
    }
  );

  let sentMail = await Email.getInstance("NoReply").sendEmail(
    "shahzaibsultan110@outlook.com",
    "Welcome",
    emailFormatE
  );
}
