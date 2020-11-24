import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-new';
  paginationInfo: any;
  tabNo: number;
  itemsPerPage: any;
  viewModel: any;
  dataModel: any;
  store: any;
  resolveData: any;
  listSubject$: any;

  ngOnInit(): void {

  }

  ngOnDestroy() {
  }

  paginationInit() {
    if (this.tabNo === 0) {
      console.info('[paginationInit] >>> 01', this.vm);
      const itemsPerPage = this.itemsPerPage; // 1페이지당 10개 아이템

      // limits 가져오기
      const limits = this.getRqLimits();
      const curPage = this.getLimitsToPageNum(limits[0], itemsPerPage);

      const nowItem = this.viewModel.consulting.totalCount;

      console.info('[paginationInit > limits]', limits);
      console.info('[paginationInit > nowItem]', nowItem);
      console.info('[paginationInit > curPage]', curPage);

      this.paginationInfo = {
        currentPage: curPage,
        totalItems: nowItem,
        itemsPerPage: itemsPerPage,
        maxSize: 5,
        disabled: false
      };
    } else {

      const itemsPerPage = this.itemsPerPage; // 1페이지당 10개 아이템

      // limits 가져오기
      const limits = this.getRqLimits();
      const curPage = this.getLimitsToPageNum(limits[0], itemsPerPage);

      const nowItem = this.viewModel.qna.totalCount;

      console.info('[paginationInit > limits]', limits);
      console.info('[paginationInit > nowItem]', nowItem);
      console.info('[paginationInit > curPage]', curPage);

      this.paginationInfo = {
        currentPage: curPage,
        totalItems: nowItem,
        itemsPerPage: itemsPerPage,
        maxSize: 5,
        disabled: false
      };
    }

  }
  vm(arg0: string, vm: any) {
    throw new Error('Method not implemented.');
  }

  getRqLimits(): Array<number> {
    const limits = _
      .chain(this.dataModel.rq.condition)
      .get('limits')
      .value();
    console.log(this.dataModel.rq, 'getRqLimits');

    return limits;
  }

  /**
   * Limits[0] 에서 현제 페이지 구하기
   * @param $num
   * @param $itemsPerPage
   */
  getLimitsToPageNum($num: number, $itemsPerPage: number): number {
    const tgNum = $num;
    const divideNum = $itemsPerPage; // 1페이지당 10개 아이템

    let curPage;

    const temp = Math.floor(tgNum / divideNum);

    if (temp === 0) {
      curPage = 1;
    } else {
      curPage = temp + 1;
    }
    console.log(curPage, 'curPage');

    return curPage;
  }

  onPageChange(e) {
    console.info('[onPageChange]', e.page);
    console.info('[this.paginationInfo]', this.paginationInfo.currentPage);


    if (this.tabNo === 0) {
      if (e.page === this.paginationInfo.currentPage) {
        console.info('[현재 페이지]', e.page, this.paginationInfo.currentPage);
      } else {
        console.info('[다른 페이지]', e.page, this.paginationInfo.currentPage);
        const itemsPerPage = this.itemsPerPage;
        const goPage = e.page;
        const tempLimits = this.getPageNumToLimits(goPage, itemsPerPage);

        const vm: any = _.cloneDeep(this.vm);
        const trId = _.chain(this.vm).get('transactionSetId').value();

        vm.limits = tempLimits;
        vm.transactionSetId = trId;
        this.vm = vm;

        this.dataModel.rq.condition.limits = tempLimits;
        console.info('onPageChange  vm ', this.vm);

        const opt = {
          limits: tempLimits,
          transactionSetId: trId
        };

        this.goPageEvt(this.vm);
      }
    } else {
      if (e.page === this.paginationInfo.currentPage) {
        console.info('[현재 페이지]', e.page, this.paginationInfo.currentPage);
      } else {
        console.info('[다른 페이지]', e.page, this.paginationInfo.currentPage);
        const itemsPerPage = this.itemsPerPage;
        const goPage = e.page;
        const tempLimits = this.getPageNumToLimits(goPage, itemsPerPage);

        const vm: any = _.cloneDeep(this.view);
        const trId = _.chain(this.view).get('transactionSetId').value();

        vm.limits = tempLimits;
        vm.transactionSetId = trId;
        this.view = vm;

        this.dataModel.rq.condition.limits = tempLimits;
        console.info('onPageChange  view ', this.view);

        const opt = {
          limits: tempLimits,
          transactionSetId: trId
        };

        this.goPageEvt(this.view);
      }
    }






  }
  view(view: any): any {
    throw new Error('Method not implemented.');
  }



  /**
   * $goPage 에서 limits[] 구하기
   * @param $goPage
   * @param $itemsPerPage
   */
  getPageNumToLimits($goPage: number, $itemsPerPage: number): Array<number> {
    const itemsPerPage = $itemsPerPage;
    const goPage = $goPage;
    const tempLimits = [0, itemsPerPage];

    tempLimits[0] = (() => {
      const tempNum = goPage - 1;
      if (tempNum === 0) {
        return tempNum;
      } else {
        return tempNum * itemsPerPage;
      }
    })();

    tempLimits[1] = (() => {
      const tempNum = goPage - 1;
      if (tempNum === 0) {
        return itemsPerPage;
      } else {
        return goPage * itemsPerPage;
      }
    })();
    console.log(tempLimits, 'tempLimits');

    return tempLimits;
  }



  /**
  * 페이지 검색
  * @param e
  */
  goPageEvt(e) {
    this.resolveData = _.cloneDeep(e);
    this.moveScrollTo('contents');
    this.listSubject$.next(this.resolveData.rq);
    this.getQnaList(this.dataModel.rq);

  }
  getQnaList(rq: any) {
    throw new Error('Method not implemented.');
  }

  /**
  * 스크롤 이동
  * @param $id
  */
  moveScrollTo($id: string) {
    const doc = document.documentElement;
    const targetOffset = document.getElementById($id).getBoundingClientRect();
    const windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const top = targetOffset.top + windowScrollTop - 54;
    window.scrollTo(0, top);
  }
}
