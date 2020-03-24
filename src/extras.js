{
  /* <button style={{ padding: '2px 8px 2px 8px', marginLeft: '10px', marginBottom: '20px' }} onClick={() => setShowAddWordForm(true)}>
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
        )} */
}
