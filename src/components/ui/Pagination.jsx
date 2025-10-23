import PropTypes from 'prop-types';
import { Button } from './index';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate range of pages to show (always show 5 pages if possible)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    // Adjust if endPage exceeds totalPages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <nav className={`flex items-center justify-center my-8 ${className}`} aria-label="Pagination">
      {/* Previous page button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="mr-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </Button>
      
      {/* First page button (if not in view) */}
      {getPageNumbers()[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(1)}
            aria-label="Page 1"
            aria-current={currentPage === 1 ? 'page' : undefined}
            className="mx-1"
          >
            1
          </Button>
          {getPageNumbers()[0] > 2 && (
            <span className="mx-2 text-accent">...</span>
          )}
        </>
      )}
      
      {/* Page number buttons */}
      {getPageNumbers().map(number => (
        <Button
          key={number}
          variant={currentPage === number ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(number)}
          aria-label={`Page ${number}`}
          aria-current={currentPage === number ? 'page' : undefined}
          className="mx-1"
        >
          {number}
        </Button>
      ))}
      
      {/* Last page button (if not in view) */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="mx-2 text-accent">...</span>
          )}
          <Button
            variant={currentPage === totalPages ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Page ${totalPages}`}
            aria-current={currentPage === totalPages ? 'page' : undefined}
            className="mx-1"
          >
            {totalPages}
          </Button>
        </>
      )}
      
      {/* Next page button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="ml-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </Button>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;