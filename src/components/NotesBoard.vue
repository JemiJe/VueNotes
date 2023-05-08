<script setup>
import Note from './Note.vue'
import storage from './storage';
</script>

<script>
export default {
  data() {
    return {
      test: 'meme',
    }
  },
  props: ['notesArr'],
  computed: {
    newNotesArr() {

    }
  },
}
</script>

<template>
  <div class="note-board">
    <Note 
      v-for="note in notesArr"
      :id="note.id"
      :style="note.styleObj"
      :text="note.text" 
      :key="note.id"
    />
  </div>
</template>

<style>
.note-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1em;
}
</style>