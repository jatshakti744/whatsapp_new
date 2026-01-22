import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReusableForm from "@/extraComponents/ReusableForm";
import * as Yup from "yup";

const EditClientDialog = ({ open, setOpen, clientdetail, onSubmit }) => {
  // if (!member) return null;

  const initialValues = {
    FullName: clientdetail.FullName || "",
    PhoneNo: clientdetail.PhoneNo || "",
  };

  const validationSchema = Yup.object({
    FullName: Yup.string().required("Full name required"),
    PhoneNo: Yup.string().required("Phone required"),
  });

  const fields = [
    { name: "FullName", label: "Full Name" },
    // { name: "UserName", label: "Username", disabled: true },
    { name: "PhoneNo", label: "Phone" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitText="Update Client"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
