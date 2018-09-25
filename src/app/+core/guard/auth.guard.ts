import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Store, select } from "@ngrx/store";

import { IUser } from '../interfaces/user.interface';
import { IAppStore } from '../../app-store.module';
import { ISession } from '../interfaces/session.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    private user: Observable<IUser>;

    constructor(
        public router: Router,
        public store: Store<IAppStore>
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.store
            .pipe(select('session'))
            .pipe(obs => {
                obs.subscribe((session: ISession) => {
                    if (!session)
                        this.router.navigateByUrl('/');
                    return true;
                });
                return of(true);
            });
    }
}
