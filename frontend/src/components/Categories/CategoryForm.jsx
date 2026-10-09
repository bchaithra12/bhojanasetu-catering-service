import { useState } from 'react';
import './CategoryForm.css';

function CategoryForm({ category, error, onClearError, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => category || {
    name: '',
    description: '',
    image: '',
    isActive: true,
    displayOrder: 0
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onClearError();
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="category-form-overlay">
      <div className="category-form-container">
        <h2>{category ? 'Edit Category' : 'Add New Category'}</h2>
        
        <form onSubmit={handleSubmit} className={error ? 'form-has-error' : ''}>
          {error && <p className="form-error-message" role="alert">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="displayOrder">Display Order</label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox">
              <label htmlFor="isActive">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {category ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;
