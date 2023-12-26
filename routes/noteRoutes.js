const express = require('express');
const noteController = require('../controllers/noteController');

const router = express.Router();

router.get('/create', noteController.note_create_get);
router.get('/', noteController.note_index);
router.post('/', noteController.note_create_post);
router.get('/:id', noteController.note_details);
router.get('/update/:id', noteController.note_update_get);
router.post('/update/:id',noteController.note_update_post);
router.delete('/:id', noteController.note_delete);

module.exports = router;