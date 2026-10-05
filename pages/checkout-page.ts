import { expect, Page, Locator } from "@playwright/test";
import { logger } from "../helpers/logger";

export class CheckoutPage {
  //Title locator
  private readonly checkoutPageTitle: Locator;

  //Navigation buttons
  private readonly cancelBtn: Locator;
  private readonly continueBtn: Locator;

  //Input fields
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;

  //Checkout error
  private readonly checkoutError: Locator;

  //All products
  private readonly allItemCards: Locator;
  private readonly allProductsNames: Locator;
  private readonly allProductsPrices: Locator;

  //Pay related
  private readonly paymentInfo: Locator;
  private readonly shippingInfo: Locator;
  private readonly subTotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;

  //finish button
  private readonly finishBtn: Locator;

  //Finish page
  private readonly orderConfirmation: Locator;
  private readonly backHomeBtn: Locator;
  private readonly generatePDFBtn: Locator;

  constructor(private readonly page: Page) {
    //Title locator
    this.checkoutPageTitle = this.page.getByText("Checkout: Your Information");

    //Navigation buttons
    this.cancelBtn = this.page.getByRole("button", { name: "Cancel" });
    this.continueBtn = this.page.locator("input#continue");

    //Input fields
    this.firstNameInput = this.page.getByRole("textbox", {
      name: "First Name",
    });
    this.lastNameInput = this.page.getByRole("textbox", { name: "Last Name" });
    this.postalCodeInput = this.page.getByRole("textbox", {
      name: "Postal Code",
    });

    //Checkout error
    this.checkoutError = this.page.getByRole("alert");

    // All products in the cart
    this.allItemCards = this.page.locator("div.cart_item");
    this.allProductsNames = this.page.locator("div.inventory_item_name");
    this.allProductsPrices = this.page.locator("div.inventory_item_price");

    // Pay related
    this.paymentInfo = this.page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = this.page.locator('[data-test="shipping-info-value"]');
    this.subTotal = this.page.locator("div.summary_subtotal_label");
    this.tax = this.page.locator("div.summary_tax_label");
    this.total = this.page.locator("div.summary_total_label");

    //finish button
    this.finishBtn = this.page.getByRole("button", { name: "Finish" });

    //Finish page
    this.orderConfirmation = this.page.locator("h2.complete-header");
    this.backHomeBtn = this.page.getByRole("button", { name: "Back Home" });
    this.generatePDFBtn = this.page.getByRole("button", {
      name: "Generate PDF",
    });
  }

  /**
   * Get the product item card by its name.
   * @param productName - The name of the product.
   * @returns Locator for the product item card.
   */
  getProductItemCardByName(productName: string): Locator {
    return this.allItemCards.filter({ hasText: productName });
  }

  /**
   * Get the price of a product by its name.
   * @param productName - The name of the product.
   * @returns Locator for the product price.
   */
  getProductPriceByName(productName: string): Locator {
    return this.getProductItemCardByName(productName).locator(
      "div.inventory_item_price",
    );
  }

  /**
   * Check the visibility of the checkout page title.
   * @returns Promise that resolves when the title is visible.
   */
  async checkCheckoutPageTitle(): Promise<void> {
    await expect(this.checkoutPageTitle).toBeVisible();
    logger.info("Checkout page title is visible");
  }

  /**
   * Navigate to the cart page by clicking the cancel button.
   * @returns Promise that resolves when navigation is complete.
   */
  async navigateToCartByCancel(): Promise<void> {
    await this.cancelBtn.click();
    logger.info("Navigated to cart by clicking cancel button");
  }

  /**
   * Fill the first name input field in the checkout form.
   * @param firstName - The first name to fill.
   * @returns Promise that resolves when the action is complete.
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    logger.info(`Filled first name with: ${firstName}`);
  }

  /**
   * Fill the last name input field in the checkout form.
   * @param lastName - The last name to fill.
   * @returns Promise that resolves when the action is complete.
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
    logger.info(`Filled last name with: ${lastName}`);
  }

  /**
   * Fill the postal code input field in the checkout form.
   * @param postalCode - The postal code to fill.
   * @returns Promise that resolves when the action is complete.
   */
  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
    logger.info(`Filled postal code with: ${postalCode}`);
  }

  /**
   * Fill the entire checkout form with first name, last name, and postal code.
   * @param firstName - The first name to fill.
   * @param lastName - The last name to fill.
   * @param postalCode - The postal code to fill.
   * @returns Promise that resolves when the action is complete.
   */
  async fillCheckoutForm(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
    logger.info(
      `Filled checkout form with First Name: ${firstName}, Last Name: ${lastName}, Postal Code: ${postalCode}`,
    );
  }

  /**
   * Get the error status and message for the checkout form.
   * @returns An object containing the status and error message.
   */
  async errorStatus(): Promise<{ status: boolean; errorMessage: string }> {
    const errorStatus = await this.checkoutError.isVisible();
    let errorMessage: string | null = "";
    if (errorStatus) {
      errorMessage = await this.checkoutError.textContent();
      logger.warn(`Checkout error message: ${errorMessage}`);
    }
    return {
      status: errorStatus ? false : true,
      errorMessage: errorMessage || "",
    };
  }

  /**
   * Navigate to the overview page by clicking the continue button.
   * @returns Promise that resolves when navigation is complete.
   */
  async navigateToOverview(): Promise<void> {
    await this.continueBtn.click();
    logger.info("Navigated to overview page");
  }

  /**
   * Get the names of all products listed in the overview page.
   * @returns An array of product names.
   */
  async getAllProductsInOverview(): Promise<string[]> {
    await this.allProductsNames.first().waitFor();
    const productNames: string[] =
      await this.allProductsNames.allTextContents();
    logger.info(`All products in overview: ${productNames.join(", ")}`);
    return productNames;
  }

  /**
   * Get the prices of all products listed in the overview page.
   * @returns An array of product prices as numbers.
   */
  async getAllProductsPricesInOverview(): Promise<number[]> {
    await this.allProductsPrices.first().waitFor();
    const rawPrices = await this.allProductsPrices.allInnerTexts();
    const parsedPrices = rawPrices.map((price) =>
      parseFloat(price.replace("$", "")),
    );
    logger.info(`All product prices in overview: ${parsedPrices.join(", ")}`);
    return parsedPrices;
  }

  /**
   * Calculate the sum of all product prices listed in the overview page.
   * @returns The total sum of all product prices.
   */
  async getSumOfAllProductsPricesInOverview(): Promise<number> {
    const parsedPrices = await this.getAllProductsPricesInOverview();
    let subTotal = 0;
    for (const price of parsedPrices) {
      subTotal += price;
    }
    logger.info(`Subtotal of all product prices in overview: ${subTotal}`);
    return subTotal;
  }

  /**
   * Get the payment information displayed in the overview page.
   * @returns Promise that resolves when the action is complete.
   */
  async getPaymentInfo(): Promise<void> {
    await this.paymentInfo.waitFor();
    const paymentInfoText = await this.paymentInfo.textContent();
    logger.info(`Payment info in overview: ${paymentInfoText}`);
  }

  /**
   * Get the shipping information displayed in the overview page.
   * @returns Promise that resolves when the action is complete.
   */
  async getShippingInfo(): Promise<void> {
    await this.shippingInfo.waitFor();
    const shippingInfoText = await this.shippingInfo.textContent();
    logger.info(`Shipping info in overview: ${shippingInfoText}`);
  }

  /**
   * Get the subtotal amount displayed in the overview page.
   * @returns The subtotal amount as a number.
   */
  async getSubTotalInOverview(): Promise<number> {
    await this.subTotal.waitFor();
    const subTotal = await this.subTotal.textContent();
    const subTotalValue = parseFloat(
      subTotal?.replace("Item total: $", "") || "0",
    );
    logger.info(`Subtotal in overview: ${subTotalValue}`);
    return subTotalValue;
  }

  /**
   * Get the tax amount displayed in the overview page.
   * @returns The tax amount as a number.
   */
  async getTaxAmountInOverview(): Promise<number> {
    await this.tax.waitFor();
    const taxText = await this.tax.textContent();
    const taxAmount = parseFloat(taxText?.replace("Tax: $", "") || "0");
    logger.info(`Tax amount in overview: ${taxAmount}`);
    return taxAmount;
  }

  /**
   * Get the total amount displayed in the overview page.
   * @returns The total amount as a number.
   */
  async getTotalAmountInOverview(): Promise<number> {
    await this.total.waitFor();
    const totalText = await this.total.textContent();
    const totalAmount = parseFloat(totalText?.replace("Total: $", "") || "0");
    logger.info(`Total amount in overview: ${totalAmount}`);
    return totalAmount;
  }

  /**
   * Navigate to the finish page by clicking the finish button.
   * @returns Promise that resolves when navigation is complete.
   */
  async navigateToFinishPage(): Promise<void> {
    await this.finishBtn.click();
    logger.info("Navigated to finish page");
  }

  /**
   * Get the order confirmation text displayed on the finish page.
   * @returns The order confirmation text as a string.
   */
  async getOrderConfirmation(): Promise<string> {
    await this.orderConfirmation.waitFor();
    const orderConfirmationText = await this.orderConfirmation.textContent();
    logger.info(`Order confirmation in finish page: ${orderConfirmationText}`);
    return orderConfirmationText || "";
  }

  /**
   * Navigate to the home page by clicking the back home button.
   * @returns Promise that resolves when navigation is complete.
   */
  async navigateToHomePage(): Promise<void> {
    await this.backHomeBtn.click();
    logger.info("Navigated to home page");
  }

  /**
   * Generate a PDF for the order by clicking the generate PDF button.
   * @returns Promise that resolves when the PDF is generated.
   */
  async generatePDF(): Promise<void> {
    await this.generatePDFBtn.click();
    logger.info("Generated PDF for the order");
  }
}
