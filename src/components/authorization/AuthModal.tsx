import { AlertColor, Box, SnackbarOrigin, Modal } from "@mui/material";
import React from "react";
import SignIn from "./SignIn";
import { AuthModel } from "../../models";
import { useAuthStore, useFeatureStore } from "../../stores";
import { MapHelper } from "../../helpers";
import SignUp from "./SignUp";
import AlertSnackbar from "../snackbars/AlertSnackbar";
import { ILogin, IRegister } from "../../models/types";

interface Props {
  open: boolean;
  onClose: () => void;
  tabIndex: number;
  tabChange: (index: number) => void;
}

const AuthModal = (props: Props) => {
  const { open, onClose, tabIndex, tabChange } = props;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [snackbarConfig, setSnackbarConfig] = React.useState<{
    show: boolean;
    color: AlertColor;
    text: string;
    anchorOrigin: SnackbarOrigin;
    autoHideDuration: number;
    onClose: () => void;
  }>({
    show: false,
    text: "",
    color: null,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    autoHideDuration: 2000,
    onClose: () => {},
  });

  const authStore = useAuthStore((state) => state);
  const featureStore = useFeatureStore((state) => state);

  const login = async (credentials: ILogin) => {
    setIsSubmitting(true);
    AuthModel.login(credentials)
      .then((result) => {
        authStore.setAuth(result.data);
        MapHelper.refreshMapData(featureStore);
        onClose();
        setSnackbarConfig((prev) => ({
          ...prev,
          show: true,
          text: result.message,
          color: "success",
        }));
        setIsSubmitting(false);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err);
      });
  };

  const register = async (credentials: IRegister) => {
    setIsSubmitting(true);
    AuthModel.register(credentials)
      .then((result) => {
        setSnackbarConfig((prev) => ({
          ...prev,
          show: true,
          text: result.message,
          color: "success",
        }));
        setIsSubmitting(false);
        tabChange(0);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err);
      });
  };

  const boxStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 800,
  };

  const onSnackbarClose = () => {
    setSnackbarConfig((prevOptions) => ({
      ...prevOptions,
      show: false,
    }));
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="signin-modal-title"
        sx={{ margin: "auto" }}
      >
        <Box sx={boxStyle}>
          {tabIndex === 0 && (
            <SignIn
              onSubmit={login}
              isSubmitting={isSubmitting}
              tabChange={tabChange}
            />
          )}
          {tabIndex === 1 && (
            <SignUp
              onSubmit={register}
              isSubmitting={isSubmitting}
              tabChange={tabChange}
            />
          )}
        </Box>
      </Modal>

      <AlertSnackbar
        SnackbarConfig={{
          ...snackbarConfig,
          onClose: onSnackbarClose,
        }}
      />
    </>
  );
};

export default AuthModal;
