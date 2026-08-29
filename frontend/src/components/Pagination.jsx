import React from "react";

const Pagination = ({
    currentPage,
    totalPages,
    setCurrentPage,
}) => {

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination">

            <button
                disabled={currentPage === 1}
                onClick={() =>
                    setCurrentPage(
                        (prev) => prev - 1
                    )
                }
            >
                Previous
            </button>

            {Array.from(
                { length: totalPages },
                (_, index) => index + 1
            ).map((page) => (

                <button
                    key={page}
                    className={
                        currentPage === page
                            ? "active-page"
                            : ""
                    }
                    onClick={() =>
                        setCurrentPage(page)
                    }
                >
                    {page}
                </button>

            ))}

            <button
                disabled={
                    currentPage === totalPages
                }
                onClick={() =>
                    setCurrentPage(
                        (prev) => prev + 1
                    )
                }
            >
                Next
            </button>

        </div>
    );
};

export default Pagination;