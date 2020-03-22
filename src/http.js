import config from './config.js'

export const submitWord = (sendable, callback) => {
  //these are only helpers for the function to alert correctly
  const wordHelpers = [
    {
      word: sendable.korean,
      title: 'Korean'
    },
    {
      word: sendable.pronounced,
      title: 'Pronounced'
    },
    {
      word: sendable.meaning,
      title: 'English'
    }
  ]

  for (let i = 0; i < wordHelpers.length; i++) {
    const obj = wordHelpers[i]
    const word = '' + obj.word
    const title = obj.title
    if (word.trim() === '') {
      alert(`Empty field under title "${title}" !`)
      return null
    }
  }
  async function submitData() {
    try {
      const jsonData = await fetch(config.apiURL + '/strings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendable) // body data type must match "Content-Type" header
      })

      const jsonString = await jsonData.json()
      console.log(jsonString)
    } catch (err) {
      console.log(err)
    }
    if (typeof callback === 'function') callback()
  }
  submitData()
}

export const deleteWord = (sendable, callback) => {
  async function submitData() {
    try {
      const jsonData = await fetch(config.apiURL + '/strings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendable) // body data type must match "Content-Type" header
      })

      const jsonString = await jsonData.json()
      console.log(jsonString)
    } catch (err) {
      console.log(err)
    }
    if (typeof callback === 'function') callback()
  }
  submitData()
}
