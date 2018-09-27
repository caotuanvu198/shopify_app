import '../../../app/assets/javascripts/shopify_app/itp_polyfill';

suite('ITPHelper', () => {
  let contentContainer;
  let button;

  setup(() => {
    contentContainer = document.createElement('div');
    button = document.createElement('button');

    contentContainer.setAttribute('id', 'Content');
    button.setAttribute('id', 'Action');
    button.setAttribute('type', 'button');

    contentContainer.appendChild(button);
    document.body.appendChild(contentContainer);
  });

  teardown(() => {
    document.body.removeChild(contentContainer);
  });

  suite('userAgentIsAffected', () => {
    test('returns false the user agent is Shopify POS', () => {
      navigator.__defineGetter__('userAgent', function(){
        return 'com.jadedpixel.pos';
      });

      sinon.assert.match(ITPHelper.prototype.userAgentIsAffected(), false);
    });

    test('returns false if the user agent is the Shopify mobile app', () => {
      navigator.__defineGetter__('userAgent', function(){
        return 'Shopify Mobile/iOS';
      });

      sinon.assert.match(ITPHelper.prototype.userAgentIsAffected(), false);
    });

    test('returns false if document.storageAccess is undefined', () => {
      navigator.__defineGetter__('userAgent', function(){
        return '';
      });

      document.hasStorageAccess = undefined;

      sinon.assert.match(ITPHelper.prototype.userAgentIsAffected(), false);
    });

    test('returns true if document.storageAccess is defined', () => {
      navigator.__defineGetter__('userAgent', function(){
        return '';
      });

      document.hasStorageAccess = sinon.stub();

      sinon.assert.match(ITPHelper.prototype.userAgentIsAffected(), true);
    });
  });

  suite('canPartitionCookies', () => {
    test('returns true if the user agent is a version of Safari 12.0', () => {
      navigator.__defineGetter__('userAgent', function(){
        return 'Version/12.0 Safari';
      });

      sinon.assert.match(ITPHelper.prototype.canPartitionCookies(), true);

      navigator.__defineGetter__('userAgent', function(){
        return 'Version/12.0.1 Safari';
      });

      sinon.assert.match(ITPHelper.prototype.canPartitionCookies(), true);
    });

    test('returns false if the user agent is a version of Safari 12.0', () => {
      navigator.__defineGetter__('userAgent', function(){
        return 'Version/12.1 Safari';
      });

      sinon.assert.match(ITPHelper.prototype.canPartitionCookies(), false);

      navigator.__defineGetter__('userAgent', function(){
        return 'Version/12.1.2 Safari';
      });

      sinon.assert.match(ITPHelper.prototype.canPartitionCookies(), false);

      navigator.__defineGetter__('userAgent', function(){
        return 'Version/11.0 Safari';
      });

      sinon.assert.match(ITPHelper.prototype.canPartitionCookies(), false);
    });
  });

  suite('setUpContent', () => {
    test('adds an event listener to the expected button that calls redirectToEmbedded on click', () => {
      const helper = new ITPHelper({
        content: '#Content',
        action: '#Action',
      });

      const redirectToEmbeddedStub = sinon.stub(helper, 'redirectToEmbedded');

      helper.setUpContent();

      button = document.querySelector('#Action');
      button.click();

      sinon.assert.called(redirectToEmbeddedStub);
      redirectToEmbeddedStub.restore();
    });

    test('sets display property of the expected node to "block"', () => {
      const helper = new ITPHelper({
        content: '#Content',
        action: '#Action',
      });

      helper.setUpContent();
      contentContainer = document.querySelector('#Content');
      sinon.assert.match(contentContainer.style.display, 'block');
    });
  });
});