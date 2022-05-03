
import 
{ fetchData } 
from './main.js'

//Have to make code to wipe is_vent notes
//When reloading the page the sql connection seems to crash, or maybe just window href?
//Everytime I save it reloads and crashes, nodemon
//Have to close LiveServer and open again to fix
//But seems it's just a problem w/ my note files & saving in them. Display() to blame?

//**** Yeah it seems to just be when I save in note-script.js something messes up
//Only when I save code while LOOKING or CURRENTLY ON /public/notes, switch tab to SAVE
display()

let noteForm = document.getElementById("noteForm")
if(noteForm) noteForm.addEventListener('submit', addNote)

function displayNotes(note) {

  const flexNotes = document.getElementById("flex-notes")
  const contentTemp = note.content
  const moodTemp = note.mood
  const noteId = note.noteId    //For testing delete purposes
  //const is_ventTemp = note.is_vent

  let p = document.createElement('p')
  p.className = "note"
  p.innerHTML = `
    ${noteId}
    <hr>
    ${contentTemp}
    <hr>
    <br>
    This made you feel: ${moodTemp}
    <br>
    <button class="button" id="deleteBtn">Delete</button>
  `

  let btn = document.getElementById("deleteBtn")
  if(btn) p.addEventListener('click', deleteNote(noteId))
  p.addEventListener('click', deleteNote(noteId))
  // if(btn) p.addEventListener('click', deleteNote())
  // p.addEventListener('click', deleteNote)

  flexNotes.appendChild(p)

  document.getElementById("note").value = ""
}

function addNote(e) {
  e.preventDefault()

  const flexNotes = document.getElementById("flex-notes")
  const contentTemp = document.getElementById("note").value
  const moodTemp = document.getElementById("emotion").value
  let is_ventTemp
  if(document.getElementById("is_vent").checked) {
    is_ventTemp = 1
  } else {
    is_ventTemp = 0
  }

  fetchData('/notes/create', {content: contentTemp, mood: moodTemp, is_vent: is_ventTemp}, "POST")
  .then((data) => {
    if(!data.message) {
      console.log(data)
      // localStorage.setItem('note', JSON.stringify(data))
    }
  })
  .catch((error) => {
    const errText = error.message;
    console.log(`Error! ${errText}`)
  })
  //We could send a note object to the display() instead of repeating code
  //Just refresh here? Because of display don't want to do all this again
  let p = document.createElement('p')
  p.className = "note"
  p.innerHTML = `
    ${contentTemp}
    <hr>
    <br>
    This made you feel: ${moodTemp}
    <br>
    <button class="button" id="deleteBtn">Delete</button>
  `
  let btn = document.getElementById("deleteBtn")
  if(btn) p.addEventListener('click', deleteNote)
  p.addEventListener('click', deleteNote)
  

  // const newNote = new Note(note)
  // console.log(newNote)

  flexNotes.appendChild(p)

  document.getElementById("note").value = ""
}

function deleteNote(noteIdTemp) { 
  console.log("in deleteNote")
  //Sends parameters to routes, have to use key
  fetchData('/notes/delete', {noteId: noteIdTemp}, "DELETE")
  .then((data) => {
    if(!data.message) {
      console.log(data.success)
      //window.location.href = "notes.html"
    }
  })
  .catch((error) => {
    const errText = error.message 
    console.log(`Error! ${errText}`)
  })
}

function display() {
  fetchData('/notes/display', {}, "POST")
  .then((data) => {
    if(!data.message) {
      console.log(data.success)
      data.forEach(note => displayNotes(note))
    }
  })
  .catch((error) => {
    const errText = error.message 
    console.log(`Error! ${errText}`)
  })
}
