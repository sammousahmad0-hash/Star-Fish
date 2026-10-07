import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext.js';
import * as api from '../../services/api.js';
import { ShieldCheck, Lock, User, KeyRound, X, AlertCircle, Loader2 } from 'lucide-react';

interface ManagerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManagerAuthModal({ isOpen, onClose, onSuccess }: ManagerAuthModalProps) {
  const {
    t,
    loginManagerUser,
    setupManagerUser,
    checkManagerAuthStatus
  } = useRestaurant();

  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [hasAccount, setHasAccount] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Always query the server directly when the modal opens
  useEffect(() => {
    let mounted = true;
    if (isOpen) {
      setLoadingStatus(true);
      setError(null);
      api.checkAuthStatus()
        .then(status => {
          if (mounted) {
            setHasAccount(status.hasAccount);
            // Pre-fill username if helpful or leave clean
            if (status.hasAccount && status.username) {
              setUsername(status.username);
            }
            setLoadingStatus(false);
          }
        })
        .catch(err => {
          if (mounted) {
            console.error('Failed to check auth status:', err);
            // Default to hasAccount: true for safety so setup is never exposed erroneously
            setHasAccount(true);
            setLoadingStatus(false);
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError(t.fillAllFields);
      return;
    }

    setSubmitting(true);
    try {
      if (!hasAccount) {
        // First time setup
        if (password !== confirmPassword) {
          setError(t.passwordsDoNotMatch);
          setSubmitting(false);
          return;
        }
        if (password.length < 3) {
          setError('Password must be at least 3 characters long.');
          setSubmitting(false);
          return;
        }
        await setupManagerUser(username.trim(), password, confirmPassword);
        await checkManagerAuthStatus();
        onSuccess();
      } else {
        // Existing account login
        await loginManagerUser(username.trim(), password);
        await checkManagerAuthStatus();
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.invalidCredentials;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#081220] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-left rtl:text-right">
        {/* Accent Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#60A5FA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#E2B774]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#60A5FA] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white tracking-wide">
              {loadingStatus
                ? t.loading
                : !hasAccount
                ? t.setupManagerTitle
                : t.loginManagerTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {!hasAccount ? t.setupManagerSubtitle : t.loginManagerSubtitle}
            </p>
          </div>
        </div>

        {/* Loading Spinner during initial check */}
        {loadingStatus ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#60A5FA]" />
            <span className="text-xs">{t.loading}</span>
          </div>
        ) : (
          <>
            {/* First Time Setup Notice Banner */}
            {!hasAccount && (
              <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{t.setupManagerNotice}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.fieldUsername}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. manager"
                    className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-2.5 rounded-xl bg-[#060D17] border border-slate-700 focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.fieldPassword}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-2.5 rounded-xl bg-[#060D17] border border-slate-700 focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password Field (Only when NO account exists yet) */}
              {!hasAccount && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.fieldConfirmPassword}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 py-2.5 rounded-xl bg-[#060D17] border border-slate-700 focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-sm font-semibold tracking-wide shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.loading}</span>
                  </>
                ) : !hasAccount ? (
                  <span>{t.btnSetupAccount}</span>
                ) : (
                  <span>{t.btnLogin}</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
