import { Component, OnInit } from '@angular/core';
/* import Hero user defined class */
import { Hero } from '../hero';
/* import HEROES array */
/* import { HEROES } from '../mock_heroes'; */

/* using HeroService instead of HEROES */
import { HeroService } from '../hero.service';

/* 组件不应该直接获取或保存数据，不应该了解是否在展示假数据，而应该聚焦于展示数据，
   把数据访问的指责委托给某个服务 */

/* decorator function that specifies the Angular metadata for the component */
@Component({
  /* three metadata properties */
  selector: 'app-heroes', /* the component's CSS element selector */
  /* app-heroes matches the name of the HTML element that identifies this component within a parent component's template */
  templateUrl: './heroes.component.html', /* the location of the component's template file */
  styleUrls: ['./heroes.component.css'] /* the location of the component's private CSS styles */
})

/* always export the component class so that you can import it elsewhere */
/* 声明一个私有heroService属性，并把它标记为一个HeroService的注入点 */
/* 当Angular创建HeroesComponent时，依赖注入系统就会把这个heroService参数设置为HeroService的单例对象 */
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
  /* selectedHero: Hero;*/ /* no assignment for the hero object since when the app starts nothing has been selected */

  /* add a private heroService parameter of type HeroService */
  /* the parameter indentifies heroService as a HeroService injection site */
  constructor(private heroService: HeroService) { }
  /* 构造函数不应该做任何事情，只做初始化操作，更不能调用某个函数来向远端服务发起HTTP请求 */
  /* when Angular creates a HeroesComponent, the DI system sets the heroService parameter to the singleton instance of HeroService */

  ngOnInit() {
    /* lifecycle hook, Angular calls ngOnInit shortly after creating a component, pure initialization logic */
    /* let Angular call ngOnInit at an appropriate time after constructing a HeroesComponent instance */
    this.getHeroes();
  }

  /* 创建函数，以从服务中获取英雄数据 */
  /* retrieve the heroes from the Service */
  getHeroes(): void {
    /* call service method each time the component wants to retrieve data */
    /* synchrounously fetch data with no Observable */
    /* assigns an array of heroes to the component's heroes property, as if the server could return heroes instantly
       or the browser could freeze the UI while it waited for the server's response */
    /* 同步假设：服务器能立即返回英雄数组，或者浏览器能在等待服务器响应时冻结界面 */
    /* this.heroes = this.heroService.getHeroes(); */

    /* asynchrounously fetch with Observable */
    /* waits for the Observable to emit the array of heroes - which could happen now or several minutes from now
       then subscribe passes the emitted array to the callback, which sets the component's heroes property */
    /* 等待Observable发出英雄数组，然后subscribe函数把这个英雄数组传给该回调函数，该函数把英雄数组赋值给组件的heroes属性 */
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  /*onSelect(hero: Hero): void {
      this.selectedHero = hero;
  }*/

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    /* 当名字非空时，处理器会用改名字创建一个类似于Hero的对象，并把它传给服务的addHero（）方法 */
    /* 当addHero保存成功时，subscribe的回调函数会收到这个新英雄并把它追加到heroes列表里 */
    /* { varName } as Object：通过变量名创建一个同Object同类的Object */
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    /* delete()方法会在HeroService对服务器的操作成功之前，先从列表中移除要删除的英雄 */
    this.heroes = this.heroes.filter(h => h !== hero);
    /* 服务不会把删除请求发送给服务器，Observable在有人订阅之前什么都不会做 */
    this.heroService.deleteHero(hero).subscribe();
  }
}
