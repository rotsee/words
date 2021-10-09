const assert = require("assert")


describe("compounds", () => {
  const W = require("../src/words")
  const w = W("../")

  it("should find a dictionary word", () => {
    let c = w.compounds("skidskytte")
    assert(c.length === 1)
    assert.equal(c[0], "skidskytte")
  })  
  it("should break up compounds", () => {
    let c = w.compounds("skidskyttemåltavla")
    // assert(c.length === 2)
    assert.equal(c[c.length - 1], "måltavla")
  })
  it("should break up compounds with connecting s", () => {
    let c = w.compounds("prinskorvsmacka")
    assert(c.length === 3)
    assert.equal(c[1], "korv")
  })
  it("should break up compounds with irregular connectors", () => {
    let c = w.compounds("kyrkoförsäljning")
    assert(c.length === 2)
    assert.equal(c[0], "kyrko")
  })  
  it("should break up long compounds", () => {
    let c = w.compounds("småbordsbelysning")
    assert(c.length === 3)
    assert.equal(c[2], "belysning")
  })
  /*
  it("should break up verb compounds", () => {
    let c = w.compounds("korvätartävling")
    assert(c.length === 3)
    assert(c[0] === "korv")
  })
  */
  it("should break handle consonant ellipsis", () => {
    let c = w.compounds("snabbaka")
    assert(c.length === 2)
    assert(c[0] === "snabb")
    assert(c[1] === "baka")
  })  
})
