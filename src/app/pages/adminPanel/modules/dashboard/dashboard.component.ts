import { Component, OnInit, AfterViewInit,ChangeDetectionStrategy, HostListener } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DashboardService } from './dashboard.service';
import { revenueDistribution } from './chartData';
import { AlertService } from '../../../../shared/services/alert.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { UserManagementService } from '../user-management/user-management.service';

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

  trendingArtists: any[] = [];
  trendingArtworks: any[] = [];
  topCustomers:any[] = [];

  isLoading: boolean = true;
  currentIndex = 0;
  itemWidth = 25;
  gap = 10;

  currentIndex1 = 0;
  itemWidth1 = 20;
  gap1 = 10;

  selectedUser: any = {};
  socialLinks: any[] = [];
  rank:number = 0;

  constructor(private dashboardService: DashboardService, private alertService: AlertService,public modalService: ModalService,private userManagementService: UserManagementService) {}


  ngAfterViewInit(): void {
    this.getDashboardData();
    this.getCategorydist();
    this.getCategoryPref();
    this.initLineChart();
  }

  private getDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData(2024).subscribe((data) => {
      this.chartData = data;
      this.totalUsers = data.numRegisteredUsers;
      this.totalcreations = this.chartData.numUploadedCreations;
      this.appArtist = this.chartData.numApprovedArtists;
      this.regCustomers = this.chartData.numRegisteredCustomers;
      this.trendingArtists = this.chartData.trendingArtists[0];
      this.trendingArtworks = this.chartData.trendingArts[0];
      this.topCustomers = this.chartData.topCustomers[0];
      this.createChartLine(data);
      this.isLoading = false;
    }, (error) => {
      this.alertService.showMessage('An error occurred while fetching dashboard data', false, error.message);
      this.isLoading = false;
    }
  );
  }

  private getCategorydist(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData(2024).subscribe((data) => {
      this.createChartColumn(data);
      this.isLoading = false;
    });
  }

  private getCategoryPref(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData(2024).subscribe((data) => {
      this.createChartStack(data);
      this.isLoading = false;
    });
  }

  private createChartLine(data: any) {
    const monthlyApprovalsData = data.monthlyApprovals.map((item: { registrationsCount: any; }) => item.registrationsCount);
    const monthlyRegistrationsData = data.monthlyRegistrations.map((item: { registrationsCount: any; }) => item.registrationsCount);
    const chart1 = Highcharts.chart('userRegistrations', {
      chart: { type: 'area'},
      title:{ text: 'User Registrations 2024'},
      xAxis: { type: 'category', title:{ text:'Month'}, categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']},
      yAxis: { title: { text: 'Total' },  },
      tooltip: {
        pointFormat: '<b>{point.y:,.0f}</b> {series.name} have registered <br/> in {point.x}'
      },
      series: [
        { name: 'Artists', data: monthlyApprovalsData  },
        { name: 'Customers', data: monthlyRegistrationsData  }
      ],
      legend: { enabled: true },
      credits: { enabled: false },
      plotOptions: {
        pointStart: 1,
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

    const monthlyCreationsData = data.monthlyCreations.map((item: { creationsCount: any; }) => item.creationsCount);
    const chart2 = Highcharts.chart('uploadedCreations',{
      chart: {
        type: 'line',
        backgroundColor: 'white',
      },
      title: { text: 'Uploaded Artworks 2024' },
      series: [{ type: 'line', name: 'Month', data: monthlyCreationsData }],
      legend: { enabled: false },
      credits: { enabled: false },
      xAxis: { type: 'category', title:{ text:'Month'}, categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']},
      yAxis: { title: { text: 'Total' },  },
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

  next() {
    if (this.currentIndex < this.trendingArtists.length - (100 / this.itemWidth)) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateCarousel();
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.trendingArtists.length - (100 / this.itemWidth);
    }
    this.updateCarousel();
  }

  updateCarousel() {
    const carousel = document.querySelector('.carousel') as HTMLElement;
    const gapAdjustment = (this.gap / window.innerWidth) * 100;
    const translateValue = -(this.currentIndex * (this.itemWidth + gapAdjustment));
    carousel.style.transform = `translateX(${translateValue}%)`;
  }

  updateItemWidth() {
    const width = window.innerWidth;
    if (width >= 1200) {
      this.itemWidth = 25;
    } else if (width >= 992 && width < 1200) {
      this.itemWidth = 33.33;
    } else if (width >= 768 && width < 992) {
      this.itemWidth = 50;
    } else {
      this.itemWidth = 100;
    }
    this.updateCarousel();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateItemWidth();
    this.updateItemWidth1();
  }

  openUserDetailsModal(userId:string, role:string): void {
    console.log('id',userId,role)
    this.userManagementService.getUserDetails(userId, role).subscribe(
      (response: any) => {
        console.log('response',response);
        this.selectedUser = response.userDetails[0];
        console.log('selected',this.selectedUser);
        if(role === 'artist'){
          this.socialLinks = response.socialAccounts[0];
          this.rank = response.rank.featured;
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
    this.modalService.open('modal-userDetails');
  }

  updateFeaturedStatus(user_id:string){
    console.log('User ID:', user_id,'rank',this.rank);

    if(this.rank === 0){
      this.userManagementService.rankArtist(user_id).subscribe(
        (response) => {
          console.log('Artist ranked successfully:', response);
        },
        (error) => {
          console.error('Error ranking artist:', error);
        }
      );
      this.rank = 1;
    } else {
      this.userManagementService.unrankArtist(user_id).subscribe(
        (response) => {
          console.log('Artist unranked successfully:', response);
        },
        (error) => {
          console.error('Error unranking artist:', error);
        }
      );
      this.rank = 0;
    }
  }
  updateItemWidth1() {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 1200) {
      this.itemWidth1 = 20;
    } else if (windowWidth >= 992) {
      this.itemWidth1 = 25; 
    } else if (windowWidth >= 768) {
      this.itemWidth1 = 33.33; 
    } else if (windowWidth >= 576) {
      this.itemWidth1 = 50; 
    } else {
      this.itemWidth1 = 100; 
    }
    this.updateCarousel1();
  }

  prev1(){
    if(this.topCustomers.length > 0){
      this.currentIndex1--;
    } else {
      this.currentIndex1 = this.topCustomers.length - (100 / this.itemWidth1)
    }
    this.updateCarousel1();
  }
  next1(){
    if(this.currentIndex1 < this.topCustomers.length - (100 / this.itemWidth1)){
      this.currentIndex1++;
    } else {
      this.currentIndex1 = 0;
    }
    this.updateCarousel1();
  }
  updateCarousel1(){
    const carousel = document.querySelector('.carousel1') as HTMLElement;
    const gapAdjustment = (this.gap1 / window.innerWidth) * 100;
    const translateValue = -(this.currentIndex1 * (this.itemWidth1 + gapAdjustment));
    carousel.style.transform = `translateX(${translateValue}%)`;
  }
}

