'use strict';
/*---------------SPONSORSHIP----------------------*/

const Sponsorship = require('../models/Sponsorship');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const ActorUtil = require('../utils/actorUtils');

let checkSponsorId = (req, res) => {
    if (!req.query['sponsorId']) {
        res.status(400);
        res.json({ message: "Bad Request" });
    }
}

let checkIsSponsor = async (req, res) => {
    let sponsorId = req.query['sponsorId']
    let isActorSponsor = await ActorUtil.isSponsor(sponsorId);
    if (!isActorSponsor) {
        res.status(403);
        res.json({ message: "403 Forbidden request" });
        return
    }
}



let checkIsAdministrator= async (req, res) => {
    let sponsorId = req.query['sponsorId']
    let isActorSponsor = await ActorUtil.isAdministrator(sponsorId);
    if (!isActorSponsor) {
        res.status(403);
        res.json({ message: "403 Forbidden request" });
        return
    }
}


exports.list_all_sponsorships = async (req, res) => {
    try {
        checkSponsorId(req, res)
        checkIsSponsor(req, res)
        let sponsorId = req.query['sponsorId']
        let paid = req.query['paid'] || true
        let numperpages = parseInt(req.query['limit']) || 5;
        let page = parseInt(req.query['page']) || 1;
        let sponsorships = await Sponsorship.find({ sponsorId: sponsorId, paid: paid })
            .skip((numperpages * page) - numperpages)
            .limit(numperpages);

        res.send(sponsorships);

    } catch (err) {
        logger.error("ERROR getting sponsorships, Some error occurred while retrieving sponsorships")
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving sponsorships."
        });
    };
};

exports.create_sponsorship = async (req, res) => {
    //checkIsAdministrator(req, res)
    checkIsSponsor(req, res)
    let sponsorship = new Sponsorship(req.body)
    try {
        let response = await sponsorship.save();
        res.status(201);
        res.json(response);
    } catch (error) {
        logger.error("ERROR getting sponsorship, Some error occurred while retrieving sponsorships")
        res.status(400);
        res.json({ message: "Bad Request" });
    }
};

exports.get_a_sponsorship = async (req, res) => {
    try {
        checkSponsorId(req, res)
        checkIsSponsor(req, res)
        let sponsorId = req.query['sponsorId']
        if (!mongoose.Types.ObjectId.isValid(req.params.sponsorship_id)) {
            res.status(404);
            res.json({ message: "Sponsorship not found with id " + req.params.sponsorship_id });
            return
        } else {
            let sponsorship = await Sponsorship.findOne({ _id: req.params.sponsorship_id, sponsorId: sponsorId, paid: true });
            if (!sponsorship) {
                logger.error(`ERROR: -GET /sponsorship/${req.params.sponsorship_id} - Not found sponsorship with id: ${req.params.sponsorship_id}`);
                return res.status(404).send({
                    message: "Sponsorship not found with id " + req.params.sponsorship_id
                });
            }
            res.send(sponsorship);
            return
        }
    } catch (err) {
        console.log(err)
        logger.error(`ERROR getting sponsorship ${req.params.sponsorship_id}`)
        return res.status(500).send({
            message: "Error retrieving sponsorship with id " + req.params.sponsorship_id
        });
    }
};

exports.pay_a_sponsorship = async (req, res) => {
    try {
        checkSponsorId(req, res)
        checkIsSponsor(req, res)
        let sponsorId = req.query['sponsorId']
        if (!mongoose.Types.ObjectId.isValid(req.params.sponsorship_id)) {
            return res.status(404).send({
                message: "Sponsorship not found with id " + req.params.sponsorship_id
            });
        } else {
            let confirmation = await Sponsorship.updateOne({ _id: req.params.sponsorship_id, sponsorId: sponsorId }, { paid: true });
            if (confirmation["n"] == 0) {
                return res.status(404).send({
                    message: "Sponsorship not found with id " + req.params.sponsorship_id
                });
            }
            if (confirmation["nModified"] == 0) {
                res.status(304);
                res.json({ message: "Sponsorship has already been paid" });
                return
            } else {
                res.status(200);
                res.json(`Sponsorship ${req.params.sponsorship_id} has been paid`);
                return
            }
        }
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.json({ message: "Internal Error" });
        return
    }
};

exports.update_a_sponsorship = async (req, res) => {
    try {
        checkSponsorId(req, res)
        checkIsSponsor(req, res)
        let sponsorId = req.query['sponsorId']
        if (!mongoose.Types.ObjectId.isValid(req.params.sponsorship_id)) {
            res.status(404);
            res.json({ message: "Not Found" });
            return
        } else {
            await Sponsorship.updateOne({ _id: req.params.sponsorship_id, sponsorId: sponsorId }, req.body);
            let sponsorship = await Sponsorship.findOne({ _id: req.params.sponsorship_id, sponsorId: sponsorId }, req.body);
            if (!sponsorship) {
                res.status(404);
                res.json({ message: "Sponsorship Not Found" });
                return
            } else {
                res.status(200);
                res.json(sponsorship);
                return
            }
        }

    } catch (error) {
        logger.error(error);
        res.status(500);
        res.json({ message: "Internal Error" });
        return

    }
};


exports.delete_a_sponsorship = (req, res) => {
    try {
        checkSponsorId(req, res)
        checkIsSponsor(req, res)
        let sponsorId = req.query['sponsorId']
        if (!mongoose.Types.ObjectId.isValid(req.params.sponsorship_id)) {
            res.status(404);
            res.json({ message: "Not Found" });
            return
        } else {
            Sponsorship.deleteOne({ _id: req.params.sponsorship_id, sponsorId: sponsorId }, function (err, sponsorship) {
                if (err) {
                    res.status(500).send(err);
                }
                else if (sponsorship.deletedCount == 0) {
                    res.status(404).send("Not found");
                }
                else {
                    res.json({ message: `Sponsorship ${req.params.sponsorship_id} successfully deleted` });
                }
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.json({ message: "Internal Error" });
        return
    }
};
