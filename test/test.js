const assert = require("assert")


describe("loading the module", () => {
  const W = require("../src/words")
  const w = W("")

  it("should return a Word instance", () => {
    assert.strictEqual(typeof w, "object")
  })

})
