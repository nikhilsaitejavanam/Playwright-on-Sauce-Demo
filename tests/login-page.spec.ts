import {test,expect} from '@playwright/test';
import {LoginPage} from '../pages/login-page';
import {logger} from '../helpers/logger';

import { ENV_CONFIG } from '../config/environment';

let loginPage: LoginPage;

test.describe('Login Page Tests', ()=>{
    test.beforeEach(async({page})=>{
        loginPage = new LoginPage(page);
        await page.goto('/');
        logger.info(`Navigated to Application`);
    })

    test.afterEach(async({page})=>{
        logger.info(`Test completed, closing page`);
        await page.close();
    })

    test('Should login successfully with valid credentials',{tag: '@smoke'}, async({page})=>{
        const {status, errorMessage} = await loginPage.login(ENV_CONFIG.SAUCE_USERNAME, ENV_CONFIG.SAUCE_PASSWORD);
        expect(status).toBe(true);
        logger.info(`Login successful`);
    });

    test('Should fail login with invalid credentials',{tag:'@smoke'},async({page})=>{
        const {status, errorMessage} = await loginPage.login('invalid_user', 'invalid_sauce');
        expect(status).toBe(false);
        logger.info(`Login failed as expected with invalid credentials`);
        expect(errorMessage).toBe('Epic sadface: Username and password do not match any user in this service');
    });

    test('Should fail login with empty credentials',{tag:'@edge'},async({page})=>{
        const {status, errorMessage} = await loginPage.login('', '');
        expect(status).toBe(false);
        logger.info(`Login failed as expected with empty credentials`);
        expect(errorMessage).toBe('Epic sadface: Username is required');
    });

});