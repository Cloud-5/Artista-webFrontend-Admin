import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { ArtCategoriesService } from './art-categories.service';

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
    //image: File
    image: ''
  };

  selectedCategory: any = {};

  newFormat: string = '';

  editingCategoryIndex: number | null = null;

  searchedCategory: any[] = this.categoryData;

  constructor(
    public modalService: ModalService,
    private artCategoriesService: ArtCategoriesService,
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
        this.searchedCategory = this.categoryData;

      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }
  }
  
  async addCategory(categoryForm: any): Promise<void> {
    if (categoryForm.valid) {
      try {

        const response = await this.artCategoriesService.createCategory(this.newCategory).toPromise();
        console.log('newCategory = ', this.newCategory);

        console.log('Category Added successfully', response);
        this.categoryData.push(response);
        console.log('newCategory = ', response);
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

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   this.newCategory.image = file;
  // }

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

  searchCategoryByName(searchKeyword: string): void {
    searchKeyword = searchKeyword.toLowerCase().trim();

    if (searchKeyword === '') {
      this.searchedCategory = this.categoryData;
      //return;
    } else {
      this.searchedCategory = this.categoryData.filter(category =>
        category.name.toLowerCase().includes(searchKeyword)
      );
    }
    console.log('Searched category:', this.searchedCategory);
  }

}
