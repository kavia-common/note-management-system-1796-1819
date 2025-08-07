import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

/**
 * PUBLIC_INTERFACE
 * NoteEditorComponent provides the editor and viewer for a note.
 * Shows inputs if editable; otherwise, shows static text.
 */
@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent implements OnChanges {
  @Input() note: Note | null = null;
  @Input() editable: boolean = false;
  @Input() isCreating: boolean = false;
  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() cancel = new EventEmitter<void>();

  noteForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.noteForm = fb.group({
      title: [''],
      content: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note'] && this.note && !this.isCreating) {
      this.noteForm.patchValue({
        title: this.note.title,
        content: this.note.content
      });
    } else if (this.isCreating) {
      this.noteForm.reset();
    }
  }

  onSubmit() {
    if (this.noteForm.valid) {
      this.save.emit(this.noteForm.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
