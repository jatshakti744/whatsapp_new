const axios = require('axios');
const db = require("../Models");

const Smsprovider_Modal = db.Smsprovider;


const sendSMS = async (mobile, message, templateId) => {

  const activeProvider = await Smsprovider_Modal.findOne({ status: 1 });

  const authKey = activeProvider.apikey;
  const sender = activeProvider.sender;
  const route = activeProvider.route;
  const urls = activeProvider.url;
  const username = activeProvider.username;
  const password = activeProvider.password;
  const entity_id = activeProvider.entity_id;
  const name = activeProvider.name;

  const coding = '1';
  let config;
  const encodedMessage = encodeURIComponent(message);

  if (name == "bulksmsservice") {
    config = `username=${username}&pass=${password}&senderid=${sender}&dest_mobileno=${mobile}&msgtype=TXT&response=Y&dlttempid=${templateId}&message=${encodedMessage}`;
  }
  else if (name == "pushsms") {
    config = `UserID=${username}&Password=${authKey}&SenderID=${sender}&Phno=${mobile}&Msg=${encodedMessage}&EntityID=${entity_id}&TemplateID=${templateId}`;
  }
  else if (name == "smartping") {
    config = `username=${username}&password=${password}&unicode=false&from=${sender}&to=${mobile}&text=${encodedMessage}&dltPrincipalEntityId=${entity_id}&dltContentId=${templateId}`;
  }

  const url = `${urls}?${config}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.message;
  }


};

module.exports = { sendSMS };
