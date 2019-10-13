# genese-angular  [![npm version](https://badge.fury.io/js/genese-angular.svg)](https://badge.fury.io/js/genese-angular)

The generic data-service library for Angular.

Simple example using genese: https://github.com/gillesfabre34/genese-angular-demo


## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [DataServices](#dataservices)


## Installation

First you need to install the npm module:

```sh
npm install genese-angular --save
```

Choose the version corresponding to your Angular version:

 Angular     | genese-angular
 ----------- | -------------------
 8           | 0.0.1               

---


## Usage

#### 1. Config

At first, you need to configure your environment. Genese needs to know what is the api address of your backend. You can do that by adding GeneseEnvironmentService in the constructor of your AppComponent.

* Example:

`app.component.ts`
```ts
import { Component } from '@angular/core';
import { GeneseEnvironmentService } from 'genese-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'genese-demo';


  constructor(geneseEnvironmentService: GeneseEnvironmentService) {
      geneseEnvironmentService.setEnvironment(environment.genese);
  }
}
```

`environment.ts`
```ts
export const environment = {
  production: false,
    genese: {
        api: 'http://localhost:3000'
    }
};
```

#### 2. Import Genese module

Import the genese module in the app.module.

* Example

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneseModule } from 'genese-angular';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        GeneseModule.forRoot(),

        AppRoutingModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```


##### 3. Inject geneseService in your component

Add a property with `Genese` Type to your component, inject `GeneseService` in the constructor and instantiate your property with `getGeneseInstance`.

* Example

```ts
import { Genese } from 'genese-angular/lib/factories/genese.factory';
import { GeneseService } from 'genese-angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent {

    public booksGenese: Genese<Books>;

    constructor(
        private dialog: MatDialog,
        private geneseService: GeneseService,
        public methodService: MethodService,
    ) {
        this.booksGenese = geneseService.getGeneseInstance(Books);
    }
}
```

## DataServices

Genese provides many useful dataservices:

#### 1. getOne(id: string, path?: string): Observable< T >

This method returns an element of type T for a given id and a given path (optional). The returned object is mapped with the T type.
