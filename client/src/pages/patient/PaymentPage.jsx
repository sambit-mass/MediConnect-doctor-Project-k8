import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createAppointment } from "../../services/appointmentService";
import { isAuthenticated } from "../../services/auth";
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: doctorIdParam } = useParams();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { selectedDate, selectedTime } = location.state || {};

  const mockFee = 1000.0;
  const mockTax = 180.0;
  const total = mockFee + mockTax;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", {
        replace: true,
        state: { from: `/patient/book-appointment/${doctorIdParam}` },
      });
    } else if (!selectedDate || !selectedTime) {
      navigate(`/patient/book-appointment/${doctorIdParam}`, { replace: true });
    }
  }, [doctorIdParam, navigate, selectedDate, selectedTime]);

  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Simulate a brief processing delay, then mark as successful
      await new Promise((resolve) => setTimeout(resolve, 1200));

      await createAppointment({
        doctorId: doctorIdParam,
        date: selectedDate,
        time: selectedTime,
        paymentId: `mock_pay_${Date.now()}`,
      });

      setPaymentSuccess(true);

      setTimeout(() => {
        navigate("/patient/my-appointments");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "Could not book appointment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    navigate(-1);
  };

  if (!selectedDate || !selectedTime) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
        <p className="payment-tag">Checkout</p>
        <h2>Complete your Payment</h2>

        {!paymentSuccess ? (
          <>
            <div className="bill-summary">
              <div className="bill-row">
                <span>Consultation Fee</span>
                <span>₹{mockFee.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Taxes & Platform Fees</span>
                <span>₹{mockTax.toFixed(2)}</span>
              </div>
              <div className="bill-total">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {errorMessage && <p className="payment-error">{errorMessage}</p>}

            <button
              className="pay-btn"
              onClick={handlePayNow}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing Payment..." : `Pay ₹${total.toFixed(2)}`}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancelPayment}
              disabled={isProcessing}
            >
              Cancel
            </button>
          </>
        ) : (
          <div className="payment-success">
            <h3>🎉 Payment Successful!</h3>
            <p>Your appointment is confirmed. Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
