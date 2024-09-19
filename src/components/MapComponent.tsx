import { useRef, useEffect, useState } from "react";
import { useMapStore, useFeatureStore } from "../stores";
import { FeatureModel, MapModel } from "../models";

const MapComponent = () => {
  const mapRef = useRef();
  const featureStore = useFeatureStore((state) => state);

  const fetchFeatures = () => {
    FeatureModel.getAll()
      .then((result) => {
        MapModel.featureList = result.data;
        MapModel.renderMap();
        featureStore.setFeatureList(result.data);
      })
      .catch((err) => {
        MapModel.featureList = [];
        MapModel.renderMap();
      });
  };

  useEffect(() => {
    MapModel.mapRef = mapRef;
    fetchFeatures();
  }, []);

  return (
    <>
      <div ref={mapRef} className="map-container" id="map" />
    </>
  );
};

export default MapComponent;
