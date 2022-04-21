const express = require("express");
const { requireSignin, isAuth, isAdmin } = require("../../controllers/auth.controller");
const router = express.Router();
const travel_historyController = require("../../controllers/travel_history.controller"); 
const { userById } = require("../../controllers/user.controller");


router.route('')
    .get(travel_historyController.getAll);

router.route('/:userId')
    .post(requireSignin,isAuth,isAdmin,travel_historyController.createNewTravelHistory)
router.route(`/:travel_history_id`)
    .get(travel_historyController.getOne);
router.route('/:travel_history_id/:userId')
    .put(requireSignin,isAuth,isAdmin,travel_historyController.replaceOneTravelHistory)
    .patch(requireSignin,isAuth,isAdmin,travel_historyController.partialUpdate)
    .delete(requireSignin,isAuth,isAdmin,travel_historyController.deleteOne)

router.param("userId", userById);
module.exports = router;