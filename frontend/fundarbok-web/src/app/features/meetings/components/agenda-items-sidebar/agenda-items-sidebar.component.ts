import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AgendaItemDetail } from '../../../../models/meeting.model';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-agenda-items-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    DragDropModule,
    HasRoleDirective,
    TranslatePipe
  ],
  templateUrl: './agenda-items-sidebar.component.html',
  styleUrl: './agenda-items-sidebar.component.scss'
})
export class AgendaItemsSidebarComponent {
  @Input() agendaItems: AgendaItemDetail[] = [];
  @Input() selectedItemId: string | null = null;
  @Input() currentItemId: string | null = null;
  @Input() meetingDescription: string = '';
  @Output() selectItem = new EventEmitter<AgendaItemDetail>();
  @Output() addItem = new EventEmitter<void>();
  @Output() reorderItems = new EventEmitter<string[]>();

  constructor(private authService: AuthService) {}

  onSelectItem(item: AgendaItemDetail): void {
    this.selectItem.emit(item);
  }

  onAddItem(): void {
    this.addItem.emit();
  }

  isSelected(item: AgendaItemDetail): boolean {
    return item.id === this.selectedItemId;
  }

  isCurrentItem(item: AgendaItemDetail): boolean {
    return item.id === this.currentItemId;
  }

  getDocumentCount(item: AgendaItemDetail): number {
    return item.documents?.length || 0;
  }

  canReorder(): boolean {
    return this.authService.hasRole('Secretary');
  }

  onDrop(event: CdkDragDrop<AgendaItemDetail[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const items = [...this.agendaItems];
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    // Emit the new order as an array of IDs
    const orderedIds = items.map(item => item.id);
    this.reorderItems.emit(orderedIds);
  }
}
