import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { FlightPlanDto } from 'src/models/flight-plan';
import { FlightPlanService } from 'src/services/flight-plan.service';
import { FlightPlanStore } from 'src/services/flight-plan.store';
import { SharedDialogService } from 'src/shared/dialog/dialog.service';

@Component({
  selector: 'load-panel',
  templateUrl: './load-panel.component.html',
  styleUrls: ['./load-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadPanelComponent implements OnInit {
  constructor(
    private planService: FlightPlanService,
    private planStore: FlightPlanStore,
    private snackBar: MatSnackBar,
    private dialogService: SharedDialogService
  ) {}

  flightPlans$: Observable<FlightPlanDto[]> | undefined;

  ngOnInit(): void {
    this.fetchPlans();
  }

  private fetchPlans(): void {
    const plans = this.planService.getFlightPlans();
    this.planStore.setFlightPlans(plans);
    this.flightPlans$ = this.planStore.plansState$;
  };

  loadPlan(id: string): void {
    const plan = this.planService.getFlightPlanById(id);
    this.planStore.setFlightPlan(plan);
  };

  deletePlan(id: string): void {
    this.dialogService.open({
      title: 'Delete flight plan',
      description: 'Are you sure you want to remove the flight plan?'
    });
    this.dialogService.confirmed().subscribe(res => {
      if (res !== false) {
        if (id === this.planStore.flightPlanDto.id) {
          this.planStore.cleanFlightPlan();
        }
        this.planService.deletePlanById(id);
        this.fetchPlans();
        this.snackBar.open('The flight plan has been removed', 'Close');
      }
    });
  };
}
