require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:5501",
      "http://127.0.0.1:5501",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stdavdancaringheartsinitiative@gmail.com",
    pass: "smti zwax zkmq kwfu",
  },
});

// Contact form endpoint
app.post("/contact", async (req, res) => {
  console.log("Received contact form data:", req.body);
  const { name, email, subject, message } = req.body;

  // Email content
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "stdavdancaringheartsinitiative@gmail.com",
    replyTo: email,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Thank you for your message. We will get back to you soon!",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).json({
      success: false,
      message:
        "Sorry, there was an error sending your message. Please try again later.",
    });
  }
});

// Payment initialization endpoint
app.post("/initialize-payment", async (req, res) => {
  try {
    console.log("Payment initialization request received:", req.body);
    const {
      amount,
      email = "donor@example.com",
      name = "Anonymous Donor",
    } = req.body;

    const payload = {
      tx_ref: "STDAVDAN-" + Date.now(),
      amount: amount,
      currency: "NGN",
      payment_options: "card",
      redirect_url: "http://localhost:5500/donation-success.html",
      meta: {
        consumer_id: 23,
        consumer_mac: "92a3-912ba-1192a",
      },
      customer: {
        email: email,
        phonenumber: "080****4528",
        name: name,
      },
      customizations: {
        title: "St. DAVDAN Initiatives Donation",
        description: "Donation to support our cause",
        logo: "http://localhost:5500/images/footer%20logo.jpg",
      },
    };

    console.log("Sending payload to Flutterwave:", payload);

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Flutterwave response:", response.data);

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Payment initialization failed");
    }

    res.status(200).json({
      success: true,
      authorization_url: response.data.data.link,
    });
  } catch (error) {
    console.error("Detailed payment error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({
      success: false,
      message: "Payment initialization failed: " + error.message,
    });
  }
});

// Add webhook endpoint for payment verification
app.post("/webhook", async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    // Verify the webhook signature
    if (!signature || signature !== secretHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const payload = req.body;

    // Verify the transaction
    const response = await flw.Transaction.verify({ id: payload.data.id });

    if (response.data.status === "successful") {
      // Handle successful payment
      console.log("Payment verified successfully:", response.data);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/test-flutterwave", (req, res) => {
  try {
    if (!flw || !flw.Payment) {
      throw new Error("Flutterwave not properly initialized");
    }
    res.json({
      success: true,
      message: "Flutterwave initialized successfully",
      publicKey: process.env.FLW_PUBLIC_KEY.substring(0, 10) + "...", // Only show part of the key for security
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
