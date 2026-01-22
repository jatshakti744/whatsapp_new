const router = require("express").Router();
const auth = require('../Middleware/auth');
const { getCount, Notification, NotificationList, statusChangeNotifiction, allStatusChangeNotifiction } = require('../Controllers/Dashboard');

router.get('/dashboard/getcount', auth, getCount);
router.get('/dashboard/notification', auth, Notification);
router.post('/dashboard/notificationlist', auth, NotificationList);
router.post('/dashboard/statuschangenotifiction', auth, statusChangeNotifiction);
router.get('/dashboard/allstatuschangenotifiction', auth, allStatusChangeNotifiction);


module.exports = router;
