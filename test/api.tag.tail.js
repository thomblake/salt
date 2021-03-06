describe( '_tail tag', function () {
  
  var salt;

  it( 'should redirect when navigation ends in a tagged branch', function () {
    salt = new Salt({
      a: {
        _tail: '@next',
        b: {}
      },
      c: {}
    });
    salt.go('//a/');
    salt.state.path.should.equal('//c/');
    salt.go('//a/b/');
    salt.state.path.should.equal('//c/');
  });

  it( 'should not redirect when redirecting to, and stopping on, the tagged state', function () {
    var spy = sinon.spy();
    salt = new Salt({
      a: {
        _tail: '.',
        _on: spy
      }
    });
    salt.go('//a/');
    spy.should.have.been.calledOnce;
  });

  it( 'should not redirect when targeting within the tagged branch', function () {
    var spy = sinon.spy();
    salt = new Salt({
      a: {
        _tail: 'b',
        b: spy
      }
    });
    salt.go('//a/');
    salt.state.path.should.equal('//a/');
    spy.should.not.have.been.called;
  });

  it( 'should not redirect when given a bad query', function () {
    var spy = sinon.spy();
    salt = new Salt({
      a: {
        _tail: 'foo',
        b: spy
      }
    });
    salt.go('//a/');
    salt.state.path.should.equal('//a/');
    spy.should.not.have.been.called;
  });

  it( 'should only apply to the destination state', function () {
    var spy = sinon.spy();
    salt = new Salt({
      a: {
        _tail: '//c/'
      },
      b: {},
      c: spy
    });
    salt.go('//a/', '//b/');
    spy.should.not.have.been.called;
  });

  it( 'should treat `true` as a query to the tagged state', function () {
    var spy = sinon.spy();
    salt = new Salt({
      a: {
        _on: spy,
        _tail: true,
        b: {}
      }
    });

    salt.go('//a/');
    spy.should.have.been.calledOnce;
    spy.reset();

    salt.go('//a/b/');
    salt.state.path.should.equal('//a/');
  });

  it( 'should treat `false` as a bad query', function () {
    var spy = sinon.spy();
    salt = new Salt({
      a: {
        _tail: false,
        b: spy
      }
    });
    salt.go('//a/');
    salt.state.path.should.equal('//a/');
    spy.should.not.have.been.called;
  });

  it( 'should ignore ancestor settings', function () {
    salt = new Salt({
      a: {
        _tail: true,
        b:{
          c: {
            _tail: false
          },
          d: {
            _tail: '//e/'
          }
        }
      },
      e: {}
    });
    salt.go('//a/b/');
    salt.state.path.should.equal('//a/');

    salt.go('//a/b/c/');
    salt.state.path.should.equal('//a/b/c/');

    salt.go('//a/b/d/');
    salt.state.path.should.equal('//e/');
  });

  it( 'should allow tailing to the null state', function () {
    salt = new Salt({_tail: 0});
    salt.go(1);
    salt.state.path.should.equal('..//');
  });

  it( 'should allow for compounding redirects', function () {
    var spy = sinon.spy();
    salt = new Salt({
      a: {
        _tail: '//b/',
        _on: spy
      },
      b: {
        _tail: '//c/',
        _on: spy
      },
      c: spy
    });
    salt.go('//a/');
    salt.state.path.should.equal('//c/');
    spy.should.have.been.calledThrice;
  });

  it( 'should work when navigation is paused', function (done) {
    salt = new Salt({
      a: {
        _tail: '//b/',
        _on: function () {
          this.wait(0);
        }
      },
      b: done
    });
    salt.go('//a/');
  });

  it( 'should work when navigation is pinned', function (done) {
    var pinner = new Salt(function () {
      this.wait(0);
    });
    salt = new Salt({
      a: {
        _tail: '//b/',
        _on: function () {
          pinner.go(1);
        }
      },
      b: done
    });
    salt.go('//a/');
    salt.status().pinned.should.equal(true);
    salt.state.path.should.equal('//a/');
    pinner.go();
  });

});