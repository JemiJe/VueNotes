

<script>
// import EventBus from '@/eventBus';

export default {
  data() {
    return {
      controlsIsHidden: true,
      noteText: this.text,
      styleObject: this.style
    }
  },
  props: ['id', 'text', 'style'],
  methods: {
    toggleContols() {
      this.controlsIsHidden = !this.controlsIsHidden;
    },
    saveNote() {
      this.emitter.emit('note-updated', {
        id: this.id,
        text: this.noteText,
        dateEdited: new Date(),
      });
    },
    deleteNote() {
      this.emitter.emit('note-deleted', this.id);
    },
  }
}
</script>

<template>
  <div 
    class="note"
    :style="styleObject"
    @mouseenter="toggleContols"
    @mouseleave="toggleContols"
  >
    <div class="note-controls" :class="controlsIsHidden ? 'hidden' : ''">
      <button @click="deleteNote" class="note-delete btn" id="noteDelete">&#10006;</button>
    </div>
    <textarea
      :style="styleObject"
      class="note-textarea"
      v-model="noteText"
      @focusout="saveNote"
    >
      {{ noteText }}
    </textarea>
  </div>
</template>

<style>
.note {
  position: relative;
  width: 10em;
  height: 10em;
  margin: 1em;
  padding: 1em;
  
  font-size: 1.1em;
  
  box-shadow: var(--shadow);
  background-color: var(--note-bg);
}

.note textarea {
  width: 100%;
  height: 8em;
  margin: 0;
  padding: 0;

  border: none;
  overflow: auto;
  outline: none;
  box-shadow: none;
  resize: none;
  font-family: sans-serif;

  background-color: var(--note-bg);
}

.note .note-controls {
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 550px) {
  .note {
    width: 100%;
  }
}
</style>