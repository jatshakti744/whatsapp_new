import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ReusableDataTable from "../../../extraComponents/ReusableDataTable";
import {
  GetUnassignContact,
  GetUnassignContactDownload,
} from "../../../services/AdminServices";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EXPORT_COLUMNS = [
  { key: "phone", label: "Phone" },
  { key: "createdAt", label: "Received At" },
  { key: "message_type", label: "Message Type" },
];

const exportToCSV = (rows, fileName = "unassigned_chats.csv") => {
  if (!rows || !rows.length) {
    alert("No data available to export");
    return;
  }

  const headers = EXPORT_COLUMNS.map((col) => col.label).join(",");

  const csvRows = rows.map((row) =>
    EXPORT_COLUMNS.map((col) => {
      let value = row[col.key] ?? "";

      if (col.key === "createdAt" && value) {
        value = new Date(value).toLocaleString();
      }
      return `"${value}"`;
    }).join(",")
  );

  const csv = [headers, ...csvRows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const UnassignedChats = () => {
  const { token } = useUser();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [prevSearch, setPrevSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchUnassignedChats = async () => {
    setLoading(true);

    try {
      const res = await GetUnassignContact(token, {
        search,
        page,
        limit,
      });

      if (res?.status) {
        setData(res.data || []);
        setTotalRows(res.totalRecords || 0);
      } else {
        setData([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUnassignedChats();
  }, [search, page, limit]);

  const handleExport = async () => {
    setLoading(true);

    try {
      const res = await GetUnassignContactDownload(token, {
        search: search || "",
        page: 1,
        limit: 100000,
      });

      if (res?.status && res.data?.length) {
        const fileName = search
          ? "unassigned_chats_search.csv"
          : "unassigned_chats_all.csv";

        exportToCSV(res.data, fileName);
      } else {
        alert("No data available to export");
      }
    } catch (error) {
      console.error("Export error:", error);
    }

    setLoading(false);
  };

  const handleChat = (row) => {
    navigate("/dashboard/whatsappadmin", {
      state: {
        client: {
          mobile: row.phone,
          fname: "",
          lname: "",
        },
      },
    });
  };

  const columns = [
    {
      name: "S.No",
      width: "80px",
      cell: (row, index) => <span>{(page - 1) * limit + index + 1}</span>,
    },
    {
      name: "Phone",
      selector: (row) => row.phone || "—",
      sortable: true,
    },
    {
      name: "Message Type",
      selector: (row) => row.message_type || "—",
      sortable: true,
    },
    {
      name: "Received At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "—",
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:opacity-90"
          onClick={() => handleChat(row)}
        >
          Chat
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Unassigned WhatsApp Chats" />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-4">
            {/* Left side: Search is inside ReusableDataTable */}
            <div />

            {/* Right side: Export button */}
            <Button onClick={handleExport} disabled={loading}>
              {search ? "Export Search Results" : "Export All"}
            </Button>
          </div>

          <ReusableDataTable
            columns={columns}
            data={data}
            loading={loading}
            searchable
            serverSearch
            searchPlaceholder="Search by phone"
            onSearch={(value) => {
              if (value !== prevSearch) {
                setSearch(value);
                setPage(1);
                setPrevSearch(value);
              }
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
    </div>
  );
};

export default UnassignedChats;
