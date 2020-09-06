/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51HNebGFtQoGJUP750yAsgsC6aVykqgJ29nCdTNdC38Kuyz2s2rV4duVZNS8mEASfuZZNEKDnzBHd1ku14m9AKCTv00jCwg2Dt6'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get the session from our API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    // 2) Use stripe to create checkout form and charge the price
  } catch (err) {
    showAlert('error', err);
  }
};
