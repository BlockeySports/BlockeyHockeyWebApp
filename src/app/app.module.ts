// Modules
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { FilterService, GridAllModule } from '@syncfusion/ej2-angular-grids';

// Services
import { CookieService } from 'ngx-cookie-service';

// Components
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StatsComponent } from './components/profile/stats/stats.component';
import { InfractionsComponent } from './components/profile/infractions/infractions.component';
import { TrophiesComponent } from './components/profile/trophies/trophies.component';

// Pipes
import { TimeAgoPipe } from './pipes/timeago.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { HoursPipe } from './pipes/hours.pipe';
import { DaysSincePipe } from './pipes/days-since.pipe';
import { UsernamePipe } from './pipes/username.pipe';
import { LengthPipe } from './pipes/length.pipe';
import { PunishmentTypePipe } from './pipes/punishment-type.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    TimeAgoPipe,
    HeaderComponent,
    FooterComponent,
    StatsComponent,
    InfractionsComponent,
    TrophiesComponent,
    RoundPipe,
    HoursPipe,
    DaysSincePipe,
    UsernamePipe,
    LengthPipe,
    PunishmentTypePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxTippyModule,
    BrowserAnimationsModule,
    MatTabsModule,
    NgxPrettyCheckboxModule,
    GridAllModule
  ],
  providers: [CookieService, FilterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
