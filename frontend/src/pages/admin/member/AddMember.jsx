import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import * as Yup from "yup";
import ReusableForm from "../../../extraComponents/ReusableForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddMember = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const fields = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      col: 12,
    mdCol: 6,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
     col: 12,
    mdCol: 6,
    },
  ];

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    // For example, after submitting, you can navigate to a different page
    navigate("/members");
  };

  return (
    <DashboardLayout title="Members" subtitle="Manage your team members">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <ReusableForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              fields={fields}
              submitText="Add Member"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddMember;
