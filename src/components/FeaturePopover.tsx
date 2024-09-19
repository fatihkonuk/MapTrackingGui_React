import { Popover, Typography } from "@mui/material";
import React, { useState } from "react";

const FeaturePopover = (asd) => {
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverContent, setPopoverContent] = useState("");

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  return (
    <Popover
      ref={asd}
      open={Boolean(popoverAnchor)}
      anchorReference="anchorPosition"
      anchorPosition={
        popoverAnchor
          ? { top: popoverAnchor[1], left: popoverAnchor[0] }
          : undefined
      }
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Typography sx={{ p: 2 }}>{popoverContent}</Typography>
    </Popover>
  );
};

export default FeaturePopover;
