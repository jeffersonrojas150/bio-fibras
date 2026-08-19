import React from 'react';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/favoritesContext';

const ProductCard = ({ product }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleProductClick = (slug) => navigate(`/producto/${slug}`);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    isFavorite(product.id) ? removeFavorite(product.id) : addFavorite(product);
  };

  const precioMostrado = product.precio_oferta
    ? parseFloat(product.precio_oferta)
    : parseFloat(product.precio_unitario);
  const precioOriginal = product.precio_oferta
    ? parseFloat(product.precio_unitario)
    : null;

  const discountPercent = product.precio_oferta
    ? Math.round((1 - parseFloat(product.precio_oferta) / parseFloat(product.precio_unitario)) * 100)
    : 0;

  const tieneMayoreo = product.precio_mayor && product.cantidad_minima_mayor;

  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dee2e6] bg-white
                 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300
                 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
    >
      {/* === IMAGEN === */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => handleProductClick(product.slug)}
      >
        <img
          src={product.imagen_principal}
          alt={product.nombre}
          className="block h-[180px] w-full object-cover transition-transform duration-400
                     ease-in-out group-hover:scale-105 sm:h-[200px] md:h-[250px]"
        />

        {/* Badge de descuento */}
        {product.precio_oferta && (
          <div className="absolute left-2 top-2 z-[2] flex flex-col gap-2 sm:left-4 sm:top-4">
            <span className="rounded-md bg-amber-400 px-2.5 py-1 text-[0.7rem] font-bold text-gray-900 sm:text-xs">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Botón favorito */}
        <button
          type="button"
          className="absolute right-1 top-1 z-[2] appearance-none border-none bg-transparent p-1.5
                     leading-none shadow-none outline-none transition-transform duration-200
                     hover:scale-115 sm:right-2 sm:top-2 sm:p-2"
          onClick={handleToggleFavorite}
          aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          {isFavorite(product.id) ? (
            <FaHeart className="text-[1.3rem] text-[#C8860D] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-[1.6rem]" />
          ) : (
            <FaRegHeart className="text-[1.3rem] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-[1.6rem]" />
          )}
        </button>

        {/* Precio por mayor: overlay mostaza semitransparente sobre la imagen */}
        {tieneMayoreo && (
          <div
            className="absolute inset-x-0 bottom-0 z-[2] bg-[#C8860D]/70 px-2 py-1.5
                       text-center text-[0.68rem] leading-tight text-white sm:text-[0.78rem]"
          >
            <span className="block sm:inline">
              A partir de {product.cantidad_minima_mayor} unid. a:
            </span>{' '}
            <strong className="block font-bold sm:inline">
              S/ {parseFloat(product.precio_mayor).toFixed(2)} c/u
            </strong>
          </div>
        )}
      </div>

      {/* === CUERPO === */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3 md:p-4">
        <h3
          className="mb-1.5 line-clamp-3 flex-grow text-[0.9rem] font-semibold leading-snug
                     text-[#495057] sm:mb-2 sm:line-clamp-none sm:text-[0.95rem] md:text-base"
        >
          {product.nombre}
        </h3>

        <div className="mb-2.5 flex flex-wrap items-baseline gap-[5px] sm:mb-4 sm:block sm:gap-0">
          {precioOriginal && (
            <span className="mr-0 whitespace-nowrap text-[0.75rem] text-gray-500 line-through sm:mr-2 sm:text-[0.9rem]">
              S/{precioOriginal.toFixed(2)}
            </span>
          )}
          <span className="whitespace-nowrap text-[1rem] font-bold text-[#C8860D] sm:text-[1.1rem] md:text-[1.25rem]">
            S/{precioMostrado.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          className="mt-auto flex min-h-[38px] w-full appearance-none items-center justify-center
                     gap-1.5 rounded-md border-2 !border-[#C8860D] !bg-white px-3 py-2
                     text-[0.8rem] font-medium !text-[#C8860D] outline-none transition-all duration-300
                     hover:-translate-y-0.5 hover:!bg-[#C8860D] hover:!text-white
                     sm:px-4 sm:py-2.5 sm:text-[0.85rem] sm:normal-case md:rounded-lg md:text-[0.95rem]
                     md:uppercase md:tracking-wide"
          onClick={() => handleProductClick(product.slug)}
        >
          <FaShoppingCart />
          Ver Producto
        </button>
      </div>
    </div>
  );
};

export default ProductCard;