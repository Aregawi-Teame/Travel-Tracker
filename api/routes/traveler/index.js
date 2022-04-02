const express = require("express");
const router = express.Router();
const travel_historyController = require("../../controllers/travel_history.controller"); 


router.route(process.env.TRAVEL_HISTORIES)
    .get(travel_historyController.getAll)
    .post(travel_historyController.createNewTravelHistory)
router.route(`${process.env.TRAVEL_HISTORIES}/:travel_history_id`)
    .get(travel_historyController.getOne)
    .put(travel_historyController.updateOne)
    .delete(travel_historyController.deleteOne)
module.exports = router;