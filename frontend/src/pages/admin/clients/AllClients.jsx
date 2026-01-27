import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableDataTable from "../../../extraComponents/ReusableDataTable";
import {
  GetCRMCContactWithFilter,
  GetActiveTemplateList,
  SendBulkTemplate,
  AddClient,
  EditClient,
  UpdateClientStatus,
} from "../../../services/AdminServices";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AddClientDialog from "./AddClientDialog";
import EditClientDialog from "./EditClientDialog";
import { Pencil, Plus, MoreHorizontal } from "lucide-react";
import ConfirmAction from "../../../extraComponents/confirmAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AllClients = () => {
  const { toast } = useToast();
  const { token } = useUser();
  const tokens = localStorage.getItem("tokenjwt");
  const owner_id = localStorage.getItem("uid");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prevSearch, setPrevSearch] = useState("");
  const [search, setSearch] = useState("");
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAddClient, setOpenAddClient] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateParams, setTemplateParams] = useState("");
  const [openEditClient, setOpenEditClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchTemplates = async (tokens) => {
    setLoadingTemplates(true);
    try {
      const res = await GetActiveTemplateList(tokens);
      setTemplates(res.data || []);
    } catch (err) {
      console.error("Template fetch error", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (templateModalOpen) fetchTemplates(tokens);
  }, [templateModalOpen]);

  const handleRowSelect = (row) => {
    setSelectedRows((prev) => {
      const alreadySelected = prev.find((r) => r.PhoneNo === row.PhoneNo);

      if (alreadySelected) {
        return prev.filter((r) => r.PhoneNo !== row.PhoneNo);
      } else {
        return [...prev, row];
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(data);
    } else {
      setSelectedRows([]);
    }
  };

  const sendBulkTemplate = async () => {
    if (!selectedTemplate) return;

    const phones = selectedRows.map((u) => {
      const PhoneNo = String(u.PhoneNo).trim().slice(-10);
      return `91${PhoneNo}`;
    });

    const payload = {
      phones,
      sender_type: "admin",
      sender_id: owner_id,
      template_name: selectedTemplate.template_name,
      template_params: templateParams || "",
      crm_user_id: owner_id,
    };
    try {
      const res = await SendBulkTemplate(tokens, payload);
      console.log("SEND BULK RESPONSE =>", res);

      if (res?.status) {
        toast({
          title: "Success",
          description: res?.message || "Templates sent successfully",
        });
        setTemplateModalOpen(false);
        setSelectedTemplate(null);
        setTemplateParams("");
        setSelectedRows([]);
      } else {
        toast({
          title: "Error",
          description: res?.message || "Failed to send templates",
          variant: "destructive",
        });
      }

      if (res?.status === 500) {
        toast({
          title: "Server Error",
          description: res?.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send template",
        variant: "destructive",
      });
    }
  };

  const fetchCRMContacts = async () => {
    setLoading(true);

    const res = await GetCRMCContactWithFilter(tokens, {
      owner_id: null,
      search,
      // page,
      // limit,
    });

    if (res?.status) {
      setData(res.data || []);
      // setTotalRows(res.pagination.totalRecords || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCRMContacts();
  }, [search]);

  const handleChat = (row) => {
    navigate("/dashboard/whatsappadmin", {
      state: {
        client: row,
      },
    });
  };

  const handleStatusChange = async (row) => {
    const currentStatus = String(row.ActiveStatus); // 🔑 IMPORTANT
    const newStatus = currentStatus === "1" ? "0" : "1";

    try {
      const res = await UpdateClientStatus(row._id, newStatus, owner_id);

      console.log("STATUS API RESPONSE =>", res);

      if (res?.status) {
        toast({
          title: "Success",
          description: res.message || "Status updated",
        });

        // 🔥 OPTIMISTIC UI (instant update)
        setData((prev) =>
          prev.map((item) =>
            item._id === row._id ? { ...item, ActiveStatus: newStatus } : item,
          ),
        );
      } else {
        toast({
          title: "Error",
          description: res?.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Server Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length === data.length && data.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      width: "60px",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.some((r) => r.PhoneNo === row.PhoneNo)}
          onChange={() => handleRowSelect(row)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: "S.No",
      width: "80px",
      cell: (row, index) => index + 1,
    },
    {
      name: "Full Name",
      width: "190px",
      selector: (row) => row.FullName || "—",
      sortable: true,
    },
    {
      name: "Owner Name",
      width: "190px",
      selector: (row) => row.owner_name || "—",
      sortable: true,
    },
    // {
    //   name: "Email",
    //   selector: (row) => row.email || "—",
    // },
    {
      name: "Status",
      width: "110px",
      cell: (row) => {
        const isActive = String(row.ActiveStatus) === "1";
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      name: "Phone",
      selector: (row) => row.PhoneNo || "—",
      width: "140px",
    },
    {
      name: "Actions",
      width: "120px",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingClient(row);
                setOpenEditClient(true);
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleChat(row)}>
              Chat
            </DropdownMenuItem>

            <DropdownMenuItem>
              <ConfirmAction
                title="Change Status?"
                description={`Do you want to ${String(row.ActiveStatus) === "1" ? "deactivate" : "activate"} this client?`}
                confirmText="Yes"
                cancelText="No"
                type="warning"
                onConfirm={() => handleStatusChange(row)}
              >
                Change Status
              </ConfirmAction>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <DashboardLayout title="My Clients" subtitle="Manage your clients">
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6">
              <Button onClick={() => setOpenAddClient(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>

              <Button
                disabled={selectedRows.length === 0}
                onClick={() => setTemplateModalOpen(true)}
              >
                Send Template ({selectedRows.length})
              </Button>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-4">
              <ReusableDataTable
                columns={columns}
                data={data}
                loading={loading}
                searchable
                serverSearch
                searchPlaceholder="Search name / email / phone"
                onSearch={(value) => {
                  if (value !== prevSearch) {
                    setSearch(value);
                    // setPage(1);
                    setPrevSearch(value);
                  }
                }}
                noDataText="No clients found"
                // pagination
                // paginationServer
                // paginationTotalRows={totalRows}
                // paginationPerPage={limit}
                // onChangePage={(p) => setPage(p)}
                // onChangeRowsPerPage={(newLimit) => {
                //   setLimit(newLimit);
                //   setPage(1);
                // }}
              />
            </div>
          </main>
        </div>
      </div>

      <AddClientDialog
        open={openAddClient}
        setOpen={setOpenAddClient}
        onSubmit={async (values) => {
          try {
            const payload = {
              FullName: values.FullName,
              PhoneNo: values.PhoneNo,
              add_by: owner_id,
            };

            const res = await AddClient(payload);

            if (res?.status) {
              toast({
                title: "Client Added",
                description: res.message || "Client added successfully",
              });
              setOpenAddClient(false);
              fetchCRMContacts();
            } else {
              toast({
                title: "Error",
                description: res?.message || "Failed to add client",
                variant: "destructive",
              });
            }
          } catch (err) {
            toast({
              title: "Server Error",
              description: "Unable to add client",
              variant: "destructive",
            });
          }
        }}
      />

      {openEditClient && editingClient && (
        <EditClientDialog
          open={openEditClient}
          setOpen={setOpenEditClient}
          clientdetail={editingClient}
          onSubmit={async (values) => {
            try {
              const payload = {
                id: editingClient._id,
                FullName: values.FullName,
                PhoneNo: values.PhoneNo,
              };

              const res = await EditClient(payload);

              if (res?.status) {
                toast({
                  title: "Client Updated",
                  description: res.message || "Client updated successfully",
                });
                setOpenEditClient(false);
                setEditingClient(null);
                fetchCRMContacts();
              } else {
                toast({
                  title: "Error",
                  description: res?.message || "Failed to update client",
                  variant: "destructive",
                });
              }
            } catch (err) {
              toast({
                title: "Server Error",
                description: "Unable to update client",
                variant: "destructive",
              });
            }
          }}
        />
      )}

      {templateModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setTemplateModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Template</h2>
              <button onClick={() => setTemplateModalOpen(false)}>✖</button>
            </div>

            <div className="p-4 overflow-y-auto">
              {loadingTemplates ? (
                <p>Loading templates...</p>
              ) : (
                <>
                  <label className="block text-sm mb-2">Choose Template</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={selectedTemplate?._id || ""}
                    onChange={(e) => {
                      const t = templates.find((x) => x._id === e.target.value);
                      setSelectedTemplate(t);
                      setTemplateParams("");
                    }}
                  >
                    <option value="">-- Select --</option>
                    {templates.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.template_name}
                      </option>
                    ))}
                  </select>

                  {selectedTemplate && (
                    <>
                      <label className="block text-sm mt-4">
                        Template Message
                      </label>
                      <textarea
                        readOnly
                        value={selectedTemplate.message}
                        rows={4}
                        className="w-full border p-2 rounded bg-gray-100"
                      />

                      <label className="block text-sm mt-4">
                        Template Params
                      </label>
                      <input
                        value={templateParams}
                        onChange={(e) => setTemplateParams(e.target.value)}
                        placeholder="Ex: 1##2##3##4"
                        className="w-full border p-2 rounded"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate parameters with ## (e.g.,
                        param1##param2##param3)
                      </p>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setTemplateModalOpen(false)}
              >
                Cancel
              </Button>
              <ConfirmAction
                title="Send Template?"
                description={`Are you sure you want to send this template to ${selectedRows.length} client(s)?`}
                confirmText="Send"
                cancelText="Cancel"
                type="info"
                onConfirm={sendBulkTemplate}
              >
                <Button disabled={!selectedTemplate}>Send</Button>
              </ConfirmAction>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllClients;
