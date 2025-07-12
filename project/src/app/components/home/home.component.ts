import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  todaySpecial: string = '';
  currentDay: string = '';
  isHoliday: boolean = false;

  ngOnInit(): void {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    this.currentDay = dayNames[todayIndex];

    if (this.currentDay === 'Saturday' || this.currentDay === 'Sunday') {
      this.isHoliday = true;
      this.todaySpecial = '🔴 No meals available today. It’s a holiday!';
    } else {
      const todayMenu = this.weeklyMenu.find(menu => menu.day === this.currentDay);
      this.todaySpecial = todayMenu ? `✅ ${todayMenu.items.join(', ')}` : 'Menu not available';
    }
  }
}
