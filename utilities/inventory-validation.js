const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification must not contain spaces or special characters."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classification_name =
      (req.body && req.body.classification_name) || ""
    return res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
  }
  next()
}

validate.inventoryRules = () => {
  const thisYear = new Date().getFullYear()
  return [
    body("classification_id").notEmpty().withMessage("Choose a classification."),

    body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1886, max: thisYear + 1 })
      .withMessage("Enter a valid year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a number >= 0."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be an integer >= 0."),

    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_color").trim().escape(),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    
    const body = req.body || {}
    const classification_id = body.classification_id || ""
    const inv_make = body.inv_make || ""
    const inv_model = body.inv_model || ""
    const inv_description = body.inv_description || ""
    const inv_image = body.inv_image || "/images/no-image-available.png"
    const inv_thumbnail = body.inv_thumbnail || "/images/no-image-available.png"
    const inv_price = body.inv_price || ""
    const inv_year = body.inv_year || ""
    const inv_miles = body.inv_miles || ""
    const inv_color = body.inv_color || ""

    const classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory Item",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
  }

  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    
    const body = req.body || {}
    const classification_id = body.classification_id || ""
    const inv_make = body.inv_make || ""
    const inv_model = body.inv_model || ""
    const inv_description = body.inv_description || ""
    const inv_image = body.inv_image || "/images/no-image-available.png"
    const inv_thumbnail = body.inv_thumbnail || "/images/no-image-available.png"
    const inv_price = body.inv_price || ""
    const inv_year = body.inv_year || ""
    const inv_miles = body.inv_miles || ""
    const inv_color = body.inv_color || ""
    const inv_id = body.inv_id || ""

    const classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id
    })
  }

  next()
}

module.exports = validate
