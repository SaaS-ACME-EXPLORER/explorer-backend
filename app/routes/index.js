var actorRoutes = require('./actorRoutes');
var applicationRoutes = require('./applicationRoutes');
var sponsorshipRoutes = require('./sponsorshipRoutes');
var dataWareHouseRoutes = require('./dataWareHouseRoutes');
var tripRoutes = require('./tripRoutes');
var storageRoutes = require('./storageRoutes');
var resourceRoutes = require('./resourceRoutes');
var loginRoutes = require('./loginRoutes');
var cubeRoutes = require('./cubeRoutes');



module.exports = (app) => {
    app.get('/', (req, res) => res.send('<html><body><h1>Welcome to papi chulo!</h1></body></html>'));

    actorRoutes(app);
    applicationRoutes(app);
    sponsorshipRoutes(app);
    dataWareHouseRoutes(app);
    tripRoutes(app);
    storageRoutes(app);
    resourceRoutes(app);
    loginRoutes(app);
    cubeRoutes(app);
}