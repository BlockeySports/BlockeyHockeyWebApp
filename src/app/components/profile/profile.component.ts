import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { MemberService } from 'src/app/services/member.service';

import { NgxTippyService } from 'ngx-tippy-wrapper';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { DateService } from 'src/app/services/date.service';
import { PlayerStatisticService } from 'src/app/services/player-statistic.service';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { HockeyPlayerStatistic } from 'src/app/models/HockeyPlayerStatistic';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  public member: Member = {
    username: '',
  };
  public playerStatistics: HockeyPlayerStatistic[] = [];

  public isError = false;
  public errorMessage = '';

  public usernameColor = 'currentColor';
  public profilePicture = '';

  // which content to display (i.e. stats, awards, infractions)
  // show stats content by default
  public tab = 'stats';

  // subs
  private playerSub: Subscription;
  private memberSub: Subscription;
  private titleSub: Subscription;
  private tippySub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tippyService: NgxTippyService,
    private memberService: MemberService,
    private playerStatisticService: PlayerStatisticService,
    private titleService: Title,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    // set the content if specified in the url
    this.route.fragment.subscribe(data => (this.tab = data ?? 'stats')).unsubscribe();
    // get the username from the url
    this.member.username = this.getUsernameFromAddress();
    // set initial profile picture from username search for (may be changed in subscribe success)
    // this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${this.member.username}`;
    this.profilePicture = `https://mineskin.eu/helm/${this.member.username}/400.png`;
    // set the initial tab title
    this.titleService.setTitle(this.member.username + ' \u007c Blockey Hockey Network');
    // subscribe to member data
    this.memberSub = this.memberService.getMemberByUsername(this.member.username).subscribe(
      (data: Member) => {
        // set the member
        this.member = data;
        // set the username color
        this.usernameColor = this.member?.roles?.length > 0 ? this.member.roles[0].background : 'currentColor';
        // set member profile picture from uuid
        // this.profilePicture = `https://api.ashcon.app/mojang/v2/avatar/${this.member?.uuid || '13'}`;
        this.profilePicture = `https://mineskin.eu/helm/${this.member?.uuid || '13'}/400.png`;
        // set the browser tab title
        this.titleService.setTitle(this.member?.username || 'Player Not Found' + ' \u007c Blockey Hockey Network');
        // change the tab to the fragment in the url
        this.changeTab(this.tab !== 'stats' ? this.tab : '');
        // get player statistics
        this.getPlayerStatistics();
      },
      error => {
        this.isError = true;
        // set the username color
        this.usernameColor = 'currentColor';
        // console.log(error);
      }
    );
  }

  /**
   * Get the player statistics.
   */
  private getPlayerStatistics(): void {
    // get player stats (i.e. goals, assists, etc.)
    if (this.member?.uuid)
      this.playerStatisticService.getPlayerStatisticsOnProfile(this.member.uuid).subscribe(
        (playerStatistics: HockeyPlayerStatistic[]) => {
          this.playerStatistics = this.sortBySeasonType(playerStatistics);
          // console.log(this.playerStatistics);
        },
        error => {
          // console.log(error);
        }
      );
  }

  /**
   * This method simply adds a fragment onto the url when switching between tab on the page.
   * That allows the page to be reloaded and the user may remain on the same tab the left off on.
   * This also is good for bookmarking the page in a specific view.
   */
  public changeTab(tab: string): void {
    this.tab = tab || 'stats'; // default tab is stats
    if (this.member?.username) {
      this.router.navigate([`/u/${this.member.username}`], {
        relativeTo: this.route,
        fragment: tab || null,
      });
    }
  }

  /**
   * Get the date that this member was last online.
   * @param lastOnline the date that this member was last online
   */
  public getLastOnlineDate(): Date {
    return this.member?.lastOnline ? this.dateService.getDate(this.member.lastOnline) : null;
  }

  /**
   * Set the tooltips for the online/offline indicator and the last seen date
   */
  public getTippyOnlineStatus(): string {
    return this.member?.isOnline ? 'Online' : 'Offline';
  }

  public getTippyLastOnlineDate(): string {
    // get date using date service
    const date = this.getLastOnlineDate();
    // get formatted date as string
    return date ? formatDate(date, 'MMM d, y, h:mm a', 'en-US') : 'N/A';
  }

  /**
   * Calculate the win-lose ratio
   */
  public calculateWinLoseRatio(wins: number, losses: number): number {
    if (wins === undefined || losses === undefined) {
      return 0;
    }
    if (losses === 0) {
      return wins;
    }
    return wins / losses;
  }

  /**
   * Get the username from the url address
   * occurring after the last slash and before an fragments.
   */
  private getUsernameFromAddress(): string {
    const url = window.location.href;
    const lastSlash = url.lastIndexOf('/');
    // in case a fragment exists in url, only take everything before that
    return url.substr(lastSlash + 1).split('#')[0];
  }

  search(name: string): void {
    this.router.navigate([`/u/${name}`]);
  }

  /**
   * Sort the player statistics by season type.
   */
  private sortBySeasonType(playerStatistics: HockeyPlayerStatistic[]): HockeyPlayerStatistic[] {
    // Use a custom comparator function to specify the sort order
    return playerStatistics.sort((o1: HockeyPlayerStatistic, o2: HockeyPlayerStatistic) => {
      // regular season first
      if (o1?.filter?.seasonType?.value === 3 && o2?.filter?.seasonType?.value !== 3) {
        return -1;
      } else if (o1?.filter?.seasonType?.value !== 3 && o2?.filter?.seasonType?.value === 3) {
        return 1;
      }
      // postseason next
      if (o1?.filter?.seasonType?.value === 4 && o2?.filter?.seasonType?.value !== 4) {
        return -1;
      } else if (o1?.filter?.seasonType?.value !== 4 && o2?.filter?.seasonType?.value === 4) {
        return 1;
      }
      // all-star next
      if (o1?.filter?.seasonType?.value === 5 && o2?.filter?.seasonType?.value !== 5) {
        return -1;
      } else if (o1?.filter?.seasonType?.value !== 5 && o2?.filter?.seasonType?.value === 5) {
        return 1;
      }
      // preseason next
      if (o1?.filter?.seasonType?.value === 2 && o2?.filter?.seasonType?.value !== 2) {
        return -1;
      } else if (o1?.filter?.seasonType?.value !== 2 && o2?.filter?.seasonType?.value === 2) {
        return 1;
      }
      // exhibition last
      if (o1?.filter?.seasonType?.value === 1 && o2?.filter?.seasonType?.value !== 1) {
        return 1;
      } else if (o1?.filter?.seasonType?.value !== 1 && o2?.filter?.seasonType?.value === 1) {
        return -1;
      }
      // otherwise, leave the order unchanged
      return 0;
    });
  }

  ngOnDestroy(): void {
    if (this.memberSub) {
      this.memberSub.unsubscribe();
    }
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
    if (this.titleSub) {
      this.titleSub.unsubscribe();
    }
    if (this.tippySub) {
      this.tippySub.unsubscribe();
    }
  }
}
