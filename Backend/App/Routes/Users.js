const router = require('express').Router();
const auth = require('../Middleware/auth');
const {
    AddUser,
    getUser,
    updateUser,
    deleteUser,
    detailUser,
    loginUser,
    statusChange,
    updateUserPermissions,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    activeUser,
    loginUserWithCrm,
    getCrmContactWithFilter,
    getCrmContactWithFilterUnassign,
    getCrmContactWithFilterUnassignAll,
    checkCrmStatus,
    getCrmContactWithFilterWithClient,
    getCrmContactWithFilterUnassignWithClient,
    getCrmContactWithFilterUnassignAllWithClient,
    getAllClients,
    getUsers
} = require('../Controllers/Users');

// Public routes
router.post('/user/login', loginUser);
router.get('/user/loginuserwithcrm', loginUserWithCrm);

router.post('/user/forgot-password', forgotPassword);
router.post('/user/reset-password', resetPassword);

// Protected routes
router.post('/user/add', auth, AddUser);
router.get('/user/list', auth, getUser);
router.get('/user/lists', auth, getUsers);
router.put('/user/update', auth, updateUser);
router.get('/user/delete/:id', auth, deleteUser);
router.get('/user/detail/:id', auth, detailUser);
router.post('/user/change-status', auth, statusChange);
router.post('/user/update-permissions', auth, updateUserPermissions);
router.post('/user/change-password', auth, changePassword);
router.post('/user/update-profile', updateProfile);
router.get('/user/activeuser', auth, activeUser);
router.post('/user/getcrmcontactwithfilter', getCrmContactWithFilter);
router.post('/user/getcrmcontactwithfilterunassign', getCrmContactWithFilterUnassign);
router.post('/user/getcrmcontactwithfilterunassignall', getCrmContactWithFilterUnassignAll);
router.post('/user/checkcrmstatus', checkCrmStatus);
router.post('/user/getcrmcontactwithfilterwithclient', auth, getCrmContactWithFilterWithClient);
router.post('/user/getcrmcontactwithfilterunassignwithclient', auth, getCrmContactWithFilterUnassignWithClient);
router.post('/user/getcrmcontactwithfilterunassignallwithclient', auth, getCrmContactWithFilterUnassignAllWithClient);
router.post('/user/getallclients', auth, getAllClients);


module.exports = router;
