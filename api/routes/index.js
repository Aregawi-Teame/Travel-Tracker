const express = require("express");
const tourist_attractionRoutes = require('./tourist_attraction');
const travelHistoryRoutes = require('./traveler');

const router = express.Router();

router.use(`/${process.env.TRAVEL_HISTORIES}`, travelHistoryRoutes);
router.use(`/${process.env.TRAVEL_HISTORIES}`, tourist_attractionRoutes);



module.exports = router;