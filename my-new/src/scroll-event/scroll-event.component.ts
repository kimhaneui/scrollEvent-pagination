import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-scroll-event',
  templateUrl: './scroll-event.component.html',
  styleUrls: ['./scroll-event.component.css']
})
export class ScrollEventComponent implements OnInit {
  isSearchDone: any;
  typeCodeCount: number;
  viewModel: any;
  dataModel: any;
  qnaTotalCount: number;
  apiMypageService: any;
  alertService: any;
  transactionSetId: any;
  consultingTotalCount: any;

  constructor() { }

  ngOnInit() {
  }

  onScroll() {
    console.log('scrollllllll');

    if (this.isSearchDone)
      this.listIncrease();
  }

  numberUp(value) {
    const valueLength = value.toString().length;
    const exponent = 1;
    return Math.ceil(value / Math.pow(10, exponent)) * Math.pow(10, exponent);
  }

  /**
   * 더보기
   */
  listIncrease() {

    if (this.typeCodeCount < 10 || this.viewModel.consulting.list.length > this.numberUp(this.consultingTotalCount)) {
      return false;
    } else {
      this.consultingLimits();
      this.consultingIncrease(_.cloneDeep(this.dataModel.rq));
    }

  }


  /**
   * 스크롤 작동시
   * 리스트 가져오기
  */
  consultingIncrease(rq) {

    this.apiMypageService.POST_CONSULTING(rq)
      .subscribe(
        (res: any) => {
          if (res.succeedYn) {
            this.dataModel.consulting = _.cloneDeep(res.result);
            console.log(this.dataModel.consulting, 'this.dataModel.consulting');

            this.viewModel.consulting.list = this.viewModel.consulting.list.concat(this.dataModel.consulting.list);


          } else {
            this.alertService.showApiAlert(res.errorMessage);
          }
        },
        (err: any) => {
          this.alertService.showApiAlert(err);
        }
      );
  }

  /**
   * 증가
   */
  consultingLimits() {
    console.info('[consultingLimits]', this.dataModel.rq);
    this.dataModel.rq.condition.limits[0] += 10;
    this.dataModel.rq.condition.limits[1] += 10;
    this.dataModel.rq.transactionSetId = this.transactionSetId;
  }

}
