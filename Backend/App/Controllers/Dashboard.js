const db = require("../Models");

const Clients_Modal = db.Clients;
const Adminnotification_Modal = db.Adminnotification;




class Dashboard {
  async getCount(req, res) {
    try {
      // Count documents in the Clients_Modal collection where del is false
      const client = await Clients_Modal.countDocuments({ del: 0 });

      const clientactive = await Clients_Modal.countDocuments({ del: 0, ActiveStatus: 1 });
      const clientinactive = await Clients_Modal.countDocuments({ del: 0, ActiveStatus: 0 });



      return res.json({
        status: true,
        message: "Count retrieved successfully",
        data: {
          clientCountTotal: client,
          clientCountActive: clientactive,
          clientCountInactive: clientinactive,

        }
      });

    } catch (error) {
      console.error(error); // <-- always log error
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async Notification(req, res) {
    try {

      const result = await Adminnotification_Modal.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const unreadCount = await Adminnotification_Modal.countDocuments({ status: 0 });

      return res.json({
        status: true,
        message: "get",
        data: result,
        unreadCount
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async NotificationList(req, res) {
    try {

      const { page } = req.body;
      const limit = 10; // Default to 10 items per page
      const skip = (page - 1) * limit; // Calculate the number of documents to skip

      const result = await Adminnotification_Modal.find({})
        .sort({ createdAt: -1 })
        .skip(skip) // Skip the required number of documents
        .limit(limit) // Limit the number of documents
        .lean();

      // Get total count for pagination metadata
      const totalCount = await Adminnotification_Modal.countDocuments({});
      const totalPages = Math.ceil(totalCount / limit);

      return res.json({
        status: true,
        message: "get",
        data: result,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
        },
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async statusChangeNotifiction(req, res) {
    try {
      const { id, status } = req.body;
      // Find and update the plan
      const result = await Adminnotification_Modal.findByIdAndUpdate(
        id,
        { status: status },
        { new: true } // Return the updated document
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Notification not found"
        });
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      // console.log("Error updating status:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }

  async allStatusChangeNotifiction(req, res) {
    try {
      // Update all documents where status is 0 to set status to 1
      const result = await Adminnotification_Modal.updateMany(
        { status: 0 }, // Condition: status is 0
        { $set: { status: 1 } } // Update: set status to 1
      );

      if (result.matchedCount === 0) {
        return res.json({
          status: false,
          message: "No notifications found with status 0"
        });
      }

      return res.json({
        status: true,
        message: "All statuses updated successfully",
        data: result // Return the result of the operation
      });

    } catch (error) {
      // Log and return error response
      console.error("Error updating all statuses:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }




}

module.exports = new Dashboard();