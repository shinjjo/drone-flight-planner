import { 
  Component, 
  NgZone, 
  AfterViewInit, 
  Input, ChangeDetectorRef, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { View, Map, Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { ScaleLine, defaults as DefaultControls} from 'ol/control';
import { defaults as DefaultInteractions } from 'ol/interaction';
import proj4 from 'proj4';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import {register}  from 'ol/proj/proj4';
import {get } from 'ol/proj'
import VectorSource from 'ol/source/Vector';
import { DrawControl } from './controls/DrawControl';
import { FlightMapConfig } from 'src/services/map-config.service';
import { mapVariables } from 'src/assets/config';
import Geometry from 'ol/geom/Geometry';
import { styleFunction } from './controls/FeatureStyle';

@Component({
  selector: 'app-map',
  templateUrl: './app-map.component.html',
  styleUrls: ['./app-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OlMapComponent implements AfterViewInit, OnChanges {

  constructor(
    private zone: NgZone, 
    private cdr: ChangeDetectorRef,
  ) { }

  @Input() center: Coordinate = [];
  @Input() zoom!: number;

  view!: View;
  map!: Map;
  vectorSource = new VectorSource({ wrapX: false })
  vectorLayer!: VectorLayer<VectorSource<Geometry>>;

  @Input() flightMapConfig?: FlightMapConfig;
  
  ngAfterViewInit():void {
    if (!this.map) {
      this.zone.runOutsideAngular(() => this.initMap())
    } 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flightMapConfig'].currentValue && changes['flightMapConfig'].previousValue) {
      this.loadMap();
    }
  }

  private initMap(): void{
    proj4.defs(mapVariables.projectionName, mapVariables.projectionDefinition);
    register(proj4)

    const projection = get(mapVariables.projectionName) as Projection;
    projection.setExtent(mapVariables.extent);
    this.view = new View({
      center: mapVariables.center,
      zoom: mapVariables.zoom,
      projection
    });

    this.vectorLayer = new VectorLayer({ source: this.vectorSource, style: styleFunction });
    this.map = new Map({
      layers: [mapVariables.raster, this.vectorLayer],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({}),
      ]),
      interactions: DefaultInteractions()
    }) 

    if (this.flightMapConfig?.vectorLayer) {
      this.vectorLayer.getSource()?.addFeatures(this.flightMapConfig.vectorLayer);
    }

    const drawControl = new DrawControl(this.map, this.vectorSource, {});
    this.map.addControl(drawControl);
  }

  private loadMap(): void {
    this.vectorSource.clear();
    if (this.flightMapConfig?.vectorLayer){
      this.vectorSource.addFeatures(this.flightMapConfig?.vectorLayer);
    } 

    this.vectorLayer = new VectorLayer({ source: this.vectorSource, style: styleFunction });
    this.map.getView().setCenter(this.flightMapConfig?.center || mapVariables.center);
    this.map.getView().setZoom(this.flightMapConfig?.zoom || mapVariables.zoom);
    this.map.setLayers([mapVariables.raster, this.vectorLayer]);
    this.cdr.markForCheck();
  }
}
