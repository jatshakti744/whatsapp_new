const cron = require("node-cron");
const moment = require("moment-timezone");
const db = require("../Models");

const Whatsappchat_Modal = db.Whatsappchat;
const axios = require("axios");



async function getEmployeeFromCrmMobile(mobileNumber) {
  try {
    if (!mobileNumber) {
      return {
        id: "INFADMIN2901"
      };
    }

    const last10Phone = mobileNumber.slice(-10);

    const response = await axios.get(
      `${process.env.API_BASE_URL}viewcontactbyphone/${last10Phone}`,
      {
        headers: {
          "x-crm-key": process.env.CRM_SECRET_KEY
        }
      }
    );

    if (!response?.data?.data) {
      return {
        id: "INFADMIN2901"
      };
    }

    return response.data.data;

  } catch (error) {
    if (error.response?.status === 404) {
      return {
        id: "INFADMIN2901"
      };
    }

 //   console.error("CRM ERROR:", error.message);
    return {
      id: "INFADMIN2901"
    };
  }
}


cron.schedule("*/2 * * * * *", async () => {
  // cron.schedule("*/10 * * * *", async () => {
  try {

    const startOfDay = moment()
      .tz("Asia/Kolkata")
      .startOf("day")
      .toDate();

    const endOfDay = moment()
      .tz("Asia/Kolkata")
      .endOf("day")
      .toDate();

    const chats = await Whatsappchat_Modal.find({
      crm_user_id: "INFADMIN2901",
      assign_notified: false,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
      .sort({ createdAt: 1 })
      .limit(50);

    if (!chats.length) return;

    for (const chat of chats) {
      const phone = chat.phone?.slice(-10);
      if (!phone) continue;

      const crmUser = await getEmployeeFromCrmMobile(phone);



//      if (
//   !crmUser?.employee_id ||
//   crmUser.employee_id === "INFADMIN2901"
// ) {
//   continue;
// }

      // ?? Update CRM user
      const updatedChat = await Whatsappchat_Modal.findOneAndUpdate(
        { _id: chat._id,
           assign_notified: false
         },
        { crm_user_id: crmUser.employee_id,
          assign_notified: true
         },
        { new: true }
      );


      


      if (!updatedChat) continue;


const payload = {
  phone: updatedChat.phone,
  message: updatedChat.message || updatedChat.caption || "Media message",
  message_id: updatedChat._id,
  old_crm_user_id: "INFADMIN2901",
  crm_user_id: updatedChat.crm_user_id,
  createdAt: updatedChat.createdAt
};


//console.log('url---',process.env.DOMAINNAME);
axios.post(`https://${process.env.DOMAINNAME}/backend/whatsapp/emit-chat-assign`, payload)
  .then(res => {
   //console.log("API Response:", res.data);
  })
  .catch(err => {
   // console.error("API Error:", err.message);
  });



 //     console.log(
     //   `?? Socket emitted | Chat ${updatedChat._id} ? CRM ${updatedChat.crm_user_id}`
 //     );
    }
  } catch (error) {
  //  console.error("?? Cron Error:", error.message);
  }
});
