'use client';

import { productImages, productImages2 } from './data';

export default function InfiniteScroll() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mb-5 sm:mb-8 lg:mb-10 text-center">
        <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Shop by Category</h3>
      </div>

      <div className="relative mb-3 sm:mb-4 lg:mb-6 overflow-hidden">
        <div className="flex gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 animate-scroll-right">
          {[...productImages, ...productImages].map((img, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100"
            >
              <img
                src={img}
                alt="Product"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 animate-scroll-left">
          {[...productImages2, ...productImages2].map((img, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100"
            >
              <img
                src={img}
                alt="Product"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-left {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right:hover,
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
