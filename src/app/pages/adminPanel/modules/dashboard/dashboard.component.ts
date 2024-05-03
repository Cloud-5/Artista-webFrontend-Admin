import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DashboardService } from './dashboard.service';
import { revenueDistribution } from './chartData';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent implements OnInit{

  chartData: any[] = [];
  categoryDistribution: any[] = [];
  categoryPreferences: any[] = [];
  revenueDistribution = revenueDistribution;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getDashboardData();
    this.getCategorydist();
    this.getCategoryPref();
    this.initLineChart();
  }

  getDashboardData() {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.chartData = this.generateChartData(data);
      this.initCharts();
    });
  }

  getCategorydist(){
    this.dashboardService.getDashboardData().subscribe(data => {
      this.categoryDistribution = this.generateCategoryDistribution(data);
      this.initBarChart(data);
    });
  }

  getCategoryPref(){
    this.dashboardService.getDashboardData().subscribe(data => {
      this.categoryPreferences = this.generateCategoryPreferences(data);
      this.initStackChart(data);
    });
  }

  generateChartData(data: any): any[] {
    const chartData: any[] = [];

    chartData.push({
      title: 'User Registrations',
      chartId: 'userRegistrations',
      value: data.numRegisteredUsers,
      chartData: {
        chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
        title: { text: '' },
        series: [{ type: 'line', name: '', data: data.monthlyUserRegistrations }],
        legend: { enabled: false },
        credits: { enabled: false },
        plotOptions: { series: { color: '', showInLegend: false } }
      }
    });
    chartData.push({
      title: 'Uploaded Creations',
      chartId: 'uploadedCreations',
      value: data.numUploadedCreations,
      chartData: {
        chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
        title: { text: '' },
        series: [{ type: 'line', name: '', data: data.monthlyCreations }],
        legend: { enabled: false },
        credits: { enabled: false },
        plotOptions: { series: { color: '', showInLegend: false } }
      }
    });
    chartData.push({
      title: 'Approved Artists',
      chartId: 'approvedArtists',
      value: data.numApprovedArtists,
      chartData: {
        chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
        title: { text: '' },
        series: [{ type: 'line', name: '', data: data.monthlyApprovals }],
        legend: { enabled: false },
        credits: { enabled: false },
        plotOptions: { series: { color: '', showInLegend: false } }
      }
    });
    chartData.push({
      title: 'Registered Customers',
      chartId: 'registeredCustomers',
      value: data.numRegisteredCustomers,
      chartData: {
        chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
        title: { text: '' },
        series: [{ type: 'line', name: '', data: data.monthlyRegistrations }],
        legend: { enabled: false },
        credits: { enabled: false },
        plotOptions: { series: { color: '', showInLegend: false } }
      }
    });

    return chartData;
  }

  generateCategoryDistribution(data: any): any[] {
    return [
      {
        title: 'Art Category Distribution',
        chartId: 'artCategoryDistribution',
        chartData: {
          title: { text: '' },
          chart: { type: 'column' },
          xAxis: { type: 'category', title: { text: 'Category' }, categories: data.categoryPreferences.categories},
          yAxis: { min: 0, title: { text: 'Artwork Count' },visible:true },
          legend: { enabled: false },
          credits: { enabled: false },
          tooltip: { pointFormat: 'Artwork Count: <b>{point.y}</b>' },
          series: [{
            name: 'Artwork Count',
            colors: ['#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3'],
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
              style: { fontSize: '13px', fontFamily: 'Verdana, sans-serif' }
            }
          }]
        }
      }
    ];
  }

  generateCategoryPreferences(data: any): any[] {
    return [
      {
        title: 'Category Preferences',
        chartId: 'categoryPreferences',
        chartData: {
          chart: { type: 'column' },
          title: { text: '' },
          xAxis: { categories: data.categoryPreferences.categories },
          yAxis: { min: 0, title: { text: 'Engagement Count' }, stackLabels: { enabled: true } },
          legend: { align: 'right', x: 0, verticalAlign: 'top', y: -10, floating: true, backgroundColor: 'white', borderColor: '#CCC', borderWidth: 1, shadow: false },
          credits: { enabled: false },
          tooltip: { headerFormat: '<b>{point.x}</b><br/>', pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}' },
          plotOptions: { column: { stacking: 'normal', dataLabels: { enabled: true } } },
          series: data.categoryPreferences.series
        }
      }
    ];
  }

  initCharts(){
      this.chartData.forEach(chart => {
          Highcharts.chart(
              chart.chartId,
              chart.chartData as Highcharts.Options
          );
      });
  }
  initBarChart(data:any){
    this.categoryDistribution = this.generateCategoryDistribution(data);
    this.categoryDistribution.forEach(chart => {
        Highcharts.chart(
            chart.chartId,
            chart.chartData as Highcharts.Options
        );
    })
  }
  initStackChart(data:any){
    this.categoryPreferences = this.generateCategoryPreferences(data);
    this.categoryPreferences.forEach(chart => {
      Highcharts.chart(
        chart.chartId,
        chart.chartData as Highcharts.Options
      );
    })
  }
  getTopCategories(chartData: any): string[] {
    const seriesData = chartData.series[0].data;
    const categoriesWithValues = chartData.xAxis.categories.map((category: any, index: string | number)=>({
      category,
      value: seriesData[index]
    }));
    const sortedCategories = categoriesWithValues.sort((a: { value: number; },b: { value: number; })=>b.value-a.value);
    const topCategories = sortedCategories.slice(0,3).map((item: any) => item.category);
    return topCategories;
  }

  initLineChart(){
    this.revenueDistribution.forEach(chart => {
      Highcharts.chart(
        chart.chartId,
        chart.chartData as Highcharts.Options
      );
    })
  }

}