import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  /* 声明searchTerms属性为RxJS的subject类型，subject是可观察对象的数据源，本身也是Observable */
  private searchTerms = new Subject<string>();
  /* searchTerms为一个能发出搜索词的稳定的流 */

  constructor(private heroService: HeroService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    /* 调用next(value)方法向Observable中推送数值 */
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    /* 如果每当用户击键后就直接调用searchHeroes（）将导致创建海量的HTTP请求，浪费资源并消耗大量网络流量 */
    /* 向searchTerms这个可观察的处理管道中加入一系列RxJS操作符，缩减对searchHeroes()的调用次数，并最终返回一个
       可及时给出英雄搜索结果的可观察对象 - Hero[] */
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
