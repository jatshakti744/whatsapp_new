import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AddTemplateApi } from "../../../services/AdminServices";

const AddTemplate = ({ open, setOpen, onSuccess }) => {
  const [templateName, setTemplateName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("tokenjwt");
  const [errors, setErrors] = useState({
  templateName: "",
  message: "",
});
  const { toast } = useToast();
 const handleSubmit = async () => {
  let hasError = false;

  const newErrors = {
    templateName: "",
    message: "",
  };

  if (!templateName.trim()) {
    newErrors.templateName = "Template name is required";
    hasError = true;
  }

  if (!message.trim()) {
    newErrors.message = "Message is required";
    hasError = true;
  }

  if (hasError) {
    setErrors(newErrors);
    return;
  }

  try {
    setLoading(true);
    setErrors({ templateName: "", message: "" });

    const data = {
      template_name: templateName,
      message,
    };

    const res = await AddTemplateApi(data,token);

    if (res?.status) {
      toast({
        title: "Success",
        description: res?.message,
      })
      setOpen(false);
      setTemplateName("");
      setMessage("");
      onSuccess();
    } else {
      toast({
        title: "Error",
        description: res?.message,
      });
    }
  } catch (err) {
    toast({
      title: "Error",
      description: err?.message,
    })
  } finally {
    setLoading(false);
  }
};

const resetForm = () => {
  setTemplateName("");
  setMessage("");
  setErrors({
    templateName: "",
    message: "",
  });
  setLoading(false);
};

  return (
 <Dialog
  open={open}
  onOpenChange={(isOpen) => {
    setOpen(isOpen);

    if (!isOpen) {
      resetForm(); 
    }
  }}
>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
         <Input
  placeholder="Template Name"
  value={templateName}
  onChange={(e) => {
    setTemplateName(e.target.value);
    setErrors((prev) => ({ ...prev, templateName: "" }));
  }}
/>

{errors.templateName && (
  <p className="text-xs text-red-500 mt-1">
    {errors.templateName}
  </p>
)}

         <Textarea
  placeholder="Template Message"
  rows={4}
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);
    setErrors((prev) => ({ ...prev, message: "" }));
  }}
/>

{errors.message && (
  <p className="text-xs text-red-500 mt-1">
    {errors.message}
  </p>
)}

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemplate;
