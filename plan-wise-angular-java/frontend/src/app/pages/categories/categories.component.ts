import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class CategoriesComponent implements OnInit {
  categories: any = [];
  newCategory = '';
  showInput = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  async fetchCategories() {
    try {
      let response: any = await this.categoryService.getAll();
      this.categories = response.categories || [];
    } catch(exception){
      console.log(exception);
    }
  }

  async createCategory() {
    if (this.newCategory) {
      let body = {
        categoryName: this.newCategory
      };
      try {
        let response: any = await this.categoryService.create(body);
        if (response.success) {
          this.categories.push({
            id: response.category.id,
            category_name: this.newCategory,
            average_monthly_expense: 0
          });
          this.newCategory = '';
        } else {
          console.error(response.message);
        }
      } catch (exception) {
        console.error(exception);
      }
    } else {
      console.warn("Please enter a category name");
    }
  }

  async updateCategory(index: number){
    await this.categoryService.update(this.categories[index].id, {
      categoryName: this.categories[index].category_name
    });
  }

  async deleteCategory(index: number){
    let response: any = await this.categoryService.delete(this.categories[index].id);
    if(response.success){
      this.categories = this.categories.filter((_: any, i: number) => i !== index);
    }
  }
}
