import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface ToastProps {
  success?: boolean;
  warning?: boolean;
  info?: boolean;
  error?: boolean;
  message?: string | any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Toast({
  warning,
  info,
  error,
  message,
  open,
  setOpen,
}: ToastProps) {
  const handleClose = (reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => handleClose}
      >
        <Alert
          onClose={() => handleClose}
          severity={
            error
              ? 'error'
              : warning
              ? 'warning'
              : info
              ? 'info'
              : 'success'
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
