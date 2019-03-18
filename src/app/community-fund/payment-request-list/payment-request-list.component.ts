import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { CommunityFundService } from 'src/app/services/community-fund.service';
import { NotificationService } from 'src/app/notification-bar/notification.service';
import { MzToastService } from 'ngx-materialize';

@Component({
  selector: 'app-payment-request-list',
  templateUrl: './payment-request-list.component.html',
  styleUrls: ['./payment-request-list.component.css']
})
export class PaymentRequestListComponent implements OnInit {
  constructor(
    public communityFundService: CommunityFundService,
    private notificationService: NotificationService,
    private toastService: MzToastService
  ) {}
  buttonDebounce: Boolean = false;
  dataRefresher: Subscription;

  filterBy: Array<string> = [];
  payReqfilterValue = 'PENDING';

  ngOnInit() {
    this.getData();

    this.dataRefresher = Observable.interval(30000).subscribe(val => {
      this.getData();
    });
  }

  getData() {
    console.log('PaymentRequestListComponent fetching new paymentRequest data');
    this.communityFundService
      .fetchPaymentRequestVotes()
      .catch(error =>
        this.notificationService.addError(
          error,
          'Failed to get Community Fund Payment Request Votes'
        )
      );
    this.communityFundService
      .fetchPaymentRequests()
      .catch(error =>
        this.notificationService.addError(
          error,
          'Failed to fetch Community Fund Payment Requests'
        )
      );
  }

  updateFilter() {
    if (this.payReqfilterValue === 'ALL') {
      this.filterBy = [];
    } else if (this.payReqfilterValue === 'PENDING') {
      this.filterBy = ['pending'];
    } else if (this.payReqfilterValue === 'ACCEPTED') {
      this.filterBy = ['accepted'];
    } else if (this.payReqfilterValue === 'FAILED') {
      this.filterBy = ['expired', 'rejected'];
    }
  }

  voteOnPaymentRequest(paymentReqHash: string, vote: string) {
    this.buttonDebounce = true;

    this.communityFundService
      .updatePaymentRequestVote(paymentReqHash, vote)
      .then(() => {
        this.toastService.show(
          `Successfully voted for ${paymentReqHash}`,
          4000,
          'green'
        );
        this.getData();
      })
      .catch(error => {
        this.notificationService.addError(
          error,
          `Failed to vote for ${paymentReqHash}`
        );
      })
      .finally(() => {
        this.buttonDebounce = false;
      });
  }
}
