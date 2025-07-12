import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  phoneNumbers = [
    '9952981694',
    '9884884154'
  ];

  address = {
    line1: 'C2, Nahar Ashiyana',
    line2: 'Kazura Garden 1st Main Road',
    city: 'Neelankarai, Chennai – 600115'
  };

  onSubmit() {
    console.log('Form submitted:', this.contactForm);
    // Here you would typically send the form data to a backend service
    alert('Thank you for your message! We will get back to you soon.');
    this.resetForm();
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}