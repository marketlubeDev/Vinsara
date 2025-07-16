import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useVerifyOtp, useResendOtp } from "../../hooks/queries/auth";

export const Verification = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email);
    const { mutate: verifyOtp, isPending, isError } = useVerifyOtp();
    const { mutate: resendOtp, isPending: isResendPending, isError: isResendError } = useResendOtp();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const handleOtpChange = (index, value) => {
        setError(""); // Clear error when user starts typing
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input if current input is filled
        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
        if (nextEmptyIndex !== -1) {
            inputRefs[nextEmptyIndex].current.focus();
        } else {
            inputRefs[3].current.focus();
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join("");

        if (otpString.length !== 4) {
            setError("Please enter all 4 digits");
            return;
        }

        verifyOtp({ email, otp: otpString });
    };

    const handleResend = () => {
        // Reset OTP inputs
        setOtp(["", "", "", ""]);
        setError("");
        resendOtp(email);
    };

    return (
        <div className="verification-container">
            <div className="verification-card">
                <div className="verification-content">
                    <div className="verification-header">
                        <h2>Verification Code</h2>
                        <p>Please enter the verification code sent to your email</p>
                        {error && <div className="error-message">{error}</div>}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-container">
                            <div className="otp-section">
                                <div className="otp-inputs">
                                    {otp.map((digit, index) => (
                                        <div key={index} className="otp-input-container">
                                            <input
                                                ref={inputRefs[index]}
                                                className={`otp-input ${error ? 'error' : ''}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                autoComplete="off"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="submit-section">
                                <button type="submit" className="submit-button">
                                    Verify
                                </button>
                                <button type="button" className="resend-button" onClick={handleResend} disabled={isResendPending}>
                                    {isResendPending ? "Resending..." : "Resend Code"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
