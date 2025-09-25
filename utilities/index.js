const invModel = require("../models/inventory-model")
const Util = {}

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details" class="card-link">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`;
      grid += `<div class="namePrice">`;
      grid += `<hr>`;
      grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
      grid += `</div>`;
      grid += `</a>`;
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="main-nav">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildDetailView = async function(vehicle) {
  let html = `<div class="vehicle-detail">
    <img src="${vehicle.inv_image}" alt=" This is a ${vehicle.inv_make} ${vehicle.inv_model}">
    <div class="vehicle-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <p class="price">Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
    </div>
  </div>`
  return html
}

Util.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" class="classification_select" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util