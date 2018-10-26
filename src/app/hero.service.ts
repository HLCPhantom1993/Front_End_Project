/* 应用中的所有类都可以使用该服务来获取英雄列表，不要使用new来创建服务，而要依靠依赖注入机制把它注入到HeroesComponent
   的构造函数中 */
/* Services are a great way to share information among classes that don't know each other */
/* In HeroService, it is used to send a message to MessagesComponent */
import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs'; /* 从rxjs导入Observable和of符号 */
/* import http symbols that will be needed */
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* inject Message service to Hero Service */
import { MessageService } from './message.service';

/* operators from RxJS to build pipe for handling errors */
import { catchError, map, tap } from 'rxjs/operators';

/* Web API 期待在保存时的请求中有一个特殊的头 */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

/* @Injectable() decorator marks the class as one that participates in the DI system */
@Injectable({
  /* 在要求Angular把HeroService注入到HeroesComponent之前，必须先把这个服务提供给依赖注入系统 */
  /* 通过注册提供商来创建和交付服务，它会把服务类进行实例化以提供该服务 */
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
  private heroesUrl = 'api/heroes'; // URL to web api
  /* The HeroService could get hero data from anywhere - a web service, local storage, or a mock data source */
  /* declare a private messageService property as parameter of the ctor so that Angular will inject the singleton MessageService into that
     property when it creates the HeroService */
  /* Service-in-Service scenario: inject the MessageService into the HeroService which is injected into the HeroesComponent */
  /* 添加私有的messageService属性参数，Angular将会在创建HeroService时把MessageService的单例倒入到这个属性中 */
  /* 服务中的服务场景： MessageService注入到HeroService，而HeroService又被注入到了HeroesComponent中 */
  constructor(
    /* inject HttpClient to private attribute named http */
    private http: HttpClient,
    private messageService: MessageService) {}

  /* method to return the mock heroes */
  /* method has a synchronous signature, which implies that the HeroService can fetch heroes synchrounously */
  /* The HeroesComponent consumes the getHeroes() result as if heroes could be fetched synchrounously */
  /* when in real app, fetch heroes from a remote server rather than mock data, which is an inherently asynchronous operation */
  /* the HeroService must wait for the server to respond, getHeroes() cannot return immediately with hero data and the browser will not
     block while the service waits */
  /* use RxJS's of() function to get hero data and return them as Observable<hero[]> */
  /* getHeroes(): Observable<Hero[]> {*/ /* using Observable for HttpClient.get() returns */
    /* send the message_after_fetching the heroes */
  //  this.messageService.add('HeroService: fetched heroes');
  /*  return of(HEROES); */ /* of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes */
  /* } */

  /* GET heroes from the server */
  /* of(HEROES)会返回一个Observable<Hero[]>, 它会发出单个值，这个值就是这些模拟英雄的数组 */
  /* 获取数据之后，HeroesComponent需要向该服务看齐，必须订阅该服务的getHeroes方法以获得通知当有数据从服务中返回传递 */
  getHeroes(): Observable<Hero[]> {
    /* 从HeroService中发送一条消息 */
    /* this.messageService.add('HeroService: fetched heroes'); */
    /* By default, HttpClient.get will return a JSON object but if specified template such as <Hero[]>, i
       t will return a classified object */
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        /* use RxJS's catchError() to build a pipe to handle errors from the result of Observable */
        /* HeroService的方法将会窥探Observable的数据流，并通过log（）函数在页面底部发送一条消息 */
        /* 使用RxJS的tap操作符实现，该操作符会查看Observable中的值，tap回调不会改变值本身 */
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /* getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  } */

  /** Get hero by id and return 'undefined when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        /* Other APIs may bury the data that you want within an object, you might have to dig that data out by processing
           the Observableresult with the RxJS map operator */
        map(heroes => heroes[0]),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** Get hero by id will 404 if id not found */
  /** Web API 支持 ：baseURL/：id 的形式根据id进行数据获取 */
  getHero(id: number): Observable<Hero> {
    /** api/heroes/id */
    const url = `${this.heroesUrl}/${id}`;
    /* 返回单个可观察英雄对象而非一个可观察数组 */
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Get heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    /* URL：由搜索词组成的查询字符串 */
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}`)),
      catchError(this.handleError<Hero[]>(`searchHeroes`, []))
    );
  }

  /** POST: add a new hero to the server */
  /* 期待服务器为这个新英雄生成一个id，然后通过Observable<Hero>返回给调用者 */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      catchError(this.handleError<Hero>('addHero'))
    );
  }


  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    /* 使用http.put()把修改后的英雄保存到服务器上 */
    /* put()三个参数：URL地址，要修改的数据，选项 */
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /* since handleError() will be shared by many HeroService methods so it's generalized to meet
     their different needs */

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    /* return a error handler function */
    /* since each service method returns a different kind of Observable result,
       handleError() takes a type parameter so it can return the safe value as the
       type that the app expects */
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      /* instead of handling the error directly, returns an error handler function to
         catchError that it has configured with both the name of the operation that failed
         and a safe return value */
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}

