import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReusableForm from "@/extraComponents/ReusableForm";
import * as Yup from "yup";

const AddClientDialog = ({ open, setOpen, onSubmit }) => {
  const initialValues = {
    FullName: "",
    PhoneNo: "",
  };

  const validationSchema = Yup.object({
    FullName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets allowed")
      .required("Full name is required"),

    PhoneNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const fields = [
    {
      name: "FullName",
      label: "Full Name",
      inputProps: {
        onInput: (e) => {
          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        },
      },
    },
    {
      name: "PhoneNo",
      label: "Phone",
      inputProps: {
        maxLength: 10,
        inputMode: "numeric",
        pattern: "[0-9]*",
        onInput: (e) => {
          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
        },
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
        </DialogHeader>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitText="Add Client"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
