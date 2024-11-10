import React, { useState, useEffect } from 'react';
import category from '../services/category-service';
import './Categories.css';

interface Category {
  id: number;
  category_name: string;
  average_monthly_expense: number;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await category.getAll();
      setCategories(response.category || []);
    } catch (exception) {
      console.log(exception);
    }
  }

  async function createCategory() {
    if (newCategory) {
      const body = {
        category_name: newCategory,
      };
      try {
        const response = await category.create(body);
        if (response.success) {
          setCategories([
            ...categories,
            {
              id: response.category.id,
              category_name: newCategory,
              average_monthly_expense: 0,
            },
          ]);
          setNewCategory('');
        } else {
          console.error(response.message);
        }
      } catch (exception) {
        console.error(exception);
      }
    } else {
      console.warn('Please enter a category name');
    }
  }

  async function updateCategory(index: number) {
    await category.update(categories[index].id, {
      category_name: categories[index].category_name,
    });
  }

  async function deleteCategory(index: number) {
    const response = await category.delete(categories[index].id);
    if (response.success) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  }

  return (
    <div className="uui-page-padding">
      <div className="uui-container-large">
        <div className="uui-padding-vertical-xhuge">
          <div className="uui-text-align-center">
            <div className="uui-max-width-large align-center">
              <h2 className="uui-heading-medium">Categories</h2>
              <div className="uui-space-xsmall"></div>
              <div className="uui-text-size-large">
                Add and manage your expense <strong>categories</strong>
              </div>
              <button className="button w-button" onClick={() => setShowInput(!showInput)}>
                +
              </button>
            </div>
          </div>
          <div className="uui-table">
            <div className="uui-table_heading-row">
              <div className="uui-table_heading-row-text">Category Name</div>
              <div className="uui-table_heading-row-text">Monthly Average</div>
              <div className="uui-table_heading-row-text">Action</div>
            </div>
            {showInput && (
              <input
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                type="text"
                className="w-layout-grid uui-table_row new-row uui-table_feature uui-pricing07_row-lead-text w-100"
                onKeyPress={(e) => e.key === 'Enter' && createCategory()}
              />
            )}
            {categories.map((category, index) => (
              <div key={category.id} className={`w-layout-grid uui-table_row ${index % 2 === 1 ? 'background-color-gray50' : ''}`}>
                <div className="uui-table_feature">
                  <div className="uui-pricing07_row-lead-text">
                    <input
                      type="text"
                      className="expense-input"
                      value={category.category_name}
                      onChange={(e) => {
                        const newCategories = [...categories];
                        newCategories[index].category_name = e.target.value;
                        setCategories(newCategories);
                      }}
                    />
                  </div>
                </div>
                <div className="uui-table_row">
                  <div className="uui-pricing07_row-lead-text">
                    ${category.average_monthly_expense.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="uui-table_row">
                  <div className="action">
                    <button type="button" className="btn btn-warning" onClick={() => updateCategory(index)}>
                      Save
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => deleteCategory(index)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
