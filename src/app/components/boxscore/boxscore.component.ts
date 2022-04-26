import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreService } from 'src/app/services/box-score.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { TeamService } from 'src/app/services/team.service';
import { HockeyTeam } from 'src/app/models/HockeyTeam';
import { DateService } from 'src/app/services/date.service';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { PlayerLeaderboard } from 'src/app/models/PlayerLeaderboard';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';
import { PlayerStatisticService } from 'src/app/services/player-statistic.service';
import { HockeyPlayerStatistic } from 'src/app/models/HockeyPlayerStatistic';

@Component({
  selector: 'app-boxscore',
  templateUrl: './boxscore.component.html',
})
export class BoxScoreComponent implements OnInit, OnDestroy {
  public isReadOnly = true;
  public pending = true;
  public boxScore: BoxScore = {
    id: '',
  };

  public teams: HockeyTeam[];
  public playerStatistics: HockeyPlayerStatistic[] = [];
  public playerStandings: PlayerLeaderboard[] = [];

  // subs
  public boxScoreSubscription: Subscription;
  public playerStatisticsSub: Subscription;
  public teamSubscription: Subscription;

  constructor(
    private boxScoreService: BoxScoreService,
    private statisticsService: PlayerStatisticService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    // get the username from the url
    this.boxScore.id = this.getBoxScoreIdFromURL();
    // if id is null, return
    if (!this.boxScore.id) {
      return;
    }
    // set temporary tab title
    document.title = 'Loading Box Score... | Blockey Hockey Network';
    // subscribe to the box score data
    this.boxScoreSubscription = this.boxScoreService
      .getBoxScore(this.boxScore.id)
      .subscribe(
        (data: BoxScore) => {
          this.boxScore = data;
          this.applyShiftsAndIceTimeRecords();
          console.log(this.boxScore);
          // no longer pending
          this.pending = false;
          // set tab title to team codes
          if (data) {
            document.title =
              this.boxScore?.awayTeam?.code +
              ' @ ' +
              this.boxScore?.homeTeam?.code +
              ' | ' +
              this.getBoxScoreDate() +
              ' | Blockey Hockey Network';
          } else {
            document.title = 'Box Score Not Found | Blockey Hockey Network';
          }
        },
        (error) => {
          // set tab title to error
          document.title = 'Error Loading Box Score | Blockey Hockey Network';
          console.log(error);
        }
      );

    this.playerStatisticsSub = this.statisticsService
      .getPlayerStatistics(this.boxScore)
      .subscribe(
        (data: HockeyPlayerStatistic[]) => {
          this.playerStatistics = data;
          // console.log(this.playerStatistics);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * Loop through each shift, ice time record, goal, etc. and add them to the
   * corresponding box score player's arrays.
   */
  private applyShiftsAndIceTimeRecords(): void {
    // for each shift in the box score, add the shift to the corresponding player
    this.boxScore?.shifts?.forEach((shift) => {
      // get the player with the same id as the shift's player id
      const player = this.boxScore?.players?.find(
        (p) => p?.id === shift?.player?.id
      );
      // if the player is found, add the shift to the player
      if (player) player.shifts.push(shift);
    });
    // for each ice time record in the box score, add the itr to the corresponding shift
    this.boxScore?.iceTimeRecords?.forEach((itr) => {
      // get the shift with the same id as the itr's shift id
      const shift = this.boxScore?.shifts?.find(
        (s) => s?.id === itr?.shift?.id
      );
      // if the shift is found, add the itr to the shift
      if (shift) shift.iceTimeRecords.push(itr);
    });
    // for each goal in the box score, set the goal's scorer, assists, etc. to the corresponding box score player.
    this.boxScore?.goals?.forEach((goal) => {
      // set the goal scorer
      goal.goalScorer = this.boxScore?.iceTimeRecords?.find(
        (itr) => itr?.id === goal?.goalScorer?.id
      );
      if (goal.goalScorer)
        goal.goalScorer.player = this.boxScore?.players?.find(
          (p) => p?.id === goal?.goalScorer?.player?.id
        );
      // set the primary assistant
      goal.primaryAssistant = this.boxScore?.iceTimeRecords?.find(
        (itr) => itr?.id === goal?.primaryAssistant?.id
      );
      if (goal.primaryAssistant)
        goal.primaryAssistant.player = this.boxScore?.players?.find(
          (p) => p?.id === goal?.primaryAssistant?.player?.id
        );
      // set the secondary assistant
      goal.secondaryAssistant = this.boxScore?.iceTimeRecords?.find(
        (itr) => itr?.id === goal?.secondaryAssistant?.id
      );
      if (goal.secondaryAssistant)
        goal.secondaryAssistant.player = this.boxScore?.players?.find(
          (p) => p?.id === goal?.secondaryAssistant?.player?.id
        );
      // set the own goal scorer
      goal.ownGoalScorer = this.boxScore?.iceTimeRecords?.find(
        (itr) => itr?.id === goal?.ownGoalScorer?.id
      );
      if (goal.ownGoalScorer)
        goal.ownGoalScorer.player = this.boxScore?.players?.find(
          (p) => p?.id === goal?.ownGoalScorer?.player?.id
        );
      // set the goaltender
      goal.goaltender = this.boxScore?.iceTimeRecords?.find(
        (itr) => itr?.id === goal?.goaltender?.id
      );
      if (goal.goaltender)
        goal.goaltender.player = this.boxScore?.players?.find(
          (p) => p?.id === goal?.goaltender?.player?.id
        );
    });
  }

  /**
   * Get the date from the box score from the date service.
   */
  public getDate(): Date {
    return this.dateService.getDate(this.boxScore.date);
  }

  /**
   * Get the box score date in a human-readable format.
   */
  public getBoxScoreDate(): string {
    // if pending box score information, return empty string
    if (this.pending || !this.boxScore?.date) {
      return '';
    }
    dayjs.extend(localizedFormat);
    return dayjs(this.getDate()).format('MMM D, YYYY');
  }

  /**
   * Get the box score uuid from the url address
   * occurring after the last slash and before an fragments.
   */
  private getBoxScoreIdFromURL(): string {
    // get the 13 character code after the word 'boxscore' or 'b' in the url
    const uuid = window.location.href?.split('b/')[1]?.split('#')[0];
    // if the uuid is not 13 characters, return null
    if (!uuid || uuid.length !== 13) {
      return null;
    }
    // return the uuid
    return uuid;
  }

  public getPlayers(team: string = 'away' || 'home'): BoxScorePlayer[] {
    // if box score is not loaded, return empty array
    if (!this.boxScore?.players) {
      return [];
    }
    // return the players for the specified team
    return this.boxScore?.players.filter((player) =>
      player.shifts
        .flatMap((shift) => shift.team.toLowerCase())
        .includes(team.toLowerCase())
    );
  }

  public ngOnDestroy(): void {
    if (this.boxScoreSubscription) {
      this.boxScoreSubscription.unsubscribe();
    }
    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }
  }
}
