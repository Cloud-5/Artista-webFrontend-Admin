import { Component, OnInit, AfterViewInit,ChangeDetectionStrategy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DashboardService } from './dashboard.service';
import { revenueDistribution } from './chartData';
import { title } from 'process';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements AfterViewInit {

  Highcharts: typeof Highcharts = Highcharts;

  chartData: any;
  categoryDistribution: any[] = [];
  categoryPreferences: any[] = [];
  revenueDistribution = revenueDistribution;
  topCategories: string[] = [];

  totalUsers:number | undefined;
  totalcreations:number | undefined;
  appArtist:number | undefined;
  regCustomers: number | undefined

  constructor(private dashboardService: DashboardService) {}


  ngAfterViewInit(): void {
    this.getDashboardData();
    this.getCategorydist();
    this.getCategoryPref();
    this.initLineChart();
  }

  private getDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.chartData = data;
      this.totalUsers = data.numRegisteredUsers;
      this.totalcreations = this.chartData.numUploadedCreations;
      this.appArtist = this.chartData.numApprovedArtists;
      this.regCustomers = this.chartData.numRegisteredCustomers;
      console.log(this.chartData);
      this.createChartLine(data);
    });
  }

  private getCategorydist(): void {
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.createChartColumn(data);
    });
  }

  private getCategoryPref(): void {
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.createChartStack(data);
    });
  }

  private createChartLine(data: any) {
    const chart1 = Highcharts.chart('userRegistrations', {
      chart: {
        type: 'area',
        spacingBottom: 2,
        spacingTop: 0,
        spacingLeft: 2,
        spacingRight: 2,
        margin: [0, 4, 0, 4],
      },
      xAxis: {
        type: 'category',
        title:{
          text:'Month'
        },
        categories: ['03','04','05','06','07','08','09','10']
      },
      yAxis: {
        title: {
          text: 'Total'
        }
      },
      title: { text: '' },
      series: [
        { name: '', data: data.monthlyUserRegistrations },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        pointStart: 3,
        marker: {
          enabled:false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    } as any);
    const chart2 = Highcharts.chart('uploadedCreations',{
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        spacingBottom: 2,
        spacingTop: 0,
        spacingLeft: 2,
        spacingRight: 2,
        margin: [0, 4, 0, 4],
      },
      title: { text: '' },
      series: [{ type: 'line', name: '', data: data.monthlyCreations }],
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: { series: { color: '', showInLegend: false } },
    } as any);
    const chart3 = Highcharts.chart('approvedArtists',{
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        spacingBottom: 2,
        spacingTop: 0,
        spacingLeft: 2,
        spacingRight: 2,
        margin: [0, 4, 0, 4],
      },
      title: { text: '' },
      series: [{ type: 'line', name: '', data: data.monthlyApprovals }],
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: { series: { color: '', showInLegend: false } },
    } as any);
    const chart4 = Highcharts.chart('registeredCustomers',{
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        spacingBottom: 2,
        spacingTop: 0,
        spacingLeft: 2,
        spacingRight: 2,
        margin: [0, 4, 0, 4],
      },
      title: { text: '' },
      series: [{ type: 'line', name: '', data: data.monthlyRegistrations }],
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: { series: { color: '', showInLegend: false } },
    } as any);
  }

  private createChartColumn(data: any): void {
    const chart = Highcharts.chart('artCategoryDistribution', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Art Category Distribution',
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Category',
        },
        categories: data.categoryPreferences.categories,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Artwork Count',
        },
        visible: true,
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: 'Artwork Count: <b>{point.y}</b>',
      },
      series: [
        {
          name: 'Artwork Count',
          colors: [
            '#9b20d9',
            '#9215ac',
            '#861ec9',
            '#7a17e6',
            '#7010f9',
            '#691af3',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: data.artCategoryDistribution,
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y}',
            y: 10,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif',
            },
          },
        },
      ],
    } as any);
  }

  private createChartStack(data: any): void {

    
    const chart = Highcharts.chart('categoryPreferences', {
      chart: { type: 'column' },
      title: { text: 'Category Preferences' },
      xAxis: {
        type: 'category',
        title: { text: '' },
        categories: data.categoryPreferences.categories,
      },
      yAxis: {
        min: 0,
        title: { text: 'Engagement Count' },
        stackLabels: { enabled: true },
      },
      legend: {
        align: 'right',
        x: 0,
        verticalAlign: 'top',
        y: -10,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
      },
      credits: { enabled: false },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      },
      plotOptions: {
        column: { stacking: 'normal', dataLabels: { enabled: true } },
      },
      series: data.categoryPreferences.series,
    } as any);

    this.topCategories = this.getTopCategories(data.categoryPreferences);
  }

  getTopCategories(chartData: any): string[] {
    const seriesData = chartData.series[0].data;
    const categoriesWithValues = chartData.categories.map(
      (category: any, index: string | number) => ({
        category,
        value: seriesData[index],
      })
    );
    const sortedCategories = categoriesWithValues.sort(
      (a: { value: number }, b: { value: number }) => b.value - a.value
    );

    const topCategories = sortedCategories
      .slice(0, 3)
      .map((item: any) => item.category);
    return topCategories;
  }

  initLineChart() {
    this.revenueDistribution.forEach((chart) => {
      Highcharts.chart(chart.chartId, chart.chartData as Highcharts.Options);
    });
  }
}
