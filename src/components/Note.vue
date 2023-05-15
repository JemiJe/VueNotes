

<script>
// import EventBus from '@/eventBus';

const breakpointPhone = 550;

export default {
  data() {
    return {
      controlsIsHidden: true,
      noteText: this.noteObj.text,
      styleObject: this.noteObj.styleObj,
      isActive: false,
      isPinnedNote: this.noteObj.isPinned,
    }
  },
  props: ['noteObj'],
  methods: {
    toggleContols() {
      this.controlsIsHidden = !this.controlsIsHidden;
    },
    saveNote() {
      this.deactivateNote();
      this.emitter.emit('note-updated', {
        id: this.noteObj.id,
        text: this.noteText,
        dateEdited: new Date(),
        isPinned: this.isPinnedNote,
      });
    },
    deleteNote() {
      if(this.isActive) {
        this.deactivateNote();
      } else {
        this.emitter.emit('note-deleted', this.noteObj.id);
      }
    },
    pinNote() {
      this.isPinnedNote = !this.isPinnedNote;
      this.saveNote();
    },
    activateNote() {
      this.isActive = true;

      // put note to properly position for wide screens
      if( window.innerWidth > breakpointPhone ) {
        // const noteBoardTop = this.$refs.note.parentElement.offsetTop;
        const noteBoardTop = this.$refs.note.closest(".note-board").offsetTop;
        const windowScrollPos = Math.floor(document.documentElement.scrollTop);
        this.styleObject.note.top = `${windowScrollPos - noteBoardTop}px`;
      }
    },
    deactivateNote() {
      // return false;
      this.isActive = false;

      if( window.innerWidth > breakpointPhone ) {
        this.styleObject.note.top = 'auto';
      }
    },
    getNoteDates() {
      
      const options = ['en-GB', { hour12: false, }];
      const { dateEdited, dateCreated } = this.noteObj;
      
      const full = {
        created: 'created: ' + new Date(dateCreated).toLocaleString(...options),
        edited: 'edited: ' + new Date(dateEdited).toLocaleString(...options),
      };
      const short = {
        created: new Date(dateCreated).toLocaleDateString(options[0]),
        edited: new Date(dateEdited).toLocaleDateString(options[0]),
      };
      
      return this.isActive ? full : short;
    }
  }
}
</script>

<template>
  <div 
    class="note"
    ref="note"
    :class="this.isActive ? 'note-active' : ''"
    :style="this.styleObject.note" 
    @mouseenter="toggleContols" 
    @mouseleave="toggleContols"
  >
    <div :class="isPinnedNote ? 'note-pinned-badge' : 'hidden'"><div></div></div>
    <div class="note-controls" :class="controlsIsHidden ? 'hidden' : ''">
      
      <button 
        @click="pinNote" 
        class="btn btn-control btn-pin" 
        id="pinNote"
      ><div></div></button>
      
      <button 
        @click="deleteNote" 
        class="btn btn-control" 
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

    <div 
      class="note-date" 
      :class="controlsIsHidden ? 'hidden' : isActive ? 'note-date note-date-active' : ''"
    >
      <span>{{this.getNoteDates().edited}}</span>
      <span v-if="isActive">{{this.getNoteDates().created}}</span>
    </div>
  </div>
</template>

<style>
.note {
  position: relative;
  width: 10em;
  height: var(--note-height);
  margin: 0.5em;
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
  z-index: 5;
}

@media screen and (max-width: 550px) {

  .note.note-active {
    position: relative;
    height: var(--note-active-height);
    width: 90vw;
    margin-top: initial;
    transform: scale(1.05);
  }
}

.note textarea,
.note .note-controls {
  z-index: 2;
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
.note-pinned-badge {
  position: absolute;
  left: 0;
  top: -0.5em;
  z-index: 1;
}

.note-pinned-badge > div {
  width: 1.8em;
  height: 1.8em;
  
  background-image: url('../assets/icons8-round-pushpin-48.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.note .note-date {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.3em;
  width: 100%;

  display: flex;
  justify-content: center;
  
  color: var(--note-date-color);
  font-size: 0.7em;
  z-index: 1;
}

.note .note-date span {
  margin: 0 0.5em;
}

.note .note-date.note-date-active {
  padding: 0.3em;
}
</style>