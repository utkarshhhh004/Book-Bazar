
import Razorpay from "razorpay";
import { env } from "./env.js";

if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Razorpay configuration is incomplete. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the root .env file."
  );
}

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
