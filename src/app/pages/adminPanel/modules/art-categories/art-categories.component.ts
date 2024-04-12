import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { ArtCategoriesService } from './art-categories.service';
import { ImageUploadService } from '../../../../shared/services/image-upload.service';

@Component({
  selector: 'app-art-categories',
  templateUrl: './art-categories.component.html',
  styleUrl: './art-categories.component.css'
})
export class ArtCategoriesComponent implements OnInit {

  categoryData: any[] = [];

  imageObj: File | undefined;
  imageUrl: string = '';

  newCategory: any = {
    name: '',
    description: '',
    margin: '',
    formats: [],
    banner: ''
  };

  selectedCategory: any = {};

  newFormat: string = '';

  editingCategoryIndex: number | null = null;

  searchedCategory: any[] = this.categoryData;

  constructor(
    public modalService: ModalService,
    private artCategoriesService: ArtCategoriesService,
    private imageUploadService: ImageUploadService
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  closeModalAndResetForm(){
    this.modalService.close();
    this.newCategory = {};
  }


  //adding new category

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

  onFileSelected(event: any) {
    const FILE = (event.target as HTMLInputElement).files?.[0];
    this.imageObj = FILE;
  }

  onImageUpload(){
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj as Blob);
    this.imageUploadService.imageUpload(imageForm).subscribe((res: any) => {
      this.imageUrl = res.image.location;
      this.newCategory.banner = this.imageUrl;
    });
  }

  removeImage() {
    if (this.imageUrl) {
      const key = this.imageUrl.split('/').pop();
      this.imageUploadService.removeImage(key as any).subscribe(
        () => {
          this.imageUrl = ''; 
          this.newCategory.banner = '';
        },
        (error) => {
          console.error('Error removing image:', error);
        }
      );
    }
  }

  async addCategory(categoryForm: any): Promise<void> {
    if (categoryForm.valid) {
      try {
        const response = await this.artCategoriesService.createCategory(this.newCategory).toPromise();
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

  //deleting a category
  deleteCategory(categoryId: string): void {
    // Find the category with the given ID
    const categoryToDelete = this.categoryData.find(category => category.category_id === categoryId);
    
    if (!categoryToDelete) {
      console.error('Category not found');
      return;
    }
    
    const key = categoryToDelete.banner.split('/').pop();

    //deleting image
    this.imageUploadService.removeImage(key).subscribe(
      () => {
        console.log('Banner image deleted successfully');
        
        //deleting record of the sql table
        this.artCategoriesService.deleteCategory(categoryId).subscribe(
          () => {
            
            this.categoryData = this.categoryData.filter(category => category.category_id !== categoryId);
            console.log('Category deleted successfully');
            this.loadCategories();
          },
          (error) => {
            console.error('Error deleting category:', error);
          }
        );
      },
      (error) => {
        console.error('Error deleting banner image:', error);
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


  //search function
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
