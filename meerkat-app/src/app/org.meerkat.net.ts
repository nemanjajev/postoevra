import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';

   export class Invoice extends Asset {
      invoiceId: string;
      amount: number;
      status: InvoiceStatus;
      sender: BizEntity;
      receiver: BizEntity;
   }
   export class BizEntity extends Participant {
      bizEntityId: string;
      name: string;
      debt: number;
      claim: number;
   }
   export class CreateInvoice extends Transaction {
      invoiceId: string;
      amount: number;
      sender: BizEntity;
      receiver: BizEntity;
   }
   export class AcceptInvoice extends Transaction {
      newStatus: InvoiceStatus;
      sender: BizEntity;
      invoice: BizEntity;
   }
   export enum InvoiceStatus {
      NEW,
      ACCEPTED,
      REJECTED,
      PAID,
      COMPLETED,
   }
