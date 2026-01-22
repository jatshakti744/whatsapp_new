const router = require("express").Router()
const auth = require('../Middleware/auth');

const { getSmstemplate, updateSmstemplate, detailSmstemplate } = require('../Controllers/Smstemplate')


router.get('/smstemplate/list', auth, getSmstemplate);
router.put('/smstemplate/update', auth, updateSmstemplate);
router.get('/smstemplate/detail/:id', auth, detailSmstemplate);

module.exports = router;
