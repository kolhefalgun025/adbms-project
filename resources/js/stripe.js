import Noty from 'noty'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51K053qSAsAg6Jebt3XCE6g9HdJBn3kb7PbOD5GUxxEImuGsgjQb0oMnVgdML8yOngGyKNMOjRIwCVb8666kL3kHt00QEKF2qMj');

    let card = null;
    function mountWidget() {
        const elements = stripe.elements();

        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }

        card = elements.create('card', { style, hidePostalCode: true });
        card.mount('#card-element')
    }


    const paymentType = document.querySelector('#paymentType');
    if(!paymentType) {
        return;
    }
    paymentType.addEventListener('change', (e) => {
        // console.log(e.target.value);
        if (e.target.value === 'card') {
            // Display Widget
            mountWidget();
        } else {
            card.destroy();
        }
    })

    // Ajax Call
    const paymentForm = document.querySelector('#payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', e => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}

            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            axios.post('/orders', formObject).then(res => {
                // console.log(res.data);
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text: res.data.message,
                    progressBar: false
                }).show();

                setTimeout(() => {
                    window.location.href = '/customer/orders';
                }, 1000)

            }).catch(err => {
                // console.log(err);
                new Noty({
                    type: 'error',
                    timeout: 1000,
                    text: err.res.data.message,
                    progressBar: false
                }).show();
            })
        })
    }
}