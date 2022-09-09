import * as uuid from 'uuid';
import { Inject } from "@angular/core";
import { GeoJSON } from 'ol/format';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

export interface FlightMapConfigStore {
    id?: string;
    name: string;
    description?: string;
    lastUpdated: string;
    vectorLayer: string; 
    center: string;
    zoom: string; 
}

export interface FlightMapConfig {
	id?: string;
	name: string;
	description?: string;
	lastUpdated: Date;
	vectorLayer?: Feature<Geometry>[]; 
	center: number[];
	zoom: number; 
}

/** 
*    Service provides functions to save / load flight map(s)
*		 @Function saveMapConfig: Save a map config
*    @Function getMapConfigById: Load a map config by id
*/

@Inject({ providedIn: 'root'})
export class FlightMapConfigService {

	/** 
	*    @description: get map config ids as array
	*/	
	private getIdCollection = (): string[] => JSON.parse(localStorage.getItem('id-collection') as string);

	private saveConfigId = (id: string) => {
		const idCollection = this.getIdCollection() || [];
		if (!idCollection.includes(id)) { idCollection.push(id) };
		localStorage.setItem('id-collection', JSON.stringify(idCollection));
	}

	private parseConfig = (config: FlightMapConfigStore): FlightMapConfig => {
		return {
			...config,
			vectorLayer: new GeoJSON().readFeatures(JSON.parse(config?.vectorLayer)),
			lastUpdated: new Date(config?.lastUpdated),
			center: JSON.parse(config?.center),
			zoom: JSON.parse(config?.zoom)
		}
	}

	/** 
	*    @param config: id, name, description, last updated, vector layer, center, zoom
	*/
  saveMapConfig = (config: FlightMapConfigStore) => {
    if (!config.id) { 
			config.id = uuid.v4() 
			localStorage.setItem(config.id as string, JSON.stringify(config));
		} else {
			localStorage[config.id] = JSON.stringify(config);
		}
		this.saveConfigId(config.id);
  };
	
	/** 
	*    @param id: Map config id
	*/	
  getMapConfigById = (id: string): FlightMapConfig => this.parseConfig(JSON.parse(localStorage.getItem(id) as string));

	getMapConfigs = (): FlightMapConfig[] => this.getIdCollection()?.map(id => this.getMapConfigById(id)) 

	deleteMapConfigById = (id: string) => {
		localStorage.removeItem(id);
		const idCollection = this.getIdCollection();
		localStorage.setItem('id-collection', JSON.stringify(idCollection.filter(id => id !== id)));
	}
}