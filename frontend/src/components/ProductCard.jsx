import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
      <Link to={`/product/${product._id}`}>
        <img
          src={
            product.image ||
            product.images?.[0] ||
            "https://placehold.co/600x400?text=No+Image"
          }
          alt={product.name}
          className="w-full h-52 object-cover rounded-lg"
        />

        <h3 className="text-lg font-semibold mt-4">
          {product.name}
        </h3>
      </Link>

      <p className="text-gray-500 mt-2">
        LKR {Number(product.price).toLocaleString()}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Stock: {product.stock ?? 0}
      </p>

      <button
        type="button"
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;