exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    // Mock order — no Razorpay, just return a fake success response
    res.json({
      id: `mock_order_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      status: "created",
    });
  } catch (error) {
    res.status(500).json({ error: "Order creation failed" });
  }
};
