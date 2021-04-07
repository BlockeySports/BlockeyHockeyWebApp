// Modules
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';

// Services
import { CookieService } from 'ngx-cookie-service';

// Components
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

// Pipes
import { TimeAgoPipe } from './pipes/timeago.pipe';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    TimeAgoPipe,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxTippyModule,
    BrowserAnimationsModule,
    MatTabsModule,
    NgxPrettyCheckboxModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
