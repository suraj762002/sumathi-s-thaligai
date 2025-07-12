import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService, OrderItem, BookingDetails } from '../../services/payment.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  currentStep = 1;
  maxSteps = 3;

  // Step 1: Date Selection
  selectedDate = '';
  minDate = '';

  // Step 2: Menu Selection
  availableItems = [
    { id: 'meal', name: 'Complete Meal (without rice)', price: 110, type: 'meal' as const },
    { id: 'rice', name: 'Rice', price: 30, type: 'rice' as const },
    { id: 'sambar-podi', name: 'Sambar Podi (250g)', price: 200, type: 'podi' as const },
    { id: 'kootu-podi', name: 'Kootu Podi (250g)', price: 200, type: 'podi' as const },
    { id: 'rasam-podi', name: 'Rasam Podi (250g)', price: 200, type: 'podi' as const }
  ];

  cartItems: OrderItem[] = [];

  // Step 3: Customer Details & Payment
  customerInfo = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  selectedPaymentMethod: 'online' | 'cod' = 'online';
  isProcessingPayment = false;
  orderConfirmed = false;
  orderDetails: any = null;

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setMinDate();
  }

  private setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  // Step Navigation
  nextStep() {
    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step <= this.maxSteps && step >= 1) {
      this.currentStep = step;
    }
  }

  // Date Selection
  onDateChange() {
    console.log('Selected date:', this.selectedDate);
  }

  // Cart Management
  addToCart(item: any) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        type: item.type
      });
    }
  }

  removeFromCart(itemId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  updateQuantity(itemId: string, quantity: number) {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  getCartTotal(): number {
    return this.paymentService.calculateTotal(this.cartItems);
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Payment Processing
  async processPayment() {
    if (!this.isFormValid()) {
      return;
    }

    this.isProcessingPayment = true;

    const bookingDetails: BookingDetails = {
      checkinDate: this.selectedDate,
      items: this.cartItems,
      totalAmount: this.getCartTotal(),
      customerInfo: this.customerInfo
    };

    try {
      const result = await this.paymentService.initiatePayment(bookingDetails, this.selectedPaymentMethod);
      this.orderDetails = result;
      this.orderConfirmed = true;
      console.log('Order confirmed:', result);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      this.isProcessingPayment = false;
    }
  }

  isFormValid(): boolean {
    return !!(
      this.selectedDate &&
      this.cartItems.length > 0 &&
      this.customerInfo.name &&
      this.customerInfo.email &&
      this.customerInfo.phone &&
      this.customerInfo.address
    );
  }

  // Utility Methods
  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.selectedDate;
      case 2:
        return this.cartItems.length > 0;
      case 3:
        return this.isFormValid();
      default:
        return false;
    }
  }

  canProceedToStep(step: number): boolean {
    for (let i = 1; i < step; i++) {
      if (!this.isStepCompleted(i)) {
        return false;
      }
    }
    return true;
  }

  resetOrder() {
    this.currentStep = 1;
    this.selectedDate = '';
    this.cartItems = [];
    this.customerInfo = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };
    this.selectedPaymentMethod = 'online';
    this.orderConfirmed = false;
    this.orderDetails = null;
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}