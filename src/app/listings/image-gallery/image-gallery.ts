import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css',
})
export class ImageGallery implements OnChanges {
  // Array of image URLs passed by parent component
  @Input() images: string[] = [];

  // Currently active image index in the gallery
  selectedIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.selectedIndex = 0;
    }
  }

  /**
   * Returns the currently active main image URL
   */
  get currentImage(): string {
    if (this.images && this.images.length > 0) {
      return this.images[this.selectedIndex] || this.images[0];
    }
    return '';
  }

  /**
   * Sets the active image index when a thumbnail is clicked
   */
  selectImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.selectedIndex = index;
    }
  }

  /**
   * Advances to previous image
   */
  previous(): void {
    if (this.images.length > 1) {
      this.selectedIndex = (this.selectedIndex - 1 + this.images.length) % this.images.length;
    }
  }

  /**
   * Advances to next image
   */
  next(): void {
    if (this.images.length > 1) {
      this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
    }
  }
}
