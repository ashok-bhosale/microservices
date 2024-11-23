import { Component, OnInit } from '@angular/core';
import {ItemService } from '../itemservice.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit  {
  items:any[]=[];

  constructor(private itemService:ItemService){}

  ngOnInit():void{
    this.itemService.getItems().subscribe(
      (data)=>{
                this.items=data;
              }
   );

  }

}
