import React, { useEffect, useState } from 'react'
import config from './config.js'
import { submitWord, deleteWord } from './http.js'

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
  let [showAddWordForm, setShowAddWordForm] = useState(false)

  let koreanRef = React.createRef()
  let pronouncedRef = React.createRef()
  let englishRef = React.createRef()

  //fetch strings
  useEffect(() => {
    async function fetchData() {
      try {
        const jsonData = await fetch(config.apiURL + '/strings')
        const jsonString = await jsonData.json()
        const jsonObject = JSON.parse(jsonString)
        console.log(jsonObject)
        setStrings(jsonObject)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
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

        <button style={{ padding: '2px 8px 2px 8px', marginLeft: '10px', marginBottom: '20px' }} onClick={() => setShowAddWordForm(true)}>
          Add word
        </button>
        {showAddWordForm && (
          <div
            id='modal'
            style={{ position: 'absolute', top: '0px', left: '0px', height: '100%', width: '100%', background: 'rgba(210,210,210,0.8)' }}
          >
            <div
              className='fat-shadow'
              style={{
                padding: '40px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgb(252, 252, 252)',
                border: '1px solid rgba(202, 202, 202, 1)'
              }}
            >
              <button
                style={{
                  padding: '2px 8px 2px 8px',
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '20px'
                }}
                onClick={() => setShowAddWordForm(false)}
              >
                ✕
              </button>
              <div className='form-line'>
                <div className='label'>Korean:</div>
                <input ref={koreanRef}></input>
              </div>
              <div className='form-line'>
                <div className='label'>Pronounced:</div>
                <input ref={pronouncedRef}></input>
              </div>
              <div className='form-line'>
                <div className='label'>English:</div>
                <input ref={englishRef}></input>
              </div>
              <button
                onClick={() => {
                  let sendable = {
                    korean: koreanRef.current.value,
                    pronounced: pronouncedRef.current.value,
                    meaning: englishRef.current.value,
                    timestamp: new Date().toJSON()
                  }

                  submitWord(sendable, () => {
                    setShowAddWordForm(false)
                    let newStrings = [...strings, sendable]
                    setStrings(newStrings)
                    alert(`Word "${sendable.meaning}" was successfully added.`)
                  })
                }}
                style={{ padding: '10px 20px 10px 20px', cursor: 'pointer', marginTop: '20px' }}
              >
                SUBMIT
              </button>
            </div>
          </div>
        )}
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
