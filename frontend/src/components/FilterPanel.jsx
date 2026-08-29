import React from "react";

const FilterPanel = ({
    filters,
    setFilters,
}) => {

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const clearFilters = () => {

        setFilters({
            name: "",
            color: "",
            location: "",
            minRating: "",
            fromDate: "",
            toDate: "",
        });
    };

    return (

        <div className="filter-panel">

            <h2>
                Filter Bikes
            </h2>

            <div>

                <label>
                    Name
                </label>

                <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                    placeholder="Enter your Bike name"
                />

            </div>

            <div>

                <label>
                    Color
                </label>

                <select
                    name="color"
                    value={filters.color}
                    onChange={handleChange}
                >
                    <option value="">
                        All Colors
                    </option>

                    <option value="Black">
                        Black
                    </option>

                    <option value="White">
                        White
                    </option>

                    <option value="Red">
                        Red
                    </option>

                    <option value="Blue">
                        Blue
                    </option>

                </select>

            </div>

            <div>

                <label>
                    Location
                </label>

                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                />

            </div>

            <div>

                <label>
                    Minimum Rating
                </label>

                <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleChange}
                >

                    <option value="">
                        Any Rating
                    </option>

                    <option value="1">
                        1+
                    </option>

                    <option value="2">
                        2+
                    </option>

                    <option value="3">
                        3+
                    </option>

                    <option value="4">
                        4+
                    </option>

                    <option value="4.5">
                        4.5+
                    </option>

                </select>

            </div>

            <div>

                <label>
                    From Date
                </label>

                <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleChange}
                />

            </div>

            <div>

                <label>
                    To Date
                </label>

                <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleChange}
                />

            </div>

            <button
                onClick={clearFilters}
            >
                Clear Filters
            </button>

        </div>
    );
};

export default FilterPanel;