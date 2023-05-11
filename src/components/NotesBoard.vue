<script setup>
import Note from './Note.vue'
</script>

<script>
export default {
  data() {
    return {
      test: 'meme',
    }
  },
  props: ['notesArr'],
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
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
  max-width: 70em;
  margin: auto;
  padding: 1em;
}
</style>