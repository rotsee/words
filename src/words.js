/**
 * Swedish dictionary support for text template functions,
 * using the Stava algorithms and the Saldo dictionary.
 * This is my SPRAK HT2021 project.
 *
 * Leonard Wallentin
 *
 */


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

  /**
   * Find compound word parts
   *
   * @param {string} word to format
   * @returns {Array} list of parts
   */
  words.compounds = function(word) {
    return ["hej!"]
  }
  
  return words
}
