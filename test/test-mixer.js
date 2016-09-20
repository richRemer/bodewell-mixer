var expect = require("expect.js"),
    mixer = require("..");

describe("mixer(Type)", () => {
    var Type,
        OtherType;

    beforeEach(() => {
        Type = function(arg) {this.type = "Type"; this.arg = arg;};
        Type.prototype.foo = 42;
        
        OtherType = function() {this.type = "OtherType";};
        OtherType.prototype.foo = 13;
    });

    it("should return a function", function() {
        expect(mixer(Type)).to.be.a("function");
    });

    describe("=> mix", () => {
        var mix;

        beforeEach(() => {
            mix = mixer(Type);
        });

        describe("(function)", () => {
            it("should return the function", () => {
                var fn = function() {};
                expect(mix(fn)).to.be(fn);
            });

            it("should extend function prototype", () => {
                var fn = function() {};
                expect(mix(fn).prototype.foo).to.be(42);
            });

            it("should not call constructor", () => {
                var fn = function() {},
                    Type, mix, called = false;

                Type = function() {
                    called = true;
                };

                mix = mixer(Type);
                mix(fn);

                expect(called).to.be(false);
            });
        });

        describe("(object, ...*)", () => {
            it("should return the object", () => {
                var obj = {};
                expect(mix(obj)).to.be(obj);
            });

            it("should extend the object", () => {
                var obj = {};
                expect(mix(obj).foo).to.be(42);
            });

            it("should not re-mix", () => {
                var obj = {};
                mix(obj);       expect(obj.foo).to.be(42);
                obj.foo = 13;   expect(obj.foo).to.be(13);
                mix(obj);       expect(obj.foo).to.be(13);
            });

            it("should call constructor on object", () => {
                var obj = mix({});
                expect(obj.type).to.be("Type");
            });

            it("should pass extra args to constructor", () => {
                var obj = mix({}, 13);
                expect(obj.arg).to.be(13);
            });
        });
    });
});
