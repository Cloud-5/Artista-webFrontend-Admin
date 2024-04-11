import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { chartData } from './chartData';
import { categoryDistribution } from './chartData';
import { categoryPreferences } from './chartData';
import { revenueDistribution } from './chartData';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent implements OnInit{

  chartData = chartData;
  categoryDistribution = categoryDistribution;
  categoryPreferences = categoryPreferences;
  revenueDistribution = revenueDistribution;

  ngOnInit(): void {
      this.initCharts();
      this.initBarChart();
      this.initStackChart();
      this.initLineChart();
  }

  initCharts(){
      this.chartData.forEach(chart => {
          Highcharts.chart(
              chart.chartId,
              chart.chartData as Highcharts.Options
          );
      });
  }
  initBarChart(){
    this.categoryDistribution.forEach(chart => {
        Highcharts.chart(
            chart.chartId,
            chart.chartData as Highcharts.Options
        );
    })
  }
  initStackChart(){
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