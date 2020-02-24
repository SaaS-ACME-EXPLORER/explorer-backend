'use strict';
/*---------------SPONSORSHIP----------------------*/

const Sponsorship = require('../models/Sponsorship');

exports.list_all_sponsorships = async (req, res) => {
    try {
        let numperpages = parseInt(req.query['limit']) || 5;
        let page = parseInt(req.query['page']) || 1;
        let numTrips = await Sponsorship.count();
        let sponsorships = await Sponsorship.find()
            .skip((numperpages * page) - numperpages)
            .limit(numperpages);

        res.send({ sponsorships: sponsorships, totalPages: Math.ceil(numTrips / numperpages) });

    } catch (err) {
        logger.error("ERROR getting sponsorshipsf, Some error occurred while retrieving sponsorships")
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving sponsorships."
        });
    };
};

exports.create_sponsorship = async (req, res) => {
    let sponsorship = new Sponsorship(req.body)
    try {
        let response = await sponsorship.save();
        res.status(201);
        res.json(response);
    } catch (error) {
        if (error.errors.name.kind == "required") {
            res.status(400);
            res.json({ message: "Bad Request" });
        } else if (error.errors.name.kind == "unique") {
            res.status(409);
            res.json({ message: "Conflict" });
        } else {
            logger.error(error);
            res.status(500);
            res.json({ message: "Internal Error" });
        }
    }
};

exports.get_a_sponsorship = async (req, res) => {
    try {
        let sponsorship = await Sponsorship.find({ sponsorId: req.params.sponsorship_id });

        if (!sponsorship) {
            logger.error(`ERROR: -GET /sponsorship/${req.params.sponsorship_id} - Not found sponsorship with id: ${req.params.sponsorship_id}`);
            return res.status(404).send({
                message: "Sponsorship not found with id " + req.params.sponsorship_id
            });
        }
        res.send(sponsorship);
        return

    } catch (err) {
        logger.error(`ERROR getting sponsorship ${req.params.sponsorship_id}`)
        return res.status(500).send({
            message: "Error retrieving sponsorship with id " + req.params.sponsorship_id
        });
    }
};

exports.pay_a_sponsorship = (req, res) => {
    res.status(200).send("OK");
};

exports.update_a_sponsorship = async(req, res) => {
    try {
        let sponsorship = await Sponsorship.findOneAndUpdate({ sponsorId: req.params.sponsorship_id }, req.body);
        if (!trip) {
            res.status(404);
            res.json({ message: "Sponsorship Not Found" });
            return
        } else {
            res.status(200);
            res.json(sponsorship);
            return
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
        Sponsorship.deleteOne({ sponsorId: req.params.sponsorship_id }, function (err, sponsorship) {
            if (err) {
                res.status(500).send(err);
            }
            else if (sponsorship.deletedCount==0) {
                res.status(404).send("Not found");
            }
            else {
                res.json({ message: 'Sponsorship successfully deleted' });
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.json({ message: "Internal Error" });
        return
    }
};
