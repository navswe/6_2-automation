const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

// build a new driver for each test
beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

// quit a driver after each test
// afterEach(async () => {
//   await driver.quit();
// });

// Helper function to add a movie
const addMovie = async (movieTitle) => {
  await driver
    .findElement(By.css('input[name="movieTitle"]'))
    .sendKeys(movieTitle);
  await driver.findElement(By.css('button[type="submit"]')).click();
};

describe("Tests the Movies App", () => {
  test("can add a movie", async () => {
    // Navigate to the web app => localhost:3000
    await driver.get("http://localhost:3000/");
    // Find the input box and type in the name of the movie
    await driver
      .findElement(By.css('input[name="movieTitle"]'))
      .sendKeys("The Matrix");
    // Find the add button and click it
    await driver.findElement(By.css('button[type="submit"]')).click();
    // Wait until the movie appears in the list
    const addedMovie = await driver.wait(
      until.elementLocated(By.css("#movies-list li label")),
      1000
    );
    // Check that the movies apprears in the list
    expect(await addedMovie.getText()).toBe("The Matrix");
  });

  // test 2: remove a movie
  test("remove a movie by clicking on remove button", async () => {
    // Navigate to the web app => localhost:3000
    await driver.get("http://localhost:3000/");
    // use addMovie() helper function to add a movie
    await addMovie("Little Mermaid");

    const addedMovie = await driver.wait(
      until.elementLocated(By.css("#movies-list li")),
      9000
    );
    // find delete button and click
    await addedMovie.findElement(By.css("button.delete-btn")).click();

    await driver.wait(until.stalenessOf(addedMovie), 9000);
  });

  // test 3: check for display/notification that a movie is deleted. Should have a message : "movieTitle deleted!"
  test("check for notification that a movie is deleted", async () => {
    // Navigate to the web app => localhost:3000
    await driver.get("http://localhost:3000/");
    // use addMovie() helper function to add a movie
    await addMovie("Little Mermaid");

    const addedMovie = await driver.wait(
      until.elementLocated(By.css("#movies-list li")),
      9000
    );
    // find delete button and click
    await addedMovie.findElement(By.css("button.delete-btn")).click();

    // check for delete notification message

    await driver.wait(
      until.elementTextContains(
        driver.findElement(By.id("message")),
        "deleted!"
      ),
      9000
    );
  });
});
