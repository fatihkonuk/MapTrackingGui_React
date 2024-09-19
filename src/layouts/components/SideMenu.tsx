import React, { useState } from "react";
import FeatureForm from "../../components/FeatureForm";
import { AlertColor, Drawer, SnackbarOrigin } from "@mui/material";
import { useFeatureStore, useSidemenuStore } from "../../stores";
import { IFeature } from "../../models/types";
import { FeatureModel, MapModel } from "../../models";
import AlertSnackbar from "../../components/snackbars/AlertSnackbar";
import { refreshMapData } from "../../helpers/map.helper";

const SideMenu: React.FC = () => {
  const sidemenuStore = useSidemenuStore();
  const featureStore = useFeatureStore();

  const [snackbarConfig, setSnackbarConfig] = useState({
    show: false,
    text: "",
    color: null as AlertColor | null,
    anchorOrigin: { vertical: "top", horizontal: "center" } as SnackbarOrigin,
    autoHideDuration: 3000,
  });

  const updateSnackbar = (text: string, color: AlertColor) => {
    setSnackbarConfig((prev) => ({
      ...prev,
      show: true,
      text,
      color,
    }));
  };

  const handleSubmit = async (feature: IFeature) => {
    try {
      let result = sidemenuStore.updateMode
        ? await FeatureModel.update(featureStore.feature.id, feature)
        : await FeatureModel.create(feature);

      sidemenuStore.hide();
      updateSnackbar(result.message, "success");

      await refreshMapData(featureStore);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      updateSnackbar(errorMessage, "error");
    }
  };

  const handleCancel = () => {
    MapModel.disableAddMode();
    sidemenuStore.hide();
  };

  const handleSnackbarClose = () => {
    setSnackbarConfig((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={sidemenuStore.open}
        onClose={handleCancel}
        variant="persistent"
        ModalProps={{
          BackdropProps: { invisible: true },
        }}
      >
        <FeatureForm
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          dialogTitle={
            sidemenuStore.updateMode ? "Update Feature" : "Create Feature"
          }
        />
      </Drawer>

      <AlertSnackbar
        SnackbarConfig={{
          ...snackbarConfig,
          onClose: handleSnackbarClose,
        }}
      />
    </>
  );
};

export default SideMenu;
