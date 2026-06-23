import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { flushSync } from "react-dom";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import { KeyRound, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { auth } from "@/Firebase/firebase";
import { db } from "@/Firebase/firebase";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { useAdmin } from "../context/useAdmin";
import { usePinGate } from "../context/usePinGate";
import { AdminLoading } from "../components/AdminLoading";
import { COLLECTIONS } from "../lib/collections";
import {
  createPinCredential,
  isValidPin,
  PIN_ITERATIONS,
  PIN_LENGTH,
  verifyPin,
} from "../lib/pin";
import { writeAuditLog } from "../lib/audit";

/** Masked PIN dot-slots for the full-page entry form. */
function PinSlots({ count, invalid }: { count: number; invalid: boolean }) {
  const ctx = useContext(OTPInputContext);
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: PIN_LENGTH }).map((_, i) => {
        const active = ctx?.slots[i]?.isActive ?? false;
        const filled = i < count;
        return (
          <div
            key={i}
            aria-hidden="true"
            className={cn(
              "relative flex h-14 w-12 items-center justify-center rounded-xl border-2 bg-muted/40 text-sm transition-all duration-150",
              active
                ? "z-10 border-primary ring-4 ring-primary/20 shadow-lg shadow-primary/10"
                : "border-input",
              invalid && "border-destructive ring-4 ring-destructive/20",
            )}
          >
            {filled && (
              <span className="h-3 w-3 rounded-full bg-foreground shadow-sm" />
            )}
            {!filled && active && (
              <span className="h-0.5 w-5 animate-pulse rounded-full bg-primary" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Full-page Security PIN verification screen.
 *
 * Shown after a successful email/password login when the admin already has a
 * PIN configured. Blocks access to the dashboard and all protected routes
 * until the correct PIN is entered. Redirects to /admin/pin-setup if the
 * admin's PIN data is missing or corrupt.
 *
 * Fix notes:
 * - Uses flushSync to commit pinSessionVerified state BEFORE navigate so
 *   RequirePinSession sees the updated value immediately.
 * - Navigates before awaiting any background work (audit log, re-hash).
 * - After a successful verify, re-hashes at the current iteration count in
 *   the background so legacy 150k-iteration PINs are upgraded silently.
 */
export function PinVerify() {
  const { admin, loading } = useAdmin();
  const { completePinSession } = usePinGate();
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Redirect to setup if no PIN is configured
  useEffect(() => {
    if (!loading && admin && !admin.pinHash) {
      navigate("/admin/pin-setup", { replace: true });
    }
  }, [loading, admin, navigate]);

  const handleSubmit = async (candidate: string) => {
    if (busy || !candidate) return;
    if (!admin) {
      setError("No admin account is loaded. Please sign in again.");
      return;
    }
    if (!admin.pinHash || !admin.pinSalt) {
      navigate("/admin/pin-setup", { replace: true });
      return;
    }
    if (!isValidPin(candidate)) {
      setError(`Enter your ${PIN_LENGTH}-digit security PIN.`);
      return;
    }

    setError(null);
    setBusy(true);

    try {
      const ok = await verifyPin(candidate, {
        hash: admin.pinHash,
        salt: admin.pinSalt,
        iterations: admin.pinIterations,
      });

      if (ok) {
        // ── CRITICAL: flushSync commits the state update synchronously so
        // RequirePinSession reads pinSessionVerified=true before navigate
        // renders the dashboard route. Without this, the state batch hasn't
        // committed yet and RequirePinSession bounces the user back.
        flushSync(() => {
          completePinSession();
        });
        navigate("/admin/dashboard", { replace: true });

        // Background work after navigation — don't block the redirect.
        // 1. Silently re-hash at current iteration count if PIN was stored at
        //    a higher count (e.g. legacy 150k), so next verify is fast.
        const storedIterations = admin.pinIterations ?? PIN_ITERATIONS;
        if (storedIterations !== PIN_ITERATIONS) {
          createPinCredential(candidate)
            .then((cred) =>
              updateDoc(doc(db, COLLECTIONS.admins, admin.uid), {
                pinHash: cred.hash,
                pinSalt: cred.salt,
                pinIterations: cred.iterations,
                updatedAt: serverTimestamp(),
              }),
            )
            .catch((err) =>
              console.warn("[PinVerify] background re-hash failed", err),
            );
        }
        // 2. Audit log.
        void writeAuditLog({
          actorUid: admin.uid,
          actorEmail: admin.email,
          action: "admin.pin_verified",
        });
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setError(
          next >= 3
            ? `Incorrect PIN (${next} failed attempts). Please try again carefully.`
            : "Incorrect PIN. Please try again.",
        );
        setPin("");
        setBusy(false);
      }
    } catch (err) {
      console.error("[PinVerify] verification failed", err);
      setError("Could not verify PIN. Please try again.");
      setPin("");
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/admin/login", { replace: true });
  };

  if (loading) {
    return <AdminLoading label="Loading account…" />;
  }

  if (!admin) {
    return null; // ProtectedAdminRoute will redirect to login
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white via-indigo-50/40 to-white px-4 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      {/* Subtle decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/20"
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Security verification
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your{" "}
              <span className="font-medium text-foreground">
                {PIN_LENGTH}-digit PIN
              </span>{" "}
              to access the admin panel.
            </p>
            {admin.displayName && (
              <p className="mt-1 text-xs text-muted-foreground">
                Signed in as{" "}
                <span className="font-medium">{admin.email}</span>
              </p>
            )}
          </div>

          {/* PIN input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(pin);
            }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <OTPInput
                id="pin-verify-input"
                maxLength={PIN_LENGTH}
                value={pin}
                onChange={(val) => {
                  setPin(val);
                  if (error) setError(null);
                  // Auto-submit the moment the last digit is entered.
                  if (val.length === PIN_LENGTH) {
                    void handleSubmit(val);
                  }
                }}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                autoFocus
                disabled={busy}
                containerClassName="flex items-center justify-center"
                aria-label="Security PIN"
              >
                <PinSlots count={pin.length} invalid={!!error} />
              </OTPInput>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  <KeyRound
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={busy || pin.length < PIN_LENGTH}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              )}
              {busy ? "Verifying…" : "Verify PIN"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Sign out */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => void handleSignOut()}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out and use a different account
          </Button>
        </div>

        {/* Attempts warning */}
        {attempts >= 3 && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Too many failed attempts? Sign out and contact your system
            administrator if you&apos;re locked out.
          </p>
        )}
      </div>
    </div>
  );
}
