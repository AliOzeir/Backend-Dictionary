const express = require("express");
const router = express.Router();
const wordController = require("../controllers/wordController")

// --- Get all cart items
router.get('/get', wordController.getAll);

router.post('/add', wordController.addWord)

router.post("/search", wordController.searchWord);

router.post("/search/option", wordController.searchWordOpt1);

router.post("/search/autocorrect", wordController.autocorrectFunc);

router.post("/admin", wordController.verifyAdmin);

router.delete("/delete/:id", wordController.deleteWord);

module.exports = router