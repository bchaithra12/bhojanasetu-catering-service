import { useEffect, useState } from 'react';
import { categoryAPI, getApiErrorMessage } from '../../services/api';
import MenuBrowser from './MenuBrowser';
import './CateringService.css';

function CateringService({ cartState, setCartState }) {
  const cart = cartState?.items || [];
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Appetizers');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  useEffect(() => {
    let active = true;
    categoryAPI.getDishesByCategory(selectedCategory)
      .then((response) => {
        if (active) {
          setDishes(response.data.data);
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) {
          console.error('Error fetching dishes:', requestError);
          setError(getApiErrorMessage(requestError, 'Unable to load dishes. Please try again.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCategory]);

  const addToCart = (dish) => {
    setCartState?.((currentState) => {
      const currentItems = currentState.items || [];
      const existingItem = currentItems.find((item) => item._id === dish._id);
      const items = existingItem
        ? currentItems.map((item) =>
          item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item
        )
        : [...currentItems, { ...dish, quantity: 1 }];

      return { ...currentState, items, showCart: false };
    });
  };

  return (
    <div className="catering-service">
      <div className="catering-container">
        <div className="menu-section">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  if (category !== selectedCategory) setLoading(true);
                  setSelectedCategory(category);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading dishes...</div>
          ) : (
            <>
              {error && <p role="alert" className="error-message">{error}</p>}
            <MenuBrowser 
              dishes={dishes}
              category={selectedCategory}
              onAddToCart={addToCart}
              cartItems={cart}
            />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CateringService;
