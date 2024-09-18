import React, { useState } from 'react'
import TickIcon from "../components/TickIcon"
import ProgressBar from "../components/ProgressBar"
import Modal from './Modal'

const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(false)

  const deleteItem = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/todos/${task.id}`, {
        method: 'DELETE'
      })
      if (response.status === 200) {
        getData()
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='list-item'>
      <div className='info-container'>
        <div className='head-title'>
          <TickIcon />
          <p className='task-title'>{task.title}</p>
        </div>

        <ProgressBar progress={task.progress} />
        <div className='button-container'>
          <button className='edit' onClick={() => setShowModal(true)}>Edit</button>
          <button className='delete' onClick={deleteItem}>Delete </button>
        </div>
      </div>

      {showModal && <Modal mode={'edit'} setShowModal={setShowModal} task={task} getData={getData} />}
    </div>
  )
}

export default ListItem