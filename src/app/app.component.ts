import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FlightMapConfig, FlightMapConfigService, FlightMapConfigStore } from 'src/services/map-config.service';
import { OlMapComponent } from './map/app-map.component';
import { GeoJSON } from 'ol/format';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { SharedDialogService } from 'src/shared/dialog/dialog.service';
import { mapVariables } from 'src/assets/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'drone-flight-planner';
  showFiller = false;
  opened = false;
  flightMapConfig?: FlightMapConfig;
  @ViewChild('appMap') mapComponent!: OlMapComponent;

  constructor(
    private configService: FlightMapConfigService,
    private dialogService: SharedDialogService,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit(): void {
    // this.changeConfig(this.configService.getLatestConfig());
  }

  save(){
    const options = {
      title: 'Save flight plan',
      content: 'This will save flight plan',
      formProps: [
        {
          name: 'name',
          type: 'string',
          required: true,
        },
        {
          name: 'description',
          type: 'string',
          required: false,
        }
      ]
    }

    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(formValue => {
      if (formValue) {
        const configToSave: FlightMapConfigStore = {
          id: this.mapComponent.flightMapConfig?.id,
          name: formValue.name,
          description: formValue.description,
          lastUpdated: new Date().toISOString(),
          vectorLayer: new GeoJSON().writeFeatures(this.mapComponent.vectorLayer.getSource()?.getFeatures() as Feature<Geometry>[]),
          center: JSON.stringify(this.mapComponent.map.getView().getCenter()),
          zoom: JSON.stringify(this.mapComponent.map.getView().getZoom())
        }
        this.configService.saveMapConfig(configToSave);

        this.cdr.markForCheck();
      }
    })
  }

  createNew(){
    const config = {
      name: '',
      lastUpdated: new Date(),
      center: mapVariables.center,
      zoom: mapVariables.zoom
    } as FlightMapConfig;
    this.changeConfig(config);
    this.cdr.markForCheck();
  }

  changeConfig = (config?: FlightMapConfig) => { 
    this.flightMapConfig = config;
    console.log('confi', config)
    this.cdr.markForCheck();
  }
}
