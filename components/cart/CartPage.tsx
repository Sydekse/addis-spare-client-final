import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useCart } from '@/context/use-cart';

interface CartPageProps {
  onNavigate: (page: string) => void;
  onProductClick: (productId: string) => void;
}

export function CartPage({ onNavigate, onProductClick }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  
  const shippingFee = 200;
  const taxRate = 0.15;
  const subtotal = getTotalPrice();
  const discount = appliedCoupon?.discount || 0;
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === 'welcome10') {
      setAppliedCoupon({ code: couponCode, discount: subtotal * 0.1 });
      setCouponCode('');
    } else {
      // In a real app, show error message
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart to get started
            </p>
            <Button onClick={() => onNavigate('products')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('products')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-20 h-20 bg-muted rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => onProductClick(item.productId)}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={item.product.images[0] || '/img.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-medium text-sm cursor-pointer hover:text-primary"
                      onClick={() => onProductClick(item.productId)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      SKU: {item.product.sku}
                    </p>
                    {item.product.brand && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {item.product.brand}
                      </Badge>
                    )}
                    {item.compatibilityNote && (
                      <p className="text-xs text-muted-foreground">
                        Note: {item.compatibilityNote}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-lg font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} each
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Clear Cart */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Coupon */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discount Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-700">
                      {appliedCoupon.code}
                    </div>
                    <div className="text-sm text-green-600">
                      -{formatPrice(appliedCoupon.discount)} saved
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCoupon}
                    className="text-green-700 hover:text-green-800"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon} disabled={!couponCode.trim()}>
                    Apply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Tax (15%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => onNavigate('checkout')}
              >
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Secure checkout with 256-bit SSL encryption
              </p>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="text-sm space-y-2">
                <div className="font-medium">Free shipping available:</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Orders over 5,000 ETB</li>
                  <li>• Within Addis Ababa</li>
                  <li>• Delivery in 24-48 hours</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}