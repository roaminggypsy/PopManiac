import React, { useState } from 'react';
import axios from 'axios';

export default function JoinPlaylist() {
  const [isValid, setIsValid] = useState(true);
  const [playlistId, setPlaylistId] = useState('');

  function handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    setPlaylistId(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get('/api/playlist' + playlistId)
      .then(function (response) {
        // if (songQ.doesNotExist) {
        //   this.setState({
        //     isValid: false,
        //   });
        // } else {
        //   this.props.router.push('/q/' + songQ._id);
        // }
      })
      .catch(function (error) {})
      .then(function () {});
  }

  return (
    <div id='joinQueue'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 col-md-offset-2'>
            <div className='page-header'>
              <h2>Join Queue</h2>
            </div>

            {/* <ReactCSSTransitionGroup
              transitionName='alert'
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
            >
              {this.state.isValid ? null : (
                <Alert
                  message='No SongQueue exists with that ID'
                  type='danger'
                  key='doesNotExistAlert'
                />
              )}
            </ReactCSSTransitionGroup> */}

            <form onSubmit={handleSubmit}>
              <div className='input-group input-group-lg'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Example ID: ax34EDc'
                  name='playlistId'
                  onChange={handleInputChange}
                  value={playlistId}
                ></input>

                <span className='input-group-btn'>
                  <button className='btn btn-primary' type='submit'>
                    Join
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
