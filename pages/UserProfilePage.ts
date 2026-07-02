import { type Locator, type Page, expect } from "@playwright/test";

export class UserProfilePage {
  readonly page: Page;
  readonly editProfileSettings: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define Locators
    this.editProfileSettings = this.page.getByRole("link", {
      name: " Edit Profile Settings",
    });
  }

  async verifyPageElements() {
    const userName = process.env.USER_NAME!;
    await expect(this.page).toHaveURL(
      new RegExp(`@${userName.toLowerCase()}(/)?$`),
    );

    await expect(this.editProfileSettings).toBeEnabled();
  }
}
