import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export const mapVariables = {
  projectionName: 'EPSG:3857',
  projectionDefinition:
    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
  extent: [-20026376.39, -20048966.1, 20026376.39, 20048966.1],
  center: [-483281, 6904172],
  zoom: 8.5,
  raster: new TileLayer({ source: new OSM() })
};