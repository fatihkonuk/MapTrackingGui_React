import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useMemo, useState } from "react";
import {
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  SnackbarOrigin,
} from "@mui/material";
import { useFeatureStore, useSidemenuStore } from "../stores";
import { Close, Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import Swal from "sweetalert2";
import AlertSnackbar from "./snackbars/AlertSnackbar";
import { FeatureModel, MapModel } from "../models";
import { refreshMapData } from "../helpers/map.helper";

export interface Props {
  open: boolean;
  onClose: (value: string) => void;
}

const FeatureList = (props: Props) => {
  const { open, onClose } = props;
  const [alertDialogOpen, setalertDialogOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [snackbarConfig, setSnackbarConfig] = useState<{
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

  const featureStore = useFeatureStore((state) => state);
  const sidemenuStore = useSidemenuStore((state) => state);

  const renderActionButtons = (params) => {
    const { id } = params.data;

    return (
      <>
        <IconButton onClick={() => handleShowBtn(id)}>
          <RemoveRedEye />
        </IconButton>
        <IconButton onClick={() => handleUpdateBtn(id)} color="warning">
          <Edit />
        </IconButton>
        <IconButton onClick={() => handleDeleteBtn(id)} color="error">
          <Delete />
        </IconButton>
      </>
    );
  };

  const colDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 2,
        minWidth: 200,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: "WKT",
        field: "wkt",
        flex: 2,
        minWidth: 400,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: "Actions",
        flex: 1,
        maxWidth: 220,
        cellStyle: { display: "flex", alignItems: "center" },
        filter: false,
        cellRenderer: renderActionButtons,
      },
    ],
    []
  );

  const gridOptions = useMemo(
    () => ({
      columnDefs: colDefs,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      alwaysShowHorizontalScroll: true,
      domLayout: "autoHeight",
      rowHeight: 60,
      autoSizePadding: 20,
      defaultColDef: {
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
    }),
    [colDefs]
  );

  useEffect(() => {
    setRowData(featureStore.featureList);
  }, [featureStore.featureList]);

  const handleShowBtn = (id) => {
    onClose("");
    const selectedFeature = featureStore.getFeatureById(id);
    MapModel.zoomToFeature(selectedFeature);
  };

  const handleUpdateBtn = (id) => {
    const selectedFeature = featureStore.getFeatureById(id);
    featureStore.setFeature(selectedFeature);
    sidemenuStore.updateMode = true;
    sidemenuStore.show();
    onClose("");
    MapModel.setFeatureUpdateable(selectedFeature, (modifiedFeature) => {
      featureStore.setFeature({ ...modifiedFeature });
    });
  };

  const handleDeleteBtn = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      showConfirmButton: true,
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const result = await FeatureModel.delete(id);
          updateSnackbar(result.message, "success");

          await refreshMapData(featureStore);
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          updateSnackbar(errorMessage, "error");
        }
      }
    });
  };

  const onAlertDialogClose = () => {
    setalertDialogOpen(false);
  };

  const updateSnackbar = (text: string, color: AlertColor) => {
    setSnackbarConfig((prev) => ({
      ...prev,
      show: true,
      text,
      color,
    }));
  };

  const onSnackbarClose = () => {
    setSnackbarConfig((prevOptions) => ({
      ...prevOptions,
      show: false,
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xl"
        onClose={onClose}
        PaperProps={{
          sx: {
            alignSelf: "flex-start",
          },
        }}
        sx={{
          zIndex: 100,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => onClose("sa")}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>

        <DialogTitle align="center">Select a feature</DialogTitle>
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", margin: "0px 20px 20px" }}
        >
          <AgGridReact gridOptions={gridOptions} rowData={rowData} />
        </div>
      </Dialog>

      <Dialog
        open={alertDialogOpen}
        onClose={onAlertDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogActions>
          <Button onClick={onAlertDialogClose}>Disagree</Button>
          <Button onClick={onAlertDialogClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar
        SnackbarConfig={{
          ...snackbarConfig,
          onClose: onSnackbarClose,
        }}
      />
    </>
  );
};

export default FeatureList;
