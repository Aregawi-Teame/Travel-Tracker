const express = require("express");
const router = express.Router();
const travel_historyController = require("../../controllers/travel_history.controller"); 


router.route('')
    .get(travel_historyController.getAll)
    .post(travel_historyController.createNewTravelHistory)
router.route(`/:travel_history_id`)
    .get(travel_historyController.getOne)
    .put(travel_historyController.replaceOneTravelHistory)
    .patch(travel_historyController.partialUpdate)
    .delete(travel_historyController.deleteOne)
module.exports = router;