const db = require("../Models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendEmail } = require('../Utils/emailService');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Clients_Modal = db.Clients;
const Mailtemplate_Modal = db.Mailtemplate;
const BasicSetting_Modal = db.BasicSetting;
const Logs_Model = db.Logs;
const Users_Model = db.Users;
const ioSocket = require("../Utils/ioSocketReturn");
const io = ioSocket.getIO();
const csv = require("csvtojson");

class Clients {

  async AddClient(req, res) {

    try {

      const { FullName, PhoneNo, add_by } = req.body;
      if (!FullName) {
        return res.status(400).json({ status: false, message: "fullname is required" });
      }



      if (!PhoneNo) {
        return res.status(400).json({ status: false, message: "phone number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.status(400).json({ status: false, message: "Invalid phone number format" });
      }

      if (!add_by) {
        return res.status(400).json({ status: false, message: "Added by field is required" });
      }




      const existingUser = await Clients_Modal.findOne({
        del: "0",
        PhoneNo
      });

      if (existingUser) {
        return res.status(400).json({ status: false, message: "Phone number already exists" });
      }

      const result = new Clients_Modal({
        FullName: FullName,
        PhoneNo: PhoneNo,
        add_by: add_by,
        ActiveStatus: 1,
      })

      await result.save();

      const ipaddress = req.ip || req.connection.remoteAddress;
      const addedByUser = await Users_Model.findById(add_by).select('FullName');
      await Logs_Model.create({
        message: `Client "${FullName}" added successfully by ${addedByUser?.FullName} (${add_by})`,
        type: "client_add",
        ipaddress
      });

      return res.json({
        status: true,
        message: "Client Added Successfully",
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




  async getClientWithFilter(req, res) {
    try {
      const { status = "", search = "", add_by = "", page = 1, limit = 10 } = req.body;
      const skip = (parseInt(page) - 1) * limit;

      // Base condition
      const matchConditions = { del: 0 };


      if (status !== "") {
        matchConditions.ActiveStatus = parseInt(status);
      }

      if (add_by !== "") {
        matchConditions.add_by = add_by;
      }

      if (search && search.trim() !== "") {
        matchConditions.$or = [
          { FullName: { $regex: search, $options: "i" } },
          { PhoneNo: { $regex: search, $options: "i" } },
        ];
      }
      // Fetch total count for pagination
      const totalCount = await Clients_Modal.countDocuments(matchConditions);

      // Fetch paginated data
      const clients = await Clients_Modal.find(matchConditions)
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit);

      return res.json({
        status: true,
        message: "Client data fetched successfully",
        data: clients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
        },
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async getDeleteClientWithFilter(req, res) {
    try {
      const { status = "", search = "", add_by = "", page = 1 } = req.body;

      const limit = 10;
      const skip = (parseInt(page) - 1) * limit;

      // Base condition
      const matchConditions = { del: 1 };



      // Active/Inactive status filter
      if (status !== "") {
        matchConditions.ActiveStatus = parseInt(status);
      }

      // add_by specific filter
      if (add_by !== "") {
        matchConditions.add_by = add_by;
      }

      // Search filter (FullName, Email, PhoneNo)
      if (search && search.trim() !== "") {
        matchConditions.$or = [
          { FullName: { $regex: search, $options: "i" } },
          { PhoneNo: { $regex: search, $options: "i" } },
        ];
      }

      // Fetch total count for pagination
      const totalCount = await Clients_Modal.countDocuments(matchConditions);

      // Fetch paginated data
      const clients = await Clients_Modal.find(matchConditions)
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit);

      return res.json({
        status: true,
        message: "Client data fetched successfully",
        data: clients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
        },
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async getClientWithFilterExcel(req, res) {
    try {
      const { status = "", search = "", add_by = "", page = 1 } = req.body;

      const limit = 10;
      const skip = (parseInt(page) - 1) * limit;

      // Base condition
      const matchConditions = { del: 0 };


      // Active/Inactive status filter
      if (status !== "") {
        matchConditions.ActiveStatus = parseInt(status);
      }

      // add_by specific filter
      if (add_by !== "") {
        matchConditions.add_by = add_by;
      }

      // Search filter (FullName, Email, PhoneNo)
      if (search && search.trim() !== "") {
        matchConditions.$or = [
          { FullName: { $regex: search, $options: "i" } },
          { PhoneNo: { $regex: search, $options: "i" } },
        ];
      }

      // Fetch total count for pagination
      const totalCount = await Clients_Modal.countDocuments(matchConditions);

      // Fetch paginated data
      const clients = await Clients_Modal.find(matchConditions)
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit);

      return res.json({
        status: true,
        message: "Client data fetched successfully",
        data: clients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
        },
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async detailClient(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;
      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required"
        });
      }

      const client = await Clients_Modal.findById(id);
      // If client not found
      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
        });
      }

      return res.json({
        status: true,
        message: "Client details fetched successfully",
        data: client
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async updateClient(req, res) {
    try {
      const { id, FullName, PhoneNo, add_by } = req.body;

      // Check if the required fields are provided
      if (!FullName) {
        return res.json({ status: false, message: "Fullname is required" });
      }



      if (!PhoneNo) {
        return res.json({ status: false, message: "Phone Number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.json({ status: false, message: "Invalid Phone Number format" });
      }



      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required",
        });
      }

      // Check if the phone number is already used by another client (excluding current client)
      const existingPhone = await Clients_Modal.findOne({
        PhoneNo,
        _id: { $ne: id },   // current client ko exclude karo
        del: 0
      });

      if (existingPhone) {
        return res.status(400).json({ status: false, message: "Phone number already exists" });
      }



      // Proceed with the update
      const updatedClient = await Clients_Modal.findByIdAndUpdate(
        id,
        {
          FullName,
          PhoneNo,
        },
        { new: true, runValidators: true } // Options: return the updated document and run validators
      );

      // If the client is not found
      if (!updatedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

      const ipaddress = req.ip || req.connection.remoteAddress;
      const updatedByUser = await Users_Model
        .findById(add_by)
        .select('FullName');

      await Logs_Model.create({
        message: `Client "${FullName}" updated successfully by ${updatedByUser?.FullName || 'Unknown User'} (${add_by})`,
        type: "client_update",
        ipaddress
      });


      return res.json({
        status: true,
        message: "Client updated successfully",
        data: updatedClient,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async deleteClient(req, res) {
    try {
      const { id, add_by } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required",
        });
      }

      const deletedClient = await Clients_Modal.findByIdAndUpdate(
        id,
        { del: 1 }, // Set del to true
        { new: true }  // Return the updated document
      );
      if (!deletedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

      const ipaddress = req.ip || req.connection.remoteAddress;
      const deletedByUser = await Users_Model
        .findById(add_by)
        .select('FullName');

      await Logs_Model.create({
        message: `Client "${deletedClient.FullName}" deleted successfully by ${deletedByUser?.FullName || 'Unknown User'} (${add_by})`,
        type: "client_delete",
        ipaddress
      });



      return res.json({
        status: true,
        message: "Client deleted successfully",
        data: deletedClient,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async statusChange(req, res) {
    try {
      const { id, status, add_by } = req.body;

      const validStatuses = ['1', '0'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find and update the plan
      const result = await Clients_Modal.findByIdAndUpdate(
        id,
        { ActiveStatus: status },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
        });
      }

      const ipaddress = req.ip || req.connection.remoteAddress;
      const updatedByUser = await Users_Model
        .findById(add_by)
        .select('FullName');
      const statusText = status === '1' ? 'Active' : 'Deactive';
      await Logs_Model.create({
        message: `Client "${result.FullName}" status changed to "${statusText}" by ${updatedByUser?.FullName || 'Unknown User'} (${add_by})`,
        type: "client_status_change",
        ipaddress
      });

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


  async changeOwner(req, res) {
  try {
    const { id, assigned_to, performed_by } = req.body;

    // Validation
    if (!id || !assigned_to) {
      return res.status(400).json({
        status: false,
        message: "Client ID and new owner (assigned_to) are required"
      });
    }

    // Find client first (to get previous owner)
    const client = await Clients_Modal.findById(id);
    if (!client) {
      return res.status(404).json({
        status: false,
        message: "Client not found"
      });
    }

    const previousAssignedTo = client.assigned_to;

    // Update assigned_to
    const result = await Clients_Modal.findByIdAndUpdate(
      id,
      { assigned_to },
      { new: true }
    );

    // Fetch user names for logs
    const previousOwner = previousAssignedTo
      ? await Users_Model.findById(previousAssignedTo).select("FullName")
      : null;

    const newOwner = await Users_Model.findById(assigned_to).select("FullName");

    const performedByUser = performed_by
      ? await Users_Model.findById(performed_by).select("FullName")
      : null;

    // Create log
    await Logs_Model.create({
      message: `Client "${client.FullName}" assigned from "${previousOwner?.FullName || 'Unassigned'}" to "${newOwner?.FullName || 'Unknown'}" by "${performedByUser?.FullName || 'System'}" (${performed_by || 'N/A'})`,
      type: "client_owner_change",
      ipaddress // make sure this is defined in middleware
    });

    return res.json({
      status: true,
      message: "Owner changed successfully",
      data: result
    });

  } catch (error) {
    console.error("changeOwner error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}

async  bulkUploadClients(req, res) {
  try {
    // 🔹 File check
    if (!req.file) {
      return res.status(400).json({ status: false, message: "CSV file is required" });
    }

    // 🔹 add_by from request (frontend)
    const add_by = req.body.add_by;
    if (!add_by) {
      return res.status(400).json({ status: false, message: "'add_by' is required" });
    }

    const rows = await csv().fromFile(req.file.path);

    let success = 0;
    let duplicate = 0;
    let failed = 0;
    const failedRows = [];

    for (const row of rows) {
      try {
        const { FullName, PhoneNo } = row;

        if (!FullName || !PhoneNo) {
          failed++;
          failedRows.push({ ...row, reason: "Missing required fields" });
          continue;
        }

        // 🔹 Validate phone number
        if (!/^\d{10}$/.test(PhoneNo)) {
          failed++;
          failedRows.push({ ...row, reason: "Invalid phone number format" });
          continue;
        }

        // 🔹 Duplicate phone
        const exists = await Clients_Modal.findOne({ PhoneNo, del: 0 });
        if (exists) {
          duplicate++;
          failedRows.push({ ...row, reason: "Duplicate phone number" });
          continue;
        }

        // 🔹 Create client
        const newClient = new Clients_Modal({
          FullName,
          PhoneNo,
          add_by,
          ActiveStatus: 1,
        });

        await newClient.save();
        success++;

      } catch (err) {
        failed++;
        failedRows.push({ ...row, reason: err.message });
      }
    }

    // 🔹 Generate failed CSV if needed
    let failedFile = null;
    if (failedRows.length) {
      failedFile = `failed_clients_${Date.now()}.csv`;
      const failedPath = path.join(__dirname, `../../../${process.env.DOMAINNAME}/uploads/client/failed`, failedFile);

      const header = Object.keys(failedRows[0]).join(",") + "\n";
      const csvData = failedRows.map(r => Object.values(r).join(",")).join("\n");

      fs.writeFileSync(failedPath, header + csvData);
    }

    return res.json({
      status: true,
      message: "Bulk client upload completed",
      summary: {
        total: rows.length,
        success,
        failed,
        duplicate
      },
      failed_csv: failedFile ? `${process.env.DOMAINNAME}/uploads/client/failed/${failedFile}` : null
    });

  } catch (error) {
    console.error("BULK CLIENT UPLOAD ERROR:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}



}
module.exports = new Clients();