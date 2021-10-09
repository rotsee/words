/**
 * Swedish dictionary support for text template functions,
 * using the Stava algorithms and the Saldo dictionary.
 * This is my SPRAK HT2021 project.
 *
 * Leonard Wallentin
 *
 */
 const path = require("path")
 const DICT_FILE_NAME = "saldomp.json"


/**
 * @module words
 * @param {string} dictionaryPath Path to local saldo dictionary
 * @returns {object} A words instance
 * @example
 * // returns ["högstadium", "korridor"]
 * const w = require("words")("dictionary")
 * w.compunds("Högstadiekorridor")
 */
module.exports = function(dictionaryPath) {
  let words = {}

  words.dictionaryPath = dictionaryPath
  const _path = path.join(words.dictionaryPath, DICT_FILE_NAME)
  words.data = require(_path)
  
  // ej sms
  // data.filter(d => !d.WordForms.find(w => w.msd === "sms")).map(w => w.WordForms.map(wf => wf.writtenForm)).flat()
  /*
  words.allTheWords = words.data
    .map(w => w.WordForms.map(wf => wf.writtenForm))
    .flat()
  */
  // ci: compound form, initial
  // sms: compound form, free-standing
  // https://spraakbanken.gu.se/en/resources/saldo/tagset
  const isPrefix = w => ["cm", "ci", "c"].includes(w.msd)
  const isTail = w => !["cm", "ci", "c", "sms"].includes(w.msd)
  words.prefixes = words.data
    .map(w => w.WordForms
      .filter(isPrefix)
      .map(wf => wf.writtenForm.toLocaleLowerCase("sv"))
    )
    .flat()
  // Every word that is not a prefix
  console.time()
  words.tails = words.data
    .map(w => w.WordForms
      .filter(isTail)
      .map(wf => wf.writtenForm.toLocaleLowerCase("sv"))
    )
    .flat()
  console.timeEnd()
  /**
   * Find compound word parts
   *
   * @param {string} word to format
   * @returns {Array} list of parts
   */
  words.compounds = function(word) {
    word = word.toLocaleLowerCase("sv")
    // Is this a non-prefix word in our dictionary?
    if (this.tails.includes(word)) {
      return [word]
    }
    // All Swedish prefixes must contain one vowel
    
    const minimalSyllable = /[qwrtpsdfghjklzxcvbnm]*[eyuioaåöä]\-?/
    /*const m = word.match(minimalSyllable)
    let candidate = m[0]
    let candidateBoundry = candidate.length
    */
    /* Recursive function splitting function*/
    let globalSplittingStage = 1
    const split = (word) => {
      const variants = []
      const m = word.match(minimalSyllable)
      let candidate = m[0]
      let candidateBoundry = candidate.length

      while (candidateBoundry < word.length) {
        if (this.prefixes.includes(candidate)) {
          globalSplittingStage++
          // We found a prefix. Check if we already have a compound
          // console.log("hittade", candidate)
          let remainder = word.slice(candidate.length, word.length)
          // console.log("rest", remainder)

          if (
            (globalSplittingStage > 1) &&
            (remainder[0] === "s") &&
            this.tails.includes(remainder.slice(1, remainder.length))
          ) {
            // If we hade more than one compound already,
            // first try removing glueing 's'!          
            const reminderWithoutGlue = remainder.slice(1, remainder.length)
            return [candidate, reminderWithoutGlue]
          } else if (this.tails.includes(remainder)) {
            // otherwise, try the whole rest
            // variants.push([candidate, remainder])
            return [candidate, remainder]
          } else if (
            candidate[candidate.length - 1] === candidate[candidate.length - 2] &&
            this.tails.includes(candidate[candidate.length - 1] + remainder)
          ) {
            // also check for tripple-consonant reduction
            // variants.push([candidate, candidate[candidate.length - 1] + remainder])
            return [candidate, candidate[candidate.length - 1] + remainder]
          } else {
            globalSplittingStage--
            remainder = split(remainder)
            if (remainder && remainder.length) {
              // console.log("We could recursively split remainder!!!")
              // variants.push([previousPrefixes, candidate, ...remainder])
              return [candidate, ...remainder]
            }
          }
        } else {
          // console.log(candidate, "är inget ord")
        }
        candidateBoundry++
        candidate = word.slice(0, candidateBoundry)
      }
      return []
    }
    console.log("I/O", word, split(word))
    return split(word)
  }
  
  return words
}
