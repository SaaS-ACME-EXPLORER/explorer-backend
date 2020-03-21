'use strict';
const mongoose = require('mongoose');
const Cube = mongoose.model('Cube');
const Actor = mongoose.model('Actor');
const ActorUtil = require('../utils/actorUtils');
exports.get_cube = async (req, res) => {
    let explorerId = req.query['explorerId']
    let month = parseInt(req.query['month'])
    let year = parseInt(req.query['year'])
    let amount = parseInt(req.query['v'])
    let operator = req.query['q'] || "$eq"

    if (!mongoose.Types.ObjectId.isValid(explorerId)) {
        res.status(404);
        res.json({ message: "Not Found" });
        return
    }
    let existExplorer = await Actor.findOne({ _id: explorerId })

    if (!existExplorer) {
        res.status(404);
        res.json({ message: "Not Found" });
        return

    }
    let isActorExplorer = await ActorUtil.isExplorer(explorerId);
    if (!isActorExplorer) {
        res.status(403);
        res.json({ message: "403 Forbidden request" });
        return
    }
    let match = { explorerId: explorerId }
    if (month) {
        match.month = month
    }
    if (year) {
        match.year = year
    }
    if (amount) {
        match.amount = {}
        if (req.query['q']) {
            let replaced = req.query['q'].replace(/\s/g, '_')
            let dict = {
                equal: "$eq", not_equal: "$ne",
                greater_than: "$gt", greater_than_or_equal: "$gte",
                smaller_than: "$lt", smaller_than_or_equal: "$lte"
            }
            operator = dict[replaced]
        }
        match.amount[operator] = amount
    }

    //e, p
    let cube = await Cube.aggregate([
        { $match: match },
        {
            $group:
            {
                _id: "cube",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        }

    ])
    if (cube.length == 0) {
        res.json({
            _id: "cube",
            "totalAmount": 0,
            "count": 0
        })
        return

    }
    res.json(cube[0])
}


