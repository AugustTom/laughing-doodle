const Discogs = require('disconnect').Client;
let pk = require('./package.json');
const releases = require('./releases.json');
const db = new Discogs(`${pk}.name}/${pk}.version}`).database();




releases.forEach(release => {
    db.getRelease(release, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            process.stdout.write(`Artists: `)
           data.artists.forEach(artist => {
               console.log(artist.name)
            });
            console.log(`Number of releases for sale: ${data.num_for_sale}\nLowest price: ${data.lowest_price}`);
            console.log(`----------------`)
        }
    });
});
