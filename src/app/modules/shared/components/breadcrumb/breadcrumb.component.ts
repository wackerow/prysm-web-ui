import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Route, ResolveEnd, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, takeUntil, filter } from 'rxjs/operators';

interface Breadcrumb {
    displayName: string, 
    url: string,
    route: Route | null,
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute, 
    private router: Router
  ) { }
  breadcrumbs: Breadcrumb[];
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    // Initial this.breadcrumbs assignment
    this.buildBreadcrumbs();
    // Observable subsription
    this.router.events.pipe(
      filter(event => event instanceof ResolveEnd),
      tap(() => this.buildBreadcrumbs()),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildBreadcrumbs(): void {
    let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;
    let url: string = '';

    const newCrumbs: Breadcrumb[] = [];

    while (route.firstChild !== null) {
      route = route.firstChild;

      if (route.routeConfig === null) { continue };
      if (!route.routeConfig.path) { continue };
      
      url += `/${this.createUrl(route)}`;
      // Only include route paths with defined breadcrumb label
      if (!route.data['breadcrumb']) { continue };

      const newCrumb = this.createBreadcrumb(route, url);
      newCrumbs.push(newCrumb);
    }
    this.breadcrumbs = newCrumbs;
  }

  createBreadcrumb(route: ActivatedRouteSnapshot, url: string): Breadcrumb {
    return {
      displayName: route.data['breadcrumb'],
      url: url,
      route: route.routeConfig
    };
  }

  createUrl(route: ActivatedRouteSnapshot): string {
    return route && route.url.map(function (s: UrlSegment) { return s.toString() }).join('/');
  }
}