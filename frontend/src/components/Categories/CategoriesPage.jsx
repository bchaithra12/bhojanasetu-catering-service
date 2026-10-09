import { useCallback, useEffect, useState } from 'react';
import { categoryAPI, getApiErrorMessage } from '../../services/api';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import './Categories.css';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchCategories = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load categories. Please try again.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    categoryAPI.getAll()
      .then((response) => {
        if (active) {
          setCategories(response.data.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(getApiErrorMessage(err, 'Unable to load categories. Please try again.'));
          console.error(err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        fetchCategories();
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to delete this category. Please try again.'));
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormError('');
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to save this category. Please try again.'));
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Category Management</h1>
        <button className="btn btn-primary" onClick={handleAddCategory}>
          + Add Category
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <CategoryForm
            key={editingCategory?._id || 'new-category'}
          category={editingCategory}
          error={formError}
          onClearError={() => setFormError('')}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      )}
    </div>
  );
}

export default CategoriesPage;
