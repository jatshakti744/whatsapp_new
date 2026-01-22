const router = require("express").Router()
const auth = require('../Middleware/auth');

const { getSmsprovider, updateSmsprovider, setActiveSmsProvider } = require('../Controllers/Smsprovider')



router.get('/smsprovider/list', auth, getSmsprovider);
router.put('/smsprovider/update', auth, updateSmsprovider);
router.post('/smsprovider/changestatus', auth, setActiveSmsProvider);




module.exports = router;
