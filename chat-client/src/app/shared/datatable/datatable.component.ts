import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";

declare let $: any;

@Component({
    selector: 'hc-datatable',
    template: `
        <table class="dataTable responsive {{tableClass}}" width="{{width}}">
            <ng-content></ng-content>
        </table>`
    /*,styles: [
        require('smartadmin-plugins/datatables/datatables.min.css')
    ]*/
})
export class DatatableComponent implements OnInit, OnDestroy {

    @Input() public options: any;
    @Input() public filter: any;
    @Input() public detailsFormat: any;

    @Input() public paginationLength: boolean = true;
    @Input() public columnsHide: boolean = true;
    @Input() public tableClass: string = '';
    @Input() public width: string = '100%';

    @Output() buttonClicked = new EventEmitter<any>();
    @Output() checkboxClicked = new EventEmitter<any>();
    @Output() rowDoubleClicked = new EventEmitter<any>();
    @Output() rowsSelected = new EventEmitter<any>();
    @Output() rowsDeselected = new EventEmitter<any>();
    jqueryDatatableObject: any;
    isRendered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        /*Promise.all([
            import('script-loader!smartadmin-plugins/datatables/datatables.min.js'),
        ]).then(() => {
            this.render()

        })*/
        this.render();
    }

    ngOnDestroy(): void {
        if (this.jqueryDatatableObject) {
            this.jqueryDatatableObject.off('click');
            this.jqueryDatatableObject.off('dblclick');
            this.jqueryDatatableObject.off('select');
            this.jqueryDatatableObject.off('deselect');
            this.jqueryDatatableObject.destroy(true);
        }
        this.isRendered$.next(false);
    }

    render() {

        let element = $(this.el.nativeElement.children[0]);
        let options = this.options || {}


        let toolbar = '';
        if (options.buttons)
            toolbar += 'B';
        if (this.paginationLength)
            toolbar += 'l';
        if (this.columnsHide)
            toolbar += 'C';

        if (typeof options.ajax === 'string') {
            let url = options.ajax;
            options.ajax = {
                url: url,
                // complete: function (xhr) {
                //
                // }
            }
        }

        options = $.extend(options, {

            "dom": "<'dt-toolbar inputToolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>" +
                "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
            oLanguage: {
                "sSearch": "<span class='input-group-addon'><i class='glyphicon glyphicon-search'></i></span> ",
                "sLengthMenu": "_MENU_"
            },
            "autoWidth": false,
            retrieve: true,
            responsive: true,
            initComplete: (settings: any, json: any) => {
                element.parent().find('.input-sm',).removeClass("input-sm").addClass('input-md').attr('id', 'inputSearch');
                element.parent().find("#inputSearch").focus();
                //element.parent().find('.inputToolbar').css({'padding':'0px'});

                element.parent().find("thead").addClass('table-light text-muted');
                element.parent().find(".dt-toolbar-footer").addClass('row justify-content-md-between align-items-md-center');
            }
        });

        options.language = {
            'paginate': {
                'previous': '«',
                'next': '»'
            }
        };

        const _dataTable = element.DataTable(options);

        if (this.filter) {
            // Apply the filter
            element.on('keyup change', 'thead th input[type=text]', function () {
                // @ts-ignore
                _dataTable.column($(this).parent().index() + ':visible').search(this.value).draw();
            });
        }

        if (!toolbar) {
            element.parent().find(".dt-toolbar").append('<div class="text-right"><img src="assets/img/logo.png" alt="SmartAdmin" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>');
        }

        if (this.detailsFormat) {
            let format = this.detailsFormat
            element.on('click', 'td.details-control', function () {
                // @ts-ignore
                let tr = $(this).closest('tr');
                let row = _dataTable.row(tr);
                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            })
        }

        this.jqueryDatatableObject = _dataTable;
        this.isRendered$.next(true);
        // _dataTable.on('click', 'td a', function () {
        //     const data = _dataTable.row($(this).parents('tr')).data();
        // });

        _dataTable.on('select', (e: any, dt: any, type: any, indexes: any) => {
            if (type === 'row') {
                this.rowsSelected.emit({rows: _dataTable.rows(indexes)});
            }
        });
        _dataTable.on('deselect', (e: any, dt: any, type: any, indexes: any) => {
            if (type === 'row') {
                this.rowsDeselected.emit({rows: _dataTable.rows(indexes)});
            }
        });
        _dataTable.on('click', 'td a', (e: any) => {
            this.onRowButtonClick(e.target);
        });
        _dataTable.on('dblclick', 'tr td', (e: any) => {
            this.onRowDoubleClick(e.target);
        });
        //
        _dataTable.on('focus', ' tr ', (e: any) => {
            $(e.currentTarget).css('background-color', '#ecf3f8');
        });

        _dataTable.on('blur', ' tr ', (e: any) => {
            $(e.currentTarget).css('background-color', 'white');
        });
        _dataTable.on('change', 'td input[type=checkbox]', (e: any) => {
            this.onRowButtonClickCheckbox(e.target);
        });

    }

    private onRowButtonClick(clickEventTarget: any): void {
        const data = this.jqueryDatatableObject.row($(clickEventTarget).parents('tr')).data();
        while (clickEventTarget.nodeName != 'A') {
            clickEventTarget = clickEventTarget.parentNode;
        }

        this.buttonClicked.emit({target: clickEventTarget, rowData: data});
    }

    private onRowButtonClickCheckbox(clickEventTarget: any): void {
        const data = this.jqueryDatatableObject.row($(clickEventTarget).parents('tr')).data();
        if (data != null && data.ticketId != null) {
            const ticketId = $('input[name=' + data.ticketId + ']:checked').val();
            let ticketIdUncheck = null;
            const check = $('input[name=' + data.ticketId + ']').is(':checked');
            if (check == false) {
                ticketIdUncheck = data.ticketId;
            }
            this.checkboxClicked.emit({target: ticketId, rowData: data, uncheck: ticketIdUncheck});
        }
    }

    private onRowDoubleClick(doubleClickEventTarget: any): void {
        const data = this.jqueryDatatableObject.row($(doubleClickEventTarget).parents('tr')).data();
        this.rowDoubleClicked.emit({rowData: data});
    }


    public jQObject(): any {
        return this.jqueryDatatableObject;
    }

    public getSelectedRows() {
        return this.jqueryDatatableObject.rows({selected: true}).data();
    }

    public update(newdata: any[]) {
        if (this.isRendered$.value) {
            this._update(newdata);
        } else {
            const sub = this.isRendered$.subscribe(rendered => {
                if (rendered) {
                    sub.unsubscribe();
                    this._update(newdata);
                }
            });
        }
    }

    public _update(newdata: any[]) {
        this.jqueryDatatableObject.clear();
        this.jqueryDatatableObject.rows.add(newdata);
        this.jqueryDatatableObject.draw();
    }

    public findRowsIdx(columnData: string, columnDataValue: string) {
        let rowIndexes: any[] = [];
        // @ts-ignore
        this.jqueryDatatableObject && this.jqueryDatatableObject.rows(function (idx: any, data: any, node: any) {
            if (data[columnData] === columnDataValue) {
                rowIndexes.push(idx);
                return false;
            }
        });
        return rowIndexes;
    }

    public addRow(newData: any) {
        this.jqueryDatatableObject && this.jqueryDatatableObject.row.add(newData).draw(false);
    }

    public updateRow(rowIdx: number, newData: any) {
        this.jqueryDatatableObject && this.jqueryDatatableObject.row(rowIdx).data(newData).invalidate();
    }

    public removeRow(rowIdx: number) {
        this.jqueryDatatableObject && this.jqueryDatatableObject.row(rowIdx).remove().draw(false);
    }

}
