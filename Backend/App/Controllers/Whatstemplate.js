"use strict";

const db = require("../Models");
const Whatstemplate_Modal = db.Whatstemplate; // Models/index.js me add karna hoga

class Whatstemplate {

    async addWhatstemplate(req, res) {
        console.log('aaaaaa', req.body);

        try {
            const { template_name, message } = req.body;
            if (!template_name) {
                return res.status(400).json({
                    status: false,
                    message: "template_name is required"
                });
            }

            if (!message) {
                return res.status(400).json({
                    status: false,
                    message: "message is required"
                });
            }

            const newTemplate = await Whatstemplate_Modal.create({
                template_name,
                message
            });

            return res.json({
                status: true,
                message: "Template added successfully",
                data: newTemplate
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    async getWhatstemplate(req, res) {
        try {
            const result = await Whatstemplate_Modal.find({ del: 0 });

            return res.json({
                status: true,
                message: "WhatsApp templates fetched successfully",
                data: result
            });

        } catch (error) {
            return res.json({ status: false, message: "Server error", data: [] });
        }
    }

    async getActiveWhatstemplate(req, res) {
        try {
            const result = await Whatstemplate_Modal.find({ status: true, del: 0 });

            return res.json({
                status: true,
                message: "Active WhatsApp templates fetched successfully",
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


    async detailWhatstemplate(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Template ID is required"
                });
            }

            const template = await Whatstemplate_Modal.findById(id);

            if (!template) {
                return res.status(404).json({
                    status: false,
                    message: "Template not found"
                });
            }

            return res.json({
                status: true,
                message: "Template details fetched successfully",
                data: template
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Server error",
                data: []
            });
        }
    }

    async updateWhatstemplate(req, res) {
        try {
            const { id, message, template_name } = req.body;
            if (!message) {
                return res.status(400).json({ status: false, message: "message is required" });
            }

            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Template ID is required",
                });
            }

            const updatedTemplate = await Whatstemplate_Modal.findByIdAndUpdate(
                id,
                { message, template_name },
                { new: true, runValidators: true } // return updated doc
            );

            if (!updatedTemplate) {
                return res.status(404).json({
                    status: false,
                    message: "Template not found",
                });
            }

            return res.json({
                status: true,
                message: "Template updated successfully",
                data: updatedTemplate,
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    async changeWhatstemplateStatus(req, res) {
        try {
            const { id, status } = req.body;

            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Template ID is required"
                });
            }

            if (typeof status !== "boolean") {
                return res.status(400).json({
                    status: false,
                    message: "Status must be true or false"
                });
            }

            const updatedTemplate = await Whatstemplate_Modal.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!updatedTemplate) {
                return res.status(404).json({
                    status: false,
                    message: "Template not found"
                });
            }

            return res.json({
                status: true,
                message: `Template ${status ? "activated" : "deactivated"} successfully`,
                data: updatedTemplate
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    async deleteWhatstemplate(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Whatsapp template ID is required",
                });
            }

            const deletedWhatsapp = await Whatstemplate_Modal.findByIdAndUpdate(
                id,
                { del: 1 },        // ✅ soft delete
                { new: true }      // ✅ updated document return
            );

            if (!deletedWhatsapp) {
                return res.status(404).json({
                    status: false,
                    message: "Whatsapp template not found",
                });
            }

            return res.json({
                status: true,
                message: "Whatsapp template deleted successfully",
                data: deletedWhatsapp,
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

module.exports = new Whatstemplate();
