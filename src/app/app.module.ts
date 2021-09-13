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
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'headlessui-angular';
import { ClipboardModule } from 'ngx-clipboard';

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
import { InfractionsListComponent } from './components/infractions-list/infractions-list.component';
import { AwardsComponent } from './components/profile/awards/awards.component';
import { BoxScoreComponent } from './components/boxscore/boxscore.component';
import { RosterComponent } from './components/boxscore/roster/roster.component';
import { TeamComponent } from './components/boxscore/team/team.component';
import { RinkComponent } from './components/rink/rink.component';

// Pipes
import { TimeAgoPipe } from './pipes/timeago.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { HoursPipe } from './pipes/hours.pipe';
import { MinutesPipe } from './pipes/minutes.pipe';
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
    AwardsComponent,
    RoundPipe,
    HoursPipe,
    MinutesPipe,
    DaysSincePipe,
    UsernamePipe,
    LengthPipe,
    PunishmentTypePipe,
    BoxScoreComponent,
    RosterComponent,
    TeamComponent,
    RinkComponent,
    InfractionsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxTippyModule,
    FormsModule,
    BrowserAnimationsModule,
    MenuModule,
    MatTabsModule,
    NgxPrettyCheckboxModule,
    GridAllModule,
    ClipboardModule
  ],
  providers: [CookieService, FilterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
