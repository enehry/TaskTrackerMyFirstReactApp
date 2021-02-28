import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from  './components/Footer'
import About from  './components/About'
import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom'

const App = () => {

  const[tasks, setTasks] = useState([])

  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {

      const getTasks = async () => {
        const taskFromServer = await fetchTasks()
        setTasks(taskFromServer)
      }
      getTasks()
    }, []
  )

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

    const addTask = async (task) => {
      // const id = Math.floor(Math.random() * 10000) + 1

      // const newTask = {id, ...task}
      // setTasks([...tasks, newTask])

      const res = await fetch('http://localhost:5000/tasks' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })

      const data = await res.json()

      setTasks([...tasks, data])

    }


    // Delete task
    const deleteTask = async (id) => {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE'
      })

      setTasks(tasks.filter((task) => task.id !== id))
    }

    const fetchTask = async (id) => {
      const res = await fetch(`http://localhost:5000/tasks/${id}`)
      const data = await res.json()
      return data
    }

    // Toggle reminder

    const toggleReminder = async (id) => {
  
      const taskToToggle = await fetchTask(id)

      const updatedTask = await {...taskToToggle, reminder: !taskToToggle.reminder}
      
      console.log(updatedTask)
      const res = await fetch(`http://localhost:5000/tasks/${id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })

      const data = await res.json()

      setTasks(
        tasks.map((task) => 
        task.id === id ? { ...task, reminder: 
        data.reminder} : task
        )
      )
    }

    const toggleAddTask = () => {
      setShowAddTask(!showAddTask)
    }

  return (
    <Router>
    <div className='container'>
        <Header title = 'Task Tracker'
        onClick = {toggleAddTask}
        showAdd  = {showAddTask}
        />
        <Route path='/' exact render={(props) => (
          <>
            {tasks.length > 0 ? 
            <Tasks tasks = {tasks} onDelete = {deleteTask} onToggle = {toggleReminder}/> : 
            <h5>Task is empty</h5> }
            {showAddTask ? <AddTask onAdd={addTask} /> : '' }
          </>
        )} />
        <Route path='/about' component={About} />
        <Footer />
    </div>
    </Router>
  )
}


export default App;
