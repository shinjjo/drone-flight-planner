import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';

export interface FlightPlanJson {
  id?: string;
  name: string;
  description?: string;
  lastUpdated: string;
  vectorLayer: string;
  center: string;
  zoom: string;
}

export interface FlightPlanDto {
  id?: string;
  name: string;
  description?: string;
  lastUpdated: Date;
  vectorLayer?: Feature<Geometry>[];
  center: number[];
  zoom: number;
}

export interface FlightPlanSaveForm {
  name: string;
  description: string;
}