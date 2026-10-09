import './MenuBrowser.css';

function MenuBrowser({ dishes, category, onAddToCart, cartItems = [] }) {
  const isInCart = (dishId) => {
    return cartItems.some(item => item._id === dishId);
  };

  if (dishes.length === 0) {
    return (
      <div className="empty-menu">
        <p>No dishes available in {category}</p>
      </div>
    );
  }

  return (
    <div className="menu-browser">
      <h2>{category}</h2>
      <div className="dishes-grid">
        {dishes.map(dish => (
          <div key={dish._id} className={`dish-card ${isInCart(dish._id) ? 'in-cart' : ''}`}>
            {dish.image && (
              <img src={dish.image} alt={dish.name} className="dish-image" />
            )}
            
            {isInCart(dish._id) && (
              <div className="cart-badge">✓ In Cart</div>
            )}
            
            <div className="dish-info">
              <h3>{dish.name}</h3>
              <p className="dish-description">{dish.description}</p>
              
              <div className="dish-meta">
                {dish.isVegetarian && (
                  <span className="badge badge-veg">🌱 Veg</span>
                )}
                {dish.spicyLevel > 0 && (
                  <span className="badge badge-spicy">🌶️ {'x'.repeat(dish.spicyLevel)}</span>
                )}
              </div>
              
              <div className="dish-footer">
                <span className="price">₹{dish.price}</span>
                <button 
                  className={`btn-add ${isInCart(dish._id) ? 'in-cart-btn' : ''}`}
                  onClick={() => onAddToCart(dish)}
                >
                  {isInCart(dish._id) ? '✓ Add More' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuBrowser;
