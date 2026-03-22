const { pool } = require("../db");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePersonInput({ full_name, email }) {
  const errors = [];

  if (!full_name || typeof full_name !== "string" || full_name.trim().length === 0) {
    errors.push("Full name is required.");
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required.");
  } else if (!emailRegex.test(email)) {
    errors.push("Email format is invalid.");
  }

  return errors;
}

async function getAllPeople(_req, res) {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email FROM people ORDER BY full_name ASC"
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("getAllPeople error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function getPersonById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, full_name, email FROM people WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Person not found." });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("getPersonById error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function createPerson(req, res) {
  const { full_name, email } = req.body;

  const errors = validatePersonInput({ full_name, email });
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation error.", errors });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM people WHERE email = $1",
      [email]
    );
    if (existing.rowCount > 0) {
      return res
        .status(409)
        .json({ message: "Email already exists for another person." });
    }

    const insertResult = await pool.query(
      "INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING id, full_name, email",
      [full_name.trim(), email.trim()]
    );

    return res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error("createPerson error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function updatePerson(req, res) {
  const { id } = req.params;
  const { full_name, email } = req.body;

  const errors = validatePersonInput({ full_name, email });
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation error.", errors });
  }

  try {
    const existingPerson = await pool.query(
      "SELECT id FROM people WHERE id = $1",
      [id]
    );
    if (existingPerson.rowCount === 0) {
      return res.status(404).json({ message: "Person not found." });
    }

    const conflict = await pool.query(
      "SELECT id FROM people WHERE email = $1 AND id <> $2",
      [email, id]
    );
    if (conflict.rowCount > 0) {
      return res
        .status(409)
        .json({ message: "Email already exists for another person." });
    }

    const updateResult = await pool.query(
      "UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, full_name, email",
      [full_name.trim(), email.trim(), id]
    );

    return res.status(200).json(updateResult.rows[0]);
  } catch (err) {
    console.error("updatePerson error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function deletePerson(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM people WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Person not found." });
    }

    return res.status(200).json({ message: "Person deleted successfully." });
  } catch (err) {
    console.error("deletePerson error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  getAllPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson
};

