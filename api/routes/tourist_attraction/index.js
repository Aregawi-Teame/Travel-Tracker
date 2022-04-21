const express = require("express");
const { requireSignin, isAuth, isAdmin } = require("../../controllers/auth.controller");
const tourist_attractionController = require("../../controllers/tourist_attraction.controller");
const { userById } = require("../../controllers/user.controller");
const router = express();

router.route(`/:travel_history_id/${process.env.TOURISTS}`)
    .get(tourist_attractionController.getAll);
router.route(`/:travel_history_id/${process.env.TOURISTS}/:userId`)
    .put(requireSignin,isAuth,isAdmin, tourist_attractionController.addTouristAttraction)

router.route(`/:travel_history_id/${process.env.TOURISTS}/:tourist_id`)
    .get(tourist_attractionController.getOne)
router.route(`/:travel_history_id/${process.env.TOURISTS}/:tourist_id/:userId`)
    .delete(requireSignin,isAuth,isAdmin,tourist_attractionController.deleteTouristAttraction)
    .put(requireSignin,isAuth,isAdmin,tourist_attractionController.replaceOneTouristAttraction)
    .patch(requireSignin,isAuth,isAdmin,tourist_attractionController.updateOneTouristAttractionPartialy);

router.param('userId', userById)

module.exports = router;