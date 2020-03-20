'use strict';
var mongoose = require('mongoose');
var Cube = mongoose.model('Cube');

exports.get_cube = async (req, res) => {
    let explorerId = req.query['explorerId']
    let month = parseInt(req.query['month'])
    let year = parseInt(req.query['year'])
    let amount = parseInt(req.query['v'])
    let operator = req.query['q'] || "$eq"
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
            let replaced =req.query['q'].replace(/\s/g, '_')
            let dict = {
                equal: "$eq", not_equal: "$ne",
                greater_than: "$gt", greater_than_or_equal: "$gte",
                smaller_than: "$lt", smaller_than_or_equal: "$lte"
            }
           operator= dict[replaced]
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
        res.status(404).send("Not found")
        return

    }
    res.json(cube[0])
}


