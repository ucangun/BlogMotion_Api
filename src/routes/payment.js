const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  /*
    #swagger.tags = ["Stripe Checkout"]
    #swagger.summary = "Create Checkout Session"
    #swagger.description = 'Creates a Stripe Checkout session for processing a newsletter subscription payment.'
    #swagger.parameters["body"] = {
        in: "body",
        required: true,
        schema: {
            "email": "user@example.com"
        }
    }
    #swagger.responses[200] = {
        description: "Successful creation of the Stripe Checkout session.",
        schema: {
            sessionId: "cs_test_a1b2c3d4e5f6g7h8i9j0k"
        }
    }
    #swagger.responses[400] = {
        description: "Bad Request, missing or invalid parameters.",
        schema: {
            error: "Email is required"
        }
    }
    #swagger.responses[500] = {
        description: "Server error while creating Stripe session.",
        schema: {
            error: "Failed to create payment session"
        }
    }
*/

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Newsletter Subscription",
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      customer_email: email,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

module.exports = router;
