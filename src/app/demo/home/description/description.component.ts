import { Component, Input, OnInit } from '@angular/core';
import { Method } from '../models/method.model';
import { MethodService } from '../services/method.service';


@Component({
    selector: 'app-description',
    templateUrl: './description.component.html',
    styleUrls: ['./description.component.scss']
})

export class DescriptionComponent implements OnInit {

    // --------------------------------------------------
    //                     PROPERTIES
    // --------------------------------------------------

    @Input() methodName = '';
    @Input() methodDescription = '';


    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    constructor(public methodService: MethodService) {
    }


    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    ngOnInit(): void {
        // console.log('%c ngOnInit this.methodName ', 'font-weight: bold; color: blue;', this.methodName);
    }
}
