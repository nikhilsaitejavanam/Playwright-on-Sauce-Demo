import {test,expect} from '@playwright/test';
import {DashboardPage} from '../pages/dashboard-page';
import {LoginPage} from '../pages/login-page';
import {logger} from '../helpers/logger';

import {ENV_CONFIG} from '../config/environment';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.describe('Dashboard page tests',()=>{

    test.beforeEach(async({page})=>{
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await page.goto("/");
        await loginPage.login(ENV_CONFIG.SAUCE_USERNAME, ENV_CONFIG.SAUCE_PASSWORD);
        await page.waitForLoadState('networkidle');
    })

    test.afterEach(async({page})=>{
        await page.close();
    })

    test.describe('Products Filter tests',()=>{
        
        test('Should filter products when Ascending order on names appliead',{tag:'@smoke'},async({page})=>{
            const namesBefore=await dashboardPage.getAllProductsNames();
            logger.info(`Names before applying ascending filter: ${namesBefore}`);
            await dashboardPage.applyProductFilter('Name (A to Z)');
            const namesAfter=await dashboardPage.getAllProductsNames();
            logger.info(`Names after applying ascending filter: ${namesAfter}`);
            expect(namesAfter).toEqual(namesBefore.sort((a,b)=>a.localeCompare(b)));
            logger.info(`Assertion passed for ascending name filter.`);
        });

        test('Should filter products when Descending order on names applied',{tag:'@smoke'},async({page})=>{
            const namesBefore=await dashboardPage.getAllProductsNames();
            logger.info(`Names before applying descending filter: ${namesBefore}`);
            await dashboardPage.applyProductFilter('Name (Z to A)');
            const namesAfter=await dashboardPage.getAllProductsNames();
            logger.info(`Names after applying descending filter: ${namesAfter}`);
            expect(namesAfter).toEqual(namesBefore.sort((a,b)=>a.localeCompare(b)).reverse());
            logger.info(`Assertion passed for descending name filter.`);
        });

        test('Should filter products when Ascending order on prices appliead',{tag:'@smoke'},async({page})=>{
            const pricesBefore=await dashboardPage.getAllProductsPrices();
            logger.info(`Prices before applying ascending filter: ${pricesBefore}`);
            await dashboardPage.applyProductFilter('Price (low to high)');
            const pricesAfter=await dashboardPage.getAllProductsPrices();
            logger.info(`Prices after applying ascending filter: ${pricesAfter}`);
            expect(pricesAfter).toEqual(pricesBefore.sort((a,b)=>a-b));
            logger.info(`Assertion passed for ascending price filter.`);
        });

        test('Should filter products when Descending order on prices applied',{tag:'@smoke'},async({page})=>{
            const pricesBefore=await dashboardPage.getAllProductsPrices();
            logger.info(`Prices before applying descending filter: ${pricesBefore}`);
            await dashboardPage.applyProductFilter('Price (high to low)');
            const pricesAfter=await dashboardPage.getAllProductsPrices();
            logger.info(`Prices after applying descending filter: ${pricesAfter}`);
            expect(pricesAfter).toEqual(pricesBefore.sort((a,b)=>a-b).reverse());
            logger.info(`Assertion passed for descending price filter.`);
        });

    });

})