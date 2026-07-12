import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">

      <img
        src={
          product.image ||
          "https://via.placeholder.com/300x200"
        }
        alt={product.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">

        <h2 className="text-xl font-bold">
          {product.name}
        </h2>

        <p className="text-gray-600 mt-2">
          {product.description}
        </p>

        <p className="text-2xl font-bold text-blue-600 mt-3">
          ${product.price}
        </p>

        <p className="mt-2">
          Stock: {product.stock}
        </p>

        <Link
          to={`/product/${product._id}`}
          className="block mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}

export default ProductCard;