import { Component, OnInit } from '@angular/core';
/* import Hero user defined class */
import { Hero } from '../hero';
/* import HEROES array */
/* import { HEROES } from '../mock_heroes'; */

/* using HeroService instead of HEROES */
import { HeroService } from '../hero.service';

/* decorator function that specifies the Angular metadata for the component */
@Component({
  /* three metadata properties */
  selector: 'app-heroes', /* the component's CSS element selector */
  /* app-heroes matches the name of the HTML element that identifies this component within a parent component's template */
  templateUrl: './heroes.component.html', /* the location of the component's template file */
  styleUrls: ['./heroes.component.css'] /* the location of the component's private CSS styles */
})

/* always export the component class so that you can import it elsewhere */
export class HeroesComponent implements OnInit {

  /* add hero property */
  /* hero = 'Windstrom'; */
  /* refactor hero property to be of type Hero. Initialize it with an id of 1 and the name Windstorm */
  /*hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };*/

  /* create property to bind HEROES array */
  // heroes = HEROES;
  /* using new definition of the heroes property */
  heroes: Hero[];

  /* add event handler for each clickable hero obejct */
  selectedHero: Hero; /* no assignment for the hero object since when the app starts nothing has been selected */

  /* add a private heroService parameter of type HeroService */
  /* the parameter indentifies heroService as a HeroService injection site */
  constructor(private heroService: HeroService) { }
  /* when Angular creates a HeroesComponent, the DI system sets the heroService parameter to the singleton instance of HeroService */

  ngOnInit() {
    /* lifecycle hook, Angular calls ngOnInit shortly after creating a component, pure initialization logic */
    /* let Angular call ngOnInit at an appropriate time after constructing a HeroesComponent instance */
    this.getHeroes();
  }

  /* retrieve the heroes from the Service */
  getHeroes(): void {
    /* call service method each time the component wants to retrieve data */
    /* synchrounously fetch data with no Observable */
    /* assigns an array of heroes to the component's heroes property, as if the server could return heroes instantly
       or the browser could freeze the UI while it waited for the server's response */
    /* this.heroes = this.heroService.getHeroes(); */

    /* asynchrounously fetch with Observable */
    /* waits for the Observable to emit the array of heroes - which could happen now or several minutes from now
       then subscribe passes the emitted array to the callback, which sets the component's heroes property */
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  onSelect(hero: Hero): void {
      this.selectedHero = hero;
  }
}
