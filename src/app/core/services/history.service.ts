import { Injectable } from '@angular/core';

import { IOrder, IPeriod } from "@Core/interfaces";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  public IHistoryPeriods: IPeriod[] = [
    {
      Name: 'Today',
    },
    {
      Name: 'Yesterday',
    },
    {
      Name: 'This Week',
    },
    {
      Name: 'This Month',
    },
    {
      Name: 'Last 3 Months',
    },
    {
      Name: 'Last 6 Months',
    },
    {
      Name: 'This Year',
    }
  ];

  constructor() {}

  private filterForToday(orders: IOrder[]): IOrder[] {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    return orders
      .filter(order => {
        const orderDate = new Date(order.OrderDate!);
        return orderDate >= today && orderDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      })
      .sort((a, b) => a.OrderDate! - b.OrderDate!);
  }

  private filterForYesterday(orders: IOrder[]): IOrder[] {
    const yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    return orders
      .filter(order => {
        const orderDate = new Date(order.OrderDate!);
        return orderDate >= yesterday && orderDate < new Date(yesterday.getTime() + 24 * 60 * 60 * 1000);
      })
      .sort((a, b) => a.OrderDate! - b.OrderDate!);
  }

  private filterForOneWeek(orders: IOrder[]): IOrder[] {
    const oneWeekAgo: Date = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return orders
      .filter(order => new Date(order.OrderDate!) >= oneWeekAgo)
      .sort((a, b) => b.OrderDate! - a.OrderDate!);
  }

  private filterForOneMonth(orders: IOrder[]): IOrder[] {
    const oneMonthAgo: Date = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return orders
      .filter(order => new Date(order.OrderDate!) >= oneMonthAgo)
      .sort((a, b) => b.OrderDate! - a.OrderDate!);
  }

  private filterForThreeMonths(orders: IOrder[]): IOrder[] {
    const threeMonthsAgo: Date = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return orders
      .filter(order => new Date(order.OrderDate!) >= threeMonthsAgo)
      .sort((a, b) => b.OrderDate! - a.OrderDate!);
  }

  private filterForSixMonths(orders: IOrder[]): IOrder[] {
    const sixMonthsAgo: Date = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return orders
      .filter(order => new Date(order.OrderDate!) >= sixMonthsAgo)
      .sort((a, b) => b.OrderDate! - a.OrderDate!);
  }

  private filterForOneYear(orders: IOrder[]): IOrder[] {
    const oneYearAgo: Date = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return orders
      .filter(order => new Date(order.OrderDate!) >= oneYearAgo)
      .sort((a, b) => b.OrderDate! - a.OrderDate!);
  }

  public filterBasedOnPeriod(selectedPeriod: any, orders: IOrder[], clientId?: number | null): IOrder[] {
    switch (selectedPeriod) {
      case 'Today':
        return clientId ? this.filterForClient(clientId, this.filterForToday(orders)): this.filterForToday(orders);
      case 'Yesterday':
        return clientId ? this.filterForClient(clientId, this.filterForYesterday(orders)): this.filterForYesterday(orders);
      case 'This Week':
        return clientId ? this.filterForClient(clientId, this.filterForOneWeek(orders)): this.filterForOneWeek(orders);
      case 'This Month':
        return clientId ? this.filterForClient(clientId, this.filterForOneMonth(orders)): this.filterForOneMonth(orders);
      case 'Last 3 Months':
        return clientId ? this.filterForClient(clientId, this.filterForThreeMonths(orders)): this.filterForThreeMonths(orders);
      case 'Last 6 Months':
        return clientId ? this.filterForClient(clientId, this.filterForSixMonths(orders)): this.filterForSixMonths(orders);
      case 'This Year':
        return clientId ? this.filterForClient(clientId, this.filterForOneYear(orders)): this.filterForOneYear(orders);
      default:
        return clientId ? this.filterForClient(clientId, this.filterForToday(orders)): this.filterForToday(orders);
    }
  }

  private filterForClient(clientId: number, orders: IOrder[]): IOrder[] {
    return orders.filter(order => Number(order.ClientID) === Number(clientId));
  }
}
