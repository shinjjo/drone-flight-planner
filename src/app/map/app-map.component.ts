import {
  Component,
  NgZone,
  AfterViewInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core';
import { View, Map, Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { ScaleLine, defaults as DefaultControls } from 'ol/control';
import { defaults as DefaultInteractions } from 'ol/interaction';
import proj4 from 'proj4';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import { register } from 'ol/proj/proj4';
import { get } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { DrawControl } from './controls/DrawControl';
import Geometry from 'ol/geom/Geometry';
import { styleFunction } from './controls/FeatureStyle';
import { FlightPlanDto } from 'src/models/flight-map';
import { mapVariables } from 'src/assets/config';
import { FlightPlanStore } from 'src/services/flight-plan.store';

@Component({
  selector: 'app-map',
  templateUrl: './app-map.component.html',
  styleUrls: ['./app-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OlMapComponent implements AfterViewInit {
  view!: View;
  map!: Map;
  vectorSource = new VectorSource({ wrapX: false });
  vectorLayer!: VectorLayer<VectorSource<Geometry>>;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private planStore: FlightPlanStore
  ) {
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: styleFunction
    });
  }

  @Input() flightMapConfig?: FlightPlanDto;

  ngAfterViewInit(): void {
    if (!this.map) {
      this.zone.runOutsideAngular(() => this.initMap());
    }
    this.loadMap();
  }

  private initMap(): void {
    proj4.defs(mapVariables.projectionName, mapVariables.projectionDefinition);
    register(proj4);

    const projection = get(mapVariables.projectionName) as Projection;
    projection.setExtent(mapVariables.extent);
    this.view = new View({
      center: mapVariables.center,
      zoom: mapVariables.zoom,
      projection
    });

    this.map = new Map({
      layers: [mapVariables.raster, this.vectorLayer],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([new ScaleLine({})]),
      interactions: DefaultInteractions()
    });

    this.addDrawControl();
  }

  private loadMap(): void {
    this.planStore.planState$.subscribe((plan) => {
      this.vectorSource.clear();
      if (plan.vectorLayer) {
        this.vectorSource.addFeatures(plan.vectorLayer);
      }
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
        style: styleFunction
      });
      this.map.getView().setCenter(plan.center || mapVariables.center);
      this.map.getView().setZoom(plan.zoom || mapVariables.zoom);
      this.map.setLayers([mapVariables.raster, this.vectorLayer]);
      this.cdr.markForCheck();
    });
  }

  private addDrawControl() {
    const drawControl = new DrawControl(this.map, this.vectorSource, {});
    this.map.addControl(drawControl);
  }
}
