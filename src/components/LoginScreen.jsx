import React, { useState } from 'react';
import { IconAlertSquare } from '../utils/svgIcons';

export default function LoginScreen({ onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('9820012345');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mockSentOtp, setMockSentOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('Enter valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    const generatedOtp = '4829';
    setMockSentOtp(generatedOtp);
    setOtpCode(generatedOtp);
    setOtpSent(true);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length === 0) {
      setErrorMsg('Enter 4-digit verification code');
      return;
    }
    setErrorMsg('');
    onLoginSuccess({
      name: 'Citizen Auditor',
      phone: phoneNumber,
      verifiedAt: '2026-08-22',
      role: 'Citizen Auditor',
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col justify-center items-center p-4 font-mono">
      <div className="w-full max-w-md bg-panel border-t-2 border-border-heavy p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1 pb-4 border-b border-border-hard">
          <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">
            MCGM CITIZEN PORTAL
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-ink-primary font-sans">
            Mumbai Civic Scorecard
          </h1>
          <p className="text-xs text-ink-secondary">
            Ward accountability & contractor execution audit ledger
          </p>
        </div>

        {/* Form */}
        <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-ink-muted block">
              Mobile Phone Number
            </label>
            <div className="flex">
              <span className="bg-panel-sub border border-r-0 border-border-hard px-3 py-2 text-ink-secondary font-bold">
                +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit number"
                className="w-full bg-panel border border-border-hard px-3 py-2 text-ink-primary focus:outline-none focus:border-border-heavy text-sm"
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              type="submit"
              className="w-full bg-border-heavy text-panel hover:bg-ink-secondary py-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Send Verification OTP
            </button>
          ) : (
            <div className="space-y-4 pt-2 border-t border-border-hard">
              <div className="text-[11px] text-ink-secondary flex justify-between">
                <span>OTP transmitted to: +91 {phoneNumber}</span>
                <span className="font-bold text-stark-green">Code: {mockSentOtp}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-ink-muted block">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-panel border border-border-hard px-3 py-2 text-center text-lg tracking-widest text-ink-primary focus:outline-none focus:border-border-heavy"
                />
              </div>

              <button
                type="button"
                onClick={handleVerify}
                className="w-full bg-border-heavy text-panel hover:bg-ink-secondary py-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Verify and Proceed →
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[11px] text-ink-secondary hover:text-ink-primary underline cursor-pointer"
                >
                  Change Mobile Number
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-xs text-stark-orange font-bold pt-1">
              * {errorMsg}
            </div>
          )}
        </form>

        <div className="border-t border-border-hard pt-4 text-[10px] text-ink-muted text-center">
          Official Civic Repository for Greater Mumbai Jurisdictions
        </div>
      </div>
    </div>
  );
}
