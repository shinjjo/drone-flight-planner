import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { FlightPlanService } from 'src/services/flight-plan.service';
import { FlightPlanStore } from 'src/services/flight-plan.store';
import { SharedDialogService } from 'src/shared/dialog/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mapVariables } from 'src/assets/config';
import { BehaviorSubject, of } from 'rxjs';
import { GeoJSON } from 'ol/format';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDrawerHarness } from '@angular/material/sidenav/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { MatCardModule } from '@angular/material/card';
import { FlightPlanDto } from 'src/models/flight-plan';
import { AppComponent as HomeComponent } from '../app.component';
import { OlMapComponent } from '../map/ol-map.component';
import { LoadPanelComponent } from '../load-panel/load-panel.component';
import { ActivatedRoute } from '@angular/router';

const MOCK_FLIGHT_PLAN: FlightPlanDto = {
  name: '',
  description: '',
  lastUpdated: new Date('2022-09-11T11:20:23Z'),
  center: mapVariables.center,
  zoom: mapVariables.zoom,
};

const MOCK_FLIGHT_PLANS: FlightPlanDto[] = [
  {
    name: 'Wilhellm-Strasse',
    description: 'Flght plan for Wilhellm-Strasse',
    lastUpdated: new Date('2022-09-11T11:20:23Z'),
    center: mapVariables.center,
    zoom:  mapVariables.zoom,
  },
  {
    name: 'Caroline-Herschel-Strasse',
    description: 'Flght plan for Caroline-Herschel-Strasse',
    lastUpdated: new Date('2022-09-11T11:20:23Z'),
    center: mapVariables.center,
    zoom: mapVariables.zoom,
  }
];

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let loader: HarnessLoader;
  let planState$ = new BehaviorSubject(MOCK_FLIGHT_PLAN);
  let parameterId$ = new BehaviorSubject('');

  const createComponent = createComponentFactory({
    component: HomeComponent,
    declarations: [
      OlMapComponent, 
      LoadPanelComponent
    ],
    imports: [
      MatButtonModule,
      MatSidenavModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatCardModule,
    ],
    mocks: [
      FlightPlanService,
      SharedDialogService,
      MatSnackBar,
      ActivatedRoute,
    ],
    providers: [
      mockProvider(FlightPlanStore, {
        planState$,
        flightPlanDto: planState$.getValue(),
        plansState$: of(MOCK_FLIGHT_PLANS),
      })
    ],
  })

 const getPlanName = () => spectator.query('h3.item-plan-name');
 const getToggleButton = () => spectator.query('button.load-item-button.toggle') as HTMLButtonElement;
 const getSaveButton = () => spectator.query('button.load-item-button.save') as HTMLButtonElement;
 const getNewButton = () => spectator.query('button.load-item-button.create-new') as HTMLButtonElement;

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(FlightPlanService).getFlightPlans.and.returnValue(of(MOCK_FLIGHT_PLANS));
    spectator.inject(SharedDialogService).confirmed.and.returnValue(of({ name: 'new plan to save', description: 'new plan description' }))
    loader = TestbedHarnessEnvironment.loader(spectator.fixture)
  });

  it('should create the home component', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('when the user initiates a new map', () => {



    it('should not render a plan name', () => {
      expect(getPlanName()).toHaveText('');
    })
  
    describe('when the user clicks the save button', () => {
      it('should open input dialog', () => {
        spectator.click(getSaveButton());
        expect(spectator.inject(SharedDialogService).open).toHaveBeenCalled();
      });
      describe('and the user fills in the form and confirm', () => {
        beforeEach(() => {
          spectator.click(getSaveButton());
        })
  
        it('should set the flight plan', () => {
          expect(spectator.inject(FlightPlanStore).setFlightPlan).toHaveBeenCalledWith({
            ...MOCK_FLIGHT_PLAN,
            name: 'new plan to save',
            id: undefined,
            description: 'new plan description',
            lastUpdated: jasmine.anything(),
            vectorLayer: spectator.query(OlMapComponent)?.vectorLayer.getSource()?.getFeatures()
          });
        })
  
        it('should renew the flight plans', () => {
          expect(spectator.inject(FlightPlanStore).setFlightPlans).toHaveBeenCalled();
        });
        
        it('should save the current flight plan', () => {
          expect(spectator.inject(FlightPlanService).saveFlightPlan).toHaveBeenCalledWith({
            name: 'new plan to save',
            id: undefined,
            description: 'new plan description',
            lastUpdated: jasmine.anything(),
            vectorLayer: new GeoJSON().writeFeatures(spectator.query(OlMapComponent)?.vectorLayer.getSource()?.getFeatures() as Feature<Geometry>[]),
            zoom: JSON.stringify(MOCK_FLIGHT_PLAN.zoom),
            center: JSON.stringify(MOCK_FLIGHT_PLAN.center),
          })
          expect(spectator.inject(MatSnackBar).open).toHaveBeenCalledWith('new plan to save has been saved successfully', 'Close');
        });
      })
      
      describe('and the user clicks the cancel button', () => {
        it('should not do anything', () => {
          spectator.inject(SharedDialogService).confirmed.and.returnValue(of(false));
          spectator.click(getSaveButton());
          expect(spectator.inject(FlightPlanStore).setFlightPlan).not.toHaveBeenCalled();
        });
      })
    });
  
    describe('when the user clicks the open button', () => {
      let drawer: MatDrawerHarness
      beforeEach( async() => {
        drawer = await loader.getHarness(MatDrawerHarness);
      });
      
      it('should open the side navigation', async() => {
        expect(await drawer.isOpen()).toBe(false);
        spectator.click(getToggleButton());
        expect(await drawer.isOpen()).toBe(true);
      });
    });
  });

  describe('when the user loaded an existing plan', () =>{
    beforeEach(() => {
      planState$.next(MOCK_FLIGHT_PLANS[0]);
      spectator.detectChanges();
    });
    it('should render the plan name', () => {
      expect(getPlanName()).toHaveText('Wilhellm-Strasse');
    });

    describe('when the user clicks the new button', () => {
      beforeEach(() => {
        spectator.click(getNewButton());
      })
      it('should clean up the current flight plan', () => {
        expect(spectator.inject(FlightPlanStore).cleanFlightPlan).toHaveBeenCalled();
      });
    });
  });
});
