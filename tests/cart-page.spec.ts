import { test, expect } from "@playwright/test";
import { CartPage } from "../pages/cart-page";
import { DashboardPage } from "../pages/dashboard-page";
import { LoginPage } from "../pages/login-page";
import { logger } from "../helpers/logger";

import { ENV_CONFIG } from "../config/environment";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let cartPage: CartPage;

test.describe("Cart Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cartPage = new CartPage(page);
    await page.goto("/");
    await loginPage.login(ENV_CONFIG.SAUCE_USERNAME, ENV_CONFIG.SAUCE_PASSWORD);
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test.describe("Navigation Tests", () => {
    test(
      "Should navigate to the cart page",
      { tag: "@edge" },
      async ({ page }) => {
        await dashboardPage.openCart();
        await cartPage.checkCartTitle();
        await expect(page).toHaveURL(/\/cart\.html/);
      },
    );

    test(
      "Should naviagate back to dashboard page from the cart page",
      { tag: "@edge" },
      async ({ page }) => {
        await dashboardPage.openCart();
        await cartPage.checkCartTitle();
        await cartPage.navigateBackToDashboard();
        await dashboardPage.checkAllItemsVisibility();
        await expect(page).toHaveURL(/\/inventory\.html/);
      },
    );
  });

  test.describe("Cart Badge and Item Tests", () => {
    test(
      "Should display cart badge count when items are added to the cart",
      { tag: "@smoke" },
      async ({ page }) => {
        const allItems = await dashboardPage.getAllProductsNames();
        await dashboardPage.addToCartByNames([
          allItems[0],
          allItems[1],
          allItems[5],
        ]);
        await dashboardPage.openCart();
        const cartBadgeCount = await cartPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe(3);
      },
    );

    test(
      "Should display added cart items in the cart",
      { tag: "@smoke" },
      async ({ page }) => {
        const allItems = await dashboardPage.getAllProductsNames();
        await dashboardPage.addToCartByNames([
          allItems[0],
          allItems[1],
          allItems[3],
        ]);
        await dashboardPage.openCart();
        await cartPage.checkAddedCartItems([
          allItems[0],
          allItems[1],
          allItems[3],
        ]);
      },
    );

    test(
      "Should display same item prices in the cart as on the dashboard",
      { tag: "@smoke" },
      async ({ page }) => {
        const allItems = await dashboardPage.getAllProductsNames();
        await dashboardPage.addToCartByNames([allItems[4]]);
        const dashboardPrice =
          await dashboardPage.getIndividualProductPriceByName(allItems[4]);
        await dashboardPage.openCart();
        const cartPrice = await cartPage.getIndividualCartItemPriceByName(
          allItems[4],
        );
        expect(cartPrice).toBe(dashboardPrice);
      },
    );

    test(
      "Should display decreased cart badge count when an item is removed from the cart",
      { tag: "@smoke" },
      async ({ page }) => {
        const allItems = await dashboardPage.getAllProductsNames();
        await dashboardPage.addToCartByNames([
          allItems[0],
          allItems[1],
          allItems[4],
        ]);
        const cartBadgeCountBeforeRemoval = await cartPage.getCartBadgeCount();
        await dashboardPage.openCart();
        await cartPage.removeCartItemByNames([allItems[0]]);
        const cartBadgeCountAfterRemoval = await cartPage.getCartBadgeCount();
        expect(cartBadgeCountAfterRemoval).toBe(
          cartBadgeCountBeforeRemoval - 1,
        );
      },
    );

    test(
      "Should remove cart items from the cart",
      { tag: "@smoke" },
      async ({ page }) => {
        const allItems = await dashboardPage.getAllProductsNames();
        await dashboardPage.addToCartByNames([
          allItems[0],
          allItems[1],
          allItems[3],
        ]);
        await dashboardPage.openCart();
        await cartPage.removeCartItemByNames([allItems[0], allItems[3]]);
        await cartPage.checkRemovedCartItems([allItems[0], allItems[3]]);
      },
    );
  });
});
