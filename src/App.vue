<script setup>
// notes stores in storage.notes property

import storage from './components/storage';
import NotesBoard from './components/NotesBoard.vue';
</script>

<script>
storage.init();

// randomize note color
const baseNoteColor = getComputedStyle(document.documentElement).getPropertyValue('--note-bg');
const getRandomColor = baseColorInHSL => {
  const rand360 = Math.ceil(Math.random() * 360 * 10) % 360;
  return baseColorInHSL.replace(/\(\d+/gm, `(${rand360}`);
}

const makeNoteObj = customText => {
  return {
    id: Math.ceil(Math.random() * new Date().getTime()),
    styleObj: {
      backgroundColor: getRandomColor(baseNoteColor)
    },
    text: customText ? customText : '',
    dateCreated: new Date(),
    dateEdited: '',
  }
};

// App component
export default {
  data() {
    return {
      notesStorageArr: storage.getStorage().notes
        ? storage.getStorage().notes
        : [makeNoteObj('edit your first note...')]
    }
  },
  created() {
    this.emitter.on('note-updated', noteObj => {
      this.saveNote(noteObj);
    });
    this.emitter.on('note-deleted', noteId => {
      this.deleteNote(noteId);
    });
  },
  methods: {
    addNewNote() {
      this.notesStorageArr.unshift(makeNoteObj());
      // this.notesStorageArr = this.notesStorageArr.sort((note1, note2) => note1.dateCreated < note2.dateCreated ? 1 : -1);
    },
    saveNote(changedNote) {
      let tempArr = [...this.notesStorageArr].map(note => {
        if (note.id === changedNote.id) note = { ...note, ...changedNote };
        return { ...note };
      });
      this.notesStorageArr = [...tempArr];

      storage.chageStorage(storage => {
        storage.notes = [...this.notesStorageArr];
      });
    },
    deleteNote(noteId) {
      this.notesStorageArr = this.notesStorageArr.filter((note) => note.id !== noteId);

      storage.chageStorage(storage => {
        storage.notes = [...this.notesStorageArr];
      });
    },
  }
}
</script>

<template>
  <header>VueNotes</header>

  <div class="app-controls">
    <button @click="addNewNote" class="btn note-add">Add new note</button>
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
  justify-content: center;
  padding: 0 2em;
}
</style>
