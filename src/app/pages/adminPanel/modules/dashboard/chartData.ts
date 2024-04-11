import { CardLineChart } from "../../../../shared/interfaces/cardLineChart"
import { ChartOptions } from 'highcharts'

export const chartData: CardLineChart[] = [
    {
        title: 'User Registrations',
        chartId: 'userRegistrations',
        value: 1043,
        chartData: {
            chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
            title: { text: '' },
            series: [{ type: 'line', name: '', data: [1, 2, 3, 2, 5, 6, 10, 8] }],
            legend: { enabled: false },
            credits: { enabled: false },
            plotOptions: { series: { color: '', showInLegend: false } }
        }
    },
    {
        title: 'Uploaded Creations',
        chartId: 'uploadedCreations',
        value: 103,
        chartData: {
            chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
            title: { text: '' },
            series: [{ type: 'line', name: '', data: [10, 20, 3, 20, 6, 6, 10, 14] }],
            legend: { enabled: false },
            credits: { enabled: false },
            plotOptions: { series: { color: '', showInLegend: false } }
        }
    },
    {
        title: 'Approved Artists',
        chartId: 'approvedArtists',
        value: 13,
        chartData: {
            chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
            title: { text: '' },
            series: [{ type: 'line', name: '', data: [1, 0, 2, 3, 1, 1, 1, 4] }],
            legend: { enabled: false },
            credits: { enabled: false },
            plotOptions: { series: { color: '', showInLegend: false } }
        }
    },
    {
        title: 'Registered Customers',
        chartId: 'registeredCustomers',
        value: 90,
        chartData: {
            chart: { type: 'line', backgroundColor: 'transparent', spacingBottom: 2, spacingTop: 0, spacingLeft: 2, spacingRight: 2, margin: [0, 4, 0, 4] },
            title: { text: '' },
            series: [{ type: 'line', name: '', data: [3, 2, 10, 33, 5, 23, 10, 14] }],
            legend: { enabled: false },
            credits: { enabled: false },
            plotOptions: { series: { color: '', showInLegend: false } }
        }
    },

]

export const categoryDistribution = [
    {
        title: 'Art Category Distribution',
        chartId: 'artCategoryDistribution',
        chartData: {
            title: {
                text: ''
            },
            chart: {
                type: 'column',
            },
            xAxis: {
                type: 'category',
                title: {
                    text: 'Art Categories'
                },
                labels: {
                    autoRotation: [-45, -90],
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
                categories: ['Abstract', 'Portrait', 'Landscape', 'Digital Art', 'Still Life', 'Surrealism'],
                visible: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Artwork Count'
                },
                visible: true
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Artwork Count: <b>{point.y}</b>'
            },
            series: [{
                name: 'Artwork Count',
                colors: ['#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3'],
                colorByPoint: true,
                groupPadding: 0,
                data: [
                    ['Abstract', 23],
                    ['Portrait', 90],
                    ['Landscape', 80],
                    ['Digital Art', 13],
                    ['Still Life', 48],
                    ['Surrealism', 40],
                ],
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y}', // Displaying whole number
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        }
    }
]

export const categoryPreferences = [
    {
        title: 'Category Preferences',
        chartId: 'categoryPreferences',
        chartData: {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['Abstract', 'Portrait', 'Landscape', 'Digital Art', 'Still Life', 'Surrealism']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Engagement Count'
                },
                stackLabels: {
                    enabled: true
                }
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
                shadow: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'Likes',
                    data: [150, 120, 10, 30, 40, 34]
                },
                {
                    name: 'Comments',
                    data: [30, 25, 11, 35, 54, 21]
                }
            ]
        }
    }
]

export const revenueData = [
    { period: 'Jan 2024', revenue: 1500 },
    { period: 'Feb 2024', revenue: 2400 },
    { period: 'March 2024', revenue: 800 },
    { period: 'April 2024', revenue: 135 },
    { period: 'May 2024', revenue: 200 },
    { period: 'June 2024', revenue: 3200 },
    { period: 'July 2024', revenue: 1900 },
    { period: 'Aug 2024', revenue: 1500 },
    { period: 'Sept 2024', revenue: 1500 },
    { period: 'Oct 2024', revenue: 1450 },
    { period: 'Nov 2024', revenue: 1000 },
    { period: 'Dec 2024', revenue: 1300 },
]

export const revenueDistribution = [
    {
        title: 'Revenue Distribution',
        chartId: 'revenueDistribution',
        chartData: {
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: revenueData.map(item => item.period),
                title: {
                    text: 'Period',
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Revenue',
                },
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
            credits: {
                enabled: false,
            },
            tooltip: {
                shared: true,
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true,
                    },
                    enableMouseTracking: true,
                },
            },
            series: [
                {
                    name: 'Revenue',
                    data: revenueData.map(item => item.revenue),
                },
            ],
        }
    }
]