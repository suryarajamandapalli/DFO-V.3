import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Stethoscope, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Signup({ onSwitchToLogin, onBackToLanding }: { onSwitchToLogin: () => void, onBackToLanding: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user, signInWithGoogle } = useAuth();


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // 1. Sign up to Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });


    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Profile Creation
      const { error: profileError } = await supabase
        .from('users')
        .upsert([
          {
            id: authData.user.id,
            email: email,
            full_name: fullName,
            created_at: new Date().toISOString(),
          }
        ], { onConflict: 'email' });

      if (profileError) {
        console.warn('Non-blocking profile sync warning:', profileError.message);
      }
    }

    setLoading(false);

    // If session is null, email confirmation is required
    if (!authData.session) {
      setSuccess(true);
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      alert("Verification email resent!");
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-sky-600 mb-6">
          <div className="bg-sky-100 p-3 rounded-xl border border-sky-200">
            <Stethoscope className="w-10 h-10" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Create Clinical Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Join the JanmaSethu Digital Front Office
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg flex flex-col items-center gap-3 text-sm text-center">
                <CheckCircle2 className="w-8 h-8 shrink-0 mb-1" />
                <p className="font-bold">Account created!</p>
                <p>Please check your email inbox to verify your account.</p>
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="mt-2 text-sky-600 font-bold hover:underline disabled:text-slate-400"
                >
                  {loading ? 'Resending...' : 'Didn\'t get an email? Resend'}
                </button>
              </div>
            )}


            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm transition-colors"
                  placeholder="Dr. Sarah Johnson"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm transition-colors"
                  placeholder="sarah@clinic.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm transition-colors"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl shadow-lg border-none font-bold"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up with Credentials'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-500 font-bold uppercase tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => signInWithGoogle()}
                className="w-full py-4 rounded-xl border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>
          </div>


          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-sky-600 hover:text-sky-500 border-b border-transparent hover:border-sky-500 transition-colors"
              >
                Sign in here
              </button>
            </p>
            <button
              onClick={onBackToLanding}
              className="flex w-full justify-center items-center gap-2 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Landing
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

