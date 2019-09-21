import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {


    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------


    constructor(public router: Router) { }



    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------


    /**
     * Check if a route can be activated based on user's role.
     * @returns {boolean}
     */
    /* istanbul ignore text */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return true;
    }
}
