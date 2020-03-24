/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 *
 * real spreadsheet: https://docs.google.com/spreadsheets/d/1nFb3jDXKOSw-aJjMZppVlWo62oFLpXM21wTCkp-Xdow/edit#gid=0
 *
 */
const spreadsheetId = '1nFb3jDXKOSw-aJjMZppVlWo62oFLpXM21wTCkp-Xdow'

const parseDate = dateStr => {
  try {
    let arr = dateStr.split('-')
    let y = parseInt(arr[0])
    let m = parseInt(arr[1]) - 1
    let d = parseInt(arr[2])
    let date = new Date()
    date.setFullYear(y)
    date.setMonth(m)
    date.setDate(d)
    return date
  } catch (ex) {
    return new Date()
  }
}

window.listRows = () => {
  let gapi = window.gapi
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: spreadsheetId,
      range: 'WORDS!A2:D'
    })
    .then(
      function(response) {
        var range = response.result
        console.log(range)
        let arrayOfWords = []

        if (range.values.length > 0) {
          for (let i = 0; i < range.values.length; i++) {
            var row = range.values[i]
            let wordObject = {
              meaning: row[0],
              pronounced: row[1],
              korean: row[2],
              timestamp: parseDate(row[3])
            }
            arrayOfWords.push(wordObject)
          }
        }
        window.currentWords = arrayOfWords
        window.wordsReadyCallback(arrayOfWords)
      },
      function(response) {
        console.log(response.result.error.message)
      }
    )
}
