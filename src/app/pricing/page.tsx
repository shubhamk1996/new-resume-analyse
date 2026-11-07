'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/lib/resume-store';
import { PaymentModal } from '@/components/payment-modal';
import { GoogleAuthModal } from '@/components/google-auth-modal';
import { Button } from '@/components/ui/button';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Download,
  FileCheck2,
  Database,
  Star,
  ChevronRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function PricingPage() {
  const { 
    downloadsUsed, 
    hasActiveSubscription, 
    subscriptionExpiresAt, 
    getSubscriptionRemainingHours,
    user 
  } = useResumeStore();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const remainingHours = getSubscriptionRemainingHours();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-md">
              R
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-foreground">
              ResuFlow <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-primary font-mono ml-1 border border-border">AI</span>
            </span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
            Transparent Pricing
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Dashboard
            </Button>
          </Link>
          <Link href="/builder">
            <Button size="sm" className="h-8 text-xs font-semibold">
              Open Studio
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 py-12 space-y-12">
        {/* Title & Headline */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIMPLE, FAIR & STUDENT-FRIENDLY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-foreground tracking-tight">
            First Download is <span className="text-emerald-500">100% Free</span>.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Create, edit, and export your first polished Enhancv-style resume at zero cost.
            Need more iterations and continuous job applications? Unlock everything for just <strong className="text-foreground">₹19 for 3 full days</strong>.
          </p>
        </div>

        {/* Current User Status Banner */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl flex items-center justify-center font-bold ${
              hasActiveSubscription 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : downloadsUsed === 0 
                ? 'bg-primary/10 text-primary' 
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              {hasActiveSubscription ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : downloadsUsed === 0 ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">Your Account Status:</div>
              <div className="text-sm font-bold text-foreground">
                {hasActiveSubscription 
                  ? `Unlimited 3-Day Pro Pass Active (${remainingHours} hours remaining)`
                  : downloadsUsed === 0
                  ? '1 Free Resume Download Available'
                  : 'Free Download Claimed • ₹19 Pass Required for Next Downloads'}
              </div>
            </div>
          </div>

          {!hasActiveSubscription && (
            <Button
              size="sm"
              onClick={() => setPaymentModalOpen(true)}
              className="text-xs font-bold gap-1.5 shrink-0"
            >
              Get ₹19 Pass
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Comparison Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier Card */}
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold font-display text-foreground">Free Starter</h3>
                  <p className="text-xs text-muted-foreground mt-1">Perfect for drafting and testing your first resume</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-bold">
                  ₹0
                </span>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-extrabold text-foreground">Free</span>
                <span className="text-xs text-muted-foreground ml-2">Forever</span>
              </div>

              <div className="h-px bg-border my-4" />

              <ul className="space-y-3 text-xs text-foreground">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>1 Free Full High-Res PDF Download</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Access to Modern Compact & Minimalist Tech templates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full Drag & Drop Enhancv-style section builder</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Resume upload & AI parsing (.pdf, .docx, .txt)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic ATS Compatibility Score</span>
                </li>
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <Lock className="w-4 h-4 shrink-0 opacity-50" />
                  <span>Subsequent downloads locked after 1st download</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link href="/builder">
                <Button variant="outline" className="w-full text-xs font-semibold py-2.5">
                  Start Building Free
                </Button>
              </Link>
            </div>
          </div>

          {/* ₹19 3-Day Pro Pass */}
          <div className="rounded-3xl bg-gradient-to-b from-card to-card/90 border-2 border-primary p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black tracking-widest px-4 py-1 rounded-bl-xl uppercase shadow-md">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
                    3-Day Unlimited Pass
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Unrestricted access to every single tool for 72 hours
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">₹19</span>
                <span className="text-sm text-muted-foreground line-through">₹299</span>
                <span className="text-xs font-semibold text-primary ml-1">/ 3 days total</span>
              </div>

              <div className="h-px bg-border my-4" />

              <ul className="space-y-3 text-xs text-foreground">
                <li className="flex items-center gap-2.5 font-semibold">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Unlimited PDF & Print Downloads</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All 4 Iconic Templates (Modern, Executive, Tech, Creative)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unlimited AI Bullet Enhancement (STAR, Metrics, Verbs)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Deep ATS Diagnostics + Job Description Gap Matcher</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>72-Hour Fresh Tech Job Radar & 1-Click Company Apply</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Neon Serverless Cloud Database Auto-Sync</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full text-xs font-bold py-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2"
              >
                <span>{hasActiveSubscription ? 'Extend 3-Day Pass (₹19)' : 'Unlock All Services for ₹19'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>One-time ₹19 payment. No auto-renewal traps.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Matrix / FAQ */}
        <div className="pt-10 border-t border-border space-y-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold font-display text-center text-foreground">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
              <div className="font-bold text-foreground">What happens on my first download?</div>
              <p className="text-muted-foreground leading-relaxed">
                Your first download is completely free without needing any card or payment. You can export a vector-quality PDF right away.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
              <div className="font-bold text-foreground">What does the ₹19 pass include?</div>
              <p className="text-muted-foreground leading-relaxed">
                For 3 days (72 hours), you get unlimited PDF downloads, all 4 templates, unlimited AI bullet rewrites, ATS diagnostics, and the 72h jobs radar.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
              <div className="font-bold text-foreground">Will I be charged again automatically?</div>
              <p className="text-muted-foreground leading-relaxed">
                No. It is a strictly one-time payment of ₹19 for 3 days of access. There is zero recurring subscription or hidden fees.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
              <div className="font-bold text-foreground">Which payment methods are supported?</div>
              <p className="text-muted-foreground leading-relaxed">
                We support Google Pay, PhonePe, Paytm, all UPI apps, QR scan, and Credit/Debit cards.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Payment and Auth Modals */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
      <GoogleAuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
    </div>
  );
}
