import * as React from "react";
import {
  AlertColor,
  Box,
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  SnackbarOrigin,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Storage as StorageIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Logout,
} from "@mui/icons-material";
import { MapHelper } from "../../helpers";
import { useFeatureStore, useAuthStore } from "../../stores";
import AlertSnackbar from "../../components/snackbars/AlertSnackbar";
import UserList from "../../components/UserList";
import AuthModal from "../../components/authorization/AuthModal";
import FeatureSelector from "../../components/FeatureSelector";
import FeatureList from "../../components/FeatureList";
import { isAdmin } from "../../helpers/auth.helper";

const Navigator = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openSelector, setOpenSelector] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [openUserList, setOpenUserList] = React.useState(false);
  const [openProfileMenu, setOpenProfileMenu] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

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

  const [openModal, setOpenModal] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleOpenModal = (index: number) => {
    handleTabChange(index);
    setOpenModal(true);
  };
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const handleCloseModal = () => setOpenModal(false);

  const authStore = useAuthStore((state) => state);
  const featureStore = useFeatureStore((state) => state);

  const handleClickAdd = () => {
    setOpenSelector(true);
    setMenuAnchorEl(null);
  };

  const handleCloseSelector = (value: string) => {
    setOpenSelector(false);
  };

  const handleClickList = () => {
    setOpenList(true);
    setMenuAnchorEl(null);
  };

  const handleCloseList = (value: string) => {
    setOpenList(false);
  };

  const handleClickUserList = () => {
    setOpenUserList(true);
    setMenuAnchorEl(null);
  };

  const handleCloseUserList = (value: string) => {
    setOpenUserList(false);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenProfileMenu(true);
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setOpenProfileMenu(false);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleClickLogout = async () => {
    authStore.purgeAuth();
    MapHelper.refreshMapData(featureStore);
  };

  const onSnackbarClose = () => {
    setSnackbarConfig((prevOptions) => ({
      ...prevOptions,
      show: false,
    }));
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 40,
          right: 40,
          zIndex: "100",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleAvatarClick}
            size="small"
            aria-controls={openProfileMenu ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openProfileMenu ? "true" : undefined}
          >
            <Avatar sx={{ width: 60, height: 60, backgroundColor: "#2d3250" }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Tooltip>

        {authStore.user && (
          <Tooltip title="Options">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              aria-controls={menuAnchorEl ? "options-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuAnchorEl ? "true" : undefined}
              sx={{
                "&.Mui-disabled": {
                  cursor: "no-drop", // İmleç değişikliği
                },
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor:
                    authStore.user == null ? "#9e9e9e" : "#2d3250",
                  cursor: authStore.user == null ? "no-drop" : "pointer",
                }}
              >
                <AddIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        id="options-menu"
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClickAdd}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Add
        </MenuItem>
        <MenuItem onClick={handleClickList}>
          <ListItemIcon>
            <StorageIcon fontSize="small" />
          </ListItemIcon>
          List
        </MenuItem>

        {isAdmin() && (
          <MenuItem onClick={handleClickUserList}>
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            Users
          </MenuItem>
        )}
      </Menu>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openProfileMenu}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {authStore.user ? (
          <div>
            <MenuItem onClick={handleProfileMenuClose}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleClickLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem onClick={() => handleOpenModal(0)}>
              <Avatar /> Sign In
            </MenuItem>
            <MenuItem onClick={() => handleOpenModal(1)}>
              <Avatar /> Sign Up
            </MenuItem>
          </div>
        )}
      </Menu>

      <FeatureSelector open={openSelector} onClose={handleCloseSelector} />
      <FeatureList open={openList} onClose={handleCloseList} />
      <UserList open={openUserList} onClose={handleCloseUserList} />

      <AuthModal
        open={openModal}
        onClose={handleCloseModal}
        tabIndex={tabIndex}
        tabChange={handleTabChange}
      />
      <AlertSnackbar
        SnackbarConfig={{
          ...snackbarConfig,
          onClose: onSnackbarClose,
        }}
      />
    </>
  );
};

export default Navigator;
