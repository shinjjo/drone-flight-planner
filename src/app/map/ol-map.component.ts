import {
  Component,
  NgZone,
  AfterViewInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { View, Map } from 'ol';
import { ScaleLine, defaults as DefaultControls } from 'ol/control';
import { defaults as DefaultInteractions } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import { get } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { DrawControl } from './controls/DrawControl';
import Geometry from 'ol/geom/Geometry';
import { styleFunction } from './controls/FeatureStyle';
import { FlightPlanDto } from 'src/models/flight-plan';
import { mapVariables } from 'src/assets/config';
import { FlightPlanStore } from 'src/services/flight-plan.store';

@Component({
  selector: 'ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OlMapComponent implements AfterViewInit {

  private vectorSource = new VectorSource({ wrapX: false });
  private view!: View;

  map!: Map;
  vectorLayer!: VectorLayer<VectorSource<Geometry>>;

  @Input() flightMapConfig?: FlightPlanDto;

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

  ngAfterViewInit(): void {
    if (!this.map) {
      this.zone.runOutsideAngular(() => this.initMap());
    }
    this.loadMap();
  }

  private initMap(): void {
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
