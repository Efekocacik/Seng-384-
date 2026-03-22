const express = require("express");
const {
  getAllPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson
} = require("../controllers/peopleController");

const router = express.Router();

router.get("/", getAllPeople);
router.get("/:id", getPersonById);
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

module.exports = router;

