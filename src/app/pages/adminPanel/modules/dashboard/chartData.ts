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