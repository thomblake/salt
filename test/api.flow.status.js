describe( 'Flow#status()', function () {

  var flow;

  it( 'should return a unique status object', function () {
    flow = new Flow();
    var status = flow.status();
    status.should.not.equal(flow.status());
    status.should.haveOwnProperty('targets');
    status.should.haveOwnProperty('trail');
    status.should.haveOwnProperty('paused');
    status.should.haveOwnProperty('pending');
    status.should.haveOwnProperty('permit');
    status.should.haveOwnProperty('trust');
    status.should.haveOwnProperty('loops');
    status.targets.should.be.an.instanceOf(Array);
    status.trail.should.be.an.instanceOf(Array);
    status.paused.should.be.a('boolean');
    status.permit.should.be.a('boolean');
    status.pending.should.be.a('boolean');
    status.loops.should.be.a('number');
  });

  // it( 'should list completed states', function () {
  //   var progamSpy = sinon.spy(function () {
  //     status = this.status();
  //     status.targets.should.have.a.lengthOf(1);
  //     status.target[0].should.equal('//a/');
  //     status.trail.should.have.a.lengthOf(1);
  //     status.trail[0].should.equal('//');
  //     status.permit.should.be.ok;
  //     status.loops.should.equal(0);
  //     status.permit.should.be.ok;
  //     status.trust.should.be.ok;
  //   });
  //   flow = new Flow({
  //     _on: programSpy,
  //     a: {}
  //   });
  //   flow.go(1, '//a');
  //   programSpy.should.have.been.calledOnce;
  //   aSpy.should.have.been.calledOnce;
  // });

  it( 'should list completed states', function () {
    var spy = sinon.spy(function () {
      var status = this.status();
      status.trail.should.have.a.lengthOf(1);
      status.trail[0].should.equal('//');
    });
    flow = new Flow({
      a: spy,
      b: {}
    });
    flow.go(1, '//a', '//b');
    spy.should.have.been.calledOnce;
  });

  it( 'should list targeted states', function () {
    var spy = sinon.spy(function () {
      var status = this.status();
      status.targets.should.have.a.lengthOf(2);
      status.targets[0].should.equal('//a/');
      status.targets[1].should.equal('//b/');
    });
    flow = new Flow({
      _on: spy,
      a: {},
      b: {}
    });
    flow.go(1, '//a', '//b');
    spy.should.have.been.calledOnce;
  });

  it( 'should indicate when the Flow is locked', function () {
    // var spy = sinon.spy(function () {
    // });
    // flow = new Flow(spy);
    // flow.go(1);
    // spy.should.have.been.calledOnce;
  });

  it( 'should indicate when the Flow is active/idle', function () {
    var spy = sinon.spy(function () {
      var status = this.status();
      status.trust.should.be.ok;
    });
    flow = new Flow(spy);
    flow.status().trust.should.not.be.ok;
    flow.go(1);
  });

  it( 'should indicate when the Flow is paused', function () {
    var spy = sinon.spy(function () {
      this.status().paused.should.not.be.ok;
      this.wait();
      this.status().paused.should.be.ok;
      this.go();
      this.status().paused.should.not.be.ok;
      this.wait(5);
      this.status().paused.should.be.ok;
      this.target('.');
      this.status().paused.should.not.be.ok;
      this.wait();
    });
    flow = new Flow(spy);
    flow.go(1);
    spy.should.have.been.calledOnce;
    flow.status().paused.should.be.ok;
  });

  it( 'should preserve sequence data while paused or pending', function () {
  });

  it( 'should indicate how many times a state has been touched', function () {
  });

  it( 'should return the given property (or `undefined`)', function () {
  });



});