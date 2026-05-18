// //Component tìm kiếm lọc mã hàng  cho mã hàng ở bảng 1
// import { TextBox, SelectBox, Button } from "devextreme-react";
// import { useState } from "react";
// import "./OrdersFilter.scss";

// export interface FilterState {
//   season?: string;
//   buy?: string;
//   status?: string;
//   search?: string;
// }

// interface OrdersFilterProps {
//   onFilter?: (filters: FilterState) => void;
//   seasons?: string[];
//   buys?: string[];
// }

// //Tìm kiếm trạng thái
// const statusOptions = [
//   { id: "all", name: "All Status" },
//   { id: "Already plan", name: "Done" },
//   { id: "Not yet plan", name: "Not Yet Plan" },
//   { id: "Plan Partial", name: "Plan Partial" },
// ];

// //Tìm kiếm các mã hàng cần tìm
// export function OrdersFilter({
//   onFilter,
//   seasons = ["FW26", "SS27", "FA26", "AW26"],
//   buys = ["01-1", "01-2", "01-3", "02-1", "02-2"],
// }: OrdersFilterProps) {
//   const [filters, setFilters] = useState<FilterState>({
//     season: "",
//     buy: "",
//     status: "",
//     search: "",
//   });

//   const handleFilterChange = (key: keyof FilterState, value: any) => {
//     const newFilters = { ...filters, [key]: value };
//     setFilters(newFilters);
//   };

//   const handleApplyFilter = () => {
//     onFilter?.(filters);
//   };

//   const handleResetFilter = () => {
//     const resetFilters = { season: "", buy: "", status: "", search: "" };
//     setFilters(resetFilters);
//     onFilter?.(resetFilters);
//   };

//   const seasonOptions = seasons.map((s) => ({ id: s, name: s }));
//   const buyOptions = buys.map((b) => ({ id: b, name: b }));

//   return (
//     <div className="orders-filter-bar">
//       <div className="filter-group">

//         {/*lọc/tìm kiếm Season*/}
//         <div className="filter-item">
//           <label htmlFor="season-filter">Season:</label>
//           <SelectBox
//             id="season-filter"
//             dataSource={seasonOptions}
//             displayExpr="name"
//             valueExpr="id"
//             value={filters.season}
//             onValueChange={(value) => handleFilterChange("season", value)}
//             placeholder="Select Season"
//             showClearButton
//           />
//         </div>

//         {/* lọc/tìm kiếm Buy*/}
//         <div className="filter-item">
//           <label htmlFor="buy-filter">Buy:</label>
//           <SelectBox
//             id="buy-filter"
//             dataSource={buyOptions}
//             displayExpr="name"
//             valueExpr="id"
//             value={filters.buy}
//             onValueChange={(value) => handleFilterChange("buy", value)}
//             placeholder="Select Buy"
//             showClearButton
//           />
//         </div>

//         {/* Lọc trạng thái mã hàng (Status) */}
//         <div className="filter-item">
//           <label htmlFor="status-filter">Plan Status:</label>
//           <SelectBox
//             id="status-filter"
//             dataSource={statusOptions}
//             displayExpr="name"
//             valueExpr="id"
//             value={filters.status}
//             onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
//             placeholder="Select Status"
//             showClearButton
//           />
//         </div>

//         {/* Search Filter
//         <div className="filter-item filter-search">
//           <label htmlFor="search-filter">Search:</label>
//           <TextBox
//             id="search-filter"
//             value={filters.search}
//             onValueChange={(value) => handleFilterChange("search", value)}
//             placeholder="Search by Style, Color..."
//             mode="text"
//           />
//         </div> */}

//         {/*Nút nhấn*/}
//         <div className="filter-actions">
//           <Button
//             text="Apply"
//             type="success"
//             stylingMode="contained"
//             onClick={handleApplyFilter}
//           />
//           <Button
//             text="Reset"
//             type="normal"
//             stylingMode="outlined"
//             onClick={handleResetFilter}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

////////////
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./OrdersFilter.scss";

export interface FilterState {
  season?: string;
  buy?: string;
  status?: string;
  search?: string;
}

interface OrdersFilterProps {
  onFilter?: (filters: FilterState) => void;
  seasons?: string[];
  buys?: string[];
}

const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "Already plan", name: "Done" },
  { id: "Not yet plan", name: "Pending" },
  { id: "Plan Partial", name: "Partial" },
];

export function OrdersFilter({
  onFilter,
  seasons = ["FW26", "SS27", "FA26", "AW26"],
  buys = ["01-1", "01-2", "01-3", "02-1", "02-2"],
}: OrdersFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    season: "",
    buy: "",
    status: "",
    search: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilter = () => {
    onFilter?.(filters);
  };

  const handleResetFilter = () => {
    const resetFilters = { season: "", buy: "", status: "" };
    setFilters(resetFilters);
    onFilter?.(resetFilters);
  };

  return (
    <div className="orders-filter-bar">
  <div className="filter-group">

    {/* Season */}
    <div className="filter-item">
      <div className="form-floating">
        <select
          className="form-select"
          id="seasonFilter"
          value={filters.season}
          onChange={(e) =>
            handleFilterChange("season", e.target.value)
          }
        >
          <option value="">All</option>
          {seasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <label htmlFor="seasonFilter">Season</label>
      </div>
    </div>

    {/* Buy */}
    <div className="filter-item">
      <div className="form-floating">
        <select
          className="form-select"
          id="buyFilter"
          value={filters.buy}
          onChange={(e) =>
            handleFilterChange("buy", e.target.value)
          }
        >
          <option value="">All</option>
          {buys.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <label htmlFor="buyFilter">Buy</label>
      </div>
    </div>

    {/* Status */}
    <div className="filter-item">
      <div className="form-floating">
        <select
          className="form-select"
          id="statusFilter"
          value={filters.status}
          onChange={(e) =>
            handleFilterChange("status", e.target.value)
          }
        >
          <option value="">All</option>
          {statusOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label htmlFor="statusFilter">Plan Status</label>
      </div>
    </div>


        {/* Actions */}
        <div className="filter-actions d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={handleApplyFilter}
          >
            Search
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleResetFilter}
          >
            ⭯ Reset
          </button>
        </div>

      </div>
    </div>
  );
}