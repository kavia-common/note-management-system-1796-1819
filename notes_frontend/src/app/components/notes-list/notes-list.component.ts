import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

/**
 * PUBLIC_INTERFACE
 * NotesListComponent renders the list of notes, handles selection and delete.
 */
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: number | null = null;
  @Output() noteSelect = new EventEmitter<number>();
  @Output() noteDelete = new EventEmitter<number>();
  @Output() createNew = new EventEmitter<void>();

  onSelect(note: Note) {
    this.noteSelect.emit(note.id);
  }

  onDelete(note: Note, event: MouseEvent) {
    event.stopPropagation();
    this.noteDelete.emit(note.id);
  }

  onCreateNew() {
    this.createNew.emit();
  }
}
