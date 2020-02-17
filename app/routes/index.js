var actorRoutes = require('./api/routes/actorRoutes');
var adminRoutes = require('./api/routes/adminRoutes');
var applicationRoutes = require('./api/routes/applicationRoutes');
var finderRoutes = require('./api/routes/finderRoutes');
var sponsorshipRoutes = require('./api/routes/sponsorshipRoutes');
var statRoutes = require('./api/routes/statRoutes');
var tripRoutes = require('./api/routes/tripRoutes');


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