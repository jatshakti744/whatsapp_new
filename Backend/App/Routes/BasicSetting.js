const router = require("express").Router()
const auth = require('../Middleware/auth');

const { AddBasicSetting, getSettings } = require('../Controllers/BasicSetting')



router.post('/basicsetting/add', auth, AddBasicSetting);
router.get('/basicsetting/detail', auth, getSettings);


module.exports = router;
