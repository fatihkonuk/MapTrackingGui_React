import { Collection, Feature, Map, Overlay } from "ol";
import { getCenter } from "ol/extent";
import WKT from "ol/format/WKT";
import { Draw, Interaction, Modify, Snap, Translate } from "ol/interaction";
import { Pixel } from "ol/pixel";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { IFeature } from "../models/types";
import { Coordinate } from "ol/coordinate";
import { FeatureLike } from "ol/Feature";
import { Geometry, LineString, Point, Polygon } from "ol/geom";
import { Vector as VectorSource } from "ol/source";

import { FeatureModel, MapModel } from "../models";

export const refreshMapData = async (featureStore: any) => {
  try {
    const result = await FeatureModel.getAll();
    MapModel.featureList = result.data;
    featureStore.setFeatureList(result.data);
    MapModel.renderMap();
  } catch (error) {
    MapModel.featureList = [];
    featureStore.setFeatureList([]);
    MapModel.renderMap();
  }
};

export const generateOlFeature = (feature: IFeature) => {
  const wktFormat = new WKT();

  const olFeature: Feature = wktFormat.readFeature(feature.wkt, {
    featureProjection: "EPSG:3857",
  });
  olFeature.set("clickable", true);

  const type = olFeature.getGeometry().getType();

  if (type == "Point") {
    olFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          src: "/medias/map-pointer.png",
          scale: 0.06,
        }),
      })
    );
  } else {
    olFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "blue",
          width: 2,
        }),
      })
    );
  }
  olFeature.setProperties({ data: feature });
  return olFeature;
};

export const zoomToFeature = ({ map, feature, duration, cb }) => {
  const extent = feature.getGeometry().getExtent();

  map.getView().fit(extent, {
    size: map.getSize(),
    maxZoom: 16,
    duration: duration,
  });

  map.getView().animate(
    {
      center: getCenter(extent),
      zoom: map.getView().getZoom(),
      duration: duration,
    },
    cb
  );
};

export const getFeatureAtPixel = (map: Map, pixel: Pixel) => {
  return map.forEachFeatureAtPixel(pixel, (feature) => feature);
};

export const getWktCoordinates = (wkt) => {
  const wktFormat = new WKT();

  const feature = wktFormat.readFeature(wkt, {
    featureProjection: "EPSG:3857",
  });

  // Feature'ın geometrisini alıyoruz
  const geometry: Geometry | null = feature.getGeometry();

  if (!geometry) {
    return null;
  }

  if (geometry instanceof Point) {
    return geometry.getCoordinates();
  } else if (geometry instanceof LineString) {
    return geometry.getCoordinates();
  } else if (geometry instanceof Polygon) {
    return geometry.getCoordinates();
  }

  return null;
};

export const removeInteraction = (map: Map, interaction: Interaction) => {
  map.removeInteraction(interaction);
};

export const getFeatureData = (feature: Feature | FeatureLike) => {
  return feature.get("data");
};

export const createMapPointPopup = (feature: IFeature) => {
  return `
    <div class="popup-header">
      <span class="popup-title" id="popupTitle">${feature.name}</span>
      <span class="close-btn">×</span>
    </div>
    <div class="popup-body">
      <p>WKT: <span id="popupX">${feature.wkt}</span></p>
      <td>
        <button type="button" class="btn btn-warning point-update-btn" >
          <i class="fa-solid fa-pen"></i>
        </button>
        <button type="button" class="btn btn-danger point-delete-btn">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        </td>
    </div>
  `;
};

export const showFeaturePopover = ({
  overlay,
  feature,
  coordinate,
}: {
  overlay: Overlay;
  feature: Feature | FeatureLike;
  coordinate: any;
}) => {
  const data: IFeature = getFeatureData(feature);
  const popupElement = overlay.getElement();

  overlay.setPosition(coordinate);
  popupElement.innerHTML = createMapPointPopup(data);
  popupElement.classList.add("show");

  popupElement.querySelector(".close-btn").addEventListener("click", () => {
    disposePopover(overlay);
  });

  popupElement.querySelector(".close-btn").addEventListener("click", () => {
    disposePopover(overlay);
  });
};

export const disposePopover = (overlay: Overlay) => {
  const popupElement = overlay.getElement();
  if (popupElement) {
    popupElement.classList.remove("show");
  }
};

export const enableDrawInteraction = ({
  map,
  vectorSource,
  drawType,
  cb,
}: {
  map: Map;
  vectorSource: VectorSource;
  drawType: any;
  cb: Function;
}) => {
  const currentDraw = new Draw({
    source: vectorSource,
    type: drawType,
  });

  map.addInteraction(currentDraw);

  const currentSnap = new Snap({
    source: vectorSource,
  });
  map.addInteraction(currentSnap);

  currentDraw.on("drawend", (event) => {
    const wktFormat = new WKT();
    const feature = event.feature;

    const wkt = wktFormat.writeFeature(feature, {
      featureProjection: "EPSG:3857",
    });

    cb(feature);

    removeInteraction(map, currentDraw);
    removeInteraction(map, currentSnap);
  });
};

export const enableTranslateInteraction = ({
  map,
  olFeature,
  cb,
}: {
  map: Map;
  olFeature: Feature;
  cb: Function;
}) => {
  const currentTranslate = new Translate({
    features: new Collection([olFeature]),
  });

  map.addInteraction(currentTranslate);
  currentTranslate.on("translateend", (event) => {
    console.log(event);
    cb();
  });
};

export const enableModifyInteraction = ({
  map,
  vectorSource,
  drawType,
  cb,
}: {
  map: Map;
  vectorSource: VectorSource;
  drawType: any;
  cb: Function;
}) => {
  const currentDraw = new Draw({
    source: vectorSource,
    type: drawType,
  });

  map.addInteraction(currentDraw);

  const currentSnap = new Snap({
    source: vectorSource,
  });
  map.addInteraction(currentSnap);

  currentDraw.on("drawend", (event) => {
    const wktFormat = new WKT();
    const feature = event.feature;

    const wkt = wktFormat.writeFeature(feature, {
      featureProjection: "EPSG:3857",
    });

    cb(feature);

    removeInteraction(map, currentDraw);
    removeInteraction(map, currentSnap);
  });
};

export const setFeatureSelected = (olFeature) => {
  const type = olFeature.getGeometry().getType();

  if (type == "Point") {
    olFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          src: "../../public/medias/map-pointer.png",
          scale: 0.06,
        }),
      })
    );
  } else {
    olFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "blue",
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      })
    );
  }
};

export const disableFeature = (olFeature) => {
  olFeature.set("clickable", false);
  const type = olFeature.getGeometry().getType();

  if (type == "Point") {
    olFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          src: "../../public/medias/map-pointer-black.png",
          scale: 0.06,
        }),
      })
    );
  } else {
    olFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.5)",
          width: 1,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0, 0.2)",
        }),
      })
    );
  }
};
