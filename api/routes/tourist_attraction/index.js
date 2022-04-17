const express = require("express");
const tourist_attractionController = require("../../controllers/tourist_attraction.controller")
const router = express();

router.route(`/:travel_history_id/${process.env.TOURISTS}`)
    .get(tourist_attractionController.getAll)
    .put(tourist_attractionController.addTouristAttraction)

router.route(`/:travel_history_id/${process.env.TOURISTS}/:tourist_id`)
    .get(tourist_attractionController.getOne)
    .delete(tourist_attractionController.deleteTouristAttraction)
    .put(tourist_attractionController.replaceOneTouristAttraction)
    .patch(tourist_attractionController.updateOneTouristAttractionPartialy)

module.exports = router;