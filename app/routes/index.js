var actorRoutes = require('./actorRoutes');
var adminRoutes = require('./adminRoutes');
var applicationRoutes = require('./applicationRoutes');
var finderRoutes = require('./finderRoutes');
var sponsorshipRoutes = require('./sponsorshipRoutes');
var statRoutes = require('./statRoutes');
var tripRoutes = require('./tripRoutes');


module.exports = (app) => {
    app.get('/', (req, res) => res.send('<html><body><h1>Welcome to papi chulo!</h1></body></html>'));

    actorRoutes(app);
    adminRoutes(app);
    applicationRoutes(app);
    finderRoutes(app);
    sponsorshipRoutes(app);
    statRoutes(app);
    tripRoutes(app);
}