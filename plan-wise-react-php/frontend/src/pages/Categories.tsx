import React, { useState, useEffect } from 'react';
import category from '../services/category-service';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      let response = await category.getAll();
      setCategories(response.category || []);
    } catch(exception){
      console.log(exception);
    }
  }

  async function createCategory() {
    if (newCategory) {
      let body = {
        category_name: newCategory
      };
      try {
        let response = await category.create(body);
        if (response.success) {
          // @ts-expect-error TS(2322): Type '{ id: any; category_name: string; average_mo... Remove this comment to see the full error message
          setCategories([...categories, {
            // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
            id: response.category.id,
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
            category_name: newCategory,
            // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'never'.
            average_monthly_expense: 0
          }]);
          setNewCategory("");
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

  async function updateCategory(index: any){
    // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
    await category.update(categories[index].id, {
      // @ts-expect-error TS(2339): Property 'category_name' does not exist on type 'n... Remove this comment to see the full error message
      category_name: categories[index].category_name
    });
  }

  async function deleteCategory(index: any){
    // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
    let response = await category.delete(categories[index].id);
    if(response.success){
      setCategories(categories.filter((_, i) => i !== index));
    }
  }

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div className="uui-page-padding">
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className="uui-container-large">
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="uui-padding-vertical-xhuge">
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className="uui-text-align-center">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="uui-max-width-large align-center">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <h2 className="uui-heading-medium">Categories</h2>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="uui-space-xsmall"></div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="uui-text-size-large">Add and manage your expense <strong>categories</strong></div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <button className="button w-button" onClick={() => setShowInput(!showInput)}>+</button>
            </div>
          </div>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className="uui-table">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="uui-table_heading-row">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="uui-table_heading-row-text">Category Name</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="uui-table_heading-row-text">Monthly Average</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="uui-table_heading-row-text">Action</div>
            </div>
            {showInput && 
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <input 
                id="new-category" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                type="text" 
                className="w-layout-grid uui-table_row new-row uui-table_feature uui-pricing07_row-lead-text w-100"
                onKeyPress={(e) => e.key === 'Enter' && createCategory()}
              />
            }
            {categories.map((category, index) => (
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div key={category.id} className={`w-layout-grid uui-table_row ${index % 2 === 1 ? "background-color-gray50" : ""}`}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_feature">
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div className="uui-pricing07_row-lead-text">                                
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="text" className="expense-input" value={category.category_name} onChange={(e) => {
                      const newCategories = [...categories];
                      // @ts-expect-error TS(2339): Property 'category_name' does not exist on type 'n... Remove this comment to see the full error message
                      newCategories[index].category_name = e.target.value;
                      setCategories(newCategories);
                    }}/>
                  </div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row">
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div className="uui-pricing07_row-lead-text">   
                    // @ts-expect-error TS(2339): Property 'average_monthly_expense' does not exist ... Remove this comment to see the full error message
                    ${category.average_monthly_expense.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row">
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div className="action">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button type="button" className="btn btn-warning" onClick={() => updateCategory(index)}>Save</button>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button type="button" className="btn btn-danger" onClick={() => deleteCategory(index)}>Delete</button>
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
