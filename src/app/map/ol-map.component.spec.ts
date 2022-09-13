import { MatButtonModule } from '@angular/material/button';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { FlightPlanService } from 'src/services/flight-plan.service';
import { FlightPlanStore } from 'src/services/flight-plan.store';
import { SharedDialogService } from 'src/shared/dialog/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mapVariables } from 'src/assets/config';
import { BehaviorSubject, of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FlightPlanDto } from 'src/models/flight-plan';
import { OlMapComponent } from './ol-map.component';
import { get, Projection } from 'ol/proj';
import { DrawControl } from './controls/DrawControl';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';

const MOCK_FLIGHT_PLAN: FlightPlanDto = {
	name: '',
	description: '',
	lastUpdated: new Date('2022-09-11T11:20:23Z'),
	center: mapVariables.center,
	zoom: mapVariables.zoom,
  }

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

	const getMap = () => spectator.query('#map') as HTMLElement;
	const getDrawButton = () => spectator.query('button.draw-button') as HTMLButtonElement;
	const getClearButton = () => spectator.query('button.clear-button') as HTMLButtonElement;
	const getDrawControl = () => spectator.component.map.getControls().getArray().find(control => control instanceof DrawControl);
	const getVectorLayer = () => spectator.component.map.getLayers().getArray().find(layer => layer instanceof VectorLayer);
	// const drawRectangle = ()  => {
	// 	// const mouseEvent = {
	// 	// 	type: 'click',
	// 	// 	coordinate: []
	// 	// }


	// 	spectator.click(getDrawButton()); 
	// 	const me = new MouseEvent('click', { clientX: 30, clientY: 40})
	// 	const me1 = new MouseEvent('click', { clientX: 40, clientY: 50})
	// 	const me2 = new MouseEvent('dbclick', { clientX: 50, clientY: 50})

	// 	getVectorLayer()?.dispatchEvent('click')
	// 	spectator.component.map.handleBrowserEvent(me1);
	// 	spectator.component.map.handleBrowserEvent(me2);

	// 	spectator.dispatchMouseEvent(getMap(), 'click', 30, 30, me);
	// 	spectator.dispatchMouseEvent(getMap(), 'click', 60, 30, me1);
	// 	spectator.dispatchMouseEvent(getMap(), 'click', 60, 60, me2);
	// 	spectator.dispatchMouseEvent(getMap(), 'click', 30, 60);
	// 	spectator.dispatchMouseEvent(getMap(), 'click', 30, 30);
	// 	spectator.dispatchMouseEvent(getMap(), 'dblClick', 20, 10);
	// };

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

		// it('should be able to draw polyline', () => {
		// 	console.log('map1',  (spectator.component.map.getLayers().getArray().find(layer => layer instanceof VectorLayer)?.getProperties()['source'] as VectorSource).getFeatures())
		// 	drawRectangle();
		// 	spectator.component.map.renderSync();

		// 	console.log('map2', (spectator.component.map.getLayers().getArray().find(layer => layer instanceof VectorLayer)?.getProperties()['source'] as VectorSource).getFeatures())

		// })

  });

	// describe('when clicking the clear icon', () => {
	// 	it('should be able to clean the flight plan', () => {
	// 		spectator.click(getDrawButton());
	// 		drawRectangle();
	// 		spectator.click(getClearButton());

			
	// 	});
	// })

});
