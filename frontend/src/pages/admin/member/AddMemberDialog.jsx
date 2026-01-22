import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReusableForm from "@/extraComponents/ReusableForm";
import * as Yup from "yup";

const AddMemberDialog = ({
  open,
  setOpen,
  onSubmit,
}) => {
  const initialValues = {
    FullName: "",
    UserName: "",
    PhoneNo: "",
    Email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    FullName: Yup.string().required("Full name is required"),
    UserName: Yup.string().required("Username is required"),
    PhoneNo: Yup.string().required(),
    Email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
  });

  const fields = [
    { name: "FullName", label: "Full Name" },
    { name: "UserName", label: "Username" },
    { name: "PhoneNo", label: "Phone" },
    { name: "Email", label: "Email" },
    { name: "password", label: "Password", type: "password" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitText="Add Member"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
