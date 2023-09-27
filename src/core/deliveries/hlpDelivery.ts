import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { SaleDelivery } from "asv-hlps/lib/cjs/models/entities/sales/SaleDelivery";

import authService from "../../auth/services/authService";

class HlpDelivery {
  // private authUser = authService.authUser()
  checkAllSalesDone = (datas: SaleDelivery[] = []) => {
    let delivering: number = 0;
    let delivered: number = 0;
    for (const data of datas) {
      for (const sale of data.sales) {
        if (sale.isDelivering) {
          delivering++;
        }
        if (sale.isDelivered) {
          delivered++;
        }
      }
    }
    return { delivering, delivered };
  };

  getIdsAndSalesLength = (deliveries: SaleDelivery[] | []) => {
    let deliveryIds: number[] = [];
    let totalSales: number = 0;
    for (const delivery of deliveries) {
      totalSales += delivery.sales.length;
      deliveryIds.push(delivery.id);
    }
    return { totalSales, deliveryIds };
  };

  updateLocalDeliveries = (delivery: SaleDelivery, sale: Sale, delivered?: boolean) => {
    const deliveries: SaleDelivery[] = JSON.parse(localStorage.getItem("saleDelivery" + authService.authUser().username));
    const currDelivery = deliveries.find((x) => x.id === delivery.id);
    const indexDl = deliveries.findIndex((x) => x.id === currDelivery.id);
    const indexSale = currDelivery.sales.findIndex((x) => x.id === sale.id);
    if (delivered) {
      currDelivery.sales[indexSale].isDelivered = true;
    } else {
      currDelivery.sales[indexSale].isDelivering = true;
    }
    deliveries[indexDl] = currDelivery;
    this.setLocalDeliveries(deliveries);
    return deliveries;
    // return JSON.parse(localStorage.getItem('saleDelivery'))
  };

  setLocalDeliveries = (deliveries: SaleDelivery[] | []) => {
    localStorage.setItem("saleDelivery" + authService.authUser().username, JSON.stringify(deliveries));
  };

  checkAllDelivering = (deliveries: SaleDelivery[] | []) => {
    return this.checkAllSalesDone(deliveries).delivering === this.getIdsAndSalesLength(deliveries).totalSales;
  };
  checkAllDelivered = (deliveries: SaleDelivery[] | []) => {
    return this.checkAllSalesDone(deliveries).delivered === this.getIdsAndSalesLength(deliveries).totalSales;
  };
}

export default new HlpDelivery() as HlpDelivery;
