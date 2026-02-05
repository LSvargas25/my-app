import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card-component.html',
  styleUrl: './profile-card-component.scss',
})
export class ProfileCardComponent {
  @Input() name!: string;
  @Input() description!: string;
  @Input() imageSrc!: string;
  @Input() languages!: string;

  @Input() email!: string;
  @Input() whatsapp!: string;
  @Input() github!: string;
  @Input() linkedin!: string;
}



