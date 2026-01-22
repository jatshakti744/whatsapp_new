const router = require("express").Router();
const auth = require('../Middleware/auth');

const {
    getWhatstemplate,
    updateWhatstemplate,
    detailWhatstemplate,
    addWhatstemplate,
    getActiveWhatstemplate,
    changeWhatstemplateStatus,
    deleteWhatstemplate
} = require('../Controllers/Whatstemplate');

router.post('/whatstemplate/add', auth, addWhatstemplate);
router.get('/whatstemplate/list', auth, getWhatstemplate);
router.put('/whatstemplate/update', auth, updateWhatstemplate);
router.get('/whatstemplate/detail/:id', auth, detailWhatstemplate);
router.get('/whatstemplate/active_list', auth, getActiveWhatstemplate);
router.put('/whatstemplate/change_status', auth, changeWhatstemplateStatus);
router.get('/whatstemplate/delete/:id', auth, deleteWhatstemplate);
module.exports = router;
