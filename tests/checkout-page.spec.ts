import {test,expect} from '@playwright/test';
import { CheckoutPage } from '../pages/checkout-page';
import { CartPage } from '../pages/cart-page';
import {LoginPage} from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import {logger} from '../helpers/logger';

import {ENV_CONFIG} from '../config/environment';

let checkoutPage: CheckoutPage;
let cartPage: CartPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.describe('Checkout Page Tests', () => {

    test.beforeEach(async({page})=>{
        checkoutPage = new CheckoutPage(page);
        cartPage = new CartPage(page);
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await page.goto('/');
        await loginPage.login(ENV_CONFIG.SAUCE_USERNAME, ENV_CONFIG.SAUCE_PASSWORD);
        await page.waitForLoadState('networkidle');
        const allItems = await dashboardPage.getAllProductsNames();
        await dashboardPage.addToCartByNames([
          allItems[0],
          allItems[1],
          allItems[4],
        ]);
        await dashboardPage.openCart();
    });

    test.afterEach(async({page})=>{
        await page.close();
    });

    test.describe('Navigation Tests', () => {
        test('Should navigate to checkout page', {tag:'@smoke'},async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.checkCheckoutPageTitle();
            await expect(page).toHaveURL(/.*checkout-step-one.html/);
        });

        test('Should navigate to cart page when clicks on cancel button', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.navigateToCartByCancel();
            await expect(page).toHaveURL(/.*cart.html/);
        });

        test('Should navigate to checkout step two page after filling checkout form', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await checkoutPage.navigateToOverview();
            await expect(page).toHaveURL(/.*checkout-step-two.html/);
        });

        test('Should navigate to finish page from overview page', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await checkoutPage.navigateToOverview();
            await checkoutPage.navigateToFinishPage();
            await expect(page).toHaveURL(/.*checkout-complete.html/);
        });

        test('Should navigate to home page from finish page', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await checkoutPage.navigateToOverview();
            await checkoutPage.navigateToFinishPage();
            await checkoutPage.navigateToHomePage();
            await expect(page).toHaveURL(/.*inventory.html/);
        });
    });

    test.describe('Error Handling Tests', () => {
        test('Should display error message when First Name missed in checkout form', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillLastName('Doe');
            await checkoutPage.fillPostalCode('12345');
            await checkoutPage.navigateToOverview();
            const {status,errorMessage} = await checkoutPage.errorStatus();
            expect(status).toBe(false);
            expect(errorMessage).toBe('Error: First Name is required');
        });

        test('Should display error message when Last Name missed in checkout form', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillFirstName('John');
            await checkoutPage.fillPostalCode('12345');
            await checkoutPage.navigateToOverview();
            const {status,errorMessage} = await checkoutPage.errorStatus();
            expect(status).toBe(false);
            expect(errorMessage).toBe('Error: Last Name is required');
        });

        test('Should display error message when Postal Code missed in checkout form', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillFirstName('John');
            await checkoutPage.fillLastName('Doe');
            await checkoutPage.navigateToOverview();
            const {status,errorMessage} = await checkoutPage.errorStatus();
            expect(status).toBe(false);
            expect(errorMessage).toBe('Error: Postal Code is required');
        });
    });

    test.describe('Order related tests', ()=>{
        test('Should display products in checkout overview page which were added to cart', {tag:'@smoke'}, async({page})=>{
            const allProductNamesInCart = await cartPage.getAllProductNamesInCart();
            await cartPage.navigateToCheckout();
            await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await checkoutPage.navigateToOverview();
            const allProductNamesInOverview=await checkoutPage.getAllProductsInOverview();
            for(const productName of allProductNamesInCart){
                expect(allProductNamesInOverview).toContain(productName);
            }
        });

        test('Should display correct subtotal,total in checkout overview page', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await checkoutPage.navigateToOverview();
            const allProductPricesInOverview = await checkoutPage.getAllProductsPricesInOverview();
            const sumOfAllProductPricesInOverview = allProductPricesInOverview.reduce((acc, price) => acc + price, 0);
            const subTotalInOverview = await checkoutPage.getSubTotalInOverview();
            expect(subTotalInOverview).toBe(sumOfAllProductPricesInOverview);
            const totalAmountInOverview = await checkoutPage.getTotalAmountInOverview();
            const taxAmountInOverview = await checkoutPage.getTaxAmountInOverview();
            expect(totalAmountInOverview).toBe(subTotalInOverview + taxAmountInOverview);
        });

        test('Should display order confirmation in finish page', {tag:'@smoke'}, async({page})=>{
            await cartPage.navigateToCheckout();
            await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await checkoutPage.navigateToOverview();
            await checkoutPage.navigateToFinishPage();
            const orderConfirmation = await checkoutPage.getOrderConfirmation();
            expect(orderConfirmation).toBe('Thank you for your order!');
        });

        //need to add generate pdf test
    });

});