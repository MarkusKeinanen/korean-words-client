import React, { useEffect, useState } from 'react'
import config from './config.js'
import { submitWord, deleteWord } from './http.js'
import 'google.js'

let spanStyle = {
  marginRight: '10px',
  padding: '3px 10px 3px 10px',
  cursor: 'pointer',
  background: '#dedede',
  borderRadius: '4px',
  border: '1px solid #c9c9c9'
}

function App() {
  let [strings, setStrings] = useState([])
  let [englishFirst, setEnglishFirst] = useState(1)
  let [sortingOrder, setSortingOrder] = useState(1)
  let [visibleIndexes, setVisibleIndexes] = useState([])

  //fetch strings
  useEffect(() => {
    //window.currentWords holds all
    window.wordsReadyCallback = arrayOfWords => {
      console.log(arrayOfWords)
      setStrings(arrayOfWords)
    }
  }, [])

  //what happens when you press a hidden word
  const hiddenClick = idx => {
    idx = parseInt(idx)
    let newVisible = [...visibleIndexes]
    if (visibleIndexes.includes(idx)) {
      newVisible = newVisible.filter(i => {
        return i !== idx
      })
    } else {
      newVisible.push(idx)
    }
    setVisibleIndexes(newVisible)
  }

  //returns JSX of black box word
  const getHiddenSpan = (targetIdx, stringInside, isVisible) => {
    return (
      <span
        className={'potential-hidden ' + !isVisible ? 'noselect' : ''}
        onClick={() => hiddenClick(targetIdx)}
        style={{ ...spanStyle, ...(isVisible ? {} : { background: 'black' }) }}
      >
        {stringInside}
      </span>
    )
  }

  strings.sort((str1, str2) => {
    let date1 = new Date(str1.timestamp)
    let date2 = new Date(str2.timestamp)
    if (sortingOrder === 1) {
      return date1.getTime() - date2.getTime()
    } else {
      return date2.getTime() - date1.getTime()
    }
  })

  return (
    <div id='main' style={{ textAlign: 'center' }}>
      <div style={{ padding: '20px' }}>
        <select
          value={englishFirst}
          onChange={e => {
            const numberValue = parseInt(e.currentTarget.value)
            setEnglishFirst(numberValue)
          }}
          style={{ marginBottom: '20px' }}
        >
          <option value={1}>English first</option>
          <option value={0}>Korean first</option>
        </select>

        <select
          value={sortingOrder}
          onChange={e => {
            const numberValue = parseInt(e.currentTarget.value)
            setSortingOrder(numberValue)
          }}
          style={{ marginLeft: '10px', marginBottom: '20px' }}
        >
          <option value={1}>Newest</option>
          <option value={0}>Oldest</option>
        </select>
      </div>
      <div className='container' style={{ textAlign: 'left', display: 'inline-block', padding: '0px 10px 0px 10px' }}>
        {strings.map((obj, i) => {
          const equalsStyle = {
            marginRight: '10px'
          }
          const visible = visibleIndexes.includes(i)

          const deleteButton = (
            <button
              onClick={() => {
                if (!window.confirm(`Are you sure you want to delete word ${obj.meaning}?`)) return null
                deleteWord(obj, () => {
                  let newStrings = strings.filter(str => {
                    if (obj.korean === str.korean && obj.pronounced === str.pronounced && obj.meaning === str.meaning) {
                      return false
                    }
                    return true
                  })
                  setStrings(newStrings)
                  alert(`Word ${obj.meaning} was successfully deleted.`)
                })
              }}
              style={{ display: 'inline-block', marginRight: '20px', background: '#ed8e8e', color: 'white' }}
            >
              ✕
            </button>
          )

          if (englishFirst === 1) {
            return (
              <div key={'line' + i} style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                {deleteButton}
                <span style={{ ...spanStyle }}>{obj.meaning}</span>
                <span style={{ ...equalsStyle }}>=</span>
                {getHiddenSpan(i, obj.pronounced, visible)}
                <span style={{ ...equalsStyle }}>=</span>
                {getHiddenSpan(i, obj.korean, visible)}
              </div>
            )
          } else {
            return (
              <div key={'line' + i} style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                {deleteButton}
                <span style={{ ...spanStyle }}>{obj.korean}</span>
                <span style={{ ...equalsStyle }}>=</span>
                {getHiddenSpan(i, obj.pronounced, visible)}
                <span style={{ ...equalsStyle }}>=</span>
                {getHiddenSpan(i, obj.meaning, visible)}
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default App
