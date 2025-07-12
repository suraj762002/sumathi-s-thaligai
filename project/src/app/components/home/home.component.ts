import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  weeklyMenu = [
    {
      day: 'Monday',
      items: ['Vathakuzhambu', 'Poriyal', 'Rasam']
    },
    {
      day: 'Tuesday',
      items: ['Sambar', 'Poriyal', 'Rasam', 'Kootu']
    },
    {
      day: 'Wednesday',
      items: ['Mor Kuzhambu', 'Poriyal', 'Rasam', 'Mango Pickle']
    },
    {
      day: 'Thursday',
      items: ['Vathakuzhambu', 'Kootu', 'Rasam']
    },
    {
      day: 'Friday',
      items: ['Sambar', 'Rasam', 'Poriyal', 'Variety Rice']
    }
  ];

  podiItems = [
    { name: 'Sambar Podi', weight: '250g', price: 200 },
    { name: 'Kootu Podi', weight: '250g', price: 200 },
    { name: 'Rasam Podi', weight: '250g', price: 200 }
  ];

  pricing = {
    mealWithoutRice: 110,
    rice: 30
  };
}