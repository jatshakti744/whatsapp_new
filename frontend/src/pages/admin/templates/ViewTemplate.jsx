import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GetTemplateById } from "../../../services/AdminServices";

const ViewTemplate = ({ open, setOpen, template }) => {
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(false);
const token = localStorage.getItem("tokenjwt");
  useEffect(() => {
    if (!template?._id || !open) return;

    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const res = await GetTemplateById(template._id,token);
        setViewData(res?.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [template?._id, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>View Template</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : viewData ? (
          <div className="space-y-4">
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Template Name</p>
              <p className="text-sm font-medium">
                {viewData.template_name}
              </p>
            </div>

            <div className="rounded-md border p-3 bg-muted">
              <p className="text-xs text-muted-foreground">Message</p>
              <div className="text-sm whitespace-pre-line max-h-60 overflow-y-auto">
                {viewData.message}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No data found
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewTemplate;
