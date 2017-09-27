import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SummaryService } from "providers/summary.service";

import { Chart, ChartConfiguration, ChartDataSets } from "chart.js";

const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

@Component({
  selector: "summary-chart",
  templateUrl: "./summary-chart.component.html",
  styleUrls: ["./summary-chart.component.scss"]
})
export class SummaryChartComponent implements OnInit {
  
  @ViewChild("summaryChart")
  chartEl: ElementRef;

  private classFeeDataSet: ChartDataSets;
  private privateFeeDataSet: ChartDataSets;
  private paymentsDataSet: ChartDataSets;

  private chart: Chart;
  private chartConfig: ChartConfiguration;

  constructor(private summaryService: SummaryService) {
    this.classFeeDataSet = {
      label: "Class Fees",
      backgroundColor: "#673AB7",
      data: []
    };

    this.privateFeeDataSet = {
      label: "Private Fees",
      backgroundColor: "#E91E63",
      data: []
    };

    this.paymentsDataSet = {
      label: "Payments",
      borderColor: "#4CAF50",
      fill: false,
      data: [],
      type: "line"
    };

    this.chartConfig = {
      type: "bar",      
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [this.paymentsDataSet, this.classFeeDataSet, this.privateFeeDataSet]
      },
      options: {
        responsive: true,
        legend: { display: false },
        scales: {
          xAxes: [ { stacked: true } ],
          yAxes: [ { stacked: true } ]
        }
      }
    };
  }

  ngOnInit() {
    this.chart = new Chart(this.chartEl.nativeElement, this.chartConfig);

    this.summaryService.getSummaryData().subscribe(summary => {
      this.classFeeDataSet.data = months.map(month => summary.class[2017][month]);
      this.privateFeeDataSet.data = months.map(month => summary.private[2017][month]);
      
      this.paymentsDataSet.data = months.map(month => summary.payment[2017][month]);

      this.chart.update();
    });
  }

}
