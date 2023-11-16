'use strict';

import GlobalConfig from './configs'
import { Logger, LogType } from "./sequelize/utils/logger";
import * as App from './app';
import { PaymentPlan, sequelize, Teacher, User } from './sequelize';
import { initLocalization } from './sequelize/locales';
import { initializeNotifyCronJobs } from './app/services/cron-jobs';

require('source-map-support').install();


async function test() {
    try {
                  
    }
    catch (err) {
        Logger.error(err);
    }
}

export async function Start(): Promise<boolean> {
    let severStarted = false
    try {

        Logger.successBold("* -------------------------------------------------------- *");
        Logger.successBold("|              Attempting to start the Server              |");
        Logger.successBold("* -------------------------------------------------------- *");

        const HttpServerConfig = GlobalConfig?.HTTPServerConfigurations;

        // Initializing Localization
        initLocalization();
        Logger.infoBright("* Attempting to start the Server");

        Logger.info("* This process will start HTTP server...");

        // Starting Http Server
        let expressApp = App.create(HttpServerConfig);
        App.start(expressApp);

        severStarted = true;

        // Enabling Types of Logs Printed
        sequelize.sync({ force: false })
        Logger.logConfig = [LogType.Error, LogType.Debug, LogType.Success, LogType.Info];
        // setTimeout(() => test(), 4000);
        initializeNotifyCronJobs()
    }
    catch (err) {
        Logger.fatalError("* -------------------------------------------------------- *");
        Logger.fatalError("|                Failed to start the Server                |");
        Logger.fatalError("* -------------------------------------------------------- *");
        severStarted = false;
    }
    finally {
        return severStarted
    }
}

(async () => {
    Start();
    test();
})();






