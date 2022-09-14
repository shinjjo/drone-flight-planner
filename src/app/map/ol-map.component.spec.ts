import { MatButtonModule } from '@angular/material/button';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { FlightPlanService } from 'src/services/flight-plan.service';
import { FlightPlanStore } from 'src/services/flight-plan.store';
import { SharedDialogService } from 'src/shared/dialog/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mapVariables } from 'src/assets/config';
import { BehaviorSubject } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FlightPlanDto } from 'src/models/flight-plan';
import { OlMapComponent } from './ol-map.component';
import { get, Projection } from 'ol/proj';
import { DrawControl } from './controls/DrawControl';
import { Draw } from 'ol/interaction';

const MOCK_FLIGHT_PLAN: FlightPlanDto = {
	name: '',
	description: '',
	lastUpdated: new Date('2022-09-11T11:20:23Z'),
	center: mapVariables.center,
	zoom: mapVariables.zoom,
};

describe('OlMapComponent', () => {
  let spectator: Spectator<OlMapComponent>;
  let planState$ = new BehaviorSubject(MOCK_FLIGHT_PLAN);

  const createComponent = createComponentFactory({
    component: OlMapComponent,
    imports: [
      MatButtonModule,
      MatDialogModule,
      MatCardModule,
    ],
    mocks: [
      FlightPlanService,
      SharedDialogService,
      MatSnackBar,
    ],
    providers: [
      mockProvider(FlightPlanStore, {
		planState$,
        flightPlanDto: planState$.getValue(),
      })
    ],
  })

	const getDrawButton = () => spectator.query('button.draw-button') as HTMLButtonElement;
	const getDrawControl = () => spectator.component.map.getControls().getArray().find(control => control instanceof DrawControl);

  beforeEach(() => {
		spectator = createComponent();
  });

  it('should create the app component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize a map', () => {
		expect(spectator.component.map.getView().getZoom()).toBe(mapVariables.zoom);
		expect(spectator.component.map.getView().getCenter()).toBe(mapVariables.center);
		expect(spectator.component.map.getView().getProjection()).toBe(get(mapVariables.projectionName) as Projection);
  });

  it('should have a draw control', () => {
		expect(getDrawControl()).toExist();
  });

  describe('when clicking the polyline icon', () => {
		it('should be able to toggle draw', () => {
			const isInstanceOfDraw = () => spectator.component.map.getInteractions().getArray().some(interaction => interaction instanceof Draw);
			expect(isInstanceOfDraw()).toBe(false);
			spectator.click(getDrawButton());
			expect(isInstanceOfDraw()).toBe(true);
			spectator.click(getDrawButton());
			expect(isInstanceOfDraw()).toBe(false);
		});
  });
});
