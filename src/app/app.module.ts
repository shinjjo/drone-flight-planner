import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { OlMapComponent } from './map/app-map.component';
import { MatMenuModule } from '@angular/material/menu';
import { SharedDialogModule } from 'src/shared/dialog/dialog.module';
import { LoadPanelComponent } from './load-panel/load-panel.component';
import { FlightPlanService } from 'src/services/flight-plan.service';
import { FlightPlanStore } from 'src/services/flight-plan.store';

@NgModule({
  declarations: [AppComponent, OlMapComponent, LoadPanelComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,

    SharedDialogModule
  ],
  bootstrap: [AppComponent],
  providers: [
    FlightPlanService,
    FlightPlanStore,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000 }
    }
  ]
})
export class AppModule {}
