

<script>
// import EventBus from '@/eventBus';

const breakpointPhone = 550;

export default {
  data() {
    return {
      controlsIsHidden: true,
      noteText: this.text,
      styleObject: this.style,
      rotateDeg: Math.ceil( -2 + Math.random() * 4 ),
      isActive: false,
      isRotated: true,
    }
  },
  props: ['id', 'text', 'style'],
  mounted() {
    this.randomRotate();
  },
  updated() {
    this.randomRotate();
  },
  methods: {
    randomRotate() {
      this.$refs.note.style.transform = this.isRotated ? `rotate(${this.rotateDeg}deg)` : 'rotate(0deg)';
    },
    toggleContols() {
      this.controlsIsHidden = !this.controlsIsHidden;
    },
    saveNote() {
      this.deactivateNote();
      this.emitter.emit('note-updated', {
        id: this.id,
        text: this.noteText,
        dateEdited: new Date(),
      });
    },
    deleteNote() {
      if(this.isActive) {
        this.deactivateNote();
      } else {
        this.emitter.emit('note-deleted', this.id);
      }
    },
    activateNote() {
      this.isActive = true;
      this.isRotated = false;

      // put note to properly position for wide screens
      if( window.innerWidth > breakpointPhone ) {
        // const noteBoardTop = this.$refs.note.parentElement.offsetTop;
        const noteBoardTop = this.$refs.note.closest(".note-board").offsetTop;
        const windowScrollPos = Math.floor(document.documentElement.scrollTop);
        this.styleObject.note.top = `${windowScrollPos - noteBoardTop}px`;
      }
    },
    deactivateNote() {
      this.isActive = false;
      this.isRotated = true;

      if( window.innerWidth > breakpointPhone ) {
        this.styleObject.note.top = 'auto';
      }
    },
  }
}
</script>

<template>
  <div 
    class="note"
    ref="note"
    :class="this.isActive ? 'note-active' : ''"
    :style="styleObject.note" 
    @mouseenter="toggleContols" 
    @mouseleave="toggleContols"
  >
    
    <div class="note-controls" :class="controlsIsHidden ? 'hidden' : ''">
      <button 
        @click="deleteNote" 
        class="note-delete btn" 
        id="noteDelete"
      >&#10006;</button>
    </div>
    
    <textarea 
      :style="styleObject.note" 
      class="note-textarea" 
      v-model="noteText" 
      @focusout="saveNote"
      @focus="activateNote"
      placeholder="start your note..."
    >
      {{ noteText }}
    </textarea>
  </div>
</template>

<style>
.note {
  position: relative;
  width: 10em;
  height: var(--note-height);
  padding: 0 1em 1em;

  font-size: 1.1em;

  box-shadow: var(--shadow);
  background-color: var(--note-bg);
}

.note.note-active {
  position: absolute;
  height: var(--note-active-height);
  width: 50vw;
  margin-top: 15%;
  z-index: 2;
}

@media screen and (max-width: 550px) {

  .note {
    margin: -2em 1em 0;
  }

  .note.note-active {
    position: relative;
    height: var(--note-active-height);
    width: 90vw;
    margin-top: initial;
  }
}

.note textarea {
  width: 100%;
  height: calc(var(--note-height) - 2em);
  margin: 2em 0 0;
  padding: 0;

  border: none;
  overflow: hidden;
  outline: none;
  box-shadow: none;
  resize: none;
  font-family: sans-serif;

  background-color: var(--note-bg);
}

.note.note-active textarea {
  overflow: auto;
  height: calc(var(--note-active-height) - 2em);
}

.note .note-controls {
  position: absolute;
  right: 0;

  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 550px) {
  .note {
    width: 100%;
  }
}
</style>