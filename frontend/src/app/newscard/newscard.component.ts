import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { News } from '../config/news';
import { NewsModalComponent } from '../modals/news-modal/news-modal.component';

@Component({
  selector: 'app-newscard',
  templateUrl: './newscard.component.html',
  styleUrls: ['./newscard.component.css']
})
export class NewscardComponent implements OnInit {
  @Input() news : any = {};
  
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openModal(n: News) {
    const modalRef = this.modalService.open(NewsModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
      });

    modalRef.componentInstance.newsModalInfo = n;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
    });
  }

}
