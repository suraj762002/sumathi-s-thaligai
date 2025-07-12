import { Injectable } from '@angular/core';

declare var Razorpay: any;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'meal' | 'rice' | 'podi';
}

export interface BookingDetails {
  checkinDate: string;
  items: OrderItem[];
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private razorpayKey = 'rzp_test_your_key_here'; // Replace with your actual key

  constructor() {
    this.loadRazorpayScript();
  }

  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof Razorpay !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  async initiatePayment(bookingDetails: BookingDetails, paymentMethod: 'online' | 'cod'): Promise<any> {
    if (paymentMethod === 'cod') {
      return this.processCODOrder(bookingDetails);
    }

    await this.loadRazorpayScript();

    const options = {
      key: this.razorpayKey,
      amount: bookingDetails.totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: "Sumathi's Thaligai",
      description: `Food Order for ${bookingDetails.checkinDate}`,
      image: '/assets/logo.png',
      order_id: this.generateOrderId(),
      prefill: {
        name: bookingDetails.customerInfo.name,
        email: bookingDetails.customerInfo.email,
        contact: bookingDetails.customerInfo.phone
      },
      notes: {
        checkin_date: bookingDetails.checkinDate,
        items: JSON.stringify(bookingDetails.items)
      },
      theme: {
        color: '#4a6b89'
      },
      method: {
        upi: true,
        card: true,
        netbanking: false,
        wallet: false,
        emi: false,
        paylater: false
      },
      handler: (response: any) => {
        return this.handlePaymentSuccess(response, bookingDetails);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled');
        }
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  private generateOrderId(): string {
    return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private handlePaymentSuccess(response: any, bookingDetails: BookingDetails): Promise<any> {
    return new Promise((resolve) => {
      console.log('Payment successful:', response);
      // Here you would typically send the payment details to your backend
      const orderConfirmation = {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        bookingDetails: bookingDetails,
        status: 'paid',
        timestamp: new Date().toISOString()
      };
      resolve(orderConfirmation);
    });
  }

  private processCODOrder(bookingDetails: BookingDetails): Promise<any> {
    return new Promise((resolve) => {
      const orderConfirmation = {
        orderId: this.generateOrderId(),
        bookingDetails: bookingDetails,
        status: 'cod_confirmed',
        timestamp: new Date().toISOString()
      };
      resolve(orderConfirmation);
    });
  }

  calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}