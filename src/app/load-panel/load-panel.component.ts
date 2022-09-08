import { EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FlightMapConfig, FlightMapConfigService } from "src/services/map-config.service";

@Component({
  selector: 'load-panel',
  templateUrl: './load-panel.component.html',
	styleUrls: ['./load-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadPanelComponent implements OnInit {
	configs!: FlightMapConfig[]
		
	@Output() changeConfig = new EventEmitter<FlightMapConfig>();
	@Output() renewConfig = new EventEmitter();

	constructor(
		private configService: FlightMapConfigService,
    	private cdr: ChangeDetectorRef,
	){}

	ngOnInit(): void {
    this.renewConfigs()

	}

	loadConfig = (id: string) => { 
		const config = this.configService.getMapConfigById(id);
		this.changeConfig.emit(config);
	}

	deleteConfig = (id: string) => {
		this.configService.deleteMapConfigById(id);
		this.changeConfig.emit();
	}

	renewConfigs = () => {
		this.configs = this.configService.getMapConfigs();
		this.cdr.markForCheck();
		this.renewConfig.emit();
	}
}