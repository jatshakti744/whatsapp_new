import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReusableForm from "@/extraComponents/ReusableForm";
import * as Yup from "yup";

const AddMemberDialog = ({ open, setOpen, onSubmit }) => {
  const initialValues = {
    FullName: "",
    UserName: "",
    PhoneNo: "",
    Email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    FullName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets allowed")
      .required("Full name is required"),
    UserName: Yup.string().required("Username is required"),
    PhoneNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    Email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).required("Password is required"),
  });

  const fields = [
    {
      name: "FullName",
      label: "Full Name",
      type: "text",
      inputProps: {
        onInput: (e) => {
          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        },
      },
    },
    { name: "UserName", label: "Username" },
    {
      name: "PhoneNo",
      label: "Phone",
      type: "text",
      inputProps: {
        maxLength: 10,
        inputMode: "numeric",
        pattern: "[0-9]*",
        onInput: (e) => {
          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
        },
      },
    },
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
