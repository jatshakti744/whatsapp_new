const db = require("../Models");
const Mailtemplate_Modal = db.Mailtemplate;


class Mailtemplate {


  async getMailtemplate(req, res) {
    try {

      const result = await Mailtemplate_Modal.find();


      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async detailMailtemplate(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Mailtemplate ID is required"
        });
      }

      const Mailtemplate = await Mailtemplate_Modal.findById(id);

      if (!Mailtemplate) {
        return res.status(404).json({
          status: false,
          message: "Mailtemplate not found"
        });
      }

      return res.json({
        status: true,
        message: "Mailtemplate details fetched successfully",
        data: Mailtemplate
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async updateMailtemplate(req, res) {
    try {
      const { id, mail_subject, mail_body } = req.body;

      if (!mail_subject) {
        return res.status(400).json({ status: false, message: "mail subject is required" });
      }
      if (!mail_body) {
        return res.status(400).json({ status: false, message: "mail body is required" });
      }



      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Mailtemplate ID is required",
        });
      }

      const updatedMailtemplate = await Mailtemplate_Modal.findByIdAndUpdate(
        id,
        {
          mail_subject,
          mail_body,
        },
        { Mailtemplate: true, runValidators: true } // Options: return the updated document and run validators
      );

      if (!updatedMailtemplate) {
        return res.status(404).json({
          status: false,
          message: "Mailtemplate not found",
        });
      }

      return res.json({
        status: true,
        message: "Mailtemplate updated successfully",
        data: updatedMailtemplate,
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }



}
module.exports = new Mailtemplate();