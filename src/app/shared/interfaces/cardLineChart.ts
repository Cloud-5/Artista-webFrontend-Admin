export interface CardLineChart {
    title: string;
    chartId: string;
    value: number;
    chartData: {
    chart: { type: string; backgroundColor: string; spacingBottom: number; spacingTop: number; spacingLeft: number; spacingRight: number; margin: number[] };
    title: { text: string };
    series: { type: string; name: string; data: number[] }[];
    legend: { enabled: boolean };
    credits: { enabled: boolean };
    plotOptions: { series: { color: string; showInLegend: boolean } };
  };
}