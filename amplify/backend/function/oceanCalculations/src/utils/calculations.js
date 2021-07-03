const fs = require('fs')
let normalData = JSON.parse(fs.readFileSync('./utils/normalData.json'))
let map = JSON.parse(fs.readFileSync('./utils/map.json'))

function GetZPercent(z) {
  //z == number of standard deviations from the mean

  //if z is greater than 6.5 standard deviations from the mean
  //the number of significant digits will be outside of a reasonable
  //range
  if (z < -6.5) return 0.0
  if (z > 6.5) return 1.0

  var factK = 1
  var sum = 0
  var term = 1
  var k = 0
  var loopStop = Math.exp(-23)
  while (Math.abs(term) > loopStop) {
    term =
      (((0.3989422804 * Math.pow(-1, k) * Math.pow(z, k)) /
        (2 * k + 1) /
        Math.pow(2, k)) *
        Math.pow(z, k + 1)) /
      factK
    sum += term
    k++
    factK *= k
  }
  sum += 0.5
  return sum
}

const calculateScores = async (data, sex, payloadage) => {
  let result = data.reduce(
    (accumulator, answer, index) => {
      let finalValue = map[index][1] === 'F' ? answer : 6 - answer
      if (map[index][0] in accumulator) {
        accumulator[map[index][0]].push(finalValue)
      } else {
        accumulator[map[index][0]] = [finalValue]
      }
      accumulator[map[index][0][0]].push(finalValue)
      return accumulator
    },
    { A: [], C: [], E: [], N: [], O: [] }
  )

  let ageScales = [20, 40, 60, 95]
  let age = ageScales.find((n) => n > payloadage) || 95
  const ageData = normalData[sex][age.toString()]
  let normalisedResults = {}
  for (let facet in result) {
    let { M, SD } = ageData[facet]
    let rawValue =
      result[facet].length *
      (result[facet].reduce((a, b) => a + b, 0) / result[facet].length)
    normalisedResults[facet] = [
      100 * GetZPercent((rawValue - M) / SD),
      10 * ((rawValue - M) / SD) + 50,
    ]
  }

  // transform normalisedResults in an object, easier to access when we display results
  let finalResult = {
    traits: {},
    groupedFacets: { A: {}, C: {}, E: {}, N: {}, O: {} },
  }
  for (let facet in normalisedResults) {
    if (['A', 'C', 'E', 'N', 'O'].includes(facet)) {
      let trait = {}
      trait['score'] = normalisedResults[facet][0]
      trait['HML'] = normalisedResults[facet][1]
      finalResult['traits'][facet] = trait
    } else {
      let trait = {}
      trait['score'] = normalisedResults[facet][0]
      trait['HML'] = normalisedResults[facet][1]
      finalResult['groupedFacets'][facet[0]][facet] = trait
    }
  }
  return finalResult
}

module.exports.calculateScores = calculateScores
