import React, { useEffect, useRef } from 'react';
import { useCategories } from '../../context/categoryContext';

// Ancho fijo por categoría (círculo + texto), igual que DualCarousel fija sus cards en 300px.
// Esto elimina cualquier variación de ancho por contenido, que era la causa probable del temblor.
const ITEM_WIDTH = 120; // px

const SCROLL_SPEED = 1;
const SCROLL_INTERVAL = 20;
const RESTART_DELAY = 800;

const CategoryCarousel = ({ selectedSlug, onSelectCategory, onShowAll }) => {
  const { categories, loading, fetchCategories } = useCategories();

  // Estructura en dos capas, igual que DualCarousel: el wrapper hace scroll,
  // el track (adentro) es el flex que contiene los items.
  const wrapperRef = useRef(null);
  const interactionTimerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const duplicatedCategories = [...categories, ...categories, ...categories];

  // === LÓGICA DE SCROLL AUTOMÁTICO (idéntica a DualCarousel) ===
  const startScroll = (speed) => {
    const el = wrapperRef.current;
    if (!el || el.intervalId) return;

    const scrollFunc = () => {
      const container = wrapperRef.current;
      if (!container || container.children.length === 0) return;

      const totalWidthOfOneCopy = container.scrollWidth / 3;
      container.scrollLeft += speed;

      if (speed > 0 && container.scrollLeft >= totalWidthOfOneCopy) {
        container.scrollLeft -= totalWidthOfOneCopy;
      } else if (speed < 0 && container.scrollLeft <= 0) {
        container.scrollLeft = totalWidthOfOneCopy;
      }
    };

    el.intervalId = setInterval(scrollFunc, SCROLL_INTERVAL);
  };

  const stopScroll = () => {
    const el = wrapperRef.current;
    if (el && el.intervalId) {
      clearInterval(el.intervalId);
      el.intervalId = null;
    }
  };

  const scheduleScrollRestart = (speed) => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => startScroll(speed), RESTART_DELAY);
  };

  useEffect(() => {
    const initScrollPosition = () => {
      if (categories.length > 0 && wrapperRef.current) {
        wrapperRef.current.scrollLeft = wrapperRef.current.scrollWidth / 3;
        startScroll(SCROLL_SPEED);
      }
    };

    const timeoutId = setTimeout(initScrollPosition, 50);

    return () => {
      clearTimeout(timeoutId);
      stopScroll();
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    };
  }, [categories]);

  // === ARRASTRE CON MOUSE ===
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const handleMouseDown = (e) => {
    const el = wrapperRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    stopScroll();
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const el = wrapperRef.current;
    if (!el) return;
    e.preventDefault();
    const delta = e.pageX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollRef.current - delta;
  };

  const endDrag = () => {
    const el = wrapperRef.current;
    if (isDraggingRef.current && el) el.style.cursor = 'grab';
    isDraggingRef.current = false;
    scheduleScrollRestart(SCROLL_SPEED);
  };

  const CATEGORIAS_LETTERS = 'CATEGORÍAS'.split('');

  if (loading && categories.length === 0) {
    return (
      <div className="mb-6 flex gap-4 overflow-hidden px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-shrink-0 flex-col items-center gap-2">
            <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200 sm:h-28 sm:w-28" />
            <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {/* Tarjeta fija "CATEGORÍAS" */}
        <div
          className="inline-flex flex-shrink-0 flex-col items-center justify-center gap-[3px]
                     rounded-lg border-[3px] border-[#C8860D] bg-white px-2.5 py-4 sm:px-3 sm:py-5"
        >
          {CATEGORIAS_LETTERS.map((letter, i) => (
            <span
              key={i}
              className="text-[0.8rem] font-medium leading-none text-[#C8860D] sm:text-[0.85rem]
                         md:text-[0.95rem]"
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Wrapper con scroll (no es flex) */}
        <div
          ref={wrapperRef}
          onMouseEnter={stopScroll}
          onMouseLeave={endDrag}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onTouchStart={stopScroll}
          onTouchEnd={() => scheduleScrollRestart(SCROLL_SPEED)}
          className="scrollbar-none flex-1 overflow-x-scroll"
          style={{ scrollbarWidth: 'none', cursor: 'grab', userSelect: 'none', position: 'relative' }}
        >
          {/* Track: el flex real vive aquí adentro, separado del elemento con scroll */}
          <div className="flex gap-4 py-1">
            {duplicatedCategories.map((category, index) => {
              const isActive = selectedSlug === category.slug;
              return (
                <button
                  key={`${category.id}-${index}`}
                  type="button"
                  onClick={() => onSelectCategory(category.slug)}
                  style={{ width: ITEM_WIDTH }}
                  className="flex flex-shrink-0 appearance-none flex-col items-center gap-2
                             border-none bg-transparent p-0 outline-none"
                >
                  <div
                    className={`h-24 w-24 overflow-hidden rounded-full border-2 bg-[#f8f9fa]
                               transition-colors duration-200 sm:h-28 sm:w-28
                               ${isActive
                                 ? 'border-[#C8860D] shadow-[0_0_0_3px_rgba(200,134,13,0.2)]'
                                 : 'border-[#dee2e6] hover:border-[#C8860D]/50'}`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                  <span
                    className={`line-clamp-2 w-full break-words text-center text-[0.8rem]
                               font-medium leading-tight sm:text-[0.85rem]
                               ${isActive ? 'text-[#C8860D]' : 'text-[#495057]'}`}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSlug && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onShowAll}
            className="flex min-h-[38px] appearance-none items-center justify-center gap-1.5
                       rounded-md border-2 !border-[#C8860D] !bg-white px-4 py-2 text-[0.8rem]
                       font-medium !text-[#C8860D] outline-none transition-all duration-300
                       hover:-translate-y-0.5 hover:!bg-[#C8860D] hover:!text-white
                       sm:px-5 sm:py-2.5 sm:text-[0.85rem] sm:normal-case md:rounded-lg
                       md:text-[0.95rem] md:uppercase md:tracking-wide"
          >
            Mostrar todos los productos
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;