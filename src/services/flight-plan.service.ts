import * as uuid from 'uuid';
import { Inject } from '@angular/core';
import { GeoJSON } from 'ol/format';
import { FlightPlanDto, FlightPlanJson } from 'src/models/flight-plan';

/**
 *    A service provides functions to save / load flight map(s)
 *	   @Function saveFlightPlan Save a flight plan
 *    @Function getFlightPlanById: Load a flight plan by id
 */

@Inject({ providedIn: 'root' })
export class FlightPlanService {
  /**
   *    @description: get flight plan IDs as array
   */
  private getIdCollection(): string[] {
		return JSON.parse(localStorage.getItem('id-collection') as string);
	}

  private savePlanId(id: string){
    const idCollection = this.getIdCollection() || [];
    if (!idCollection.includes(id)) {
      idCollection.push(id);
    }
    localStorage.setItem('id-collection', JSON.stringify(idCollection));
  };

  private parsePlan(flightPlan: FlightPlanJson): FlightPlanDto {
    return {
      ...flightPlan,
      vectorLayer: new GeoJSON().readFeatures(
        JSON.parse(flightPlan?.vectorLayer)
      ),
      lastUpdated: new Date(flightPlan?.lastUpdated),
      center: JSON.parse(flightPlan?.center),
      zoom: JSON.parse(flightPlan?.zoom)
    };
  };

  /**
   *    @param planJson: id, name, description, last updated, vector layer, center, zoom
   */
  saveFlightPlan(planJson: FlightPlanJson) {
    if (!planJson.id) {
      planJson.id = uuid.v4();
      localStorage.setItem(planJson.id as string, JSON.stringify(planJson));
    } else {
      localStorage[planJson.id] = JSON.stringify(planJson);
    }
    this.savePlanId(planJson.id);
  };

  /**
   *    @param id: Flight plan id
   */
  getFlightPlanById(id: string): FlightPlanDto {
    return this.parsePlan(JSON.parse(localStorage.getItem(id) as string));
	}

  getFlightPlans(): FlightPlanDto[] {
    return this.getIdCollection()?.map((id) => this.getFlightPlanById(id));
	}

  deletePlanById(id: string) {
    localStorage.removeItem(id);
    const idCollection = this.getIdCollection();
    localStorage.setItem(
      'id-collection',
      JSON.stringify(idCollection.filter((savedId) => savedId !== id))
    );
  };
}