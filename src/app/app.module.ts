import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { OlMapComponent } from './map/app-map.component';
import { MatMenuModule } from '@angular/material/menu';
import { FlightMapConfigService } from 'src/services/map-config.service';
import { SharedDialogModule } from 'src/shared/dialog/dialog.module';
import { LoadPanelComponent } from './load-panel/load-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    OlMapComponent,
    LoadPanelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    MatCardModule,
    MatMenuModule, 
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,

    SharedDialogModule,
  ],
  bootstrap: [AppComponent],
  providers: [FlightMapConfigService],
})
export class AppModule { }
