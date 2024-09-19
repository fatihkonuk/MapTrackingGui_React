import {
  Collection,
  Feature,
  MapBrowserEvent,
  Map as OlMap,
  Overlay,
  View,
} from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import { OSM, Vector as VectorSource } from "ol/source";
import { DOMHelper, MapHelper } from "../helpers";
import { IFeature } from "./types";
import { Coordinate } from "ol/coordinate";
import WKT from "ol/format/WKT";
import { Modify, Translate } from "ol/interaction";

const CursorTypes = {
  DEFAULT: "default",
  POINTER: "pointer",
  CROSSHAIR: "crosshair",
};

class MapModel {
  static mapRef: React.RefObject<HTMLDivElement> | null = null;
  static map: OlMap | null = null;
  static overlay: Overlay | null = null;
  static vectorLayer: VectorLayer<VectorSource> | null = null;
  static vectorSource: VectorSource | null = null;
  static featureList: IFeature[] = [];
  static addMode: boolean = false;
  static addedFeature: Feature | null = null;
  static currentTranslate = null;
  static currentModify = null;

  static resetMapState() {
    this.map = null;
    this.overlay = null;
    this.vectorLayer = null;
    this.vectorSource = null;
    this.addMode = false;
    this.addedFeature = null;
  }

  static async renderMap() {
    if (this.mapRef) {
      if (!this.map) {
        this.initOverlay();
        this.initVectorLayer();
        await this.renderFeatures();
        this.createMap();
        this.bindMapEvents();
      } else {
        this.vectorSource.clear();
        await this.renderFeatures();
        if (this.currentModify) {
          this.map.removeInteraction(this.currentModify);
        }
        if (this.currentTranslate) {
          this.map.removeInteraction(this.currentTranslate);
        }
      }
    }
  }

  static createMap() {
    this.map = new OlMap({
      target: this.mapRef.current!,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: this.vectorSource,
        }),
      ],
      overlays: [this.overlay],
      view: new View({
        center: fromLonLat([35, 39]),
        zoom: 6,
      }),
    });
  }

  static async restartMap() {
    this.resetMapState();
    this.renderMap();
  }

  static initOverlay() {
    const container = document.createElement("div");
    container.id = "mapFeaturePopup";
    container.classList.add("popup");

    this.overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
  }

  static initVectorLayer() {
    this.vectorSource = new VectorSource({ features: [] });
    this.vectorLayer = new VectorLayer({ source: this.vectorSource });
  }

  static async renderFeatures() {
    try {
      this.featureList.forEach((feature: IFeature) => {
        const olFeature = MapHelper.generateOlFeature(feature);
        this.vectorSource.addFeature(olFeature);
      });
    } catch (error) {
      console.error("Error loading features:", error);
    }
  }

  static bindMapEvents() {
    this.map.on("singleclick", this.handleSingleClick.bind(this));
    this.map.on("dblclick", this.handleDoubleClick.bind(this));
    this.map.on("pointermove", this.handlePointerMove.bind(this));
    this.map.on("movestart", this.handleMapMoveStart.bind(this));
  }

  static handleSingleClick(event: MapBrowserEvent<any>) {
    if (!this.addMode) {
      const feature = MapHelper.getFeatureAtPixel(this.map!, event.pixel);

      if (feature && feature.get("clickable")) {
        const coordinate = event.coordinate;
        this.onFeatureClick(feature, coordinate);
      } else {
        MapHelper.disposePopover(this.overlay!);
      }
    }
  }

  static onFeatureClick(feature: any, coordinate: Coordinate) {
    MapHelper.showFeaturePopover({
      overlay: this.overlay!,
      feature,
      coordinate,
    });
  }

  static handleDoubleClick(event: MapBrowserEvent<any>) {
    if (!this.addMode) {
      const feature = this.map!.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (feature) {
        event.preventDefault();
        event.stopPropagation();

        MapHelper.zoomToFeature({
          map: this.map!,
          feature,
          duration: 2000,
          cb: () => {
            this.onFeatureClick(feature, event.coordinate);
          },
        });
      }
    }
    if (this.addMode) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  static handlePointerMove(event: MapBrowserEvent<any>) {
    const feature = MapHelper.getFeatureAtPixel(this.map!, event.pixel);

    if (feature && feature.get("clickable")) {
      DOMHelper.changeCursorType(CursorTypes.POINTER);
    } else {
      DOMHelper.changeCursorType(CursorTypes.DEFAULT);
    }
  }

  static handleMapMoveStart(event: MapBrowserEvent<any>) {
    MapHelper.disposePopover(this.overlay!);
  }

  static activateAddMode(drawType: string, cb: (feature: Feature) => void) {
    this.addMode = true;
    DOMHelper.changeCursorType(CursorTypes.CROSSHAIR);
    try {
      MapHelper.enableDrawInteraction({
        map: this.map!,
        vectorSource: this.vectorSource!,
        drawType,
        cb: (feature: Feature) => {
          this.addedFeature = feature;
          cb(feature);
        },
      });
    } catch (error) {
      console.error("Error in activateAddMode:", error);
      this.disableAddMode();
    }
  }

  static disableAddMode() {
    this.addMode = false;
    DOMHelper.changeCursorType(CursorTypes.DEFAULT);
    if (this.addedFeature) {
      this.vectorSource!.removeFeature(this.addedFeature);
      this.addedFeature = null;
    }
  }

  static setFeatureUpdateable(
    selectedFeature: IFeature,
    cb: (feature: IFeature) => void
  ) {
    const olFeatureList = this.vectorLayer.getSource().getFeatures();
    const olFeature = olFeatureList.find(
      (feature) => feature.get("data").id == selectedFeature.id
    );

    if (olFeature) {
      olFeatureList.forEach((feature) => {
        if (feature !== olFeature) {
          MapHelper.disableFeature(feature);
        } else {
          MapHelper.setFeatureSelected(feature);
        }
      });

      this.addedFeature = olFeature;

      const format = new WKT();

      this.currentTranslate = new Translate({
        features: new Collection([olFeature]),
      });

      this.map.addInteraction(this.currentTranslate);
      this.currentTranslate.on("translateend", (event) => {
        const newWkt = format.writeFeature(olFeature, {
          featureProjection: "EPSG:3857",
        });
        selectedFeature.wkt = newWkt;
        cb(selectedFeature);
      });

      this.currentModify = new Modify({
        features: new Collection([olFeature]),
      });
      this.map.addInteraction(this.currentModify);
      this.currentModify.on("modifyend", (event) => {
        const newWkt = format.writeFeature(olFeature, {
          featureProjection: "EPSG:3857",
        });
        selectedFeature.wkt = newWkt;
        cb(selectedFeature);
      });
    }
  }

  static zoomToFeature(feature: IFeature) {
    const olFeatureList = this.vectorLayer.getSource().getFeatures();
    const olFeature = olFeatureList.find((f) => f.get("data").id == feature.id);

    MapHelper.zoomToFeature({
      map: this.map!,
      feature: olFeature,
      duration: 2000,
      cb: () => {
        let coordinate = null;
        const geomName = olFeature.getGeometry().getType();

        const coord = MapHelper.getWktCoordinates(feature.wkt);
        if (geomName == "Point") {
          coordinate = coord;
        } else if (geomName == "LineString") {
          coordinate = coord[0];
        } else {
          coordinate = coord[0][0];
        }
        this.onFeatureClick(olFeature, coordinate);
      },
    });
  }
}

export default MapModel;
