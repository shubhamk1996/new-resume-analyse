'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/lib/resume-store';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Zap, 
  QrCode, 
  CreditCard, 
  Smartphone,
  Lock,
  ArrowRight,
  X
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export function PaymentModal({ isOpen, onClose, reason }: PaymentModalProps) {
  const { 
    downloadsUsed, 
    hasActiveSubscription, 
    subscriptionExpiresAt, 
    activateSubscription,
    getSubscriptionRemainingHours 
  } = useResumeStore();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      activateSubscription();
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const remainingHours = getSubscriptionRemainingHours();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent Banner */}
        <div className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNLIMITED PRO PASS</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Unlock All Services for ₹19</h2>
          <p className="text-sm text-white/90 mt-1">
            {reason || `You have used your 1 free download. Get 3 days of full access to all features.`}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">₹19</span>
            <span className="text-sm text-white/80 line-through">₹299</span>
            <span className="text-xs font-bold uppercase tracking-wide bg-amber-400 text-slate-900 px-2 py-0.5 rounded-md ml-1">
              Valid for 3 Days (72h)
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Active status if already subscribed */}
          {hasActiveSubscription && remainingHours > 0 && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold block">Pass Active</span>
                <span>You currently have {remainingHours} hours remaining on your pass.</span>
              </div>
            </div>
          )}

          {/* Perks list */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What you get for ₹19:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Unlimited PDF Downloads</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>4 Premium Templates</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Unlimited AI Bullet Polish</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Full ATS Score & Fixes</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>72h Fresh Job Radar</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Neon Cloud Database Sync</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-medium ${
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-secondary/20 hover:bg-secondary/40 text-foreground'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI App / ID</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-medium ${
                  paymentMethod === 'qr'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-secondary/20 hover:bg-secondary/40 text-foreground'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Instant QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-medium ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-secondary/20 hover:bg-secondary/40 text-foreground'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card / NetBanking</span>
              </button>
            </div>
          </div>

          {/* Payment Details Container */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border">
            {paymentMethod === 'upi' && (
              <div className="space-y-3">
                <label className="text-xs font-medium text-foreground block">Enter UPI ID (Google Pay, PhonePe, Paytm)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="username@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setUpiId('user@upi')}
                    className="px-2.5 py-1 text-[11px] rounded bg-secondary text-muted-foreground hover:text-foreground"
                  >
                    Use Sample
                  </button>
                </div>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Supported:</span>
                  <span>GPay</span>
                  <span>PhonePe</span>
                  <span>Paytm</span>
                  <span>BHIM</span>
                </div>
              </div>
            )}

            {paymentMethod === 'qr' && (
              <div className="flex flex-col items-center text-center p-2 space-y-2">
                <div className="size-32 bg-white p-2 rounded-xl flex items-center justify-center border shadow-inner">
                  {/* Visual QR representation */}
                  <div className="size-28 bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="size-6 bg-white rounded flex items-center justify-center">
                        <div className="size-3 bg-slate-900 rounded-xs"></div>
                      </div>
                      <div className="size-6 bg-white rounded flex items-center justify-center">
                        <div className="size-3 bg-slate-900 rounded-xs"></div>
                      </div>
                    </div>
                    <div className="text-[9px] text-emerald-400 font-mono text-center font-bold">
                      SCAN ₹19
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="size-6 bg-white rounded flex items-center justify-center">
                        <div className="size-3 bg-slate-900 rounded-xs"></div>
                      </div>
                      <div className="size-3 bg-white rounded-xs"></div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">Scan with any UPI App to pay ₹19 instantly</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  defaultValue="4532 •••• •••• 8821"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none"
                  readOnly
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="09/28"
                    className="px-3 py-2 rounded-lg bg-background border border-border text-xs"
                    readOnly
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="•••"
                    className="px-3 py-2 rounded-lg bg-background border border-border text-xs"
                    readOnly
                  />
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  256-bit encrypted gateway test simulation
                </p>
              </div>
            )}
          </div>

          {/* Pay Button */}
          <div>
            <button
              type="button"
              disabled={isProcessing || isSuccess}
              onClick={handleSimulatePayment}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                isSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Payment (₹19)...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>3-Day Unlimited Pass Activated!</span>
                </>
              ) : (
                <>
                  <span>Pay ₹19 & Unlock 3 Days Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Safe & Secure Checkout
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Instant 72h Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
