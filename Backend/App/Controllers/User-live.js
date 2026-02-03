const db = require("../Models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Users_Modal = db.Users;
const BasicSetting_Modal = db.BasicSetting;
const { sendEmail } = require('../Utils/emailService');
const Mailtemplate_Modal = db.Mailtemplate;
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Whatsappchat_Modal = db.Whatsappchat;

class Users {

  async AddUser(req, res) {
    try {
      const { FullName, UserName, Email, PhoneNo, password, add_by } = req.body;

      if (!FullName) {
        return res.json({ status: false, message: "fullname is required" });
      }
      if (!UserName || UserName.length < 3) {
        return res.json({ status: false, message: "username must be at least 3 characters long" });
      }
      if (!Email) {
        return res.json({ status: false, message: "email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res.json({ status: false, message: "Invalid email format" });
      }

      if (!PhoneNo) {
        return res.json({ status: false, message: "phone number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.json({ status: false, message: "Invalid phone number format" });
      }
      if (!password || password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[@$!%*?&#]/.test(password)) {
        return res.json({
          status: false,
          message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)"
        });
      }
      if (!add_by) {
        return res.json({ status: false, message: "Added by field is required" });
      }


      const existingUser = await Users_Modal.findOne({
        del: "0",
        $or: [{ Email }, { PhoneNo }, { UserName }]
      });

      if (existingUser) {
        if (existingUser.UserName == UserName) {
          return res.json({ status: false, message: "Username already exists" });
        } else if (existingUser.Email == Email) {
          return res.json({ status: false, message: "Email already exists" });
        } else if (existingUser.PhoneNo == PhoneNo) {
          return res.json({ status: false, message: "Phone number already exists" });
        }
      }



      const hashedPassword = await bcrypt.hash(password, 10);
      const result = new Users_Modal({
        FullName: FullName,
        UserName: UserName,
        Email: Email,
        PhoneNo: PhoneNo,
        password: hashedPassword,
        add_by: add_by,

      });

      await result.save();

      return res.json({
        status: true,
        message: "User added successfully",
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", error: error.message });
    }
  }


/*
  async getUser(req, res) {

    try {

      const result = await Users_Modal.find({ del: 0, Role: 2 }).sort({ createdAt: -1 });
      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }
  */



async getUser(req, res) {
  try {

    // 🔹 Step 1: Get all active users from local DB
    const users = await Users_Modal.find({ del: 0, Role: 2 }).sort({ createdAt: -1 });

    // 🔹 Step 2: CRM se status check
    for (const user of users) {

      // CRM user id na ho to skip
      if (!user.crm_user_id) continue;

      const crmUser = await getEmployeeFromCrm(user.crm_user_id);

      if (!crmUser || Number(crmUser.status) === 0) {

        await Users_Modal.updateOne(
          { _id: user._id },
          {
            $set: {
              del: 1,
              ActiveStatus: 0
            }
          }
        );
      }
    }

    // 🔹 Step 3: Fresh active users list
    const updatedResult = await Users_Modal.find({ del: 0, Role: 2 })
      .sort({ createdAt: -1 });

    return res.json({
      status: true,
      message: "get",
      data: updatedResult
    });

  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}







  async activeUser(req, res) {

    try {

      const result = await Users_Modal.find({ del: 0, Role: 2, ActiveStatus: 1 }).sort({ createdAt: -1 });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async detailUser(req, res) {
    try {

      // Extract ID from request parameters
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "User ID is required"
        });
      }

      const user = await Users_Modal.findById(id);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }

      return res.json({
        status: true,
        message: "User details fetched successfully",
        data: user
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async updateUser(req, res) {
    try {
      const { id, FullName, Email, PhoneNo } = req.body;


      if (!FullName) {
        return res.status(400).json({ status: false, message: "fullName is required" });
      }

      if (!Email) {
        return res.status(400).json({ status: false, message: "email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res.status(400).json({ status: false, message: "Invalid email format" });
      }

      if (!PhoneNo) {
        return res.status(400).json({ status: false, message: "Phone number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.status(400).json({ status: false, message: "Invalid phone number format" });
      }



      if (!id) {
        return res.status(400).json({
          status: false,
          message: "User ID is required",
        });
      }
      const existingEmailClient = await Users_Modal.findOne({
        Email,
        _id: { $ne: id },
        del: 0
      });

      if (existingEmailClient) {
        return res.status(400).json({
          status: false,
          message: "This email is already in use by another account"
        });
      }




      // Find the User by ID and update their details
      const updatedUser = await Users_Modal.findByIdAndUpdate(
        id,
        {
          FullName,
          Email,
          PhoneNo,
        },
        { updateSearchIndexser: true, runValidators: true } // Options: return the updated document and run validators
      );

      // If the client is not found
      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      return res.json({
        status: true,
        message: "User updated successfully",
        data: updatedUser,
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async deleteUser(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "User ID is required",
        });
      }

      const deletedUser = await Users_Modal.findByIdAndDelete(
        id,
        { del: 1 }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedUser) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      return res.json({
        status: true,
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async loginUser(req, res) {
    try {
      const { UserName, password } = req.body;  // Extract password here
      const settings = await BasicSetting_Modal.findOne();

      if (!UserName) {
        return res.json({ status: false, message: "username is required" });
      }
      if (!password) {
        return res.json({ status: false, message: "password is required" });
      }

      const user = await Users_Modal.findOne({
        UserName: UserName,
        ActiveStatus: '1',
        del: '0'   // Make sure ActiveStatus is compared as a string
      });

      if (!user) {
        return res.json({
          status: false,
          message: "User not found or account is inactive",
        });
      }



      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({
          status: false,
          message: "Password is Incorrect",
        });
      }

      const token = crypto.randomBytes(10).toString('hex'); // 10 bytes = 20 hex characters
      user.token = token;
      await user.save();



      const tokenjwt = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );


      return res.json({
        status: true,
        message: "Login successful",
        data: {
          FullName: user.FullName,
          Email: user.Email,
          PhoneNo: user.PhoneNo,
          Role: user.Role,
          id: user.id,
          token: token,
          tokenjwt: tokenjwt, // Include the JWT token in the response
        },
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }



  async statusChange(req, res) {

    try {
      console.log("REQ BODY 👉", req.body);   // 👈 ADD THIS

      const { id, status } = req.body;
      // Validate status
      const validStatuses = ['1', '0'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find the user first
      const user = await Users_Modal.findById(id);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }

      // Check if trying to activate but permission is null
      // if (
      //   status === '1' &&
      //   (!user.permissions || !Array.isArray(user.permissions) || user.permissions.length === 0)
      // ) {
      //   return res.status(400).json({
      //     status: false,
      //     message: "permission is missing"
      //   });
      // }

      // Update the status
      user.ActiveStatus = status;
      const result = await user.save();

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async updateUserPermissions(req, res) {
    try {
      const { id, permissions } = req.body;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "User ID is required",
        });
      }

      // Ensure permissions is an array
      const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];

      // Retrieve the user's current permissions from the database
      const user = await Users_Modal.findById(id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Update permissions directly with the provided array
      user.permissions = permissionsArray;

      // Save the updated user
      const updatedUser = await user.save();

      return res.json({
        status: true,
        message: "User permissions updated successfully",
        data: updatedUser,
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async forgotPassword(req, res) {

    try {

      const { Email } = req.body;

      if (!Email) {
        return res.status(400).json({ status: false, message: "email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res.status(400).json({ status: false, message: "Invalid email format" });
      }
      // Find the user by email
      const user = await Users_Modal.findOne({ Email });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User with this email does not exist",
        });
      }


      const settings = await BasicSetting_Modal.findOne();
      if (!settings || !settings.smtp_status) {
        throw new Error('SMTP settings are not configured or are disabled');
      }


      const resetToken = Math.floor(100000 + Math.random() * 900000);

      user.forgotPasswordToken = resetToken;
      user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour from now

      await user.save();

      const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'staff_reset_password' }); // Use findOne if you expect a single document
      if (!mailtemplate || !mailtemplate.mail_body) {
        throw new Error('Mail template not found');
      }

      const templatePath = path.join(__dirname, '../../template', 'mailtemplate.html');


      fs.readFile(templatePath, 'utf8', async (err, htmlTemplate) => {
        if (err) {
          return;
        }

        const finalMailBody = mailtemplate.mail_body.replace('{resetToken}', resetToken);
        const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;
        // Replace placeholders with actual values
        const finalHtml = htmlTemplate
          .replace(/{{company_name}}/g, settings.website_title)
          .replace(/{{body}}/g, finalMailBody)
          .replace(/{{logo}}/g, logo)
          .replace(/{{resetToken}}/g, resetToken);

        // Email options
        const mailOptions = {
          to: user.Email,
          from: `${settings.from_name} <${settings.email_address}>`, // Include business name
          subject: `${mailtemplate.mail_subject}`,
          html: finalHtml // Use the HTML template with dynamic variables
        };

        // Send email
        await sendEmail(mailOptions);
      });



      return res.json({
        status: true,
        message: 'Reset token sent to email',
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        return res.status(400).json({
          status: false,
          message: "Reset token and new password are required",
        });
      }

      // Find the user by reset token and check if the token is valid
      const user = await Users_Modal.findOne({
        forgotPasswordToken: resetToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() } // Token should not be expired
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Invalid or expired reset token",
        });
      }

      // Hash the new password

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear the reset token
      user.password = hashedPassword;
      user.forgotPasswordToken = undefined; // Clear the token
      user.forgotPasswordTokenExpiry = undefined; // Clear the expiry

      await user.save();

      return res.json({
        status: true,
        message: "Password has been reset successfully",
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async changePassword(req, res) {
    try {
      const { id, currentPassword, newPassword } = req.body;

      if (!id || !currentPassword || !newPassword) {
        return res.status(400).json({
          status: false,
          message: "User ID, current password, and new password are required",
        });
      }

      const user = await Users_Modal.findOne({ _id: id });
      // Check if the current password is correct
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: "Current password is incorrect",
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      return res.json({
        status: true,
        message: "Password changed successfully",
      });




    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }



  async updateProfile(req, res) {
    try {
      const { id, FullName, Email, PhoneNo } = req.body;

      // Ensure the user ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "User ID is required",
        });
      }

      // Find the user by ID
      const user = await Users_Modal.findById(id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // ✅ Check for duplicate email (other clients only)
      const existingEmailClient = await Users_Modal.findOne({
        Email,
        _id: { $ne: id },
        del: 0
      });

      if (existingEmailClient) {
        return res.status(400).json({
          status: false,
          message: "This email is already in use by another account"
        });
      }


      // Update the user's profile information
      if (FullName) user.FullName = FullName;
      if (Email) user.Email = Email;
      if (PhoneNo) user.PhoneNo = PhoneNo;

      // Save the updated user profile
      await user.save();

      return res.json({
        status: true,
        message: "Profile updated successfully",
        data: {
          id: user.id,
          FullName: user.FullName,
          Email: user.Email,
          PhoneNo: user.PhoneNo,
        }
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  
    async loginUserWithCrm(req, res) {
      try {
        const { employeeId } = req.query;
        if (!employeeId) {
          return res.json({ status: false, message: "Employee ID required" });
        }
  
        // 🔹 Get employee detail from CRM
        const crmUser = await getEmployeeFromCrm(employeeId);
        if (!crmUser) {
          return res.json({ status: false, message: "Employee not found in CRM" });
        }
  
        //const { UserName, password, FullName, Email, PhoneNo } = crmUser;
         const { UserName,  FullName, Email, PhoneNo } = crmUser;
  
        // 🔥 mobile null / empty / undefined check
        if (!crmUser.PhoneNo) {
          return res.json({
            status: false,
            message: "Employee mobile number not found in CRM"
          });
        }
  
        if (!/^\d{10,15}$/.test(PhoneNo)) {
          return res.json({
            status: false,
            message: "Invalid mobile number in CRM"
          });
        }
  
      /*  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
          return res.json({
            status: false,
            message: "Invalid email address in CRM"
          });
        }
  
        if (password.length < 6) {
          return res.json({
            status: false,
            message: "Password must be at least 6 characters"
          });
        }
  */
  
        // 🔹 Check user
        let user = await Users_Modal.findOne({ UserName, del: '0' });
       // const hashedCrmPassword = await bcrypt.hash(password, 10);
        if (!user) {
          user = await Users_Modal.create({
            UserName,
            FullName,
            Email,
            PhoneNo,
            crm_user_id: employeeId,
           // password: hashedCrmPassword,
            ActiveStatus: '1',
            del: '0'
          });
        } else {
  
          if (user.ActiveStatus === '0') {
            return res.json({
              status: false,
              message: "Your account is deactivated. Please contact the administrator."
            });
          }
  
   let isUpdated = false;
  
        if (user.FullName !== FullName) {
          user.FullName = FullName;
          isUpdated = true;
        }
  
        if (user.Email !== Email) {
          user.Email = Email;
          isUpdated = true;
        }
  
        if (user.PhoneNo !== PhoneNo) {
          user.PhoneNo = PhoneNo;
          isUpdated = true;
        }
  
  
  
         /* const isSamePassword = await bcrypt.compare(password, user.password);
          if (!isSamePassword) {
            user.password = hashedCrmPassword; 
            isUpdated = true;
          } */
  
          user.crm_user_id = employeeId;
  
        if (isUpdated) {
          await user.save();
        }
  
  
        }
  
        // 🔹 Token generate
        const token = crypto.randomBytes(10).toString('hex');
        user.token = token;
        await user.save();
  
        const tokenjwt = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
  
  
  
  
        const redirectUrl =
          `${process.env.DOMAIN}redirect` +
          `?uid=${user.crm_user_id}` +
          `&Role=${user.Role}` +                              
          `&token=${encodeURIComponent(token)}` +
          `&tokenjwt=${encodeURIComponent(tokenjwt)}` +
          `&name=${encodeURIComponent(user.FullName)}` +
          `&email=${encodeURIComponent(user.Email)}` +
          `&phone=${encodeURIComponent(user.PhoneNo)}`;
  

          
        return res.redirect(redirectUrl);
  
  
      } catch (err) {
        return res.json({ status: false, message: err.message });
      }
    }
  
/*
  async getCrmContactWithFilter(req, res) {
    try {
      const {
        owner_id = "",
        search = "",
        page = 1,
        limit = 10
      } = req.body;

      if (!owner_id) {
        return res.json({
          status: false,
          message: "Owner ID is required",
          data: []
        });
      }

      const response = await axios.get(
        `${process.env.API_BASE_URL}viewcontactbyownerid/${owner_id}`,
        {
          headers: {
            "x-crm-key": process.env.CRM_SECRET_KEY
          },
          params: { page, limit, search }
        }
      );

      const crm = response.data;

      // 🔹 SAFE values
      const totalRecords = crm.pagination && crm.pagination.totalRecords
        ? crm.pagination.totalRecords
        : crm.total || 0;

      const totalPages = crm.pagination && crm.pagination.totalPages
        ? crm.pagination.totalPages
        : Math.ceil(totalRecords / limit);

      return res.json({
        status: true,
        message: "Client data fetched successfully",
        data: crm.data || [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          totalRecords: totalRecords
        }
      });

    } catch (error) {
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }
  
*/

async getCrmContactWithFilter(req, res) {

  try {
    const {
      owner_id = "",
      search = "",
      page = 1,
      limit = 10
    } = req.body;



    if (!owner_id) {
      return res.json({
        status: false,
        message: "Owner ID is required",
        data: []
      });
    }
    const crm = await fetchContactsByOwner(owner_id, page, limit, search);
    const contacts = crm.data || [];
/*

    // 1️⃣ Contacts by owner
    const response = await axios.get(
      `${process.env.API_BASE_URL}viewcontactbyownerid/${owner_id}`,
      {
        headers: {
          "x-crm-key": process.env.CRM_SECRET_KEY
        },
        params: { page, limit, search }
      }
    );

    const crm = response.data;
    const contacts = crm.data || []; 


    */  
    // 2️⃣ Unique owner_ids from list (safe)
    const ownerIds = [...new Set(
      contacts.map(c => c.ownerid).filter(Boolean)
    )];

    // 3️⃣ Fetch owner names
    const ownerMap = {};
    await Promise.all(
      ownerIds.map(async (id) => {
        const emp = await getEmployeeFromCrm(id);
        console.log("EMPLOYEE FETCHED 👉", emp);
        ownerMap[id] = emp?.FullName || "";
      })
    );

    // 4️⃣ Attach owner_name inside each contact
    const finalContacts = contacts.map(c => ({
      ...c,
      owner_name: ownerMap[c.ownerid] || ""
    }));

    const totalRecords =
      crm.pagination?.totalRecords || crm.total || 0;

    const totalPages =
      crm.pagination?.totalPages || Math.ceil(totalRecords / limit);

    return res.json({
      status: true,
      message: "Client data fetched successfully",
      data: finalContacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords
      }
    });

  } catch (error) {
    console.error("CRM ERROR:", error?.response?.data || error.message);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}


  async getCrmContactWithFilterUnassign(req, res) {
  try {
    const {
      search = "",
      page = 1,
      limit = 10
    } = req.body;

    const skip = (page - 1) * limit;

    let matchCondition = {
      del: 0,
      ActiveStatus: 1
    };

    if (search && search.trim() !== "") {
      const normalizedSearch = search.replace(/\D/g, "");
      matchCondition.phone = { $regex: normalizedSearch };
    }

    const data = await Whatsappchat_Modal.aggregate([
      { $match: matchCondition },

      // 🔥 normalize phone (last 10 digits)
      {
        $addFields: {
          normPhone: {
            $substrCP: [
              "$phone",
              { $subtract: [{ $strLenCP: "$phone" }, 10] },
              10
            ]
          }
        }
      },

      // 🔥 phone + crm_user_id unique
      {
        $group: {
          _id: {
            phone: "$normPhone",
            crm_user_id: "$crm_user_id"
          },
          doc: { $first: "$$ROOT" }
        }
      },

      // 🔥 phone level group
      {
        $group: {
          _id: "$_id.phone",
          crmUsers: { $addToSet: "$_id.crm_user_id" },
          lastDoc: { $first: "$doc" }
        }
      },

      // ✅ STRICT unassigned rule
      {
        $match: {
          $expr: {
            $setEquals: ["$crmUsers", [1]]
          }
        }
      },

      { $sort: { "lastDoc.createdAt": -1 } },
      { $skip: skip },
      { $limit: Number(limit) },

      {
        $project: {
          _id: 0,
          phone: "$_id",
          crm_user_id: 1,
          lastMessage: "$lastDoc.message",
          message_type: "$lastDoc.message_type",
          sender_type: "$lastDoc.sender_type",
          createdAt: "$lastDoc.createdAt"
        }
      }
    ]);

    return res.json({
      status: true,
      message: "Unassigned WhatsApp clients fetched successfully",
      data
    });

  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}


async getCrmContactWithFilterUnassignAll(req, res) {
  try {
    const { search = "" } = req.body;

    let matchCondition = {
      del: 0,
      ActiveStatus: 1
    };

    if (search && search.trim() !== "") {
      const normalizedSearch = search.replace(/\D/g, "");
      matchCondition.phone = { $regex: normalizedSearch };
    }

    const data = await Whatsappchat_Modal.aggregate([
      { $match: matchCondition },

      // 🔥 normalize phone (last 10 digits)
      {
        $addFields: {
          normPhone: {
            $substrCP: [
              "$phone",
              { $subtract: [{ $strLenCP: "$phone" }, 10] },
              10
            ]
          }
        }
      },

      // 🔥 unique phone + crm_user_id
      {
        $group: {
          _id: {
            phone: "$normPhone",
            crm_user_id: "$crm_user_id"
          },
          doc: { $first: "$$ROOT" }
        }
      },

      // 🔥 group only by phone
      {
        $group: {
          _id: "$_id.phone",
          crmUsers: { $addToSet: "$_id.crm_user_id" },
          lastDoc: { $first: "$doc" }
        }
      },

      // ✅ STRICT: only [1]
      {
        $match: {
          $expr: {
            $setEquals: ["$crmUsers", [1]]
          }
        }
      },

      { $sort: { "lastDoc.createdAt": -1 } },

      {
        $project: {
          _id: 0,
          phone: "$_id",
          crm_user_id: { $arrayElemAt: ["$crmUsers", 0] },
          lastMessage: "$lastDoc.message",
          message_type: "$lastDoc.message_type",
          sender_type: "$lastDoc.sender_type",
          createdAt: "$lastDoc.createdAt"
        }
      }
    ]);

    return res.json({
      status: true,
      message: "All unassigned WhatsApp clients fetched successfully",
      totalRecords: data.length,
      data
    });

  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}


async  checkCrmStatus(req, res) {
  try {
    const { crm_user_id } = req.body;

    // 🔴 Validation
    if (!crm_user_id) {
      return res.json({
        status: false,
        message: "crm_user_id is required"
      });
    }

    // 🔹 Local user find
    const user = await Users_Modal.findOne({
      crm_user_id: crm_user_id,
      del: 0
    });

    if (!user) {
      return res.json({
        status: false,
        message: "User not found in system"
      });
    }

    // 🔹 CRM API call
    let crmUser = null;
    try {
      crmUser = await getEmployeeFromCrm(crm_user_id);
    } catch (err) {
      crmUser = null;
    }

    // ❌ CRM me user nahi OR inactive
    if (!crmUser || Number(crmUser.status) !== 1) {

      user.del = 1;
      user.ActiveStatus = 0;
      await user.save();

      return res.json({
        status: false,
        del: user.del,
        message: !crmUser
          ? "Employee not found in CRM, user deactivated"
          : "CRM account is inactive, user deactivated"
      });
    }

    // ✅ CRM active → update latest info (optional but recommended)
    user.FullName = crmUser.FullName || user.FullName;
    user.Email = crmUser.Email || user.Email;
    user.PhoneNo = crmUser.PhoneNo || user.PhoneNo;
    user.ActiveStatus = 1;
    await user.save();

    return res.json({
      status: true,
      message: "CRM user is active",
      data: {
        user_id: user._id,
        crm_user_id: crm_user_id,
        del: user.del
      }
    });

  } catch (error) {
    console.error("checkCrmStatus error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error"
    });
  }
}


async getCrmContactWithFilterWithClient(req, res) {
  try {
    const {
      owner_id = "",
      search = "",
      page = 1,
      limit = 10
    } = req.body;

    const skip = (page - 1) * limit;

    // 1️⃣ Base filter
    const filter = {
      del: 0
    };

     if (owner_id) {
      filter.assigned_to = owner_id;
    }
    // 2️⃣ Search
    if (search) {
      filter.$or = [
        { FullName: { $regex: search, $options: "i" } },
        { PhoneNo: { $regex: search } }
      ];
    }

    // 3️⃣ Fetch clients + count
    const [clients, totalRecords] = await Promise.all([
      Clients_Modal
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      Clients_Modal.countDocuments(filter)
    ]);

    // 4️⃣ Collect add_by ids
    const ownerIds = [
      ...new Set(clients.map(c => c.add_by).filter(Boolean))
    ];

    // 5️⃣ Fetch owner names FROM SAME COLLECTION
    const owners = await Clients_Modal.find(
      { _id: { $in: ownerIds } },
      { FullName: 1 }
    ).lean();

    const ownerMap = {};
    owners.forEach(o => {
      ownerMap[o._id.toString()] = o.FullName;
    });

    // 6️⃣ Attach owner_name
    const finalClients = clients.map(c => ({
      ...c,
      owner_name: ownerMap[c.add_by] || ""
    }));

    return res.json({
      status: true,
      message: "Client data fetched successfully",
      data: finalClients,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      }
    });

  } catch (error) {
    console.error("CLIENT FETCH ERROR:", error);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}

async getCrmContactWithFilterUnassignWithClient(req, res) {
  try {
    const {
      search = "",
      page = 1,
      limit = 10
    } = req.body;

    const skip = (page - 1) * limit;

    // 🔹 Build MongoDB filter
    const filter = {
      del: 0,
      $or: [
        { assigned_to: null },
        { assigned_to: "" }
      ]
    };

    // 🔹 Add search filter if present
    if (search && search.trim() !== "") {
      const normalizedSearch = search.replace(/\D/g, "");
      filter.$or.push(
        { FullName: { $regex: search, $options: "i" } },
        { PhoneNo: { $regex: normalizedSearch } }
      );
    }

    // 🔹 Fetch clients + total count
    const [clients, totalRecords] = await Promise.all([
      Clients_Modal
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      Clients_Modal.countDocuments(filter)
    ]);

    // 🔹 Return response
    return res.json({
      status: true,
      message: "Unassigned clients fetched successfully",
      data: clients,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      }
    });

  } catch (error) {
    console.error("UNASSIGNED CLIENTS ERROR:", error);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}

async getCrmContactWithFilterUnassignAllWithClient(req, res) {
  try {
    const { search = "" } = req.body;

    // 🔹 Build MongoDB filter
    const filter = {
      del: 0,
      $or: [
        { assigned_to: null },
        { assigned_to: "" }
      ]
    };

    // 🔹 Add search filter if present
    if (search && search.trim() !== "") {
      const normalizedSearch = search.replace(/\D/g, "");
      filter.$or.push(
        { FullName: { $regex: search, $options: "i" } },
        { PhoneNo: { $regex: normalizedSearch } }
      );
    }

    // 🔹 Fetch all matching clients (no pagination)
    const clients = await Clients_Modal
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // 🔹 Return JSON or prepare for CSV/Excel export
    return res.json({
      status: true,
      message: "All unassigned clients fetched successfully",
      data: clients
    });

  } catch (error) {
    console.error("EXPORT UNASSIGNED CLIENTS ERROR:", error);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}

async getAllClients(req, res) {
  try {
    const { owner_id = "", search = "" } = req.body;

    // 1️⃣ Base filter
    const filter = { del: 0 };

    if (owner_id) {
      filter.assigned_to = owner_id;
    }

    // 2️⃣ Search
    if (search && search.trim() !== "") {
      filter.$or = [
        { FullName: { $regex: search, $options: "i" } },
        { PhoneNo: { $regex: search } }
      ];
    }

    // 3️⃣ Fetch all matching clients (no pagination)
    const clients = await Clients_Modal
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // 4️⃣ Collect add_by ids
    const ownerIds = [
      ...new Set(clients.map(c => c.add_by).filter(Boolean))
    ];

    // 5️⃣ Fetch owner names from same collection
    const owners = await Clients_Modal.find(
      { _id: { $in: ownerIds } },
      { FullName: 1 }
    ).lean();

    const ownerMap = {};
    owners.forEach(o => {
      ownerMap[o._id.toString()] = o.FullName;
    });

    // 6️⃣ Attach owner_name
    const finalClients = clients.map(c => ({
      ...c,
      owner_name: ownerMap[c.add_by] || ""
    }));

    return res.json({
      status: true,
      message: "All client data fetched successfully",
      data: finalClients
    });

  } catch (error) {
    console.error("ALL CLIENTS FETCH ERROR:", error);
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}




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

  const data = response.data.data;

 if (!data) return null;

  // ?? yahin mapping
  return {
    UserName: data.userName,
    FullName: data.fullName,
    Email: data.email,
    PhoneNo: data.phoneNo,
    status: data.status
  };
}


async function fetchContactsByOwner(owner_id, page, limit, search) {
  const response = await axios.get(
    `${process.env.API_BASE_URL}viewcontactbyownerid/${owner_id}`,
    {
      headers: { "x-crm-key": process.env.CRM_SECRET_KEY },
      params: { page, limit, search }
    }
  );

  const apiData = response.data;

  // 👇 totalRecords safely nikalo
  const totalRecords =
    apiData.pagination?.totalRecords ??
    apiData.total ??
    apiData.count ??
    0;

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    status: apiData.status,
    data: apiData.data.map(item => ({
      fname: item.name,
      lname: null,
      email: item.email ?? "",
      mobile: item.whatsAppno,
      ownerid: String(owner_id)
    })),
    pagination: {
      totalRecords,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit)
    }
  };
}
module.exports = new Users();