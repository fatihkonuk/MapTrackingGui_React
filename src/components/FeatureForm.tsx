import React, { useState, useEffect } from "react";
import { Box, Button, DialogTitle, TextField } from "@mui/material";
import { useFeatureStore } from "../stores";
import { IFeature } from "../models/types";
import { MapHelper } from "../helpers";

interface Props {
  dialogTitle: string;
  onSubmit: (feature: IFeature) => void;
  onCancel: () => void;
}

const FeatureForm: React.FC<Props> = ({ dialogTitle, onSubmit, onCancel }) => {
  const featureStore = useFeatureStore((state) => state);

  const [name, setName] = useState(featureStore.feature?.name || "");
  const [wkt, setWkt] = useState(featureStore.feature?.wkt || "");

  useEffect(() => {
    if (featureStore.feature) {
      setName(featureStore.feature.name);
      setWkt(featureStore.feature.wkt);
    }
  }, [featureStore.feature]);

  const handleSubmit = () => {
    onSubmit({ name, wkt, userId: 0 });
  };

  const handleCancel = () => {
    setName("");
    setWkt("");
    MapHelper.refreshMapData(featureStore);
    onCancel();
  };

  return (
    <Box component="form" sx={{ p: 3 }}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="WKT"
        value={wkt}
        onChange={(e) => setWkt(e.target.value)}
        margin="normal"
      />
      <Box sx={{ marginTop: "10px" }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          color="primary"
          sx={{ marginBottom: "10px" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          color="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default FeatureForm;
