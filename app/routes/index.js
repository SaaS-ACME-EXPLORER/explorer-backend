var actorRoutes = require('./actorRoutes');
var adminRoutes = require('./adminRoutes');
var applicationRoutes = require('./applicationRoutes');
var finderRoutes = require('./finderRoutes');
var sponsorshipRoutes = require('./sponsorshipRoutes');
var statRoutes = require('./statsRoutes');
var tripRoutes = require('./tripRoutes');
var storageRoutes = require('./storageRoutes');
var resourceRoutes = require('./resourceRoutes');



module.exports = (app) => {
    app.get('/', (req, res) => res.send('<html><body><h1>Welcome to papi chulo!</h1></body></html>'));

    actorRoutes(app);
    adminRoutes(app);
    applicationRoutes(app);
    finderRoutes(app);
    sponsorshipRoutes(app);
    statRoutes(app);
    tripRoutes(app);
    storageRoutes(app);
    resourceRoutes(app);

}