import React, { useState, useRef } from 'react';
import logoImg from '../assets/nagriksetu-logo.png';

export default function ModernLoginScreen({ onLoginSuccess }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setTimeout(() => {
      if (inputRefs[0].current) inputRefs[0].current.focus();
    }, 100);
  };

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 0) {
      newDigits[index] = cleaned[cleaned.length - 1];
      setOtpDigits(newDigits);
      setErrorMsg('');

      if (index < 3 && inputRefs[index + 1].current) {
        inputRefs[index + 1].current.focus();
      }
    } else {
      newDigits[index] = '';
      setOtpDigits(newDigits);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (inputRefs[index - 1].current) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData.length > 0) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 3);
      if (inputRefs[nextFocus].current) {
        inputRefs[nextFocus].current.focus();
      }
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter all 4 digits of the verification code');
      return;
    }
    setErrorMsg('');
    onLoginSuccess({
      name: fullName.trim() || 'Citizen Auditor',
      phone: phoneNumber,
      verifiedAt: '2026-08-24',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 space-y-6">
        {/* Logo & Headline */}
        <div className="text-center space-y-2.5 pb-2">
          <img
            src={logoImg}
            alt="NagrikSetu Logo"
            className="w-16 h-16 rounded-2xl object-contain mx-auto shadow-xs"
          />
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#0f172a]">Nagrik</span>
            <span className="text-[#16a34a]">Setu</span>
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
            Citizens United for a Better Tomorrow
          </p>
        </div>

        {/* Form */}
        <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="space-y-4 text-xs">
          {/* Full Name / Username Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Full Name / Username
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Mehta"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              disabled={otpSent}
            />
          </div>

          {/* Mobile Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Mobile Phone Number
            </label>
            <div className="flex">
              <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3.5 py-2.5 text-slate-500 font-semibold text-xs flex items-center">
                +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit number"
                className="w-full bg-white border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 text-sm shadow-xs"
                disabled={otpSent}
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-xs cursor-pointer mt-2"
            >
              Send Verification OTP
            </button>
          ) : (
            <div className="space-y-5 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-600 text-center">
                Enter the 4-digit verification code sent to <strong>+91 {phoneNumber}</strong>
              </div>

              {/* 4 Separate Single-Digit Input Boxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block text-center">
                  Verification Code
                </label>
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 bg-white border border-slate-200 rounded-xl text-center text-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-xs cursor-pointer"
              >
                Verify & Enter Platform →
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpDigits(['', '', '', '']);
                    setErrorMsg('');
                  }}
                  className="text-xs text-slate-400 hover:text-blue-600 underline font-medium cursor-pointer"
                >
                  Change Mobile Number or Name
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-xs text-amber-600 font-semibold text-center pt-1">
              * {errorMsg}
            </div>
          )}
        </form>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          Official Civic Portal for Municipal Corporation of Greater Mumbai
        </div>
      </div>
    </div>
  );
}
