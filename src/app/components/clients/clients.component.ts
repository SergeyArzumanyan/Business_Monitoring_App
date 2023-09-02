import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { RequestsService, TitleService, ToastService } from "@Core/services";
import { IClient, IClientForm } from "@Core/interfaces";
import { onlyWhiteSpaceValidator } from "@Core/validators";

import { IContextMenuItem, ITableConfig } from "@Shared/components/table/interfaces";
import { TableService } from '@Shared/components/table/services'
import { ITableFilters } from "app/shared/components/table/filters/interfaces";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {

  public clients: IClient[] | null = [];

  public ClientTableConfig: ITableConfig<IClient[]> = {
    TableItems: [],
    TableName: 'Clients',
    ItemName: 'Client',
    TableActions: true,
    ItemEndPoint: 'clients'
  };

  public ClientTableFilters: ITableFilters = {
    ShowName: true,
    ShowUsualAddress: true,
    ShowPhoneNumber: true,
  };

  public ClientTableContextMenuOptions: IContextMenuItem[] = [
    {
      Label: this.translateService.instant('Edit'),
      IconClass: 'pi pi-pencil',
      Action: (Item: IClient): void =>  {
        this.TableService.EditDialogForm.next(this.clientForm);
        this.TableService.EnableTableRowEdit(Item);
      }
    },
    {
      Label: this.translateService.instant('Delete'),
      IconClass: 'pi pi-trash',
      Action: (Item: IClient): void => {
        this.TableService.EditDialogForm.next(this.clientForm);
        this.TableService.DeleteItem(this.ClientTableConfig, Item)
      }
    }
  ];

  public clientForm: FormGroup<IClientForm> = new FormGroup<IClientForm>({
    ID: new FormControl<number | null>(+(new Date())),
    Name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
      onlyWhiteSpaceValidator()
    ]),
    Surname: new FormControl<string | null>(null, [
      Validators.minLength(2),
      Validators.maxLength(20),
      onlyWhiteSpaceValidator()
    ]),
    PhoneNumber: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    UsualAddress: new FormControl<string | null>(null,[
      Validators.required,
      onlyWhiteSpaceValidator(),
      Validators.maxLength(25)
    ]),
  });

  public pending: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private toastService: ToastService,
    private TableService: TableService,
    private titleService: TitleService,
    public translateService: TranslateService
  ) {
    this.titleService.setTitle(Configs.AppMainTitle, this.translateService.instant('Clients'));
  }

  ngOnInit(): void {
    this.getClients();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getClients(): void {
    this.pending = true;

    this.Request.GetItems<IClient[]>('clients')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (clients: IClient[] | null) => {
          this.pending = false;
          this.clients = clients ? this.Request.MakeArrayFromFirebaseResponse(clients) : [];

          this.ClientTableConfig.TableItems = this.clients.map((client: any) => {
            client.Orders = client.Orders?.Count;
            return client;
          });
        },
        error: () => {
          this.pending = false;
          this.toastService.showToast(
            'error',
            this.translateService.instant('Error'),
            this.translateService.instant('FailedToGetItems',
              {key: this.translateService.instant('Clients')})
          );
        }
      })
  }

}
