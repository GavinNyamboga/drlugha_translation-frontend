import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
})
export class BatchComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }
}
