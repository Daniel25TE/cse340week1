const pool = require("../database/")

//query to insert a new favorite car to the user account
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO public.favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING *;
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error adding favorite:", error)
    throw error
  }
}

// query to remove a car from the favorite list of the user account
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM public.favorites
      WHERE account_id = $1 AND inv_id = $2
      RETURNING *;
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error removing favorite:", error)
    throw error
  }
}

// query to check if the same car is already in the favorite list, this will not allow duplicates in the list
async function isFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT * FROM public.favorites
      WHERE account_id = $1 AND inv_id = $2;
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows.length > 0
  } catch (error) {
    console.error("Error checking favorite:", error)
    throw error
  }
}

//this query selects the favorite list from the specific user
async function getUserFavorites(account_id) {
  try {
    const sql = `
      SELECT f.fav_id, f.created_at, i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_thumbnail, i.inv_price
      FROM public.favorites AS f
      JOIN public.inventory AS i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC;
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("Error fetching user favorites:", error)
    throw error
  }
}

module.exports = {addFavorite, removeFavorite, isFavorite, getUserFavorites}
