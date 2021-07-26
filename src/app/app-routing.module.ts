import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BoxScoreComponent } from './components/boxscore/boxscore.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RinkComponent } from './components/rink/rink.component';

const routes: Routes = [
  { path: 'u/:username', component: ProfileComponent },
  { path: 'boxscore', component: BoxScoreComponent },
  { path: 'rink', component: RinkComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
