import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ReusableDataTable from "../../extraComponents/ReusableDataTable";
import {
  GetCRMCContactWithFilter,
  SendBulkTemplate,
  GetActiveTemplateList,
} from "../../services/AdminServices";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const MemberClients = () => {
  const { token } = useUser();
  const tokens = localStorage.getItem("tokenjwt");
  const owner_id = localStorage.getItem("uid");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateParams, setTemplateParams] = useState("");

  const fetchCRMContacts = async () => {
    setLoading(true);

    const res = await GetCRMCContactWithFilter(tokens, {
      owner_id,
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
  }, [search, page, limit]);

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

  const handleChat = (row) => {
    navigate("/dashboard/whatsapp", {
      state: {
        client: row,
      },
    });
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
          checked={selectedRows.some((r) => r.mobile === row.mobile)}
          onChange={() => handleRowSelect(row)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: "S.No",
      width: "80px",
      cell: (row, index) => <span>{(page - 1) * limit + index + 1}</span>,
    },
    {
      name: "Full Name",
      width: "280px",
      selector: (row) => row.FullName || "—",
      sortable: true,
    },
    // {
    //   name: "Email",
    //   selector: (row) => row.email || "—",
    // },
    {
      name: "Phone No",
      width: "280px",
      selector: (row) => row.PhoneNo || "—",
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
            <DropdownMenuItem onClick={() => handleChat(row)}>
              Chat
            </DropdownMenuItem>

            {/* future ke liye ready */}
            {/* <DropdownMenuItem onClick={() => editClient(row)}>
          Edit
        </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      ignoreRowClick: true,
    },
  ];

  const handleRowSelect = (row) => {
    setSelectedRows((prev) => {
      const alreadySelected = prev.find((r) => r.mobile === row.mobile);

      if (alreadySelected) {
        return prev.filter((r) => r.mobile !== row.mobile);
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
      const mobile = String(u.mobile).trim().slice(-10);
      return `91${mobile}`;
    });

    const payload = {
      phones,
      sender_type: "employee",
      sender_id: owner_id,
      template_name: selectedTemplate.template_name,
      template_params: templateParams || "",
      crm_user_id: owner_id,
    };

    try {
      const res = await SendBulkTemplate(tokens, payload);

      if (res?.status) {
        toast.success(res?.message);
        setTemplateModalOpen(false);
        setSelectedTemplate(null);
        setTemplateParams("");
        setSelectedRows([]);
      } else {
        toast.error(res?.message);
      }

      if (res?.status === 500) {

        toast.error("Failed to send tempelate");
      }
    } catch (err) {
      toast.error("Failed to send tempelate");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="My Clients" />
        <div className="mb-4 flex justify-end p-4">
          <button
            disabled={selectedRows.length === 0}
            onClick={() => setTemplateModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Send Template ({selectedRows.length})
          </button>
        </div>

        <main className="flex-1 overflow-auto p-6">
          <ReusableDataTable
            columns={columns}
            data={data}
            loading={loading}
            searchable
            serverSearch
            searchPlaceholder="Search name / email / phone"
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={limit}
            onChangePage={(p) => setPage(p)}
            onChangeRowsPerPage={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </main>
      </div>

      {templateModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setTemplateModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Template</h2>
              <button onClick={() => setTemplateModalOpen(false)}>✖</button>
            </div>

            {/* Body */}
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
                        type="text"
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

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setTemplateModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={sendBulkTemplate}
                disabled={!selectedTemplate}
                className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberClients;
