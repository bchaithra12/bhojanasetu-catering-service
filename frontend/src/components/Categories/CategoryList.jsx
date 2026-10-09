import './CategoryList.css';

function CategoryList({ categories, onEdit, onDelete }) {
  if (categories.length === 0) {
    return <div className="empty-state">No categories found. Create one to get started!</div>;
  }

  return (
    <div className="category-list">
      <table className="categories-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="category-name">
                {category.image && (
                  <img src={category.image} alt={category.name} className="category-thumb" />
                )}
                {category.name}
              </td>
              <td className="category-description">
                {category.description || '-'}
              </td>
              <td className="category-order">{category.displayOrder}</td>
              <td className="category-status">
                <span className={`badge badge-${category.isActive ? 'active' : 'inactive'}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="category-actions">
                <button
                  className="btn btn-sm btn-edit"
                  onClick={() => onEdit(category)}
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => onDelete(category._id)}
                  title="Delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryList;
