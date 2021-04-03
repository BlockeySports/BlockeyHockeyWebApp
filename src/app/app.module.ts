// Modules
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

// Components
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/test/profile.component';
import { HomeComponent } from './components/home/home.component';

// Pipes
import { TimeAgoPipe } from './pipes/timeago.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxTippyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
