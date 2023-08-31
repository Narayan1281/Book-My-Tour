import { showAlert } from "./alerts";

const stripe = Stripe('pk_test_51Nkgm7SFwSrQFE24QttNl2B3jOAlwq6oY8YjFmXxG8igAT1jp25CnqXTJjhkP0Klzwwaeqs3Upxvau1YhAxEE4B100ljbVK2j1');

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // console.log(session);

        // 2) Create checkout form +charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};