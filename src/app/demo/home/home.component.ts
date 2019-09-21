import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/operators';
import { BookDataService } from './services/book-data.service';
import { Books, LightBookEditor } from './models/books.model';
import { HttpClient } from '@angular/common/http';
import { Language } from '../../genese-core/enums/language';
import { GetAllResponse } from '../../genese-core/models/gn-request-params';
import { Genese } from '../../genese-core/services/genese.service';
import { ResponseStatus } from '../enums/response-status';
import { Method } from './models/method.model';
import { MethodService } from './services/method.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit, OnInit {

    // --------------------------------------------------
    //                     PROPERTIES
    // --------------------------------------------------

    public booleansGenese: Genese<Boolean>;
    public booksGenese: Genese<Books>;
    public categoriesGenese: Genese<String>;
    public codesGenese: Genese<Number>;
    public dataSource = new MatTableDataSource<Books>();
    public displayedColumns: string[] = [];
    public emptyList = true;
    public method: Method = {};
    public pageIndex = 0;
    public pageSize = 5;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    constructor(
        private bookDataService: BookDataService,
        private dialog: MatDialog,
        private http: HttpClient,
        public methodService: MethodService
    ) {
        this.booleansGenese = new Genese<Boolean>(http, Boolean);
        this.booksGenese = new Genese<Books>(http, Books);
        this.categoriesGenese = new Genese<String>(http, String);
        this.codesGenese = new Genese<Number>(http, Number);
    }


    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Component initialization
     */
    ngOnInit(): void {
        this.paginator.pageIndex = this.pageIndex;
        this.paginator.pageSize = this.pageSize;
    }


    /**
     * Component after initialization
     */
    ngAfterViewInit(): void {
        this.paginator.page
            .pipe(
                tap(() => this.getAllWithPagination())
            )
            .subscribe();
    }


    /**
     * Get one book for a given id
     * @param id
     */
    getOne(id: string): void {
        // this.method = this.methodService.getMethod('getOne');
        this.booksGenese.getOne('1').subscribe((book: Books) => {
            console.log('%c GeneseAbstract getOne home ', 'font-weight: bold; color: green;', book);
        });
    }


    /**
     * Get one book with only fields corresponding to LightBookEditor model
     * This methodName uses the Genese special query with gExtract param
     * The api route is /books/{id}?gExtract=...
     * @param id
     */
    getOneExtract(id: string): void {
        this.method = this.methodService.getMethod('getOneExtract');
        this.booksGenese.getOneExtract<LightBookEditor>(id, LightBookEditor).subscribe((editor: LightBookEditor) => {
            console.log('%c GeneseAbstract getOneExtract editor ', 'font-weight: bold; color: fuchsia;', editor);
        });
    }


    /**
     * Get one book with all gnTranslate fields translated in a given language
     * @param id
     * @param language
     */
    getOneTranslated(id: string, language: string): void {
        this.method = this.methodService.getMethod('getOneTranslated');
        this.booksGenese.getOne(id).subscribe(book => {
            const objectTranslated = this.booksGenese.translate(book, language as Language);
            console.log('%c GeneseAbstract getOneTranslated objectTranslated ', 'font-weight: bold; color: black;', objectTranslated);
        });
    }


    /**
     * Get all the books with pagination
     */
    getAll(): void {
        this.method = this.methodService.getMethod('getAll');
        this.displayedColumns = ['id', 'author', 'title', 'description'];
        this.booksGenese
            .getAll()
            .pipe()
            .subscribe((data: GetAllResponse<Books>) => this.displayMatTableDataSource(data));
    }


    /**
     * Get all the books with pagination
     */
    getAllPrimitives(id: string): void {
        this.method = this.methodService.getMethod('getAllPrimitives');
        this.categoriesGenese
            .getAll({
                gnPath: `/books/${id}/categories`
            })
            .pipe()
            .subscribe((data: GetAllResponse<String>) => {
                console.log('%c getAllPrimitives categories ', 'font-weight: bold; color: brown;', data);
            });
        this.codesGenese
            .getAll({
                gnPath: `/books/${id}/codes`
            })
            .pipe()
            .subscribe((data: GetAllResponse<Number>) => {
                console.log('%c getAllPrimitives codes ', 'font-weight: bold; color: brown;', data);
            });
        this.booleansGenese
            .getAll({
                gnPath: `/books/${id}/booleans`
            })
            .pipe()
            .subscribe((data: GetAllResponse<Boolean>) => {
                console.log('%c getAllPrimitives codes ', 'font-weight: bold; color: brown;', data);
            });
    }




    /**
     * Get all the books with pagination
     */
    getAllWithPagination(): void {
        this.method = this.methodService.getMethod('getAllWithPagination');
        this.displayedColumns = ['id', 'author', 'title', 'description'];
        this.booksGenese
            .getAll(
                {
                    gnPage: this.paginator.pageIndex,
                    gnLimit: this.paginator.pageSize
                })
            .pipe()
            .subscribe((data: GetAllResponse<Books>) => this.displayMatTableDataSource(data));
    }


    delete(id: string): void {
        this.method = this.methodService.getMethod('delete');
        this.booksGenese.delete(id).subscribe((response: ResponseStatus) => {
            console.log('%c GeneseAbstract delete response ', 'font-weight: bold; color: brown;', response);
        });
    }


    create() {
        this.method = this.methodService.getMethod('create');
    }


    /**
     * Display the books list in a MatTable with pagination
     * @param data
     */
    displayMatTableDataSource(data) {
        console.log('%c GeneseAbstract getAllWithPagination data ', 'font-weight: bold; color: green;', data);
        this.dataSource = data && Array.isArray(data.results) ? new MatTableDataSource(data.results) : new MatTableDataSource([]);
        this.paginator.length = data && data.totalResults ? data.totalResults : 0;
        this.emptyList = this.paginator.length === 0;
    }
}
