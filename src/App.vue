<script setup>
// notes stores in storage.notes property
// basic core entity for add/change/delete is storage.getStorage().notes (from localStorage)
// notesStorageArr used for displaying 

import storage from './components/storage';
import NotesBoard from './components/NotesBoard.vue';
</script>

<script>
// randomize note color
const baseNoteColor = getComputedStyle(document.documentElement).getPropertyValue('--note-bg');
function getRandomColor(baseColorInHSL) {
  const rand360 = Math.ceil(Math.random() * 360 * 10) % 360;
  const newBgColor = baseColorInHSL.replace(/\(\d+/gm, `(${rand360}`);
  const newTextColor = newBgColor.replace(/\s\d+%\)/gm, ` 35%)`);
  return {
    backgroundColor: newBgColor,
    color: newTextColor,
  };
}

function makeNoteObj(customText) {
  return {
    id: Math.ceil(Math.random() * new Date().getTime()),
    styleObj: {
      note: getRandomColor(baseNoteColor),
    },
    text: customText ? customText : '',
    dateCreated: new Date(),
    dateEdited: new Date(),
    isPinned: false,
  }
};

// inits
storage.init();
if( !storage.getStorage().notes ) {
  storage.changeStorage( storage => storage.notes = [makeNoteObj('edit your first note...')] );
}

// App component
export default {
  data() {
    return {
      notesStorageArr: storage.getStorage().notes,
      searchValue: '',
      searchNotesArr: [],
    }
  },
  created() {
    // to save you should to pass note.id among others properties
    this.emitter.on('note-updated', noteObj => {
      this.saveNote(noteObj);
    });
    this.emitter.on('note-deleted', noteId => {
      this.deleteNote(noteId);
    });

    this.renderNotes();
  },
  methods: {
    renderNotes() {
      this.notesStorageArr = this.searchValue 
      ? [...this.searchNotesArr]
      : [...storage.getStorage().notes];

      this.pinnedToTop();
    },
    addNewNote() {

      storage.changeStorage(storage => {
        const newNote = makeNoteObj();
        
        storage.notes.unshift(newNote);
        if(this.searchNotesArr) this.searchNotesArr.unshift(newNote);
      });

      this.renderNotes();
    },
    saveNote(changedNote) { 

      storage.changeStorage(storage => {
        storage.notes = storage.notes.map(note => {
          if (note.id === changedNote.id) note = { ...note, ...changedNote };
          return { ...note };
        });
      });

      this.renderNotes();
    },
    deleteNote(noteId) {

      storage.changeStorage(storage => {
        storage.notes = storage.notes.filter((note) => note.id !== noteId);
        this.searchNotesArr = this.searchNotesArr.filter((note) => note.id !== noteId);
      });

      this.renderNotes();
    },
    searchNotes() {
      if(this.searchValue) {

        const searchValue = this.searchValue.toLocaleLowerCase().trim();
        this.searchNotesArr = [...storage.getStorage().notes].filter(note => {
          
          const noteText = note.text.toLocaleLowerCase();
          
          return noteText.includes( searchValue );
        });
        
        this.notesStorageArr = [...this.searchNotesArr];

        this.pinnedToTop();

      } else {
        // this.notesStorageArr = [...storage.getStorage().notes];
        this.renderNotes();
      }
    },
    pinnedToTop() {
      this.notesStorageArr = [...this.notesStorageArr].sort((note1, note2) => {
        return note1.isPinned > note2.isPinned ? -1 : 1;
      });
    },
  }
}
</script>

<template>
  <header>VueNotes</header>

  <div class="app-controls">
    <button @click="addNewNote" class="btn note-add">Add new note</button>
    <input v-model="searchValue" @input="searchNotes" type="text" class="note-search" id="note-search" placeholder="search...">
  </div>

  <NotesBoard :notesArr="notesStorageArr" />
</template>

<style>
header {
  display: flex;
  height: 3em;
  justify-content: center;
  align-items: center;
  font-size: 2em;
}

.app-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 2em;
}

.app-controls>button,
.app-controls>input {
  margin: 0.3em;
}
</style>
