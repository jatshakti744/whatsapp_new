const router = require("express").Router()
const auth = require('../Middleware/auth');
const upload = require("../Utils/multerHelper"); // Your Multer helper

const { AddClient, updateClient, deleteClient, detailClient, statusChange, getClientWithFilter, getClientWithFilterExcel, getDeleteClientWithFilter, changeOwner, bulkUploadClients } = require('../Controllers/Clients')



router.post('/client/add', auth, AddClient);
router.post('/client/listwithfilter', auth, getClientWithFilter);
router.post('/client/deletelistwithfilter', auth, getDeleteClientWithFilter);

router.get('/client/listwithfilterexcel', auth, getClientWithFilterExcel);

router.put('/client/update', auth, updateClient);
router.get('/client/delete/:id/:add_by', auth, deleteClient);
router.get('/client/detail/:id', auth, detailClient);
router.post('/client/change-status', auth, statusChange);
router.post('/client/change-owner', auth, changeOwner);
router.post("/client/bulkuploadclients", auth, upload("client").single("file"), bulkUploadClients);


module.exports = router;
