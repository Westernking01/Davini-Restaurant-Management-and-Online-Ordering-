"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPaymentAction, VerifyPaymentResult } from "@/actions/payment-actions";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [verificationState, setVerificationState] = useState<{
    isLoading: boolean;
    result?: VerifyPaymentResult;
  }>({
    isLoading: true,
  });

  useEffect(() => {
    async function verify() {
      if (!reference) {
        setVerificationState({
          isLoading: false,
          result: {
            success: false,
            status: "FAILED",
            errorMessage: "No transaction reference detected in the callback URL.",
          },
        });
        return;
      }

      const res = await verifyPaymentAction(reference);
      setVerificationState({
        isLoading: false,
        result: res,
      });
    }

    verify();
  }, [reference]);

  if (verificationState.isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 shadow-xl animate-pulse">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight font-heading mb-2">
          Verifying Paystack Payment
        </h2>
        <p className="text-sm text-stone-600 max-w-md font-medium">
          Please wait while we confirm your transaction securely with Paystack servers...
        </p>
      </div>
    );
  }

  const { result } = verificationState;
  const isSuccess = result?.success && result.status === "SUCCESS";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shadow-lg shadow-red-500/10">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h2>
          <p className="text-xs text-stone-500 font-mono">
            Ref: {reference || "N/A"}
          </p>
        </div>

        <p className="text-sm text-stone-600 font-medium">
          {isSuccess
            ? "Your transaction has been verified and your feast is now being prepared by our kitchen staff."
            : result?.errorMessage || "We could not verify your payment. If you were charged, please contact support."}
        </p>

        <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
          {isSuccess ? (
            <Button
              onClick={() => router.push("/")}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-xl shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Menu & Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/")}
              className="w-full py-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Return to Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-mono mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Paystack Settlement</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
          <p className="text-sm font-bold text-stone-700">Loading payment status...</p>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
