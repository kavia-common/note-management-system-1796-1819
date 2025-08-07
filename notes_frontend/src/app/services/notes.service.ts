import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { environment } from '../../environments/environment';

/**
 * PUBLIC_INTERFACE
 * NotesService provides CRUD operations for notes via backend REST API.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  private apiUrl: string = environment.apiUrl;

  constructor(public http: HttpClient) {
    // Explicit reference to avoid unused warning
    void http;
  }


  // PUBLIC_INTERFACE
  /** Get the list of all notes (summary only, ordered by updated) */
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  // PUBLIC_INTERFACE
  /** Get details of a single note by its ID. */
  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/notes/${id}`);
  }

  // PUBLIC_INTERFACE
  /** Create a new note */
  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/notes`, note);
  }

  // PUBLIC_INTERFACE
  /** Update a note by ID */
  updateNote(id: number, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/notes/${id}`, note);
  }

  // PUBLIC_INTERFACE
  /** Delete a note by ID */
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${id}`);
  }
}
