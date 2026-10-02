import { expect, Page, Locator } from "@playwright/test";
import { logger } from "../helpers/logger";
import { get } from "http";

export class DashboardPage {
  //Title locator
  private readonly dashboardTitle: Locator;

  //All products
  private readonly allItemCards: Locator;
  private readonly allProducts: Locator;
  private readonly allProductsNames: Locator;
  private readonly allProductsPrices: Locator;
  private readonly allProductsCartBtns: Locator;

  //Product filter button
  private readonly productFilterBtn: Locator;

  //Cart locator
  private readonly cartBadgeCount: Locator;

  //Menu locators
  private readonly menuBtn: Locator;
  private readonly allItemsBtn: Locator;
  private readonly dynamicCatalogBtn: Locator;
  private readonly lazyLoadContainer: Locator;
  private readonly spinnerContainer: Locator;
  private readonly sliderContainer: Locator;
  private readonly lazyLoadItems: Locator;
  private readonly spinnerItems: Locator;
  private readonly sliderDots: Locator;
  private readonly sliderItemName: Locator;
  private readonly aboutBtn: Locator;
  private readonly logoutBtn: Locator;
  private readonly resetAppStateBtn: Locator;
  private readonly menuCloseBtn: Locator;

  constructor(private readonly page: Page) {
    //Title locator
    this.dashboardTitle = this.page.locator(".app_logo").first();

    //All products
    this.allItemCards = this.page.locator("div.inventory_item");
    this.allProducts = this.page.locator("div.inventory_list");
    this.allProductsNames = this.page.locator("div.inventory_item_name");
    this.allProductsPrices = this.page.locator("div.inventory_item_price");
    this.allProductsCartBtns = this.page.getByRole("button", {
      name: "Add to cart",
    });

    //Product filter button
    this.productFilterBtn = this.page.getByLabel("Sort products");

    //Cart locator
    this.cartBadgeCount = this.page.locator("span.shopping_cart_badge");

    //Menu locators
    this.menuBtn = this.page.getByRole("button", { name: "Open Menu" });
    this.allItemsBtn = this.page.getByRole("button", { name: "All Items" });
    this.dynamicCatalogBtn = this.page.getByRole("button", {
      name: "Dynamic Catalog",
    });
    this.lazyLoadContainer = this.page.locator(
      "div.dynamic_catalog_lazy_load_container",
    );
    this.spinnerContainer = this.page.locator(
      "div.dynamic_catalog_spinner_grid",
    );
    this.sliderContainer = this.page.locator(
      "div.dynamic_catalog_slider_container",
    );
    this.lazyLoadItems = this.page.locator("div.dynamic_catalog_card");
    this.spinnerItems = this.page.locator("div.dynamic_catalog_card");
    this.sliderDots = this.page.locator("button.dynamic_catalog_slider_dot");
    this.sliderItemName = this.page.locator("div.dynamic_catalog_card_name");
    this.aboutBtn = this.page.getByRole("link", { name: "About" });
    this.logoutBtn = this.page.getByRole("button", { name: "Logout" });
    this.resetAppStateBtn = this.page.getByRole("button", {
      name: "Reset App State",
    });
    this.menuCloseBtn = this.page.getByRole("button", { name: "Close Menu" });
  }

  /**
   *
   * @param productName The name of the product to locate.
   * @returns
   */
  getProductCardByName(productName: string): Locator {
    return this.allItemCards.filter({ hasText: productName });
  }

  /**
   *
   * @param productName The name of the product to locate the price for.
   * @returns The locator for the product's price element.
   */
  getProductPriceByName(productName: string): Locator {
    return this.getProductCardByName(productName).locator(
      "div.inventory_item_price",
    );
  }

  /**
   *
   * @param productName The name of the product to locate the cart button for.
   * @returns The locator for the product's cart button element.
   */
  getProductCartBtnByName(productName: string): Locator {
    return this.getProductCardByName(productName).getByRole("button", {
      name: "Add to cart",
    });
  }

  /**
   *
   * @param option The name of the dynamic catalog option to locate.
   * @returns The locator for the specified dynamic catalog option button.
   */
  getDynamicCatalogOption(option: string): Locator {
    return this.page.getByRole("button", { name: option });
  }

  /**
   *
   * @returns An array of all product names displayed on the dashboard.
   */
  async getAllProductsNames(): Promise<string[]> {
    return await this.allProductsNames.allInnerTexts();
  }

  /**
   *
   * @returns An array of all product prices displayed on the dashboard.
   */
  async getAllProductsPrices(): Promise<number[]> {
    const rawPrices = await this.allProductsPrices.allInnerTexts();
    const parsedPrices = rawPrices.map((price) =>
      parseFloat(price.replace("$", "")),
    );
    return parsedPrices;
  }

  /**
   *
   * @returns An array of locators for all product cart buttons displayed on the dashboard.
   */
  async getAllProductsCartBtns(): Promise<Locator[]> {
    return await this.allProductsCartBtns.all();
  }

  /**
   *
   * @returns The number of items currently displayed in the cart badge.
   */
  async getCartBadgeCount(): Promise<number> {
    const countText = (await this.cartBadgeCount.isVisible())
      ? await this.cartBadgeCount.innerText()
      : "0";
    return parseInt(countText);
  }

  /**
   *
   * @returns A promise that resolves when the dashboard title visibility has been checked.
   */
  async checkDashboardTitleVisibility(): Promise<void> {
    await expect(this.dashboardTitle).toBeVisible();
    logger.info(`Dashboard title is visible.`);
  }

  /**
   *
   * @param option The product filter option to apply.
   * @returns A promise that resolves when the product filter has been applied.
   */
  async applyProductFilter(
    option:
      | "Name (A to Z)"
      | "Name (Z to A)"
      | "Price (low to high)"
      | "Price (high to low)",
  ): Promise<void> {
    logger.info(`Applying product filter: ${option}`);
    await this.productFilterBtn.selectOption(option);
  }

  /**
   *
   * @returns A promise that resolves when the menu has been opened.
   */
  async openMenu(): Promise<void> {
    await this.menuBtn.click();
    logger.info(`Menu opened.`);
  }

  /**
   *
   * @returns A promise that resolves when the visibility of all menu options has been checked.
   */
  async checkOpenMenuVisibility(): Promise<void> {
    await expect(this.menuCloseBtn).toBeVisible();
    await expect(this.allItemsBtn).toBeVisible();
    await expect(this.dynamicCatalogBtn).toBeVisible();
    await expect(this.aboutBtn).toBeVisible();
    await expect(this.logoutBtn).toBeVisible();
    await expect(this.resetAppStateBtn).toBeVisible();
    logger.info(`Menu options are visible.`);
  }

  /**
   *
   * @returns A promise that resolves when the 'All Items' option in the menu has been clicked.
   */
  async clickAllItemsInMenu(): Promise<void> {
    await this.allItemsBtn.click();
    logger.info(`Clicked 'All Items' in menu.`);
  }

  /**
   *
   * @returns A promise that resolves when the visibility of all items on the dashboard has been checked.
   */
  async checkAllItemsVisibility(): Promise<void> {
    await expect(this.allProducts).toBeVisible();
    expect(await this.allItemCards.count()).toBeGreaterThan(0);
    logger.info(`Items are visible.`);
  }

  /**
   *
   * @param option The dynamic catalog option to click.
   * @returns A promise that resolves when the specified dynamic catalog option has been clicked.
   */
  async clickDynamicCatalog(
    option: "Lazy Load" | "Spinner" | "Slider",
  ): Promise<void> {
    await this.dynamicCatalogBtn.click();
    logger.info(`Clicked 'Dynamic Catalog' in menu.`);
    await this.getDynamicCatalogOption(option).click();
  }

  /**
   *
   * @param option The dynamic catalog option to check.
   * @returns A promise that resolves when the container for the specified dynamic catalog option is visible.
   */
  async checkDynamicCatalogContainer(
    option: "Lazy Load" | "Spinner" | "Slider",
  ): Promise<void> {
    const container =
      option === "Lazy Load"
        ? this.lazyLoadContainer
        : option === "Spinner"
          ? this.spinnerContainer
          : this.sliderContainer;
    await expect(container).toBeVisible();
    logger.info(`Dynamic Catalog container for '${option}' is visible.`);
  }

  /**
   *
   * @returns A promise that resolves when the lazy load functionality has been checked.
   */
  async checkLazyLoad(): Promise<void> {
    let previousHeight: number = 0;
    let productsCount: number = await this.lazyLoadItems.count();
    let count: number = productsCount;
    for (let i = 0; i < 5; i++) {
      const currentHeight = await this.page.evaluate(
        () => document.body.scrollHeight,
      );
      if (currentHeight == previousHeight) break;
      previousHeight = currentHeight;
      await this.page.evaluate(() =>
        window.scrollBy(0, document.body.scrollHeight),
      );
      productsCount += await this.lazyLoadItems.count();
      await expect(productsCount).toBeGreaterThan(count);
      count = productsCount;
      logger.info(`Products count: ${productsCount}`);
      await this.page.waitForTimeout(800); // Need to update
    }
    logger.info(
      `Lazy load check completed. Total products loaded: ${productsCount}`,
    );
  }

  /**
   *
   * @returns A promise that resolves when the spinner functionality has been checked.
   */
  async checkSpinner(): Promise<void> {
    expect(await this.spinnerItems.count()).toBeGreaterThan(0);
    logger.info(`Spinner items are visible.`);
  }

  /**
   *
   * @returns A promise that resolves when the slider functionality has been checked.
   */
  async checkSlider(): Promise<void> {
    const sliderDotsCount = await this.sliderDots.count();
    for (let i = 0; i < sliderDotsCount; i++) {
      const dot = this.sliderDots.nth(i);
      await dot.click();
      const ariaLabel = await dot.getAttribute("aria-label");
      const itemName = await this.sliderItemName.textContent();
      expect(ariaLabel).toContain(itemName);
      logger.info(`Clicked slider dot with aria-label: '${ariaLabel}'.`);
      logger.info(`Slider item name is: '${itemName}'.`);
    }
  }

  /**
   *
   * @returns A promise that resolves when the 'About' option in the menu has been clicked.
   */
  async clickAboutInMenu(): Promise<void> {
    await this.aboutBtn.click();
    await this.page.waitForLoadState("networkidle");
    logger.info(`Clicked 'About' in menu.`);
  }

  /**
   *
   * @returns A promise that resolves when the About page has been checked for correct navigation.
   */
  async checkAboutPage(): Promise<void> {
    await expect(this.page).toHaveURL(`https://saucelabs.com/`);
    logger.info(`Navigated to the About page.`);
  }

  /**
   *
   * @returns A promise that resolves when the 'Logout' option in the menu has been clicked.
   */
  async clickLogoutInMenu(): Promise<void> {
    await this.logoutBtn.click();
    await this.page.waitForLoadState("networkidle");
    logger.info(`Clicked 'Logout' in menu.`);
  }

  /**
   *
   * @returns A promise that resolves when the logout functionality has been checked.
   */
  async checkLogoutInMenu(): Promise<void> {
    await expect(this.page).toHaveURL(`https://www.saucedemo.com/`);
    logger.info(`Successfully logged out and navigated to the login page.`);
  }

  /**
   *
   * @returns A promise that resolves when the 'Reset App State' option in the menu has been clicked.
   */
  async clickResetAppStateInMenu(): Promise<void> {
    await this.resetAppStateBtn.click();
    logger.info(`Clicked 'Reset App State' in menu.`);
  }

  /**
   *
   * @returns A promise that resolves when the menu has been closed.
   */
  async closeMenu(): Promise<void> {
    await this.menuCloseBtn.click();
    logger.info(`Menu closed.`);
  }

  /**
   *
   * @returns A promise that resolves when the visibility of the closed menu has been checked.
   */
  async checkMenuClosedVisibility(): Promise<void> {
    await expect(this.menuCloseBtn).not.toBeVisible();
    await expect(this.menuBtn).toBeVisible();
    logger.info(`Menu is closed and not visible.`);
  }

  /**
   *
   * @param products An array of product names to add to the cart.
   * @returns A promise that resolves when the specified products have been added to the cart.
   */
  async addToCartByNames(products: string[]): Promise<void> {
    for (const product of products) {
      const cartBtn = this.getProductCartBtnByName(product);
      await cartBtn.click();
      logger.info(`Clicked 'Add to Cart' for product: '${product}'.`);
    }
  }
}
