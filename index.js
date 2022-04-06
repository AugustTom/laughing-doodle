import Ebay from 'ebay-node-api'

let ebay = new Ebay({
    clientID: 'AugusteT-laughing-SBX-0292f25b7-b729bdcb',
    clientSecret: 'SBX-292f25b7fd86-86e1-4d95-bdad-42e9',
    env: "SANDBOX",
    headers: {
        // optional
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB"
    }
});

ebay.findItemsAdvanced({
    keywords: 'iphone'
}).then((data) => {
    console.log(data[0].searchResult[0]);
}, (error) => {
    console.log(error);
});
