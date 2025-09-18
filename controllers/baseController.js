const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}
baseController.showError = async function (req, res) {
  throw new Error("500 error!!")
}

module.exports = baseController