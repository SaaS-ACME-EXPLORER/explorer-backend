'use strict';
/*---------------APPLICATION----------------------*/

const Application = require('../models/Application');
const Actor = require('../models/Actor');
const Trip = require('../models/Trip');
const logger = require('../utils/logger');

const ActorUtil = require('../utils/actorUtils');


/*---------------LIST ALL APPLICATIONS----------------------*/


// Explorers: List all their applications
// Managers: List all the applications that they manage
// query: ?actorId=123abc
exports.list_all_applications = async function (req, res) {

  const actorId = req.query.actorId;

  if (!actorId) {
    logger.error('Actor id required');
    res.status(400).json({ "error": "Actor id required" });
  } else {
    const actorRole = await ActorUtil.getRoleById(actorId);
    if (actorRole != null) {
      if (actorRole === 'EXPLORER') {
        await listExplorerApplications(res, actorId);
      } else if (actorRole === 'MANAGER') {
        await listManagerApplications(res, actorId);
      } else {
        logger.error(`Invalid role: ${actor.role}`);
        res.status(403).json({ "error": "Invalid role" });
      }
    } else {
      logger.error();
      res.status(500).json({ "error": "Error when searching the role for the actor given" });
    }
  }
};

//List all the applications of the explorer, grouped by status
const listExplorerApplications = async function (res, actorId) {
  let explorerApplications;
  try {
    explorerApplications = await Application.aggregate([
      {
        $match: { explorerId: actorId }
      },
      {
        $group: {
          _id: "$status",
          applications: { $push: "$$ROOT" }
        }
      }
    ]);
  } catch (error) {
    logger.error("Error when listing all the applications of the explorer, grouped by status");
    res.status(500).send(error);
    return;
  }
  res.status(200).json(explorerApplications);
}


const listManagerApplications = async function (res, actorId) {
  //List all the applications that he manages
  Trip.find({ managedBy: actorId }, function (error, trips) {
    if (error) {
      logger.error(`Error listing all the trips managed by an actor with id: ${actorId}`);
      res.status(500).send(error);
    } else {
      let tripsIds = trips.map(t => t.ticker);
      Application.find({ tripId: { $in: tripsIds } }, function (error, applications) {
        if (error) {
          logger.error(`Error listing all the applications of a manager with id ${actorId}`);
          res.status(500).send(error);
        } else {
          res.status(200).json(applications);
        }
      });
    }
  });
}



/*---------------CREATE AN APPLICATIONS----------------------*/


//Explorer: Apply for a trip that has been published and is not started or cancelled
//body: { "tripId": "nfwHzt","explorerId": "5e52a86f47543c53cca08f8e"}
exports.create_an_application = async function (req, res) {
  let newApplication = new Application(req.body);
  let errors = await createAnApplicationValidator(newApplication);
  if (errors.length == 0) {
    newApplication.save(function (err, application) {
      if (err) {
        if (err.name == 'ValidationError') {
          res.status(422).send(err);
        } else {
          res.status(500).send(err);
        }
      } else {
        res.status(201).json(application);
      }
    });
  } else {
    if (errors.length == 1 && errors.includes('Invalid actor. The actor given must have the role EXPLORER')) {
      res.status(403);
    } else {
      res.status(400);
    }
    res.json({ "errors": errors });
  }
};

//Explorer: Apply for a trip that has been published and is not started or cancelled
var createAnApplicationValidator = async function (newApplication) {
  var errors = [];
  if (!newApplication.tripId || !newApplication.explorerId) {
    logger.error("Trip id and explorer id must be provided");
    errors.push("Trip id and explorer id must be provided");
  } else {
    let isActorExplorer = await ActorUtil.isExplorer(newApplication.explorerId);
    if (isActorExplorer) {
      Trip.findOne({ ticker: newApplication.tripId }, function (error, trip) {
        if (error || trip == null) {
          logger.error(`Error searching for a trip with id ${newApplication.tripId}`);
          errors.push("Error searching for a trip with id " + newApplication.tripId);
        } else {
          if (!trip.public) {
            logger.error("The trip provided has not been publised");
            errors.push("The trip provided has not been publised");
          }
          if (trip.cancelled) {
            logger.error("The trip provided has been cancelled");
            errors.push("The trip provided has been cancelled");
          }
          if (trip.startDate < new Date()) {
            logger.error("The trip has already started");
            errors.push("The trip has already started");
          }
        }
      });
    } else {
      logger.error("Invalid actor. The actor given must have the role EXPLORER");
      errors.push("Invalid actor. The actor given must have the role EXPLORER");
    }

  }
  return errors;
}



/*------------------READ AN APPLICATION----------------------*/

// query: ?actorId=123abc
// params: applicationId
exports.read_an_application = function (req, res) {
  var applicationId = req.params.app_id;
  var actorId = req.query.actorId;
  Application.findById(applicationId, async function (err, application) {
    if (err) {
      res.status(500).send(err);
    } else if (application == null) {
      logger.error(`Could not find an application with id ${applicationId}`);
      res.status(404).json("Could not find an application with id" + applicationId);
    } else {
      let actorRole = await ActorUtil.getRoleById(actorId);
      if (actorRole === 'EXPLORER') {
        displayExplorerApplication(res, application, actorId);
      } else if (actorRole === 'MANAGER') {
        displayManagerApplication(res, application, actorId);
      } else {
        logger.error(`Invalid role ${actorRole}. Must be MANAGER or EXPLORER`);
        res.status(403).json({ "error": "Invalid role. The actor must be explorer or manager" });
      }
    }
  });
};


// Explorers: Display their applications
const displayExplorerApplication = function (res, application, actorId) {
  if (application.explorerId != actorId) {
    logger.error(`The actor with id ${actorId}, did not applied for that trip`);
    res.status(403).send({ "error": "The explorer did not applied for the trip" });
  } else {
    res.status(200).json(application);
  }
}

// Managers: Display the applications that they manage
const displayManagerApplication = function (res, application, actorId) {
  Trip.findOne({ ticker: application.tripId }, function (error, trip) {
    if (error || trip == null) {
      logger.error(`Error when searching for a trip with id ${application.tripId}`);
      res.status(500).send(error);
    } else if (trip.managedBy != actorId) {
      logger.error(`The actor with id ${actorId}, does not manage that trip`);
      res.status(400).send({ "error": "The explorer does not manage the trip" });
    } else {
      res.status(200).json(application);
    }
  });
}




/*------------------PAY AN APPLICATION----------------------*/


//An application with status “DUE” changes automatically to status “ACCEPTED” whenever the corresponding applicant pays the trip
//body: {paid: 'true', actorId: '123abc'}
//params: applicationId
exports.pay_an_application = async function (req, res) {
  //Check that the user is explorer and it is the user that made the application. (403)
  const body = req.body;
  const applicationId = req.params.app_id;
  let errors = await payAnApplicationValidator(applicationId, body);
  if (errors.length == 0) {
    Application.findOneAndUpdate({ _id: applicationId }, { paid: body.paid, status: "ACCEPTED" }, { new: true }, function (err, editedApplication) {
      if (err) {
        if (err.name == 'ValidationError') {
          res.status(422).send(err);
        }
        else {
          res.status(500).send(err);
        }
      }
      else {
        res.status(200).json(editedApplication);
      }
    });
  } else {
    if (errors.length == 1 && errors.includes('Ivalid role for the actor. Must be EXPLORER')) {
      res.status(403);
    } else {
      res.status(400);
    }
    res.json({ "errors": errors });
  }
};

// body: {paid: 'true', actorId: '123abc'}
var payAnApplicationValidator = async function (applicationId, body) {

  var errors = [];
  if (Object.keys(body).length != 2 || !body.actorId || !body.paid) {
    if (!body.actorId) {
      logger.error('Attribute actorId required');
      errors.push('Attribute actorId required');
    }
    if (Object.keys(body).length != 2) {
      logger.error('More or less attributes than expected');
      errors.push('More or less attributes than expected');
    }
    if (!body.paid) {
      logger.error('The value of the attribute paid must be true');
      errors.push('The value of the attribute paid must be true');
    }
  } else {
    let actorRole = await ActorUtil.getRoleById(body.actorId);
    if (!actorRole) {
      logger.error(`Error when searching an actor with id ${body.actorId}`);
      errors.push("Error when searching an actor with id" + body.actorId);
    } else if (actorRole != 'EXPLORER') {
      logger.error('Ivalid role for the actor. Must be EXPLORER');
      errors.push('Ivalid role for the actor. Must be EXPLORER');
    } else {
      await Application.findById(applicationId, function (error, application) {
        if (error || !application) {
          logger.error(`Error searching an application with id ${applicationId}.`);
          errors.push('Error searching an application with id ' + applicationId);
        }
        if (application.status != "DUE") {
          logger.error(`Invalid application status: ${application.status}, must be DUE.`);
          errors.push('Invalid application status: ' + application.status + ', must be DUE.');
        }
        if (application.paid) {
          logger.error("The application for the trip has been already paid");
          errors.push('The application for the trip has been already paid');
        }
        if (application.explorerId != body.actorId) {
          logger.error(`The actor did not apply for the trip with id ${application.tripId}`);
          errors.push('The actor did not apply for the trip with id ' + application.tripId);
        }
      });
    }
  }
  return errors;
}





/*------------------CHANGE AN APPLICATION STATUS----------------------*/


//Managers: Can cange status from “PENDING” to “REJECTED” (reason why) or from “PENDING” to “DUE”
//Explorer: Cancel an application with status “PENDING”
//Summary: update state and its reason if it is cancel or rejected;
//body: {status: "REJECTED"||"DUE"||"CANCELLED", statusReason: "abc", actorId: "123abc"}
exports.change_an_application_status = async function (req, res) {
  const applicationId = req.params.app_id;
  const body = req.body;
  let errors = await changeAnApplicationStatusValidator(applicationId, body);
  if (errors.length == 0) {
    Application.findOneAndUpdate({ _id: applicationId }, body, { new: true }, function (err, editedApplication) {
      if (err) {
        if (err.name == 'ValidationError') {
          res.status(422).send(err);
        }
        else {
          res.status(500).send(err);
        }
      }
      else {
        res.status(200).json(item);
      }
    });
  } else {
    if (errors.length == 1 && (errors.includes("The actor does not manage the application, because he does not manage the trip") || errors.includes("The actor did not make the application"))) {
      res.status(403);
    } else {
      res.status(400);
    }
    res.send(error);
  }
};


//Managers: Can cange status from “PENDING” to “REJECTED” (reason why) or from “PENDING” to “DUE”
//Explorer: Cancel an application with status “PENDING” or "ACCEPTED"
//body: {status: "REJECTED"||"DUE"||"CANCELLED", statusReason: "abc", actorId: "123abc"}
var changeAnApplicationStatusValidator = async function (applicationId, body) {
  var errors = [];
  if (!body.status || !body.actorId) {
    logger.error("Application status and actor id must be provided");
    errors.push("Application status and actor id must be provided");
  } else {
    await Application.findById(applicationId, async function (error, application) {
      if (error) {
        logger.error(`Error when searching for an application with id ${applicationId}`);
        errors.push("Error when searching for an application with id " + applicationId);
      } else {
        let actorRole = await ActorUtil.getRoleById(body.actorId);
        if (!actorRole) {
          logger.error(`Error when searching an actor with id ${body.actorId}`);
          errors.push("Error when searching an actor with id " + body.actorId);
        } else if(actorRole === 'MANAGER'){ //MANAGERS
          let managerValidationErrors = await changeAnApplicationStatusByManagerValidator(application, body);
          if(managerValidationErrors != ""){
            errors.push(managerValidationErrors);
          }
        }else if(actorRole === 'EXPLORER'){ //EXPLORERS
          let explorerValidationErrors = changeAnApplicationStatusByExplorerValidator(application, body);
          if(explorerValidationErrors != ""){
            errors.push(explorerValidationErrors);
          }
        }else{
          logger.error(`Invalid actor. Must be an explorer or a manager`);
          errors.push("Invalid actor. Must be an explorer or a manager");
        }
      }
    });
  }
  return errors;
}

//Managers: Can cange status from “PENDING” to “REJECTED” (reason why) or from “PENDING” to “DUE”
//body: {status: "REJECTED"||"DUE", statusReason: "abc", actorId: "123abc"}
var changeAnApplicationStatusByManagerValidator = async function(application, body){
  var res = "";
  if (application.status === 'PENDING') {
    await Trip.find({ ticker: application.tripId }, function (error, trip) {
      if (error) {
        logger.error(`Error when searching for a trip with id ${application.tripId}`);
        res = "Error when searching for a trip with id " + application.tripId;
      } else {
        if (trip.managedBy != actorId) {
          logger.error(`The actor with id ${actorId}, does not manage the trip with id ${trip.ticker}`);
          res = "The actor does not manage the application, because he does not manage the trip";
        } else if (body.status != "DUE" || body.status != "REJECTED") {
          logger.error(`Invalid application status ${body.status}, must be DUE or REJECTED`);
          res = "Application status must be DUE or REJECTED";
        } else if (body.status === "REJECTED" && !body.statusReason) {
          logger.error("If the new application status is REJECTED, a reason must be provided");
           res = "If the new application status is REJECTED, a reason must be provided";
        }
      }
    });
  }else{
    logger.error("Invalid application status. Must be PENDING");
    res = "Invalid application status. Must be PENDING";
  }
  return res;
}

//Explorer: Cancel an application with status “PENDING” or "ACCEPTED"
//body: {status: "CANCELLED", statusReason: "abc", actorId: "123abc"}
var changeAnApplicationStatusByExplorerValidator = function(application, body){
  var res = "";
  if (application.explorerId != actorId) {
    logger.error(`The actor with id ${actorId}, did not make the application`);
    res = "The actor did not make the application";
  } else if (body.status != 'CANCELLED') {
    logger.error("The explorer can only cancell the application");
    res = "The explorer can only cancell the application";
  } else if (application.status != 'PENDING' && application.status != 'ACCEPTED') {
    logger.error("An explorer only can cancell an application with status PENDING  or ACCEPTED");
    res = "An explorer only can cancell an application with status PENDING  or ACCEPTED";
  }
  return res;
}

