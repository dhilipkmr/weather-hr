const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;
chai.use(chaiHttp);
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome');
var driver;
let $city, $suggestions, $selectedCityInfo, $selectedCity, $selctedWeather, $selectedStatus, $resetBtn;

const options = new chrome.Options();
options.addArguments(
    'headless'
);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Weather app \n', function() {
  this.timeout(100000);

  before(function(done) {
      driver = new Builder()
          .forBrowser('chrome')
          .setChromeOptions(options)
          .build();
      driver.get('http://localhost:8000')
          .then(() => {
              done();
          });
  });

  after(function() {
      driver.quit();
  })

  beforeEach(async function() {
      driver.navigate().refresh();
      $city = await driver.findElement(By.id("city"));
      $suggestions = await driver.findElement(By.id("suggestions"));
      $selectedCityInfo = await driver.findElement(By.id("selectedCityInfo"));
      $selectedCity = await driver.findElement(By.id("selectedCity"));
      $selctedWeather = await driver.findElement(By.id("selctedWeather"));
      $selectedStatus = await driver.findElement(By.id("selectedStatus"));
      $resetBtn = await driver.findElement(By.id("resetBtn"));
  });

  it('should suggest items on typing city name', async function() {
    $city.sendKeys('da');
    await wait(1000);
    const suggestion1 = await driver.executeScript("return document.getElementsByClassName('suggestionItem')[0].innerText");
    const suggestion2 = await driver.executeScript("return document.getElementsByClassName('suggestionItem')[1].innerText");
    const suggestion3 = await driver.executeScript("return document.getElementsByClassName('suggestionItem')[2].innerText");
    expect(suggestion1).to.equal('Dallas');
    expect(suggestion2).to.equal('Dallupura');
    expect(suggestion3).to.equal('Darmstadt');
  });


  it('selecting a suggestion should change the input field value to the selected city\'s name', async function() {
    $city.sendKeys('dall');
    await wait(1000);
    await driver.executeScript("return document.getElementsByClassName('suggestionItem')[0].click()");
    const nameVal = await driver.executeScript("return document.querySelector('#city').value");
    expect(nameVal).to.equal('Dallas');
  });

  it('should add the contents to the selected section on selecting an option', async function() {
    $city.sendKeys('dall');
    await wait(1000);
    await driver.executeScript("return document.getElementsByClassName('suggestionItem')[0].click()");
    const selectedCityval = await driver.executeScript("return document.querySelector('#selectedCity').innerText");
    expect(selectedCityval).to.equal('Dallas');
    const selctedWeatherVal = await driver.executeScript("return document.querySelector('#selctedWeather').innerText");
    expect(selctedWeatherVal).to.equal('12 degree');
    const selectedStatusVal = await driver.executeScript("return document.querySelector('#selectedStatus').innerText");
    expect(selectedStatusVal).to.equal('Wind: 2Kmph,Humidity: 5%');
  });

  // it('should debounce before making API calls', async function() {
  // });

  it('should show "No results" message if the data is empty', async function() {
    $city.sendKeys('xyz');
    await wait(1000);
    const text = await driver.executeScript("return document.getElementsByClassName('suggestionItem')[0].innerText");
    expect(text).to.equal('No results');
    const isRed = await driver.executeScript(`return getComputedStyle(document.querySelectorAll(".suggestionItem")[0]).color === "rgb(255, 0, 0)"`)
    expect(isRed).to.be.true;
  });
  
  it('should show "No results" message in red color', async function() {
    $city.sendKeys('xyz');
    await wait(1000);
    const isRed = await driver.executeScript(`return getComputedStyle(document.querySelectorAll(".suggestionItem")[0]).color === "rgb(255, 0, 0)"`)
    expect(isRed).to.be.true;
  });

  it('should have a reset button which resets all entries', async function() {
    $city.sendKeys('dall');
    await wait(1000);
    await driver.executeScript("return document.getElementsByClassName('suggestionItem')[0].click()");
    await $resetBtn.click();
    const cityFieldContent = await driver.executeScript("return document.querySelector('#city').value");
    const selectedCityContent = await driver.executeScript("return document.querySelector('#selectedCity').innerText");
    const selctedWeatherContent = await driver.executeScript("return document.querySelector('#selctedWeather').innerText");
    const selectedStatusContent = await driver.executeScript("return document.querySelector('#selectedStatus').innerText");
    expect(cityFieldContent).to.equal('');
    expect(selectedCityContent).to.equal('');
    expect(selctedWeatherContent).to.equal('');
    expect(selectedStatusContent).to.equal('');
  });
});
