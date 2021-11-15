// Modules
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'headlessui-angular';
import { ClipboardModule } from 'ngx-clipboard';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

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
import { InformationComponent } from './components/boxscore/information/information.component';
import { ScoringSummaryComponent } from './components/boxscore/scoring-summary/scoring-summary.component';
import { GoalsComponent } from './components/boxscore/goals/goals.component';
import { ScoresComponent } from './components/scores/scores.component';
import { GamesComponent } from './components/profile/games/games.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { BoxScoreStatsComponent } from './components/boxscore/stats/stats.component';

// Pipes
import { TimeAgoPipe } from './pipes/timeago.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { HoursPipe } from './pipes/hours.pipe';
import { MinutesPipe } from './pipes/minutes.pipe';
import { DaysSincePipe } from './pipes/days-since.pipe';
import { UsernamePipe } from './pipes/username.pipe';
import { LengthPipe } from './pipes/length.pipe';
import { PunishmentTypePipe } from './pipes/punishment-type.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { SignedPipe } from './pipes/signed.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

// Font Awesome Icons
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCaretRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

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
        InfractionsListComponent,
        InformationComponent,
        ScoringSummaryComponent,
        GoalsComponent,
        DurationPipe,
        ScoresComponent,
        CapitalizePipe,
        SignedPipe,
        TruncatePipe,
        GamesComponent,
        LeaderboardComponent,
        BoxScoreStatsComponent
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
        ClipboardModule,
        FontAwesomeModule
    ],
    providers: [CookieService],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(library: FaIconLibrary) {
        library.addIcons(faYoutube, faExternalLinkAlt, faCaretRight);
    }
}
