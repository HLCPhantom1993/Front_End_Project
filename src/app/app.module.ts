import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
/* Need to declare HeroesComponent before use */
/* But Angular CLI declared HeroesComponent in the AppModule when it generated the componet */
import { HeroesComponent } from './heroes/heroes.component';
/* must opt-in FormsModule as metadata so that Angular will know all the files work */
import { FormsModule } from '@angular/forms';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // <-- NgModel lives here
import { AppRoutingModule } from './app-routing.module';
/* To make HttpClient available everywhere in app */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { HeroSearchComponent } from './hero-search/hero-search.component';

/* @NgModule metadata's import's array that contains a list of external modules that app needs */
@NgModule({
  /* the order of the components in the declarations array matters and will change the route the web page displays */
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent /* HeroesComponent is declared in the @NgModule.declareations array when it is created at creation time */
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule /* use InMemoryDataService to configure the modue */,

    /* The HttpClientInMemoryWebApiModule module intercepts HTTP requests
       and returns simulated server responses */

    /* Remove it when a real server is ready to receive requests. */

    HttpClientInMemoryWebApiModule.forRoot(
      /* forRoot() configuration method accepts an InMemoryDataService class */
      InMemoryDataService,
      { dataEncapsulation: false }
    )
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
