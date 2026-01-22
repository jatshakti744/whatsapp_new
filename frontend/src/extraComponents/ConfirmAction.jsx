import { toast } from "sonner";

/**
 
 * @param {ReactNode} children - 
 * @param {string} title
 * @param {string} description
 * @param {string} confirmText
 * @param {string} cancelText
 * @param {string} type - warning | info | success | error
 * @param {Function} onConfirm
 */
const ConfirmAction = ({
  children,
  title = "Are you sure?",
  description = "Do you want to continue?",
  confirmText = "Yes",
  cancelText = "No",
  type = "warning",

  onConfirm,
}) => {
  const handleClick = () => {
    toast[type](title, {
      description,
      action: {
        label: confirmText,
        onClick: onConfirm,
      },
      cancel: {
        label: cancelText,
      },
    });
  };

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default ConfirmAction;
