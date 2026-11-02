import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { Property } from '../../core/models/models';

@Component({
  selector: 'app-property-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
})
export class PropertyForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  // Form state
  isEditMode = false;
  propertyId: string | null = null;
  isSubmitting = false;

  // Master lists for selections
  readonly propertyTypes: Property['type'][] = ['Apartment', 'Villa', 'Commercial', 'Plot', 'Penthouse'];
  readonly cities = ['Mumbai', 'Bengaluru', 'Gurugram', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'];
  readonly allAmenities = [
    'Swimming Pool',
    'Gymnasium',
    'Clubhouse',
    '24/7 Security',
    'Covered Parking',
    'Power Backup',
    'Private Garden',
    'Home Automation',
    'EV Charging',
    'Sea View',
    'Terrace Jacuzzi',
    'Concierge Desk',
  ];

  selectedAmenities: string[] = [];

  // Reactive Form definition with strict validations
  propertyForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    price: [null as number | null, [Validators.required, Validators.min(100000)]],
    type: ['Apartment', [Validators.required]],
    city: ['Mumbai', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(8)]],
    bedrooms: [2, [Validators.required, Validators.min(0), Validators.max(25)]],
    bathrooms: [2, [Validators.required, Validators.min(0), Validators.max(25)]],
    area: [1200, [Validators.required, Validators.min(50)]],
    imagesText: ['', [Validators.required]],
    featured: [false],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.propertyId = id;
        this.loadPropertyForEdit(id);
      }
    });
  }

  /**
   * Loads existing property data into the reactive form when editing
   */
  private loadPropertyForEdit(id: string): void {
    this.propertyService.getById(id).subscribe((property) => {
      if (property) {
        this.propertyForm.patchValue({
          title: property.title,
          description: property.description,
          price: property.price,
          type: property.type,
          city: property.city,
          address: property.address,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          imagesText: property.images.join('\n'),
          featured: property.featured || false,
        });
        this.selectedAmenities = [...(property.amenities || [])];
      } else {
        // If property ID was not found, redirect to directory
        this.router.navigate(['/properties']);
      }
    });
  }

  /**
   * Toggles amenity inclusion in selected list
   */
  toggleAmenity(amenity: string): void {
    if (this.selectedAmenities.includes(amenity)) {
      this.selectedAmenities = this.selectedAmenities.filter((a) => a !== amenity);
    } else {
      this.selectedAmenities.push(amenity);
    }
  }

  /**
   * Helper to check field validity for error indicators
   */
  isInvalid(controlName: string): boolean {
    const control = this.propertyForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Form submission handler for both Add and Edit modes
   */
  onSubmit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.propertyForm.getRawValue();

    // Parse image URLs from line breaks or commas
    const parsedImages = formVal.imagesText
      .split(/[\n,]+/)
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    const images = parsedImages.length > 0
      ? parsedImages
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

    const area = Number(formVal.area) || 1;
    const price = Number(formVal.price) || 0;
    const pricePerSqFt = Math.round(price / area);

    if (this.isEditMode && this.propertyId) {
      const updatedProperty: Property = {
        id: this.propertyId,
        title: formVal.title,
        description: formVal.description,
        price,
        type: formVal.type,
        city: formVal.city,
        address: formVal.address,
        bedrooms: Number(formVal.bedrooms),
        bathrooms: Number(formVal.bathrooms),
        area,
        pricePerSqFt,
        amenities: this.selectedAmenities,
        images,
        featured: formVal.featured,
        createdAt: new Date().toISOString(),
      };

      this.propertyService.update(updatedProperty).subscribe({
        next: () => {
          this.router.navigate(['/properties', this.propertyId]);
        },
        error: (err) => {
          console.error('Update error:', err);
          this.isSubmitting = false;
        },
      });
    } else {
      const newProperty: Omit<Property, 'id'> = {
        title: formVal.title,
        description: formVal.description,
        price,
        type: formVal.type,
        city: formVal.city,
        address: formVal.address,
        bedrooms: Number(formVal.bedrooms),
        bathrooms: Number(formVal.bathrooms),
        area,
        pricePerSqFt,
        amenities: this.selectedAmenities,
        images,
        featured: formVal.featured,
        createdAt: new Date().toISOString(),
      };

      this.propertyService.add(newProperty).subscribe({
        next: (created) => {
          this.router.navigate(['/properties', created.id]);
        },
        error: (err) => {
          console.error('Create error:', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  /**
   * Cancel and return to listing view
   */
  cancel(): void {
    if (this.isEditMode && this.propertyId) {
      this.router.navigate(['/properties', this.propertyId]);
    } else {
      this.router.navigate(['/properties']);
    }
  }
}
