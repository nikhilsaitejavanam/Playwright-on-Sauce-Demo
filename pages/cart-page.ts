import { expect, Page, Locator } from "@playwright/test";
import { logger } from "../helpers/logger";

export class CartPage {
  // Title of the cart page
  private readonly cartPageTitle: Locator;

  // Cart badge count
  private readonly cartBadgeCount: Locator;

  // Navigation buttons in the cart page
  private readonly continueShoppingBtn: Locator;
  private readonly checkoutBtn: Locator;

  //All products
  private readonly allItemCards: Locator;
  private readonly allProductsNames: Locator;

  constructor(private readonly page: Page) {
    // Title of the cart page
    this.cartPageTitle = this.page.getByText("Your Cart", { exact: true });

    // Cart badge count
    this.cartBadgeCount = this.page.locator("span.shopping_cart_badge");

    // Navigation buttons in the cart page
    this.continueShoppingBtn = this.page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.checkoutBtn = this.page.getByRole("button", { name: "Checkout" });

    // All products in the cart
    this.allItemCards = this.page.locator("div.cart_item");
    this.allProductsNames = this.page.locator("div.inventory_item_name");
  }

  /**
   *
   * @param productName The name of the product to locate in the cart.
   * @returns The locator for the specified product's cart item element.
   */
  getProductCartItemByName(productName: string): Locator {
    return this.allItemCards.filter({ hasText: productName });
  }

  /**
   *
   * @param productName The name of the product to locate the remove button for.
   * @returns The locator for the specified product's remove button element.
   */
  getRemoveBtnByName(productName: string): Locator {
    return this.getProductCartItemByName(productName).getByRole("button", {
      name: "Remove",
    });
  }

  /**
   *
   * @param productName The name of the product to locate the price for.
   * @returns The locator for the specified product's price element.
   */
  getProductPriceByName(productName: string): Locator {
    return this.getProductCartItemByName(productName).locator(
      "div.inventory_item_price",
    );
  }

  /**
   *
   * @returns A promise that resolves when the cart page title has been checked for visibility.
   */
  async checkCartTitle(): Promise<void> {
    await expect(this.cartPageTitle).toBeVisible();
    logger.info("Cart title is visible");
  }

  /**
   *
   * @returns The number of products currently in the cart.
   */
  async getProductCountInCart(): Promise<number> {
    await this.allItemCards.first().waitFor();
    return await this.allItemCards.count();
  }

  /**
   *
   * @returns The number of items currently displayed in the cart badge.
   */
  async getCartBadgeCount(): Promise<number> {
    const countText = (await this.cartBadgeCount.isVisible())
      ? await this.cartBadgeCount.innerText()
      : "0";
    const count = parseInt(countText);
    logger.info(`Cart badge count: ${count}`);
    return count;
  }

  async getAllProductNamesInCart(): Promise<string[]> {
    await this.allProductsNames.first().waitFor();
    const allProductNames = await this.allProductsNames.allTextContents();
    logger.info(`All product names in cart: ${allProductNames.join(", ")}`);
    return allProductNames;
  }

  /**
   *
   * @param productNames An array of product names to check in the cart.
   * @returns A promise that resolves when all specified products have been verified to be in the cart.
   */
  async checkAddedCartItems(productNames: string[]): Promise<void> {
    logger.info(`Checking added cart items: ${productNames.join(", ")}`);
    const allCartItems = await this.getAllProductNamesInCart();
    for (const productName of productNames) {
      expect(allCartItems).toContain(productName);
    }
  }

  /**
   *
   * @param productNames An array of product names to check for removal from the cart.
   * @returns A promise that resolves when all specified products have been verified to be removed from the cart.
   */
  async checkRemovedCartItems(productNames: string[]): Promise<void> {
    logger.info(`Checking removed cart items: ${productNames.join(", ")}`);
    const allCartItems = await this.getAllProductNamesInCart();
    for (const productName of productNames) {
      expect(allCartItems).not.toContain(productName);
    }
  }

  /**
   *
   * @param productName The name of the product to locate the individual price for.
   * @returns The price of the specified product as a number.
   */
  async getIndividualCartItemPriceByName(productName: string): Promise<number> {
    await this.getProductPriceByName(productName).waitFor();
    const rawPrice = await this.getProductPriceByName(productName).innerText();
    const parsedPrice = parseFloat(rawPrice.replace("$", ""));
    logger.info(
      `Parsed individual cart item price for ${productName}: ${parsedPrice}`,
    );
    return parsedPrice;
  }

  /**
   *
   * @param productName An array of product names to remove from the cart.
   * @returns A promise that resolves when all specified products have been removed from the cart.
   */
  async removeCartItemByNames(productName: string[]): Promise<void> {
    logger.info(`Removing cart items: ${productName.join(", ")}`);
    for (const name of productName) {
      await this.getRemoveBtnByName(name).click();
      logger.info(`Removed cart item: ${name}`);
    }
  }

  /**
   *
   * @returns A promise that resolves when the user has navigated back to the dashboard page.
   */
  async navigateBackToDashboard(): Promise<void> {
    await this.continueShoppingBtn.click();
    logger.info("Navigated back to the dashboard page");
  }

  /**
   *
   * @returns A promise that resolves when the user has navigated to the checkout page.
   */
  async navigateToCheckout(): Promise<void> {
    await this.checkoutBtn.click();
    logger.info("Navigated to the checkout page");
  }
}
