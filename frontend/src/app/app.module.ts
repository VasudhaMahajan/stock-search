import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewsModalComponent } from './modals/news-modal/news-modal.component';
import { AppNavBarComponent } from './app-nav-bar/app-nav-bar.component';
import { MatIconModule } from '@angular/material/icon'
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartComponent } from 'highcharts-angular';
import { PortfolioModalComponent } from './modals/portfolio-modal/portfolio-modal.component';
import { NewscardComponent } from './newscard/newscard.component';
import { NetworkInterceptor } from './network.interceptor';
import { FooterComponent } from './footer/footer.component';
import { SmaHighchartComponent } from './charts/sma-highchart/sma-highchart.component';
import { RecommendationHighchartComponent } from './charts/recommendation-highchart/recommendation-highchart.component';
import { HistoricHighchartComponent } from './charts/historic-highchart/historic-highchart.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    WatchlistComponent,
    PortfolioComponent,
    NewsModalComponent,
    AppNavBarComponent,
    PortfolioModalComponent,
    NewscardComponent,
    FooterComponent,
    SmaHighchartComponent,
    RecommendationHighchartComponent,
    HistoricHighchartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule,
    NgbModule,
    ShareButtonsModule,
    ShareIconsModule,
    MatIconModule,
    HighchartsChartModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,
    },
 ],
  bootstrap: [AppComponent],
  entryComponents: [
    NewsModalComponent,
    PortfolioComponent
  ]
})
export class AppModule { }
