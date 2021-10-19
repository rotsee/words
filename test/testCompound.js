const assert = require("assert")

const W = require("../src/words")
const w = W("../")

describe("compounds", () => {
  it("should not break up words in dictionary", () => {
    let c = w.compounds("eller")
    assert(c.length === 1)
    assert.equal(c[0], "eller")

    c = w.compounds("skidskytte")
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
    assert.equal(c[1], "macka") // not 'smacka'

    c = w.compounds("skogsbad")
    assert.deepEqual(c, ["skogs", "bad"])
  })
  it("should break up compounds with irregular connectors", () => {
    let c = w.compounds("kyrkoförsäljning")
    assert(c.length === 2)
    assert.equal(c[0], "kyrko")
  })
  it("should break up long compounds", () => {
    let c = w.compounds("småbordsgranbelysning")
    assert(c.length === 4)
    assert.equal(c[3], "belysning")
  })
  /*
  it("should break up verb compounds", () => {
    let c = w.compounds("korvätartävling")
    assert(c.length === 3)
    assert(c[0] === "korv")
  })
  */
  it("should handle consonant ellipsis", () => {
    let c = w.compounds("snabbaka")
    assert(c.length === 2)
    assert(c[0] === "snabb")
    assert(c[1] === "baka")
  })
  it("should prefere double consonants to tripple", () => {
    let c = w.compounds("vinnyheter")
    assert.deepEqual(c, ["vin", "nyheter"])
  })
})
describe("Checking typical compound syntaxes", () => {
  // From https://sv.wikipedia.org/wiki/Sammans%C3%A4ttning_(lingvistik)#Indelning_med_avseende_p%C3%A5_syntax
  describe("noun+noun", () => {
    it("prisfråga", () => {
      let c = w.compounds("prisfråga")
      assert.deepEqual(c, ["pris", "fråga"])
    })
    it("gränsfallshosta", () => {
      let c = w.compounds("gränsfallshosta")
      assert.deepEqual(c, ["gränsfalls", "hosta"])
    })
  })
  describe("pm+noun", () => {
    it("Zorntavla", () => {
      let c = w.compounds("Zorntavla")
      assert.deepEqual(c, ["zorn", "tavla"])
    })
    it("Älmhultsbo", () => {
      c = w.compounds("Älmhultsbo")
      assert.deepEqual(c, ["älmhults", "bo"])
    })
  })
  describe("adj+noun", () => {
    it("blånos", () => {
      let c = w.compounds("blånos")
      assert.deepEqual(c, ["blå", "nos"])
    })
  })
  describe("vb+noun", () => {
    it("frysklamp", () => {
      let c = w.compounds("frysklamp")
      assert.deepEqual(c, ["frys", "klamp"])
    })
  })
  describe("should handle adverb+noun", () => {
    it("innepryl", () => {
      let c = w.compounds("innepryl")
      assert.deepEqual(c, ["inne", "pryl"])
    })
  })
  describe("pronoun+noun", () => {
    it("jagroman", () => {
      let c = w.compounds("jagroman")
      assert.deepEqual(c, ["jag", "roman"])
    })
    it("ossfokus", () => {
      let c = w.compounds("vifokus")
      assert.deepEqual(c, ["vi", "fokus"])
    })
  })
  describe("cardinal+noun", () => {
    it("tresamhet", () => {
      let c = w.compounds("tresamhet")
      assert.deepEqual(c, ["tre", "sam", "het"])
    })
    it("miljardklipp", () => {
      let c = w.compounds("miljardklipp")
      assert.deepEqual(c, ["miljard", "klipp"])
    })
  })
  describe("ordinal+noun", () => {
    it("fjortondeplats", () => {
      let c = w.compounds("fjortondeplats")
      assert.deepEqual(c, ["fjortonde", "plats"])
    })
    it("femtegluttare", () => {
      let c = w.compounds("femtegluttare")
      assert.deepEqual(c, ["femte", "gluttare"])
    })
  })
  describe("preposition+noun", () => {
    it("inknuff", () => {
      let c = w.compounds("inknuff")
      assert.deepEqual(c, ["in", "knuff"])
    })
    it("mellansnack", () => {
      let c = w.compounds("mellansnack")
      assert.deepEqual(c, ["mellan", "snack"])
    })
    it("hinsideskänsla", () => {
      let c = w.compounds("hinsideskänsla")
      assert.deepEqual(c, ["hinsides", "känsla"])
    })
  })
  describe("interj+noun", () => {
    it("wowfaktor", () => {
      let c = w.compounds("wowfaktor")
      assert.deepEqual(c, ["wow", "faktor"])
    })
  })
})

