import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { ListItemIcon } from "@mui/material";
import { Place, Timeline, CropLandscape } from "@mui/icons-material";
import { useMapStore, useSidemenuStore, useFeatureStore } from "../stores";
import { MapModel } from "../models";
import WKT from "ol/format/WKT";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

const listItems = [
  {
    icon: <Place />,
    text: "Point",
    type: "Point",
  },
  {
    icon: <CropLandscape />,
    text: "Polygon",
    type: "Polygon",
  },
  {
    icon: <Timeline />,
    text: "Line",
    type: "LineString",
  },
];

function FeatureSelector(props: SimpleDialogProps) {
  const { open, onClose } = props;

  const setFeature = useFeatureStore((state) => state.setFeature);
  const sidemenuStore = useSidemenuStore((state) => state);

  const handleDrawEnd = (feature) => {
    const wktFormat = new WKT();
    const wkt = wktFormat.writeFeature(feature, {
      featureProjection: "EPSG:3857",
    });
    setFeature({ name: "", wkt });
    sidemenuStore.updateMode = false;
    sidemenuStore.show();
  };

  const handleSelectType = (type) => {
    MapModel.activateAddMode(type, handleDrawEnd);
    onClose("");
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          alignSelf: "flex-start", // Üst hizalamak için flex-start kullanımı
        },
      }}
      onClose={onClose}
    >
      <DialogTitle align="center">Select a feature</DialogTitle>
      <List sx={{ pt: 0, display: "flex" }}>
        {listItems.map((item) => (
          <ListItem key={item.text}>
            <ListItemButton
              autoFocus
              onClick={() => handleSelectType(item.type)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ListItemIcon
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default FeatureSelector;
