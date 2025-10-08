const express = require("express")
const router = new express.Router()
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities/")


router.get("/account/favorites",
    utilities.checkLogin,
    utilities.handleErrors(favoriteController.buildFavoritesView)
)


router.post("/add/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(favoriteController.addFavorite)
)

router.post("/remove/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(favoriteController.removeFavorite)
)

router.post("/remove-selected",
    utilities.checkLogin,
    utilities.handleErrors(favoriteController.removeSelectedFavorites)
)
module.exports = router
