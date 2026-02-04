import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ReusableDataTable from "../../../extraComponents/ReusableDataTable";
import {
  GetTemplateList,
  StatusChange,
  DeleteTemplate,
} from "../../../services/AdminServices";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import AddTemplate from "./AddTemplate";
import EditTemplate from "./EditTemplate";
import ViewTemplate from "./ViewTemplate";
import { Edit2, Eye, Trash2, View } from "lucide-react";
import ConfirmAction from "../../../extraComponents/ConfirmAction";
const Template = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("tokenjwt");
  const [updatingId, setUpdatingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTemplate, setViewTemplate] = useState(null);
  const handleStatusToggle = async (row) => {
    const newStatus = !row.status;

    try {
      setUpdatingId(row._id);

      setData((prev) =>
        prev.map((item) =>
          item._id === row._id ? { ...item, status: newStatus } : item,
        ),
      );

      const res = await StatusChange(
        {
          id: row._id,
          status: newStatus,
        },
        token,
      );

      if (res?.status) {
        toast({
          title: "Success",
          description: `Template ${
            newStatus ? "activated" : "deactivated"
          } successfully`,
        });
      }

      if (!res?.status) {
        throw new Error("Status update failed");
      }
    } catch (err) {
      // 🔁 Rollback if API fails
      setData((prev) =>
        prev.map((item) =>
          item._id === row._id ? { ...item, status: row.status } : item,
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const res = await DeleteTemplate(id, token);
    if (res?.status) {
      toast({
        title: "Deleted",
        description: res?.message || "Template deleted successfully",
      });
      fetchTemplates();
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);

      const res = await GetTemplateList(token);

      if (res.status) {
        setData(res.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const HandleView = (row) => {
    setViewTemplate(row);
    setViewOpen(true);
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Template Name",
      selector: (row) => row.template_name,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <ConfirmAction
          title="Change Status?"
          description={`Do you want to ${
            row.status ? "deactivate" : "activate"
          } this template?`}
          confirmText="Yes"
          cancelText="No"
          type="warning"
          onConfirm={() => handleStatusToggle(row)}
        >
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              row.status ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                row.status ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </ConfirmAction>
      ),
    },
    {
      name: "Message",
      cell: (row) => (
        <div
          title={row.message}
          className="whitespace-pre-line line-clamp-2 text-sm text-muted-foreground cursor-pointer max-w-md"
        >
          {row.message}
        </div>
      ),
      grow: 2,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <ConfirmAction
            title="Edit Template?"
            description="Are you sure you want to edit this template?"
            confirmText="Edit"
            cancelText="Cancel"
            type="info"
            onConfirm={() => {
              setSelectedTemplate(row);
              setEditOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4 text-blue-700 cursor-pointer" />
          </ConfirmAction>

          <ConfirmAction
            title="Delete Template?"
            description="Are you want to delete this template?"
            confirmText="Delete"
            cancelText="Cancel"
            type="error"
            onConfirm={() => handleDelete(row._id)}
          >
            <Trash2 className="h-4 w-4 text-red-700" />
          </ConfirmAction>
          <button onClick={() => HandleView(row)}>
            <Eye className="h-4 w-4 text-green-700" />
          </button>
        </div>
      ),
    },
  ];

  const HandleAddTemplate = () => {
    setOpenModal(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Templates" subtitle="Manage your templates" />

        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-end">
            <Button onClick={HandleAddTemplate}>Add Template</Button>
          </div>

          <ReusableDataTable
            columns={columns}
            data={data}
            loading={loading}
            searchable
            searchPlaceholder="Search templates..."
          />
        </div>
      </div>

      <AddTemplate
        open={openModal}
        setOpen={setOpenModal}
        onSuccess={fetchTemplates}
      />

      <EditTemplate
        open={editOpen}
        setOpen={setEditOpen}
        template={selectedTemplate}
        onSuccess={fetchTemplates}
      />

      <ViewTemplate
        open={viewOpen}
        setOpen={setViewOpen}
        template={viewTemplate}
      />
    </div>
  );
};

export default Template;
