const router = require("express").Router()
const auth = require('../Middleware/auth');

const { getMailtemplate, updateMailtemplate, detailMailtemplate } = require('../Controllers/Mailtemplate')



router.get('/mailtemplate/list', auth, getMailtemplate);
router.put('/mailtemplate/update', auth, updateMailtemplate);
router.get('/mailtemplate/detail/:id', auth, detailMailtemplate);

module.exports = router;
