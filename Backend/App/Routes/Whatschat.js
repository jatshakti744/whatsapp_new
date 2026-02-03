const router = require("express").Router();
const auth = require('../Middleware/auth');

const {
  sendMessage,
  getClientChats,
  chatList,
  updateMessageStatus,
  deleteMessage,
  Webhook,
  getChatHistoryByPhone,
  getChatUserList,
  sendTemplateBulkMessage,
  getChatUserListFromClient,
  EmitChatAssign,
  getChatHistoryByPhones
} = require('../Controllers/Whatsappchat');


router.post('/whatsapp/send', auth, sendMessage);
router.get('/whatsapp/client/:client_id', auth, getClientChats);
router.get('/whatsapp/list', auth, chatList);
router.post('/whatsapp/change-status', auth, updateMessageStatus);
router.get('/whatsapp/delete/:id', auth, deleteMessage);
router.all('/whatsapp/webhook', Webhook);
router.get('/whatsapp/getchathistorybyphone/:phone/:crm_user_id', auth, getChatHistoryByPhone);
router.get('/whatsapp/getchathistorybyphones/:phone/:crm_user_id', auth, getChatHistoryByPhones);

router.get('/whatsapp/delete/:id', auth, deleteMessage);
router.get('/whatsapp/getchatuserlist', auth, getChatUserList);
router.post('/whatsapp/sendbluk', auth, sendTemplateBulkMessage);
router.get('/whatsapp/getchatuserlistfromclient', auth, getChatUserListFromClient);
router.post('/whatsapp/emit-chat-assign', EmitChatAssign);

module.exports = router;
