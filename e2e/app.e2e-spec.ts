import { ManyPostsPage } from './app.po';

describe('many-posts App', function() {
  let page: ManyPostsPage;

  beforeEach(() => {
    page = new ManyPostsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
