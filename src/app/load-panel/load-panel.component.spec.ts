import { MatButtonModule } from '@angular/material/button';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { FlightPlanService } from 'src/services/flight-plan.service';
import { FlightPlanStore } from 'src/services/flight-plan.store';
import { SharedDialogService } from 'src/shared/dialog/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mapVariables } from 'src/assets/config';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { LoadPanelComponent } from './load-panel.component';
import { FlightPlanDto } from 'src/models/flight-plan';

const MOCK_FLIGHT_PLANS: FlightPlanDto[] = [
  {
	id: '2d403f30-4b1a-41cc-89a6-ea5cde480ff5',
    name: 'Wilhellm-Strasse',
    description: 'Flght plan for Wilhellm-Strasse',
    lastUpdated: new Date('2022-09-11T11:20:23Z'),
    center: mapVariables.center,
    zoom:  mapVariables.zoom,
  },
  {
	id: '634b9b76-abf6-432d-882b-ba588f1023ec',
    name: 'Caroline-Herschel-Strasse',
    description: 'Flght plan for Caroline-Herschel-Strasse',
    lastUpdated: new Date('2022-09-11T11:20:23Z'),
    center: mapVariables.center,
    zoom: mapVariables.zoom,
  }
]

describe('LoadPanelComponent', () => {
  let spectator: Spectator<LoadPanelComponent>;
  
  const createComponent = createComponentFactory({
    component: LoadPanelComponent,
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
        plansState$: of(MOCK_FLIGHT_PLANS),
        flightPlanDto: MOCK_FLIGHT_PLANS[0],
      })
    ],
    detectChanges: false,
  })

 const getPlanItems = () => spectator.queryAll('mat-card.plan-load-item') as HTMLElement[];
 const getDeleteButtons = () => spectator.queryAll('button.plan-load-item-action-delete-button') as HTMLButtonElement[];
 const getLoadButtons = () => spectator.queryAll('button.plan-load-item-action-load-button') as HTMLButtonElement[];

  beforeEach(() => {
		spectator = createComponent();
    spectator.inject(SharedDialogService).confirmed.and.returnValue(of({}));
    spectator.inject(FlightPlanService).getFlightPlans.and.returnValue([ ...MOCK_FLIGHT_PLANS]);
    spectator.detectChanges();
  });

  it('should create the app component', () => {
    expect(spectator.component).toBeTruthy();
  });

	describe('when flight plans are fetched', () => {
		it('should set the flight plans', () => {
			expect(spectator.inject(FlightPlanStore).setFlightPlans).toHaveBeenCalledWith(MOCK_FLIGHT_PLANS);
		});
		it('should render the flight plan details', () => {
			expect(getPlanItems()[0]).toHaveText('Wilhellm-Strasse');
			expect(getPlanItems()[0]).toHaveText('Last Updated: 2022-09-11 13:20:00');
			expect(getPlanItems()[0]).toHaveText('Flght plan for Wilhellm-Strasse');

			expect(getPlanItems()[1]).toHaveText('Caroline-Herschel-Strasse');
			expect(getPlanItems()[1]).toHaveText('Last Updated: 2022-09-11 13:20:00');
			expect(getPlanItems()[1]).toHaveText('Flght plan for Caroline-Herschel-Strasse');
		});
	});

	describe('when the user clicks the load button', () => {
		beforeEach(() => {
			spectator.inject(FlightPlanService).getFlightPlanById.and.returnValue(MOCK_FLIGHT_PLANS[0]);
			spectator.click(getLoadButtons()[0]);
		});
		it('should load the selected plan', () => {
			expect(spectator.inject(FlightPlanService).getFlightPlanById).toHaveBeenCalledWith(MOCK_FLIGHT_PLANS[0].id);
			expect(spectator.inject(FlightPlanStore).setFlightPlan).toHaveBeenCalledWith(MOCK_FLIGHT_PLANS[0])
		});
	});

	describe('when the user clicks the delete button', () => {
		it('should open a confirmation dialog', () => {
			spectator.click(getDeleteButtons()[0]);
			expect(spectator.inject(SharedDialogService).open).toHaveBeenCalledWith({
				title: 'Delete flight plan',
				description: 'Are you sure you want to remove the flight plan?'
			});
		})
		describe('and click confirm button', () => {
			beforeEach(() => {
				spectator.click(getDeleteButtons()[0]);
			});
			it('should clean the current plan', () => {
				expect(spectator.inject(FlightPlanStore).cleanFlightPlan).toHaveBeenCalled();
			});
			it('should delete the plan', () => {
				expect(spectator.inject(FlightPlanService).deletePlanById).toHaveBeenCalledWith(MOCK_FLIGHT_PLANS[0].id);
			});
		});
	});
});
