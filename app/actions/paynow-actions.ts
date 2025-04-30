import { Paynow } from "paynow";

export const paynow = {
  createPayNowOrder: async function (orderId: string, amount: number) {
    try {
      const paynow = new Paynow(
        process.env.INTEGRATION_ID,
        process.env.INTEGRATION_KEY
      );

      paynow.resultUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/${orderId}/verify`;
      paynow.returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/${orderId}/status`;

      const payment = paynow.createPayment(`Invoice_${orderId}`);
      payment.add(`Order ${orderId}`, amount);

      const response = await paynow.send(payment);

      if (!response.success) {
        console.error("PayNow error:", response.error);
        throw new Error(response.error || "Failed to create PayNow payment");
      }

      return {
        link: response.redirectUrl,
        pollUrl: response.pollUrl,
      };
    } catch (error) {
      console.error("Error in createPayNowOrder:", error);
      throw error;
    }
  },

  capturePayNowOrder: async function (pollUrl: string) {
    try {
      const paynow = new Paynow(
        process.env.INTEGRATION_ID,
        process.env.INTEGRATION_KEY
      );

      let paymentStatus;
      let retryCount = 0;
      const maxRetries = 5;
      const retryDelay = 5000; // 5 seconds

      while (retryCount < maxRetries) {
        paymentStatus = await paynow.pollTransaction(pollUrl);
        
        if (paymentStatus.status === "paid") {
          break;
        }
        
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }

      if (!paymentStatus || paymentStatus.status !== "paid") {
        throw new Error("Payment not completed after retries");
      }

      return {
        success: true,
        id: paymentStatus.transactionId,
        paidAt: paymentStatus.paidAt || new Date().toISOString(),
        paymentDetails: paymentStatus,
      };
    } catch (error) {
      console.error("Error in capturePayNowOrder:", error);
      throw error;
    }
  },
};