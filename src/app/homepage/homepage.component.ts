import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ExplorerModel } from '../explorer/explorer.model';
import { ExplorerService } from '../explorer/explorer.service';

import { WalletModel } from '../wallet/wallet.model';
import { WalletService } from '../wallet/wallet.service';
import { RpcSend } from '../rpc/rpc-send.model';
import { RpcReceive } from '../rpc/rpc-receive.model';

export interface SendToAddressModel {
  amount: Number;
  destinationAddress: String;
  feeIncluded: Boolean;
}

@Component({
  selector: 'app-homepage-component',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css', '../common/css/grid-layout.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomepageComponent implements OnInit {
  explorer: ExplorerModel;
  wallet: WalletModel;
  transaction: SendToAddressModel = {
    amount: undefined,
    destinationAddress: undefined,
    feeIncluded: false
  };
  rpcReceive: RpcReceive;
  qrMainAddress: string;

  constructor(
    private explorerService: ExplorerService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.showUSD();
    this.showBTC();
    this.showBalance();
    this.wallet = {
      ...this.wallet,
      mainAddress: 'NaSdzJ64o8DQo5DMPexVrL4PYFCBZqcmsW'
    };
    this.qrMainAddress = `navcoin:${this.wallet.mainAddress}?label=NavPi`;
  }

  showBalance() {
    const rpcData = new RpcSend('getwalletinfo');
    this.walletService.sendRPC(rpcData).subscribe(
      (receive: RpcReceive) => {
        if (receive.type === 'SUCCESS') {
          this.wallet = {
            ...this.wallet,
            balance: receive.data.balance,
            coldStakingBalance: receive.data.coldstaking_balance,
            unconfirmedBalance: receive.data.unconfirmed_balance,
            immatureBalance: receive.data.immature_balance
          };
        } else {
          console.log('error: ', receive);
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  walletLoading() {
    if (this.wallet.balance && this.wallet) {
      return true;
    }
    return false;
  }

  sendToAddress(destinationAddress, amount, feeIncluded) {
    const rpcData = new RpcSend('sendtoaddress', [
      destinationAddress,
      amount.toString(),
      feeIncluded.toString()
    ]);
    this.walletService.sendRPC(rpcData).subscribe(
      (receive: RpcReceive) => {
        if (receive.type === 'SUCCESS') {
          console.log('receive: ', typeof receive.data);
        } else {
          console.log('error: ', receive);
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  showUSD() {
    this.explorerService.getUSD().subscribe(
      (data: number) => {
        this.explorer = {
          ...this.explorer,
          tickerUSD: data
        };
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  showBTC() {
    this.explorerService.getBTC().subscribe(
      (data: number) => {
        this.explorer = {
          ...this.explorer,
          tickerBTC: data
        };
      },
      error => {
        console.log('error: ', error);
      }
    );
  }
}
