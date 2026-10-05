import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard-page";
import { LoginPage } from "../pages/login-page";
import { logger } from "../helpers/logger";

import { ENV_CONFIG } from "../config/environment";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await page.goto("/");
  await loginPage.login(ENV_CONFIG.SAUCE_USERNAME, ENV_CONFIG.SAUCE_PASSWORD);
  await page.waitForLoadState("networkidle");
});

test.afterEach(async ({ page }) => {
  logger.info(`Test completed, closing page`);
  await page.close();
});

test(
  "Should display the dashboard page",
  { tag: "@edge" },
  async ({ page }) => {
    await dashboardPage.checkDashboardTitleVisibility();
    await expect(page).toHaveURL(/\/inventory\.html/);
  },
);

test.describe("Products Filter tests", () => {
  test(
    "Should filter products when Ascending order on names appliead",
    { tag: "@smoke" },
    async ({ page }) => {
      const namesBefore = await dashboardPage.getAllProductsNames();
      logger.info(`Names before applying ascending filter: ${namesBefore}`);
      await dashboardPage.applyProductFilter("Name (A to Z)");
      const namesAfter = await dashboardPage.getAllProductsNames();
      logger.info(`Names after applying ascending filter: ${namesAfter}`);
      expect(namesAfter).toEqual(
        namesBefore.sort((a, b) => a.localeCompare(b)),
      );
      logger.info(`Assertion passed for ascending name filter.`);
    },
  );

  test(
    "Should filter products when Descending order on names applied",
    { tag: "@smoke" },
    async ({ page }) => {
      const namesBefore = await dashboardPage.getAllProductsNames();
      logger.info(`Names before applying descending filter: ${namesBefore}`);
      await dashboardPage.applyProductFilter("Name (Z to A)");
      const namesAfter = await dashboardPage.getAllProductsNames();
      logger.info(`Names after applying descending filter: ${namesAfter}`);
      expect(namesAfter).toEqual(
        namesBefore.sort((a, b) => a.localeCompare(b)).reverse(),
      );
      logger.info(`Assertion passed for descending name filter.`);
    },
  );

  test(
    "Should filter products when Ascending order on prices appliead",
    { tag: "@smoke" },
    async ({ page }) => {
      const pricesBefore = await dashboardPage.getAllProductsPrices();
      logger.info(`Prices before applying ascending filter: ${pricesBefore}`);
      await dashboardPage.applyProductFilter("Price (low to high)");
      const pricesAfter = await dashboardPage.getAllProductsPrices();
      logger.info(`Prices after applying ascending filter: ${pricesAfter}`);
      expect(pricesAfter).toEqual(pricesBefore.sort((a, b) => a - b));
      logger.info(`Assertion passed for ascending price filter.`);
    },
  );

  test(
    "Should filter products when Descending order on prices applied",
    { tag: "@smoke" },
    async ({ page }) => {
      const pricesBefore = await dashboardPage.getAllProductsPrices();
      logger.info(`Prices before applying descending filter: ${pricesBefore}`);
      await dashboardPage.applyProductFilter("Price (high to low)");
      const pricesAfter = await dashboardPage.getAllProductsPrices();
      logger.info(`Prices after applying descending filter: ${pricesAfter}`);
      expect(pricesAfter).toEqual(pricesBefore.sort((a, b) => a - b).reverse());
      logger.info(`Assertion passed for descending price filter.`);
    },
  );
});

test.describe("Menu interaction tests", () => {
  test(
    "Should open the menu and display all options",
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.checkOpenMenuVisibility();
    },
  );

  test(
    "Should close the menu when the close button is clicked",
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.closeMenu();
      await dashboardPage.checkMenuClosedVisibility();
    },
  );

  test(
    'Should display all items when the "All Items" button is clicked in the menu',
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.clickDynamicCatalog("Lazy Load");
      await dashboardPage.checkDynamicCatalogContainer("Lazy Load");
      await dashboardPage.openMenu();
      await dashboardPage.clickAllItemsInMenu();
      await dashboardPage.checkAllItemsVisibility();
    },
  );

  test(
    'Should display products in lazy load when the "Lazy Load" option is clicked in the dynamic catalog',
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.clickDynamicCatalog("Lazy Load");
      await dashboardPage.checkDynamicCatalogContainer("Lazy Load");
      await dashboardPage.checkLazyLoad();
    },
  );

  test(
    'Should display products in spinner when the "Spinner" option is clicked in the dynamic catalog',
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.clickDynamicCatalog("Spinner");
      await dashboardPage.checkDynamicCatalogContainer("Spinner");
      await dashboardPage.checkSpinner();
    },
  );

  test(
    'Should display products in slider when the "Slider" option is clicked in the dynamic catalog',
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.clickDynamicCatalog("Slider");
      await dashboardPage.checkDynamicCatalogContainer("Slider");
      await dashboardPage.checkSlider();
    },
  );

  test(
    'Should navigate to the About page when the "About" option is clicked in the menu',
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.clickAboutInMenu();
      await dashboardPage.checkAboutPage();
    },
  );

  test(
    'Should log out successfully when the "Logout" option is clicked in the menu',
    { tag: "@smoke" },
    async ({ page }) => {
      await dashboardPage.openMenu();
      await dashboardPage.clickLogoutInMenu();
      await expect(page).toHaveURL(ENV_CONFIG.BASE_URL);
    },
  );

  test(
    "Should display initial state of dashboard page after resetting app state",
    { tag: "@smoke" },
    async ({ page }) => {
      const AllItems = await dashboardPage.getAllProductsNames();
      await dashboardPage.addToCartByNames([AllItems[0], AllItems[4]]);
      const cartBadgeCountBeforeReset = await dashboardPage.getCartBadgeCount();
      expect(cartBadgeCountBeforeReset).toBe(2);
      await dashboardPage.openMenu();
      await dashboardPage.clickResetAppStateInMenu();
      await dashboardPage.checkAllItemsVisibility();
      const cartBadgeCountAfterReset = await dashboardPage.getCartBadgeCount();
      expect(cartBadgeCountAfterReset).toBe(0);
    },
  );
});

test.describe("Cart Badge Tests", () => {
  test(
    "Should display cart badge count when items are added to the cart",
    { tag: "@edge" },
    async ({ page }) => {
      const allItems = await dashboardPage.getAllProductsNames();
      await dashboardPage.addToCartByNames([allItems[0], allItems[1]]);
      const cartBadgeCount = await dashboardPage.getCartBadgeCount();
      expect(cartBadgeCount).toBe(2);
    },
  );

  test(
    "Should decrease badge count when an item is removed from the cart",
    { tag: "@edge" },
    async ({ page }) => {
      const allItems = await dashboardPage.getAllProductsNames();
      await dashboardPage.addToCartByNames([
        allItems[0],
        allItems[1],
        allItems[4],
      ]);
      const cartBadgeCountBeforeRemoval =
        await dashboardPage.getCartBadgeCount();
      await dashboardPage.removeFromCartByNames([allItems[0], allItems[4]]);
      const cartBadgeCountAfterRemoval =
        await dashboardPage.getCartBadgeCount();
      expect(cartBadgeCountAfterRemoval).toBe(cartBadgeCountBeforeRemoval - 2);
    },
  );
});
