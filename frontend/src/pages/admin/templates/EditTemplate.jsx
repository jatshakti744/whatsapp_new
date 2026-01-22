import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditTemplateApi } from "../../../services/AdminServices";
import { useToast } from "@/hooks/use-toast";
const EditTemplate = ({ open, setOpen, template, onSuccess }) => {
    const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const token = localStorage.getItem("tokenjwt");
  const [errors, setErrors] = useState({
    templateName: "",
    message: "",
  });

  useEffect(() => {
    if (template) {
      setTemplateName(template.template_name || "");
      setMessage(template.message || "");
    }
  }, [template]);

  const handleUpdate = async () => {
    let hasError = false;
    const newErrors = { templateName: "", message: "" };

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
       id: template._id,
        template_name: templateName,
        message,
        token,
      };

      const res = await EditTemplateApi(data);

      if (res?.status) {
         toast({
           title: "Success",
           description: res?.message,
         })
        setOpen(false);
        onSuccess(); 
      } else {
        toast({
          title: "Error",
          description: res?.message || "Server error, please try again",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Server error, please try again",
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Template Name"
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                setErrors((p) => ({ ...p, templateName: "" }));
              }}
            />
            {errors.templateName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.templateName}
              </p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Template Message"
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors((p) => ({ ...p, message: "" }));
              }}
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplate;
