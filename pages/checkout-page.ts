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

  getProductItemCardByName(productName: string): Locator {
    return this.allItemCards.filter({ hasText: productName });
  }

  getProductPriceByName(productName: string): Locator {
    return this.getProductItemCardByName(productName).locator(
      "div.inventory_item_price",
    );
  }

  async checkCheckoutPageTitle(): Promise<void> {
    await expect(this.checkoutPageTitle).toBeVisible();
    logger.info("Checkout page title is visible");
  }

  async navigateToCartByCancel(): Promise<void> {
    await this.cancelBtn.click();
    logger.info("Navigated to cart by clicking cancel button");
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    logger.info(`Filled first name with: ${firstName}`);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
    logger.info(`Filled last name with: ${lastName}`);
  }

  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
    logger.info(`Filled postal code with: ${postalCode}`);
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
    logger.info(`Filled checkout form with First Name: ${firstName}, Last Name: ${lastName}, Postal Code: ${postalCode}`);
  }

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

  async navigateToOverview(): Promise<void> {
    await this.continueBtn.click();
    logger.info("Navigated to overview page");
  }

  async getAllProductsInOverview():Promise<string[]>{
    const productNames: string[] = await this.allProductsNames.allTextContents();
    logger.info(`All products in overview: ${productNames.join(", ")}`);
    return productNames;
  }

  async getAllProductsPricesInOverview(): Promise<number[]> {
    const rawPrices = await this.allProductsPrices.allInnerTexts();
    const parsedPrices = rawPrices.map((price) =>
      parseFloat(price.replace("$", "")),
    );
    logger.info(`All product prices in overview: ${parsedPrices.join(", ")}`);
    return parsedPrices;
  }

  async getSumOfAllProductsPricesInOverview(): Promise<number> {
    const parsedPrices = await this.getAllProductsPricesInOverview();
    let subTotal = 0;
    for (const price of parsedPrices) {
      subTotal += price;
    }
    logger.info(`Subtotal of all product prices in overview: ${subTotal}`);
    return subTotal;
  }

  async getPaymentInfo(): Promise<void>{
    const paymentInfoText = await this.paymentInfo.textContent();
    logger.info(`Payment info in overview: ${paymentInfoText}`);
  }

  async getShippingInfo(): Promise<void> {
    const shippingInfoText = await this.shippingInfo.textContent();
    logger.info(`Shipping info in overview: ${shippingInfoText}`);
  }

  async getSubTotalInOverview(): Promise<number> {
    const subTotal = await this.subTotal.textContent(); 
    const subTotalValue = parseFloat(subTotal?.replace("Item total: $", "") || "0");
    logger.info(`Subtotal in overview: ${subTotalValue}`);
    return subTotalValue;
  }

  async getTaxAmountInOverview(): Promise<number> {
    const taxText = await this.tax.textContent();
    const taxAmount = parseFloat(taxText?.replace("Tax: $", "") || "0");
    logger.info(`Tax amount in overview: ${taxAmount}`);
    return taxAmount;
  }

  async getTotalAmountInOverview(): Promise<number> {
    const totalText = await this.total.textContent();
    const totalAmount = parseFloat(totalText?.replace("Total: $", "") || "0");
    logger.info(`Total amount in overview: ${totalAmount}`);
    return totalAmount;
  }

  async navigateToFinishPage(): Promise<void> {
    await this.finishBtn.click();
    logger.info("Navigated to finish page");
  }

  async getOrderConfirmation(): Promise<string> {
    const orderConfirmationText = await this.orderConfirmation.textContent();
    logger.info(`Order confirmation in finish page: ${orderConfirmationText}`);
    return orderConfirmationText || "";
  }

  async navigateToHomePage(): Promise<void> {
    await this.backHomeBtn.click();
    logger.info("Navigated to home page");
  }

  async generatePDF(): Promise<void> {
    await this.generatePDFBtn.click();
    logger.info("Generated PDF for the order");
  }
}
