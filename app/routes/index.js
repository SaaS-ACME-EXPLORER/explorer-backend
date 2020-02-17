const dummy = require('../controllers/controller')

module.exports = (app) => {
    //actors
    app.get(BASE_API_PATH +'/actors',dummy.dummy); //list 
    app.post(BASE_API_PATH +'/actors',dummy.dummy); //signup
    app.put(BASE_API_PATH + '/actors/:actor_id', dummy.dummy) //update personal data 
    app.put(BASE_API_PATH + '/actors/:actor_id/activate', dummy.dummy) //change activate status to a actor ; ban or unban
    
    //trips
    app.get(BASE_API_PATH + '/trips',dummy.dummy); //list trips or filtered by questystring = keyword
    app.post(BASE_API_PATH + '/trips',dummy.dummy); //create new trip
    app.get(BASE_API_PATH + '/trips/:trip_id',dummy.dummy); //get 1 trip
    app.put(BASE_API_PATH + '/trips/:trip_id',dummy.dummy); //update trip  
    app.put(BASE_API_PATH + '/trips/:trip_id/cancel',dummy.dummy); //cancel trip  (only is able to cancel and not opening) --REASON IS A MUST
    app.delete(BASE_API_PATH + '/trips/:trip_id',dummy.dummy); //delete trip

    //applications
    app.post(BASE_API_PATH + '/applications',dummy.dummy); //create app to a trip; included actorId and ticker
    app.get(BASE_API_PATH + '/applications',dummy.dummy); //list all applications; querystring actorId
    app.get(BASE_API_PATH + '/applications/:app_id',dummy.dummy); //get an apply;
    app.put(BASE_API_PATH + '/applications/:app_id/pay',dummy.dummy); //pay a trip send amount
    app.put(BASE_API_PATH + '/applications/:app_id/status',dummy.dummy); //update state and it is reason if it is cancel or rejected;
    //stats
    app.get(BASE_API_PATH + '/stats/byManagers',dummy.dummy); //min max avg or standar deviation per managers
    app.get(BASE_API_PATH + '/stats/byApplicationTrips',dummy.dummy);//min max avg or standar deviation per trips
    app.get(BASE_API_PATH + '/stats/byPriceTrips',dummy.dummy);//min max avg or standar deviation per trips
    app.get(BASE_API_PATH + '/stats/byPriceTrips',dummy.dummy);//min max avg or standar deviation per trips
    app.get(BASE_API_PATH + '/stats/byApplications',dummy.dummy);//min max avg or standar deviation per trips

    //finder
    app.get(BASE_API_PATH + '/finders/:finder_id',dummy.dummy); //get finder; querystring actor_id(ONLY for explorer, validated)
    app.post(BASE_API_PATH + '/finders',dummy.dummy); //create a new finder; (ONLY for explorers)
    app.put(BASE_API_PATH + '/finders/:finder_id',dummy.dummy); //update a finder; (ONLY for explorers) 
    app.get(BASE_API_PATH + '/finders/average',dummy.dummy); //get average price; querystring actor_id(ONLY for explorer, validated)
    app.get(BASE_API_PATH + '/finders/keys',dummy.dummy); //get top10 key words; querystring actor_id(ONLY for explorer, validated)
   
    //admin
    app.get(BASE_API_PATH + '/admin/configuration/:finder_id',dummy.dummy); //get the conf, 1 per configuration
    app.put(BASE_API_PATH + '/admin/configuration/:finder_id',dummy.dummy); // set conf

    //sponsorships
    app.get(BASE_API_PATH + '/sponsorships',dummy.dummy); //list sponsorships or filtered by questystring = actorId
    app.post(BASE_API_PATH + '/sponsorships/',dummy.dummy); //create new trip
    app.get(BASE_API_PATH + '/sponsorships/:sponsorship_id',dummy.dummy); //get 1 sponsorship
    app.put(BASE_API_PATH + '/sponsorships/:sponsorship_id',dummy.dummy); //update sponsorship  
    app.put(BASE_API_PATH + '/sponsorships/:sponsorship_id/pay',dummy.dummy); //pay a sponsorship  
    app.delete(BASE_API_PATH + '/sponsorships/:sponsorship_id',dummy.dummy); //delete sponsorship
}
