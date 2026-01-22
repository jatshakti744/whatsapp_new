import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import * as Yup from "yup";
import ReusableDataTable from "../../../extraComponents/ReusableDataTable";
import ConfirmAction from "../../../extraComponents/confirmAction";

import {
  AddMember,
  MemberList,
  EditMember,
  MemberDetail,
  DeleteMember,
  UpdateMemberStatus,
} from "../../../services/AdminServices";
import AddMemberDialog from "./AddMemberDialog";
import EditMemberDialog from "./EditMemberDialog";
import ViewMemberDialog from "./ViewMemberDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal, Edit, UserX, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AllMembers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const id = localStorage.getItem("id");
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [memberDetail, setMemberDetail] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();

  const mockMembers = [
    {
      id: 1,
      name: "Alice Cooper",
      email: "alice@company.com",
      role: "Member",
      status: "active",
      clients: 24,
      messages: 342,
    },
    {
      id: 2,
      name: "Bob Martin",
      email: "bob@company.com",
      role: "Member",
      status: "active",
      clients: 18,
      messages: 256,
    },
    {
      id: 3,
      name: "Carol White",
      email: "carol@company.com",
      role: "Member",
      status: "on_leave",
      clients: 12,
      messages: 189,
    },
    {
      id: 4,
      name: "David Lee",
      email: "david@company.com",
      role: "Member",
      status: "inactive",
      clients: 0,
      messages: 45,
    },
    {
      id: 5,
      name: "Emma Wilson",
      email: "emma@company.com",
      role: "Admin",
      status: "active",
      clients: 8,
      messages: 567,
    },
    {
      id: 6,
      name: "Frank Johnson",
      email: "frank@company.com",
      role: "Member",
      status: "active",
      clients: 31,
      messages: 423,
    },
  ];

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        FullName: values.FullName,
        UserName: values.UserName,
        Email: values.Email,
        PhoneNo: values.PhoneNo,
        password: values.password,
        add_by: id,
      };

      const res = await AddMember(payload);

      if (res?.status) {
        toast({
          title: "Member Added",
          description: "New member added successfully",
        });

        resetForm();
        setAddOpen(false);
        fetchMemberlist();
      } else {
        toast({
          title: "Error",
          description: res?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.log("err", err);
      toast({
        title: "Server Error",
        description: "Unable to add member",
        variant: "destructive",
      });
    }
  };
  const handleEdit = async (values, { resetForm }) => {
    try {
      const payload = {
        id: selectedMember._id,
        FullName: values.FullName,
        Email: values.Email,
        PhoneNo: values.PhoneNo,
      };
      const res = await EditMember(payload);

      if (res?.status) {
        toast({
          title: "Member Updated",
          description: "Member updated successfully",
        });

        resetForm();
        setEditOpen(false);
        fetchMemberlist();
      }
    } catch (err) {
      console.error("EDIT ERROR ", err);
    }
  };

  const handleViewDetails = async (row) => {
    try {
      const memberId = row._id || row.id;

      const res = await MemberDetail(memberId);

      if (res?.status) {
        setMemberDetail(res.data);
        setDetailOpen(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to fetch member details",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (row) => {
    const Id = row._id || row.id;
    try {
      const res = await DeleteMember(Id);
      if (res?.status) {
        toast({
          title: "Deleted",
          description: "Member deleted successfully",
        });
        fetchMemberlist();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (row) => {
    const id = row._id;
    const newStatus = row.ActiveStatus === 0 ? "1" : "0";
    try {
      const res = await UpdateMemberStatus(id, newStatus);

      if (res?.status) {
        toast({
          title: "Success",
          description: `Member ${
            newStatus === 1 ? "activated" : "deactivated"
          } successfully`,
        });

        fetchMemberlist();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Status update failed",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (row) => {
    setSelectedMember(row);
    setEditOpen(true);
  };
  const fetchMemberlist = async () => {
    try {
      const res = await MemberList();
      setMemberList(res?.data || []);
    } catch (err) {
      console.log("something went wrong");
    }
  };
  useEffect(() => {
    fetchMemberlist();
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.FullName || row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.Email || row.email,
    },
    {
      name: "Username",
      selector: (row) => row.UserName,
    },
    {
      name: "Phone",
      selector: (row) => row.PhoneNo,
    },
    // {
    //   name: "Status",
    //   cell: (row) => (
    //     <Badge variant={row.ActiveStatus === 1 ? "default" : "secondary"}>
    //       {row.ActiveStatus === 1 ? "Active" : "Inactive"}
    //     </Badge>
    //   ),
    // },

    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" size="icon">
    //           <MoreHorizontal className="w-4 h-4" />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuItem onClick={() => openEditDialog(row)}>
    //           Edit
    //         </DropdownMenuItem>

    //         <DropdownMenuItem onClick={() => handleViewDetails(row)}>
    //           {/* <Users className="w-4 h-4 mr-2" /> */}
    //           View Details
    //         </DropdownMenuItem>

    //         <DropdownMenuItem className="">
    //           <ConfirmAction
    //             title="Update Status?"
    //             description="are you sure do you want change the status of member."
    //             confirmText="update"
    //             type="warning"
    //             onConfirm={() => handleStatusChange(row)}
    //           >
    //             Change Status
    //           </ConfirmAction>
    //         </DropdownMenuItem>
    //         <DropdownMenuItem className="text-destructive">
    //           <ConfirmAction
    //             title="Delete Client?"
    //             description="This action cannot be undone."
    //             confirmText="Delete"
    //             type="warning"
    //             onConfirm={() => handleDelete(row)}
    //           >
    //             Delete
    //           </ConfirmAction>
    //         </DropdownMenuItem>
    //         <DropdownMenuItem
    //           onClick={() => {
    //             navigate("/dashboard/managepermission", {
    //               state: { user: row },
    //             });
    //           }}
    //         >
    //           Manage Permission
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ];

  return (
    <DashboardLayout title="Members" subtitle="Manage your team members">
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {/* Stats */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 shadow-soft">
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockMembers.length}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-soft">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">
                  {mockMembers.filter((m) => m.status === "active").length}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-soft">
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold text-warning">
                  {mockMembers.filter((m) => m.status === "on_leave").length}
                </p>
              </div>
            </div> */}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6">
              {/* <Button onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button> */}
            </div>
            <div className="bg-card rounded-xl shadow-soft p-4">
              <ReusableDataTable
                columns={columns}
                data={memberList}
                // loading={loading}
                pagination
                searchable
                searchKeys={["FullName", "Email", "UserName", "PhoneNo"]}
                noDataText="No members found"
              />
            </div>
          </main>
        </div>
      </div>
      <AddMemberDialog
        open={addOpen}
        setOpen={setAddOpen}
        onSubmit={handleSubmit}
      />

      <EditMemberDialog
        open={editOpen}
        setOpen={setEditOpen}
        member={selectedMember}
        onSubmit={handleEdit}
      />
      <ViewMemberDialog
        open={detailOpen}
        setOpen={setDetailOpen}
        member={memberDetail}
      />
    </DashboardLayout>
  );
};

export default AllMembers;
