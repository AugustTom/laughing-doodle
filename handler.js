'use strict';
const Discogs = require('disconnect').Client;
const pk = require('./package.json');

/**PLAN:
 *  Get a list of the releases to check
 *  Connect to the Discogs API
 *  Check the release - get number of vinyls for sale and the lowest price
 *  Send out an email to the user with the release details.
 * */

const RELEASES = require('./releases.json');
const EMAIL_ADDRESS = 'aa@aa.com';

const getReleaseInfo = async (releaseId, apiDB) => {
    try {
        return await apiDB.getRelease(releaseId);
    } catch (e) {
        console.log(e);
    }
};

const sendEmail = async (emailAddress, body) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
            message: body,
            // input: event,
        }),
    };
    console.log(response);
    console.log(`-------------------------------------------------------`);
    console.log(emailAddress, body);
}

const collectAllInfo = async () => {
    const db = new Discogs(`${pk}.name}/${pk}.version}`).database();
    let messageBody = '';
    for (let release of RELEASES) {
        const releaseInfo = await getReleaseInfo(release, db);
        if (releaseInfo) {
            messageBody += `${releaseInfo.title} | ${releaseInfo.lowest_price} - ${releaseInfo.num_for_sale} vinyls available\n`;
        }
    }
    await sendEmail(EMAIL_ADDRESS, messageBody);
}

// collectAllInfo();

module.exports.laughingDoodle = (event, context, callback) => {
    collectAllInfo();
    callback(null, response);
};

