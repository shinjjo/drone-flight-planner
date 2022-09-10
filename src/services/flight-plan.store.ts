import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mapVariables } from 'src/assets/config';
import { FlightPlanDto } from 'src/models/flight-map';

@Injectable()
export class FlightPlanStore {
  initialFlightPlan: FlightPlanDto = {
    name: '',
    lastUpdated: new Date(),
    center: mapVariables.center,
    zoom: mapVariables.zoom
  };

  private readonly flightPlan: BehaviorSubject<FlightPlanDto> =
    new BehaviorSubject(this.initialFlightPlan);

  private readonly flightPlans: BehaviorSubject<FlightPlanDto[]> =
    new BehaviorSubject([]);

  planState$: Observable<FlightPlanDto> = this.flightPlan.asObservable();
  plansState$: Observable<FlightPlanDto[]> = this.flightPlans.asObservable();

  get flightPlanDto(): FlightPlanDto {
    return this.flightPlan.getValue();
  }

  get flightPlanDtos(): FlightPlanDto[] {
    return this.flightPlans.getValue();
  }

  setFlightPlan(flightPlan: FlightPlanDto): Observable<FlightPlanDto> {
    this.flightPlan.next(flightPlan);
    return this.planState$;
  }

  setFlightPlans(flightPlans: FlightPlanDto[]): Observable<FlightPlanDto[]> {
    this.flightPlans.next(flightPlans);
    return this.plansState$;
  }

  cleanFlightPlan(): void {
    this.flightPlan.next(this.initialFlightPlan);
  }
}