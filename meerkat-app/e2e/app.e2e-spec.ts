import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for meerkat-app', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be meerkat-app', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('meerkat-app');
    })
  });

  it('navbar-brand should be meerkat-network@0.0.1',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('meerkat-network@0.0.1');
  });

  
    it('Invoice component should be loadable',() => {
      page.navigateTo('/Invoice');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Invoice');
    });

    it('Invoice table should have 6 columns',() => {
      page.navigateTo('/Invoice');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });

  

});
