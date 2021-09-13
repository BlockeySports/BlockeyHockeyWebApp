import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BoxScoreComponent } from './components/boxscore/boxscore.component';
import { HomeComponent } from './components/home/home.component';
import { InfractionsListComponent } from './components/infractions-list/infractions-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RinkComponent } from './components/rink/rink.component';

const routes: Routes = [
  { path: 'u/:username', component: ProfileComponent },
  { path: 'boxscore', component: BoxScoreComponent },
  { path: 'boxscore/:uuid', component: BoxScoreComponent },
  { path: 'rink', component: RinkComponent },
  { path: 'infractions', component: InfractionsListComponent },
  { path: 'punishments', component: InfractionsListComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
