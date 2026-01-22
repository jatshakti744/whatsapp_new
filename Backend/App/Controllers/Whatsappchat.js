"use strict";

const db = require("../Models");
const Whatsappchat_Modal = db.Whatsappchat;
const Clients_Modal = db.Clients;

const ioSocket = require("../Utils/ioSocketReturn");
const io = ioSocket.getIO();
const axios = require('axios');
const crypto = require('crypto');
const upload = require("../Utils/multerHelper"); // Import the multer helper
const path = require("path");
const fs = require("fs");
const Whatstemplate_Modal = db.Whatstemplate; // Models/index.js me add karna hoga


class Whatsappchat {

  async sendMessage(req, res) {
    try {

      await new Promise((resolve, reject) => {
        upload("whatsapp").fields([{ name: "image", maxCount: 1 }])(
          req,
          res,
          (err) => {
            // if (err) {
            //     if (err.code === "LIMIT_FILE_SIZE") {
            // return reject(new Error("File size must be less than 5MB"));
            //     }
            // return reject(err);
            //    }

            //   if (!req.files || !req.files.image) {
            // return reject(new Error("No file uploaded"));
            //    }

            resolve();
          }
        );
      });
      // ✅ SAFE TO ACCESS FILE
      let file = null;

      if (req.files && req.files.image && req.files.image.length > 0) {
        file = req.files.image[0];
      }
      // 🔥 TYPE YAHIN SE NIKALO
      let message_type = "text";   // default
      let media_url = null;



      if (file && file.mimetype) {
        if (file.mimetype.startsWith("image/")) {
          message_type = "image";
        } else if (file.mimetype.startsWith("video/")) {
          message_type = "video";
        } else if (file.mimetype.startsWith("audio/")) {
          message_type = "audio";
        } else {
          message_type = "document";
        }
        const filename = file.filename;
        media_url = `${process.env.DOMAIN}/uploads/whatsapp/${file.filename}`;
      }

      const {
        phone,
        message,
        caption,
        sender_type,
        sender_id,
        reply_to,
        is_template,
        template_name,
        template_params,
        crm_user_id
      } = req.body;
      if (!phone || !sender_type) {
        return res.status(400).json({
          status: false,
          message: "Required fields missing"
        });
      }

      /* ================== BUILD WHATSAPP PAYLOAD ================== */

      const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

      let payload = {
        messaging_product: "whatsapp",
        to: phone
      };


      let finalMessage = message; // default message
      const isTemplate = is_template === true || is_template === "true";
      // 🔹 TEMPLATE MESSAGE (24h ke bahar)
      if (isTemplate) {


        // 🔹 Convert string to array if needed
        let paramsArray = [];

        if (template_params) {
          if (Array.isArray(template_params)) {
            paramsArray = template_params;
          } else if (typeof template_params === "string") {
            // Split by '##' and remove empty values
            paramsArray = template_params.split("##").filter(p => p.trim() !== "");
          }
        }



        payload.type = "template";
        payload.template = {
          name: template_name,
          language: { code: "en_US" }
        };

        if (Array.isArray(paramsArray) && paramsArray.length) {
          payload.template.components = [
            {
              type: "body",
              parameters: paramsArray.map(text => ({
                type: "text",
                text
              }))
            }
          ];
        }

        const templateDoc = await Whatstemplate_Modal.findOne({ template_name });

        if (!templateDoc) {
          return res.status(404).json({ status: false, message: "Template not found" });
        }

        // DB से जो template message आया
         finalMessage = templateDoc.message;

        // paramsArray से replace करो (curly braces escape करके)
        paramsArray.forEach((param, index) => {
          const regex = new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"); // Escape curly braces
          finalMessage = finalMessage.replace(regex, param);
        });


      }

      // 🔹 TEXT MESSAGE (24h window)
      else if (message_type === "text") {
        payload.type = "text";
        payload.text = {
          preview_url: false,
          body: message
        };
      }

      else if (message_type === "image") {
        console.log("Preparing image payload with media_url:", media_url);
        payload.type = "image";
        payload.image = {
          link: media_url,
          caption: caption || ""
        };
      }

      else if (message_type === "video") {
        payload.type = "video";
        payload.video = {
          link: media_url,
          caption: caption || ""
        };
      }


      else if (message_type === "audio") {
        payload.type = "audio";
        payload.audio = {
          link: media_url
        };
      }

      // 🔹 DOCUMENT MESSAGE
      else if (message_type === "document") {
        payload.type = "document";
        payload.document = {
          link: media_url,
          caption: caption || "",
          filename: caption || "Document"
        };
      }

      else {
        return res.status(400).json({
          status: false,
          message: "Invalid message type"
        });
      }

      /* ================== SEND TO WHATSAPP ================== */

      const waResponse = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      const metaMessageId = waResponse.data?.messages?.[0]?.id || null;
      /* ================== SAVE TO DB ================== */
      //  const crmUser = await getEmployeeFromCrmMobile(phone);
      //       const crm_user_id = crmUser?.employee_id || 1;


console.log('finalMessage:', finalMessage);
      const chat = await Whatsappchat_Modal.create({
        phone,
        message: finalMessage,
        message_type: is_template ? "template" : message_type,
        media_url,
        caption,
        sender_type,
        sender_id,
        reply_to,
        is_template,
        whatsapp_msg_id: metaMessageId,
        sendto: 1,
        is_read: 1,
        crm_user_id

      });



      const socketData = {
        title: "New WhatsApp Message",
        message: message || caption || "Media message",
        type: "whatsapp_chat",
        phone,
        message_id: chat._id,
        crm_user_id
      };



      io.emit("clientnotification", socketData);



      return res.json({
        status: true,
        message: "Message sent successfully",
        data: chat
      });

    } catch (error) {
      console.error("WhatsApp Error:", error.response?.data || error.message);

      return res.status(500).json({
        status: false,
        message: "WhatsApp message failed"
      });
    }
  }

  async getClientChats(req, res) {
    try {
      const { client_id } = req.params;

      if (!client_id) {
        return res.status(400).json({
          status: false,
          message: "Client ID required"
        });
      }

      const chats = await Whatsappchat_Modal.find({
        client_id,
        del: 0
      })
        .sort({ createdAt: 1 })
        .populate("reply_to", "message sender_type");

      return res.json({
        status: true,
        message: "Chat history fetched",
        data: chats
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error"
      });
    }
  }


  async chatList(req, res) {
    try {
      const list = await Whatsappchat_Modal.aggregate([
        { $match: { del: 0 } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$client_id",
            lastMessage: { $first: "$message" },
            lastMessageType: { $first: "$message_type" },
            phone: { $first: "$phone" },
            lastAt: { $first: "$createdAt" }
          }
        },
        { $sort: { lastAt: -1 } }
      ]);

      return res.json({
        status: true,
        message: "Chat list fetched",
        data: list
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error"
      });
    }
  }


  async updateMessageStatus(req, res) {
    try {
      const { id, status } = req.body;

      const validStatus = ['sent', 'delivered', 'read', 'failed'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status"
        });
      }

      const updated = await Whatsappchat_Modal.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          status: false,
          message: "Message not found"
        });
      }

      //   io.emit("whatsapp:status_update", updated);

      return res.json({
        status: true,
        message: "Message status updated",
        data: updated
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error"
      });
    }
  }

  async deleteMessage(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Whatsappchat_Modal.findByIdAndUpdate(
        id,
        { del: 1 },
        { new: true }
      );

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Message not found"
        });
      }

      return res.json({
        status: true,
        message: "Message deleted"
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error"
      });
    }
  }


  async getChatHistoryByPhone(req, res) {
    try {
      const { phone, crm_user_id } = req.params;

      if (!phone) {
        return res.status(400).json({
          status: false,
          message: "Phone number is required"
        });
      }

      const normalizedPhone = phone.replace(/\D/g, '').slice(-10);

      // const chats = await Whatsappchat_Modal.find({
      //   phone: new RegExp(`${normalizedPhone}$`), 
      //   crm_user_id: crm_user_id,
      //   del: 0
      // }).sort({ createdAt: 1 });


      const query = {
        phone: new RegExp(`${normalizedPhone}$`),
        del: 0
      };

      // agar crm_user_id 1 nahi hai tabhi condition lagao
      // if (Number(crm_user_id) !== 1) {
      //   query.crm_user_id = crm_user_id;
      // }


      await Whatsappchat_Modal.updateMany(
        {
          ...query,
          is_read: 0
        },
        {
          $set: { is_read: 1 }
        }
      );

      const chats = await Whatsappchat_Modal
        .find(query)
        .sort({ createdAt: 1 });

      let emp = null;

      try {
        const crmUser = await getEmployeeFromCrmMobile(normalizedPhone);

        const employeeId =
          crmUser?.employee_id ||
          crmUser?.id ||
          (Number(crm_user_id) || 1);

        let newEmployeeId = null;
        newEmployeeId =
          crmUser?.employee_id ||
          crmUser?.id ||
          null;

        if (Number(crm_user_id) !== 1) {
          if (
            newEmployeeId &&
            Number(newEmployeeId) !== Number(crm_user_id)
          ) {
            await Whatsappchat_Modal.updateMany(
              {
                phone: new RegExp(`${normalizedPhone}$`),
                crm_user_id: Number(crm_user_id),
                del: 0
              },
              {
                $set: {
                  crm_user_id: Number(newEmployeeId),
                  old_crm_user_id: Number(crm_user_id)
                }
              }
            );

            if (!newEmployeeId) {
              const redirectUrl = `${process.env.DOMAIN}member/clients`;
              return res.redirect(redirectUrl);
            }
          }

        }

          if (employeeId) {
          const empData = await getEmployeeFromCrm(employeeId);

          emp = empData
            ? {
              id: empData.id || empData.employee_id || "",
              name:
                empData.FullName  || "",
              email: empData.Email || "",
              mobile: empData.PhoneNo || empData.phone || "",
            }
            : null;
        }
      } catch (err) {
        console.error("EMP FETCH ERROR:", err.message);
        emp = null;
      }



      return res.json({
        status: true,
        message: "Chat history fetched successfully",
        data: chats,
        emp: emp
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Server error"
      });
    }
  }


  async Webhook(req, res) {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const APP_SECRET = process.env.APP_SECRET;


    if (req.method === "GET") {
      const mode = req.query["hub.mode"] || req.query["hub_mode"];
      const token = req.query["hub.verify_token"] || req.query["hub_verify_token"];
      const challenge = req.query["hub.challenge"] || req.query["hub_challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      }
      return res.status(403).send("Forbidden");
    }


    if (req.method === "POST" && APP_SECRET) {
      const signature = req.headers["x-hub-signature-256"];
      if (!signature || !req.rawBody) return res.sendStatus(401);

      const expectedHash =
        "sha256=" +
        crypto
          .createHmac("sha256", APP_SECRET)
          .update(req.rawBody)
          .digest("hex");

      if (
        signature.length !== expectedHash.length ||
        !crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedHash)
        )
      ) {
        return res.sendStatus(401);
      }
    }

    try {
      const entry = req.body?.entry?.[0];
      const value = entry?.changes?.[0]?.value || {};
      const messages = value.messages || [];
      const statuses = value.statuses || [];


      for (const msg of messages) {
        const phone = msg.from;
        const type = msg.type || "text";
        let text = msg.text?.body || null;

        let media_url = null;
        let caption = null;
        let media_id = null;
        if (type === "image") {
          media_id = msg.image?.id || null;
          media_url = await downloadWhatsAppMedia(media_id);
          caption = msg.image?.caption || null;
        }
        if (type === "document") {
          media_id = msg.document?.id || null;
          media_url = await downloadWhatsAppMedia(media_id);
          caption = msg.document?.filename || null;
        }

        if (type === "video") {
          media_id = msg.video?.id || null;
          media_url = await downloadWhatsAppMedia(media_id);
          caption = msg.video?.filename || null;
        }

        if (type === "audio") {
          media_id = msg.audio?.id || null;
          media_url = await downloadWhatsAppMedia(media_id);
          caption = msg.audio?.filename || null;
        }

      if (type === "button") {
        let button_title = null;
        button_title = msg.button?.text;   // Cash  // Cash
         text = button_title;                  // 👈 message me "Cash"
      }

        const last10Phone = phone.slice(-10); // take only last 10 digits
        const crmUser = await getEmployeeFromCrmMobile(phone);
        const crm_user_id = crmUser?.employee_id || 1;

        // 🔹 Save in DB
        const chat = await Whatsappchat_Modal.create({
          phone,
          message: text,
          message_type: type,
          media_url,
          caption,
          sender_type: "bot",
          sender_id: phone,
          status: "sent",
          whatsapp_msg_id: msg.id?.trim(),
          crm_user_id
        });


        const socketData = {
          title: "New WhatsApp Message",
          message: text || caption || "Media message",
          type: "whatsapp_chat",
          phone,
          message_id: chat._id,
          crm_user_id
        };

        io.emit("clientnotification", socketData);


      }


      for (const st of statuses) {
        const msgId = st.id?.trim();
        const validStatuses = ["sent", "delivered", "read", "failed"];
        const status = validStatuses.includes(st.status)
          ? st.status
          : "sent";

        const updateData = { status };

        if (status === "failed" && st.errors?.length) {
          updateData.whatsapp_msg_error =
            st.errors[0]?.error_data?.details ||
            st.errors[0]?.message ||
            "Unknown WhatsApp error";
        } else {
          updateData.whatsapp_msg_error = null;
        }

        const updatedMsg = await Whatsappchat_Modal.findOneAndUpdate(
          { whatsapp_msg_id: msgId },
          updateData,
          { new: true }
        );

        if (!updatedMsg) continue;

        // 🔹 find crm_user_id again
        const crmUser = await getEmployeeFromCrmMobile(updatedMsg.phone);
        const crm_user_id = crmUser?.employee_id || 1;


        const socketStatusData = {
          type: "whatsapp_status",
          message_id: updatedMsg._id,
          phone: updatedMsg.phone,
          status: updatedMsg.status,
          error: updatedMsg.whatsapp_msg_error,
          crm_user_id
        };

        io.emit("clientnotification", socketStatusData);


      }

      return res.status(200).send("OK");
    } catch (error) {
      console.error("🔥 Webhook Error:", error);
      return res.status(200).send("OK");
    }
  }

  async getChatUserList(req, res) {
    try {
      let { crm_user_id, search } = req.query;
      crm_user_id = Number(crm_user_id);

      // 🔹 Base match
      let matchCondition = {
        del: 0,
        ActiveStatus: 1
      };

      // 🔹 crm_user_id rule
      if (crm_user_id && crm_user_id !== 1) {
        matchCondition.crm_user_id = crm_user_id;
      }

      // 🔹 phone search
      if (search && search.trim() !== "") {
        const normalizedSearch = search.replace(/\D/g, "");
        matchCondition.phone = {
          $regex: normalizedSearch,
          $options: "i"
        };
      }
      const chats = await Whatsappchat_Modal.aggregate([
        { $match: matchCondition },

        // latest message first
        { $sort: { createdAt: -1 } },


              {
        $addFields: {
          normalizedPhone: {
            $substr: [
              {
                $cond: [
                  { $gt: [{ $strLenCP: "$phone" }, 10] },
                  {
                    $substr: [
                      "$phone",
                      { $subtract: [{ $strLenCP: "$phone" }, 10] },
                      10
                    ]
                  },
                  "$phone"
                ]
              },
              0,
              10
            ]
          }
        }
      },


        // 🔥 group by phone
        {
          $group: {
            _id: "$normalizedPhone",

            // last message info
            lastMessage: { $first: "$message" },
            message_type: { $first: "$message_type" },
            sender_type: { $first: "$sender_type" },
            sender_id: { $first: "$sender_id" },
            crm_user_id: { $first: "$crm_user_id" },
            createdAt: { $first: "$createdAt" },
           
                      // ✅ last BOT message time (ANYWHERE)
            lastClientMessageAt: {
              $max: {
                $cond: [
                  { $eq: ["$sender_type", "bot"] },
                  "$createdAt",
                  null
                ]
              }
            },

            // 🔥 unread count per mobile
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$is_read", 0] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        },

        { $sort: { createdAt: -1 } },
        { $limit: 50 },

        {
          $project: {
            _id: 0,
            phone: "$_id",
            lastMessage: 1,
            message_type: 1,
            sender_type: 1,
            sender_id: 1,
            crm_user_id: 1,
            createdAt: 1,
            unreadCount: 1,
            lastClientMessageAt: 1 // 🔥 frontend badge
          }
        }
      ]);


      const finalChats = await Promise.all(
        chats.map(async (chat) => {
          const employee = await getEmployeeFromCrmMobile(chat.phone);
          return {
            ...chat,
            client_name: employee?.name || "",
            client_email: employee?.email || "",
            client_id: employee?.id || null
          };
        })
      );



      res.json({
        status: true,
        data: finalChats
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        message: "Server error"
      });
    }
  }


  async sendTemplateBulkMessage(req, res) {
  try {
    const {
      phones,              // array of numbers
      sender_type,
      sender_id,
      template_name,
      template_params,
      crm_user_id
    } = req.body;

    /* ================= VALIDATION ================= */
    if (
      !Array.isArray(phones) ||
      phones.length === 0 ||
      !sender_type ||
      !template_name
    ) {
      return res.status(400).json({
        status: false,
        message: "Required fields missing"
      });
    }

    /* ================= TEMPLATE FETCH ================= */
    const templateDoc = await Whatstemplate_Modal.findOne({ template_name });

    if (!templateDoc) {
      return res.status(404).json({
        status: false,
        message: "Template not found"
      });
    }

    /* ================= PARAMS FORMAT ================= */
    let paramsArray = [];

    if (template_params) {
      if (Array.isArray(template_params)) {
        paramsArray = template_params;
      } else if (typeof template_params === "string") {
        paramsArray = template_params
          .split("##")
          .filter(p => p.trim() !== "");
      }
    }

    const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    let results = [];

    /* ================= LOOP FOR MULTIPLE NUMBERS ================= */
    for (let phone of phones) {

      let payload = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: template_name,
          language: { code: "en_US" }
        }
      };

      if (paramsArray.length) {
        payload.template.components = [
          {
            type: "body",
            parameters: paramsArray.map(text => ({
              type: "text",
              text
            }))
          }
        ];
      }

      /* ================= SEND TO WHATSAPP ================= */
      const waResponse = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      });

      const metaMessageId =
        waResponse.data?.messages?.[0]?.id || null;

      /* ================= FINAL MESSAGE (DB PURPOSE) ================= */
      let finalMessage = templateDoc.message;

      paramsArray.forEach((param, index) => {
        const regex = new RegExp(`\\{\\{${index + 1}\\}\\}`, "g");
        finalMessage = finalMessage.replace(regex, param);
      });

      /* ================= SAVE TO DB ================= */
      const chat = await Whatsappchat_Modal.create({
        phone,
        message: finalMessage,
        message_type: "template",
        media_url: null,
        caption: null,
        sender_type,
        sender_id,
        reply_to: null,
        is_template: true,
        whatsapp_msg_id: metaMessageId,
        sendto: 1,
        is_read: 1,
        crm_user_id
      });

      results.push({
        phone,
        status: "sent",
        message_id: chat._id
      });
    }

    return res.json({
      status: true,
      message: "Template messages sent successfully",
      data: results
    });

  } catch (error) {
    console.error("Bulk Template Error:", error.response?.data || error.message);

    return res.status(500).json({
      status: false,
      message: "Template message failed"
    });
  }
}



}


async function getEmployeeFromCrmMobile(mobileNumber) {
  if (!mobileNumber) return null;

  const last10Phone = mobileNumber.slice(-10); // take only last 10 digits
  const response = await axios.get(
  `${process.env.API_BASE_URL}viewcontactbyphone/${last10Phone}`,

    {
      headers: {
        "x-crm-key": process.env.CRM_SECRET_KEY
      }
    }
  );

  return response.data.data;
}


async function downloadWhatsAppMedia(mediaId) {
  // 🔹 Step 1: Get media meta
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  const metaRes = await axios.get(
    `https://graph.facebook.com/v19.0/${mediaId}`,
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      }
    }
  );

  const { url, mime_type } = metaRes.data;

  // 🔹 Step 2: Download binary
  const mediaRes = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`
    },
    responseType: "arraybuffer"
  });

  // 🔹 Step 3: Save locally
  const ext = mime_type.split("/")[1];
  const fileName = `${mediaId}.${ext}`;
  const filePath = path.join(__dirname, "../../../../var/www/apiwhatsapp.tradestreet.in/uploads/whatsapp", fileName);

  fs.writeFileSync(filePath, mediaRes.data);

  return `${process.env.DOMAIN}uploads/whatsapp/${fileName}`; // 👈 public URL
}



async function getEmployeeFromCrm(employeeId) {
  const response = await axios.get(
    `${process.env.API_BASE_URL}viewemployeebyid/${employeeId}`,
    {
      headers: {
        "x-crm-key": process.env.CRM_SECRET_KEY
      }
    }
  );

  return response.data.data;
}

module.exports = new Whatsappchat();
