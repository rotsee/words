/**
 * Swedish dictionary support for text template functions,
 * using the Stava algorithms and the Saldo dictionary.
 * This is my SPRAK HT2021 project.
 *
 * Leonard Wallentin
 *
 */
require('dotenv').config()
const path = require("path")
const fs = require("fs")

const TERRITORIES_FILE_NAME = "./assets/territory-prefixes.txt"


/**
 * @module words
 * @param {string} dictionaryPath Path to local saldo dictionary
 * @returns {object} A words instance
 * @example
 * // returns ["högstadium", "korridor"]
 * const w = require("words")("dictionary")
 * w.compunds("Högstadiekorridor")
 */
module.exports = function() {
  let words = {}

  words.data = require(process.env.DICT_FILE_NAME)
  
  console.time()
  // Add initial parts by syntactic funtion
  // c*: compound form
  // sms: compound form, free-standing
  const isPrefix = w => [
    "cm", "ci", "c", // compound parts
    "num", "ord", // ordinals and cardinals
  // ].includes(w.msd)
  ].some(p => w.msd.split(" ").includes(p))
  words.prefixes = words.data
    .map(w => w.WordForms
      .filter(isPrefix)
      .map(wf => wf.writtenForm.toLocaleLowerCase("sv"))
    ).flat()
  
  // Add parts by word class
  // https://spraakbanken.gu.se/en/resources/saldo/tagset
  const isPrefixableClass = r => [
    "pm", "pp",
    "in", "inm",
    "ssm",
    "sxc", "mxc",
  // ].includes(r.partOfSpeech)
  ].some(p => r.partOfSpeech.split(" ").includes(p))
  const morePrefixes = words.data
    .filter(w => w.FormRepresentations.some(isPrefixableClass))
    .map(w => w.WordForms
      .map(wf => wf.writtenForm.toLocaleLowerCase("sv"))
    ).flat()
  words.prefixes = words.prefixes.concat(morePrefixes)
  
  // Add compound parts from territory list
  const territories = fs.readFileSync(TERRITORIES_FILE_NAME, "utf8")
  words.prefixes = words.prefixes
    .concat(territories.split("\n"))
    .map(w => w.toLocaleLowerCase("sv"))
  
  // Every word that is not a prefix
  const isTail = w => !["cm", "ci", "c", "sms", "ord"].includes(w.msd)
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
    word = word.toLocaleLowerCase("sv").replace("-", "")
    // Is this a non-prefix word in our dictionary?
    if (this.tails.includes(word)) {
      return [word]
    }    

    /* Recursive function splitting function*/
    const split = (word, prefixStack) => {
      let variants = []
      if (typeof prefixStack === "undefined") {
        prefixStack = []
      }

      // All Swedish prefixes must contain one vowel
      const minimalSyllable = /^[qwrtpsdfghjklzxcvwbnmçĉćñţşŝśẑźđłß]*[eëéèêüâáàȩæøœãõöyuioaåöä]/
      const m = word.match(minimalSyllable)
      if (!m) {
        // No a possible prefix start found. Return early
        // (this happens at the end of words, like ”knu|ff”)
        return variants
      }
      let prefix = m[0]
      let prefixBoundry = prefix.length

      while (prefixBoundry < word.length) {
        if (this.prefixes.includes(prefix)) {
          // We found a prefix.
          // Check if the remainder is an allowed tail
          const remainder = word.slice(prefixBoundry, word.length)    
          const reminderWithoutGlue = remainder.slice(1, remainder.length)
          const remainderWithExtraConsonant = prefix[prefix.length - 1] + remainder
          if (
            (prefixStack.length) &&
            (remainder[0] === "s") &&
            this.tails.includes(reminderWithoutGlue)
          ) {
            // If we hade more than one compound already,
            // first try removing glueing 's'!          
            variants.push([...prefixStack, prefix, reminderWithoutGlue])
          } else if (this.tails.includes(remainder)) {
            // otherwise, try the whole rest
            variants.push([...prefixStack, prefix, remainder])
          } else if (
            // Finally, check if we had a triple consonant reductions
            prefix[prefix.length - 1] === prefix[prefix.length - 2] &&
            this.tails.includes(remainderWithExtraConsonant)
          ) {
            variants.push([...prefixStack, prefix, remainderWithExtraConsonant])
          } else {
            // Recursively keep splitting remainder
            prefixStack.push(prefix)
            variants = variants.concat(split(remainder, prefixStack))
            prefixStack.pop()
          }
        }
        prefixBoundry++
        prefix = word.slice(0, prefixBoundry)
      }
      return variants
    }

    let candidates = split(word)
    // pick the shortest lists
    const shortest = Math.min(...candidates.map(c => c.length))
    candidates = candidates.filter(c => c.length === shortest)
    if (candidates.length > 1) {
      // remove three-syllable compunds as they are more unlikely,
      // according to Sjöbergh & Kann
      const _ = candidates.filter(c => {
        let tripple = false
        c.forEach((part, i) => {
          const len = part.length
          const letter = part[len - 1]
          const nextPart = c[i + 1]
          if (nextPart && nextPart[0] === letter && part[len - 2] === letter) {
            tripple = true
          }
        })
        // Select those that are not tripple
        return !tripple        
      })
      if (_.length) {
        candidates = _
      }
    }
    return candidates[0] 
  }
  
  return words
}
