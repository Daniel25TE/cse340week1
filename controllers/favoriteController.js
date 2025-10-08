const favoriteModel = require("../models/favoriteModel")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


// Logic to add a car to the favorite list
async function addFavorite(req, res, next) {
  try {
    if (!res.locals.accountData) {
      req.flash("notice", "Please log in to add a favorite car to your wishlist.")
      return res.redirect("/account/login")
    }

    const account_id = res.locals.accountData.account_id
    const inv_id = parseInt(req.params.inv_id)

    if (isNaN(inv_id)) {
      req.flash("notice", "Invalid vehicle ID.")
      return res.redirect("/")
    }

    const alreadyFav = await favoriteModel.isFavorite(account_id, inv_id)
    if (alreadyFav) {
      req.flash("notice", "This vehicle is already in your favorites.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    await favoriteModel.addFavorite(account_id, inv_id)
    req.flash("success", "Vehicle added to your favorites.")
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("❌ Error adding favorite:", error)
    req.flash("notice", "Something went wrong while adding this vehicle to your favorites.")
    return res.redirect(`/inv/detail/${req.params.inv_id}`)
  }
}


// Logic to remove a car from the favorite list
async function removeFavorite(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const inv_id = parseInt(req.params.inv_id)

    if (!account_id) {
      req.flash("notice", "You must be logged in to remove favorites.")
      return res.redirect("/account/login")
    }

    await favoriteModel.removeFavorite(account_id, inv_id)
    req.flash("success", "Vehicle removed from your favorites.")
    return res.redirect("/favorites/account/favorites")
  } catch (error) {
    console.error("Error removing favorite:", error)
    next(error)
  }
}

// Logic to check if the user is log in to display the favorite list
async function buildFavoritesView(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id

    if (!account_id) {
      req.flash("notice", "Please log in to view your favorites.")
      return res.redirect("/account/login")
    }

      const favorites = await favoriteModel.getUserFavorites(account_id)
      const nav = await utilities.getNav()

    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites,
      errors: null,
    })
  } catch (error) {
    console.error("Error building favorites view:", error)
    next(error)
  }
}

// Logic to delete multiple car items
async function removeSelectedFavorites(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    const selected = req.body.selected;
    const clientName = req.body.clientName?.trim();

    const errors = [];

    if (!selected || selected.length === 0) {
      errors.push("Please select at least one vehicle to remove.");
    }

    if (!clientName) {
      errors.push("Please enter your name in the name input.");
    }

    if (errors.length > 0) {
      
      res.locals.oldClientName = clientName;
      res.locals.oldSelected = selected;

      errors.forEach(msg => req.flash("notice", msg));
      return res.redirect("/favorites/account/favorites");
    }


    const selectedArray = Array.isArray(selected) ? selected : [selected];

    for (const inv_id of selectedArray) {
      await favoriteModel.removeFavorite(account_id, parseInt(inv_id));
    }

    req.flash('success', 'Vehicle deleted succesfully.');
    return res.redirect('/favorites/account/favorites');
  } catch (error) {
    console.error('Error deleting favorites vehicles', error);
    req.flash('notice', 'Upps, an error happened when we tried to delete your favorite cars.');
    return res.redirect('/favorites/account/favorites');
  }
}

module.exports = {addFavorite, removeFavorite, buildFavoritesView, removeSelectedFavorites}
