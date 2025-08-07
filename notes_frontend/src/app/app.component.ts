import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { Note } from './models/note.model';
import { NotesService } from './services/notes.service';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';

/**
 * PUBLIC_INTERFACE
 * Root app component handles notes CRUD, layout, and responsive structure.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NotesListComponent, NoteEditorComponent],
  providers: [provideHttpClient()],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  notes: Note[] = [];
  selectedNoteId: number | null = null;
  selectedNote: Note | null = null;
  loading: boolean = false;
  error: string = '';
  isEditing: boolean = false;
  isCreating: boolean = false;

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.loading = true;
    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes.sort((a, b) =>
          (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt)
        );
        // keep selected id if possible, else clear
        if (
          this.selectedNoteId &&
          !this.notes.find((n) => n.id === this.selectedNoteId)
        ) {
          this.selectedNoteId = null;
          this.selectedNote = null;
        }
        this.loading = false;
      },
      error: () => {
        this.notes = [];
        this.loading = false;
        this.error = 'Error loading notes.';
      },
    });
  }

  onSelectNote(id: number) {
    if (this.isEditing || this.isCreating) return;
    this.selectedNoteId = id;
    this.getNoteDetails(id);
  }

  getNoteDetails(id: number) {
    this.loading = true;
    this.notesService.getNote(id).subscribe({
      next: (note) => {
        this.selectedNote = note;
        this.loading = false;
        this.isEditing = false;
        this.isCreating = false;
      },
      error: () => {
        this.selectedNote = null;
        this.loading = false;
        this.error = 'Selected note not found.';
      },
    });
  }

  onDeleteNote(id: number) {
    if (!globalThis.confirm('Delete this note?')) return;
    this.notesService.deleteNote(id).subscribe({
      next: () => {
        // If deleted note was selected, clear details
        if (this.selectedNoteId === id) {
          this.selectedNote = null;
          this.selectedNoteId = null;
        }
        this.loadNotes();
      },
      error: () => {
        this.error = 'Failed to delete note.';
      },
    });
  }

  onCreateNewNote() {
    this.isCreating = true;
    this.selectedNote = null;
    this.selectedNoteId = null;
    this.isEditing = false;
  }

  onSaveNewNote(data: Partial<Note>) {
    this.notesService.createNote(data).subscribe({
      next: (note) => {
        this.notes.unshift(note);
        this.selectedNote = note;
        this.selectedNoteId = note.id;
        this.isEditing = false;
        this.isCreating = false;
        this.loadNotes();
      },
      error: () => {
        this.error = 'Failed to create note.';
      },
    });
  }

  onEditNote() {
    this.isEditing = true;
    this.isCreating = false;
  }

  onSaveEditedNote(data: Partial<Note>) {
    if (!this.selectedNoteId) return;
    this.notesService.updateNote(this.selectedNoteId, data).subscribe({
      next: (note) => {
        this.selectedNote = note;
        this.isEditing = false;
        this.isCreating = false;
        this.loadNotes();
      },
      error: () => {
        this.error = 'Failed to save note.';
      },
    });
  }

  onCancelEditOrCreate() {
    if (this.isCreating) {
      this.isCreating = false;
      this.selectedNote = null;
      this.selectedNoteId = null;
    } else if (this.isEditing) {
      this.isEditing = false;
    }
  }
}
