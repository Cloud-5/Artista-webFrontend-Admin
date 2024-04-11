import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { ArtCategoriesService } from './art-categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { uploadFileToS3 } from '../../../../handlers/s3handler';


import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-art-categories',
  templateUrl: './art-categories.component.html',
  styleUrl: './art-categories.component.css'
})
export class ArtCategoriesComponent implements OnInit {

  categoryData: any[] = [];

  imageUrl: string = '';

  newCategory: any = {
    name: '',
    description: '',
    margin: '',
    formats: [],
    image: File
  };

  selectedCategory: any = {};

  newFormat: string = '';

  editingCategoryIndex: number | null = null;

  constructor(
    public modalService: ModalService,
    private artCategoriesService: ArtCategoriesService
  ) { }

  ngOnInit() {
    this.loadCategories();
  }


  addNewFormat() {
    if (this.newFormat.trim() !== '') {
      this.newCategory.formats.push({ format_name: this.newFormat });
      this.newFormat = '';
    }
  }

  addFormat() {
    this.newCategory.formats.push({ format_name: '' });
  }

  removeFormat(index: number) {
    this.newCategory.formats.splice(index, 1);
  }


  loadCategories(): void {
    this.artCategoriesService.getAllCategories().subscribe(
      (data: any) => {
        this.categoryData = data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  handleImageUpload(event: any) {
    console.log("ok")
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      console.log(img);
      this.newCategory.image = img;
    }
    console.log(this.newCategory.image);

  }

  // async handleImageUpload(event: any) {
  //   const file = event.target.files[0];

  //   // Generate a unique key for the image file
  //   const key = `images/${Date.now()}_${file.name}`;

  //   try {
  //     // Upload the image file to S3
  //     await Storage.put(key, file);

  //     // Get the URL of the uploaded image
  //     const url = await Storage.get(key);
  //     this.imageUrl = url;

  //     console.log('Image uploaded successfully:', this.imageUrl);
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // }
  
  async addCategory(categoryForm: any): Promise<void> {
    if (categoryForm.valid) {
      try {

        //const imageUrl = uploadFileToS3(this.newCategory.image); // Get the URL of the uploaded file
        //Set the URL to the newCategory object
        //this.newCategory.image = imageUrl;  

        const response = await this.artCategoriesService.createCategory(this.newCategory).toPromise();

        console.log('Category Added successfully', response);
        this.categoryData.push(response);
        this.loadCategories();
        categoryForm.reset();
        this.newCategory = {};
        this.modalService.close();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  }

  deleteCategory(categoryId: string): void {
    this.artCategoriesService.deleteCategory(categoryId).subscribe(
      () => {
        this.categoryData = this.categoryData.filter(category => category.category_id !== categoryId);
        console.log('Category deleted successfully');
      },
      (error) => {
        console.error('Error deleting category:', error);
      }
    );
  }


  //updating existing category

  openEditModal(category: any): void {
    //copying category data to selected category
    this.selectedCategory = { ...category };
    console.log('Selected category: ', category)
    this.modalService.open('modal-editCategory');
  }

  updateCategory(editCategoryForm: any): void {
    if (editCategoryForm.valid) {

      this.artCategoriesService.updateCategory(this.selectedCategory.category_id, this.selectedCategory).subscribe(
        (response: any) => {
          console.log('Category updated successfully', response);

          const index = this.categoryData.findIndex(cat => cat.category_id === response.category_id);
          if (index != -1) {
            this.categoryData[index] = response;
          }

          this.modalService.close();
        },
        (error) => {
          console.error('Error updating...', error);
        }
      );
    }
  }
  removeOldFormat(index: number): void {
    this.selectedCategory.formats.splice(index, 1);
  }

  updateNewFormat(): void {
    if (this.newFormat.trim() !== '') {
      this.selectedCategory.formats.push({ format_name: this.newFormat });
      this.newFormat = '';
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.newCategory.image = file;
  }

  // async uploadFileToS3(): Promise<string> {
  //   const formData = new FormData();
  //   formData.append('file', this.newCategory.image);

  //   try {
  //     const response = await fetch('/api/uploadToS3', {
  //       method: 'POST',
  //       body: formData
  //     });

  //     const data = await response.json();
  //     return data.Location; // Return the URL of the uploaded file
  //   } catch (error) {
  //     console.error('Error uploading file to S3:', error);
  //     throw error;
  //   }
  // }

}
