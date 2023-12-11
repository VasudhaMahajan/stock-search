import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.css']
})
export class NewsModalComponent implements OnInit {

  @Input() newsModalInfo : any ;

  datetime : string = "";
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      var nDate = new Date(this.newsModalInfo.datetime * 1000);
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var year = nDate.getFullYear();
      var month = months[nDate.getMonth()];
      var date = nDate.getDate();
      this.datetime = month + ' ' + date + ', ' + year + ' ';
      console.log(this.newsModalInfo.headline);
      console.log(this.datetime);
  }

  closeModal(data: any) {
    this.activeModal.close(data);
  }
}
