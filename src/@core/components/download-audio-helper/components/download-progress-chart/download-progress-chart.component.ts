import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {colors} from "../../../../../app/colors.const";

@Component({
	selector: "app-download-progress-chart",
	templateUrl: "./download-progress-chart.component.html",
	styleUrls: ["./download-progress-chart.component.scss"]
})
export class DownloadProgressChartComponent implements OnInit, OnChanges {
	@ViewChild("progressChart", {static: false}) progressChart;
	@Input() totalProgress: number;
	goalChartoptions: any;
	chartData =  {
		series: [0],
		batches: {
			total: 0,
			current: 0,
			completed: 0,
			currentProgress: 0
		}
	};
	constructor() { }

	ngOnInit(): void {
		this.goalChartoptions = {
			chart: {
				height: 70,
				type: "radialBar",
				sparkline: {
					enabled: true
				},
				dropShadow: {
					enabled: true,
					blur: 3,
					left: 1,
					top: 1,
					opacity: 0.1
				}
			},
			colors: ["#51e5a8"],
			plotOptions: {
				radialBar: {
					offsetY: -10,
					startAngle: -150,
					endAngle: 150,
					hollow: {
						size: "77%"
					},
					track: {
						background: "#ebe9f1",
						strokeWidth: "50%"
					},
					dataLabels: {
						name: {
							show: false
						},
						value: {
							color: "#5e5873",
							fontSize: "2.86rem",
							fontWeight: "600"
						}
					}
				}
			},
			fill: {
				type: "gradient",
				gradient: {
					shade: "dark",
					type: "horizontal",
					shadeIntensity: 0.5,
					gradientToColors: [colors.solid.success],
					inverseColors: true,
					opacityFrom: 1,
					opacityTo: 1,
					stops: [0, 100]
				}
			},
			stroke: {
				lineCap: "round"
			},
			grid: {
				padding: {
					bottom: 30
				}
			}
		};
	}

	ngOnChanges(changes:SimpleChanges): void {
		if(changes.totalProgress && changes.totalProgress.currentValue) {
			this.progressChart.updateSeries([changes.totalProgress.currentValue]);
		}
	}
}
