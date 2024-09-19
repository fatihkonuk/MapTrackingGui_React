import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useMemo, useState } from "react";
import {
  AlertColor,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  SnackbarOrigin,
  TextField,
  Typography,
} from "@mui/material";
import { useFeatureStore, useSidemenuStore, useUserStore } from "../stores";
import {
  Close,
  CloseOutlined,
  Delete,
  Edit,
  Label,
  RemoveRedEye,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import AlertSnackbar from "./snackbars/AlertSnackbar";
import { FeatureModel, MapModel, UserModel } from "../models";
import { refreshMapData } from "../helpers/map.helper";
import { IUser } from "../models/types";

export interface Props {
  open: boolean;
  onClose: (value: string) => void;
}

const UserList = (props: Props) => {
  const { open, onClose } = props;
  const [alertDialogOpen, setalertDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({} as IUser);
  const [showUserCard, setShowUserCard] = useState(false);
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

  const userStore = useUserStore((state) => state);
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
        headerName: "ID",
        field: "id",
        flex: 1,
        minWidth: 200,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: "Full Name",
        field: "fullname",
        flex: 2,
        minWidth: 200,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: "Username",
        field: "username",
        flex: 2,
        minWidth: 400,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: "Role",
        field: "role",
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

  const gridOptions: any = useMemo(
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
    UserModel.getAll()
      .then((result) => {
        setRowData(result.data);
        userStore.setUserList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setRowData(userStore.userList);
  }, []);

  useEffect(() => {
    UserModel.getAll()
      .then((result) => {
        setRowData(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setRowData(userStore.userList);
  }, [userStore.userList]);

  const handleShowBtn = (id: number) => {
    const user = userStore.getUserById(id);
    userStore.setUser(user);
    setSelectedUser(user);

    FeatureModel.getByUserId(id)
      .then(async (result) => {
        MapModel.featureList = result.data;
        featureStore.setFeatureList(result.data);
        MapModel.renderMap();
        setShowUserCard(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        onClose("");
      });
  };

  const handleUpdateBtn = (id) => {
    console.log(id);
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
          const result = await UserModel.delete(id);
          userStore.setUserList(userStore.userList.filter((e) => e.id != id));
          updateSnackbar(result.message, "success");
          setShowUserCard(false);
          setSelectedUser({} as IUser);
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

  const handleUserCardClose = () => {
    setShowUserCard(false);
    refreshMapData(featureStore);
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

  const userCardStyle = {
    position: "absolute",
    top: "30px",
    left: "40px",
    zIndex: 100,
    width: 275,
    padding: 2,
  };
  const userCardCloseBtnStyle = {
    position: "absolute",
    top: "5px",
    right: "5px",
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
      {showUserCard && (
        <Card sx={userCardStyle}>
          <IconButton onClick={handleUserCardClose} sx={userCardCloseBtnStyle}>
            <CloseOutlined />
          </IconButton>
          <CardContent>
            <Box
              component="form"
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="fullname">Full Name</FormLabel>
                <TextField
                  type="text"
                  fullWidth
                  size="small"
                  value={selectedUser.fullname}
                  disabled
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <TextField
                  type="text"
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={selectedUser.username}
                  disabled
                />
              </FormControl>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => handleDeleteBtn(selectedUser.id)}
              color="error"
              variant="contained"
              size="small"
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default UserList;
