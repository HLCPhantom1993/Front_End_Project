/* Services are a great way to share information among classes that don't know each other */
/* In HeroService, it is used to send a message to MessagesComponent */
import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock_heroes';
import { Observable, of } from 'rxjs';

/* inject Message service to Hero Service */
import { MessageService } from './message.service';

/* @Injectable() decorator marks the class as one that participates in the DI system */
@Injectable({
  /* must make the HeroService available to the dependency injection system before Angular can inject it into the HeroesComponent
     by registering a provider  */

  /* A provider can create or deliver a service and it instantiates the service class to provide the service */

  /* HeroService is registered as the provider of the service by registering it with an injector, which is the object that is responsible
     for choosing and injecting the provider where it is required */
  providedIn: 'root' /* when provide service at the root level, angular creates a single, shared instance of HeroService and injects into
                        any class that asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an
                        app by removing the service if it turns out not to be used after all */
})
/* The HeroService class is going to provide an injectable service and it can also have its own injected dependencies */
export class HeroService {
  /* The HeroService could get hero data from anywhere - a web service, local storage, or a mock data source */
  /* declare a private messageService property as parameter of the ctor so that Angular will inject the singleton MessageService into that
     property when it creates the HeroService */
  /* Service-in-Service scenario: inject the MessageService into the HeroService which is injected into the HeroesComponent */
  constructor(private messageService: MessageService) { }

  /* method to return the mock heroes */
  /* method has a synchronous signature, which implies that the HeroService can fetch heroes synchrounously */
  /* The HeroesComponent consumes the getHeroes() result as if heroes could be fetched synchrounously */
  /* when in real app, fetch heroes from a remote server rather than mock data, which is an inherently asynchronous operation */
  /* the HeroService must wait for the server to respond, getHeroes() cannot return immediately with hero data and the browser will not
     block while the service waits */
  getHeroes(): Observable<Hero[]> { /* using Observable for HttpClient.get() returns */
    /* send the message_after_fetching the heroes */
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES); /* of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes */
  }

  getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id)); 
  }
}
