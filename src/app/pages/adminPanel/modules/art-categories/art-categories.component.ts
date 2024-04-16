import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { ArtCategoriesService } from './art-categories.service';
import { ImageUploadService } from '../../../../shared/services/image-upload.service';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-art-categories',
  templateUrl: './art-categories.component.html',
  styleUrl: './art-categories.component.css'
})
export class ArtCategoriesComponent implements OnInit {

  categoryData: any[] = [];

  imageObj: File | undefined;
  imageUrl: string = '';
  uploadProgress: number | undefined;

  newCategory: any = {
    name: '',
    description: '',
    margin: '',
    formats: [],
    banner: ''
  };

  selectedCategory: any = {
    category_id: '',
    name: '',
    description: '',
    margin: '',
    formats: [],
    banner: ''
  };

  newFormat: string = '';

  editingCategoryIndex: number | null = null;

  searchedCategory: any[] = this.categoryData;

  constructor(
    public modalService: ModalService,
    private artCategoriesService: ArtCategoriesService,
    private imageUploadService: ImageUploadService,
    private alertService: AlertService
  ) { }

  

  ngOnInit() {
    this.loadCategories();
  }

  //adding new category

  addNewFormat() {
    if (this.newFormat.trim() !== '') {
      this.newCategory.formats.push({ format_name: this.newFormat });
      this.newFormat = '';
    }
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
        this.alertService.showMessage('Error loading categories', false, error.message);
      }
    );
  }

  onFileSelected(event: any) {
    const FILE = (event.target as HTMLInputElement).files?.[0];
    this.imageObj = FILE;
  }

  onImageUpload() {
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj as Blob);
    this.imageUploadService.imageUpload(imageForm).subscribe(
      (res: any) => {
        this.imageUrl = res.image.location;
        this.newCategory.banner = this.imageUrl;
        console.log('Image uploaded successfully:', this.imageUrl);

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

  async addCategory(): Promise<void> {
    try {
      const response = await this.artCategoriesService.createCategory(this.newCategory).toPromise();
      this.categoryData.push(response);
      this.loadCategories();
      this.newCategory = {
        name: '',
        description: '',
        margin: '',
        formats: [],
        banner: ''
      };
      this.modalService.close('modal-addCategory');
      this.alertService.showMessage('Category created successfully', true);
    } catch (error: any) {
      this.modalService.close('modal-addCategory');
      this.alertService.showMessage('Error adding category', false, error.message);
    }
  }


  //deleting a category

  openDeleteConfirm(category: any){
    this.selectedCategory = { ...category };
    this.modalService.open('modal-deleteConfirm');
  }



  deleteCategory(categoryId: string): void {
    // Find the category with the given ID
    const categoryToDelete = this.categoryData.find(category => category.category_id === categoryId);

    if (!categoryToDelete) {
      console.error('Category not found');
      return;
    }

    if (categoryToDelete.banner) {
      const key = categoryToDelete.banner.split('/').pop();

      //deleting image
      this.imageUploadService.removeImage(key).subscribe(
        () => {
          console.log('Banner image deleted successfully');

          //deleting record of the sql table
          this.artCategoriesService.deleteCategory(categoryId).subscribe(
            () => {
              this.categoryData = this.categoryData.filter(category => category.category_id !== categoryId);   
              this.loadCategories();
              this.alertService.showMessage('Category deleted successfully', true);
            },
            (error) => {
              this.alertService.showMessage('Error deleting category', false, error.message);
            }
          );
          this.modalService.close('modal-deleteConfirm');
        },
        (error) => {
          this.alertService.showMessage('Error deleting banner image', false, error.message);
        }
      );
    } else {
      //deleting record of the sql table
      this.artCategoriesService.deleteCategory(categoryId).subscribe(
        () => {
          this.categoryData = this.categoryData.filter(category => category.category_id !== categoryId);
          this.modalService.close('modal-deleteConfirm');
          this.loadCategories();
          this.alertService.showMessage('Category deleted successfully', true);
        },
        (error) => {
          this.alertService.showMessage('Error deleting category', false, error.message);
        }
      );
    }

  }



  //updating existing category

  openEditModal(category: any): void {
    //copying category data to selected category
    this.selectedCategory = { ...category };
    this.modalService.open('modal-editCategory');
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

  updateCategory(): void {

    // Remove formats first
    this.artCategoriesService.deleteFormats(this.selectedCategory.category_id).subscribe(
      () => {
        console.log('Formats deleted successfully');
      },
      (error) => {
        this.alertService.showMessage('Error deleting formats', false, error.message);
      }
    );

    this.artCategoriesService.updateCategory(this.selectedCategory.category_id, this.selectedCategory).subscribe(
      (response: any) => {
        const index = this.categoryData.findIndex(cat => cat.category_id === response.category_id);
        if (index != -1) {
          this.categoryData[index] = response;
        }
        this.modalService.close('modal-editCategory');
        this.loadCategories();
        this.alertService.showMessage('Category updated successfully', true);
      },
      (error) => {
        this.modalService.close('modal-editCategory');
        this.alertService.showMessage('Error updating category', false, error.message);
      }
    );
  }



  removeExistingImage() {
    if (this.selectedCategory.banner) {
      const key = this.selectedCategory.banner.split('/').pop();
      this.imageUploadService.removeImage(key as any).subscribe(
        () => {
          this.selectedCategory.banner = '';
        },
        (error) => {
          this.alertService.showMessage('Error removing image', false, error.message);
        }
      );
    }
  }

  newImageUpload() {
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj as Blob);
    this.imageUploadService.imageUpload(imageForm).subscribe((res: any) => {
      this.imageUrl = res.image.location;
      this.selectedCategory.banner = this.imageUrl;
      this.alertService.showMessage('Image uploaded successfully', true);
    });
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
  }
}
