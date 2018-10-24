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

/* @NgModule metadata's import's array that contains a list of external modules that app needs */
@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent /* HeroesComponent is declared in the @NgModule.declareations array when it is created at creation time */
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
