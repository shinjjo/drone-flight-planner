import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FlightPlanService } from 'src/services/flight-plan.service';
import { GeoJSON } from 'ol/format';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { SharedDialogService } from 'src/shared/dialog/dialog.service';
import {
  FlightPlanDto,
  FlightPlanJson,
  FlightPlanSaveForm
} from 'src/models/flight-plan';
import { FlightPlanStore } from 'src/services/flight-plan.store';
import { filter, finalize, map, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedDialogOptions } from 'src/models/shared-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OlMapComponent } from '../map/ol-map.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  @ViewChild('appMap') mapComponent!: OlMapComponent;

  planName: string;

  constructor(
    private planService: FlightPlanService,
    private planStore: FlightPlanStore,
    private dialogService: SharedDialogService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => { 
      if(params['id']) {
        const plan = this.planService.getFlightPlanById(params['id']);
        this.planStore.setFlightPlan(plan);
        this.planName = plan.name;
      }
    });
  }

  private createDto(formValue: FlightPlanSaveForm): FlightPlanDto {
    return {
      id: this.planStore.flightPlanDto.id,
      name: formValue?.name,
      description: formValue?.description,
      lastUpdated: new Date(),
      vectorLayer: this.mapComponent.vectorLayer
        .getSource()
        ?.getFeatures() as Feature<Geometry>[],
      center: this.mapComponent.map.getView().getCenter() as number[],
      zoom: this.mapComponent.map.getView().getZoom() as number
    };
  }

  private createJson(planDto: FlightPlanDto): FlightPlanJson {
    return {
      ...planDto,
      lastUpdated: planDto.lastUpdated.toISOString(),
      vectorLayer: new GeoJSON().writeFeatures(
        planDto.vectorLayer as Feature<Geometry>[]
      ),
      center: JSON.stringify(planDto.center),
      zoom: JSON.stringify(planDto.zoom)
    };
  }

  save(): void {
    const options: SharedDialogOptions = {
      title: 'Save flight plan',
      formProps: [
        {
          name: 'name',
          required: true,
          value: this.planStore.flightPlanDto.name || ''
        },
        {
          name: 'description',
          required: false,
          value: this.planStore.flightPlanDto.description || ''
        }
      ]
    };

    this.dialogService.open(options);
    this.dialogService
      .confirmed()
      .pipe(
        filter(formValue => typeof formValue !== 'boolean'),
        map((formValue) => this.createDto(formValue)),
        tap((planDto: FlightPlanDto) => {
          this.planStore.setFlightPlan(planDto);
        }),
        finalize(() =>
          this.planStore.setFlightPlans(this.planService.getFlightPlans())
        )
      )
      .subscribe((planDto: FlightPlanDto) => {
        const configToSave: FlightPlanJson = this.createJson(planDto);
        this.planService.saveFlightPlan(configToSave);
        this.snackBar.open(
          `${configToSave.name} has been saved successfully`,
          'Close'
        );
        this.cdr.markForCheck();
      });
  }

  createNew(): void {
    this.planStore.cleanFlightPlan();
    this.router.navigateByUrl('plan')
  }
}