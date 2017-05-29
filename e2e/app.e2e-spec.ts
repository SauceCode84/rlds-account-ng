import { RldsInvoicePage } from './app.po';

describe('rlds-invoice App', () => {
  let page: RldsInvoicePage;

  beforeEach(() => {
    page = new RldsInvoicePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
