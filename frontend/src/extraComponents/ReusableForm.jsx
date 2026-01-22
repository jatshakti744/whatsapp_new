import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";




const ReusableForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitText = "Submit",
  
}) => {
    const colMap = {
  12: "col-span-12",
  6: "col-span-6",
  4: "col-span-4",
  3: "col-span-3",
};

const mdColMap = {
  12: "md:col-span-12",
  6: "md:col-span-6",
  4: "md:col-span-4",
  3: "md:col-span-3",
};
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="grid grid-cols-12 gap-4">
        {fields.map((field, index) => (
         <div
  key={index}
  className={`${colMap[field.col || 12]} ${mdColMap[field.mdCol] || ""}`}
>

            {field.label && (
              <Label className="mb-1 block">
                {field.label}
              </Label>
            )}

            <Field name={field.name}>
              {({ field: formikField }) => (
                <Input
                  {...formikField}
                  type={field.type || "text"}
                  placeholder={field.placeholder || ""}
                />
              )}
            </Field>

            <ErrorMessage name={field.name}>
              {(msg) => (
                <p className="text-sm text-red-500 mt-1">
                  {msg}
                </p>
              )}
            </ErrorMessage>
          </div>
        ))}

        {/* Submit */}
        <div className="col-span-12 pt-4">
          <Button type="submit" className="w-full">
            {submitText}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default ReusableForm;
