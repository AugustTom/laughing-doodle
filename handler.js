'use strict';
const Discogs = require('disconnect').Client;
const pk = require('./package.json');

const aws = require('aws-sdk');
const ses = new aws.SES({region: 'eu-west-2'});

/**PLAN:
 *  Get a list of the releases to check
 *  Connect to the Discogs API
 *  Check the release - get number of vinyls for sale and the lowest price
 *  Send out an email to the user with the release details.
 * */

const RELEASES = require('./releases.json');

//Email needs to be verified before it can be used.
const EMAIL_ADDRESS = 'auguste.tomaseviciute@gmail.com';
const EMAIL_SUBJECT = 'Discogs vinyls release info';

const getReleaseInfo = async (releaseId, apiDB) => {
    try {
        return await apiDB.getRelease(releaseId);
    } catch (e) {
        console.log(e);
    }
};

const sendMail = async (emailAddress, body) => {
    console.log(body);

    const emailParams = {
        Destination: {
            ToAddresses: [emailAddress],
        },
        Message: {
            Body: {
                Text: {Data: body},
            },
            Subject: {Data: EMAIL_SUBJECT},
        },
        Source: "auguste.tomaseviciute@gmail.com",
    };

    try {
        await ses.sendEmail(emailParams).promise();
        console.log(`MAIL SENT SUCCESSFULLY!!`);
    } catch (e) {
        console.log(`FAILURE IN SENDING MAIL!!`, e);
    }
    return;
}

const collectAllInfo = async () => {
    const db = new Discogs(`${pk}.name}/${pk}.version}`).database();
    let messageBody = '<h1>Discogs vinyls release info</h1> <br/>';
    for (let release of RELEASES) {
        const releaseInfo = await getReleaseInfo(release, db);
        if (releaseInfo) {
            messageBody += formatMessage(releaseInfo);
        }
    }

    await sendMail(EMAIL_ADDRESS, messageBody);
}

const formatMessage = (releaseInfo) => {
    if (releaseInfo.num_for_sale > 0) {
        return `${releaseInfo.title} |  ${releaseInfo.num_for_sale} vinyls available. Starting from ${releaseInfo.lowest_price}€  - https://www.discogs.com/sell/release/${releaseInfo.id} \n`;
    } else {
        return `${releaseInfo.title} |  No vinyls available`;
    }
};

collectAllInfo()
module.exports.laughingDoodle = (event, context, callback) => {
    collectAllInfo();
};

