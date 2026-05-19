// // //Component tìm kiếm lọc mã hàng  cho mã hàng ở bảng 1
// import { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "./OrdersFilter.scss";

// export interface FilterState {
//   season?: string;
//   styles?: string;
//   buy?: string;
//   status?: string;
//   search?: string;
// }

// interface OrdersFilterProps {
//   onFilter?: (filters: FilterState) => void;
//   seasons?: string[];
//   styles?: string[]
//   buys?: string[];
// }

// const statusOptions = [
//   { id: "all", name: "All Status" },
//   { id: "Already plan", name: "Done" },
//   { id: "Not yet plan", name: "Pending" },
//   { id: "Plan Partial", name: "Partial" },
// ];

// export function OrdersFilter({
//   onFilter,
//   seasons = ["FW26", "SS27", "FA26", "AW26"],
//   styles = ["F2606LHBM418M", "F2606LHAF512M", "F2606LHBJ522M", "S2607JKT009"],
//   buys = ["01-1", "01-2", "01-3", "02-1", "02-2"],
// }: OrdersFilterProps) {
//   const [filters, setFilters] = useState<FilterState>({
//     season: "",
//     styles: "",
//     buy: "",
//     status: "",
//     search: "",
//   });

//   const handleFilterChange = (key: keyof FilterState, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const handleApplyFilter = () => {
//     onFilter?.(filters);
//   };

//   const handleResetFilter = () => {
//     const resetFilters = { season: "", styles: "", buy: "", status: "", search: "" };
//     setFilters(resetFilters);
//     onFilter?.(resetFilters);
//   };

//   return (
//     <div className="orders-filter-bar">
//       <div className="filter-group">
//         {/* Season */}
//         <div className="filter-item">
//           <div className="form-floating">
//             <select className="form-select" id="seasonFilter" value={filters.season} onChange={(e) => handleFilterChange("season", e.target.value)}>
//               <option value="">All</option>
//               {seasons.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//             <label htmlFor="seasonFilter">Season</label>
//           </div>
//         </div>

//         {/* Styles */}
//         <div className="filter-item">
//           <div className="form-floating">
//             <select className="form-select" id="stylesFilter" value={filters.styles} onChange={(e) => handleFilterChange("styles", e.target.value)}>
//               <option value="">All</option>
//               {styles.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//             <label htmlFor="stylesFilter">Styles</label>
//           </div>
//         </div>

//         {/* Buy */}
//         <div className="filter-item">
//           <div className="form-floating">
//             <select className="form-select" id="buyFilter" value={filters.buy} onChange={(e) => handleFilterChange("buy", e.target.value)}>
//               <option value="">All</option>
//               {buys.map(b => <option key={b} value={b}>{b}</option>)}
//             </select>
//             <label htmlFor="buyFilter">Buy</label>
//           </div>
//         </div>

//         {/* Status */}
//         <div className="filter-item">
//           <div className="form-floating">
//             <select className="form-select" id="statusFilter" value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
//               <option value="">All</option>
//               {statusOptions.map(s => (
//                 <option key={s.id} value={s.id}>{s.name}</option>
//               ))}
//             </select>
//             <label htmlFor="statusFilter">Plan Status</label>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="filter-actions d-flex gap-2">
//           <button className="btn btn-success" onClick={handleApplyFilter}>Search</button>
//           <button className="btn btn-outline-secondary" onClick={handleResetFilter}>⭯ Reset</button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OrdersFilter.scss";

//Type Filterstate
export interface FilterState {
  season?: string;
  styles?: string;
  buy?: string;
  status?: string;
  search?: string;
}

//Truyền Props
interface OrdersFilterProps {
  onFilter?: (filters: FilterState) => void;
  seasons?: string[];
  styles?: string[];
  buys?: string[];
}

const STATUS_OPTIONS = [
  { id: "Already plan", name: "Done" },
  { id: "Not yet plan", name: "Pending" },
  { id: "Plan Partial", name: "Partial" },
];

const INITIAL_FILTERS: FilterState = {
  season: "",
  styles: "",
  buy: "",
  status: "",
  search: "",
};

interface FilterSelectProps {
  id: string;
  label: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="filter-item">
      <div className="form-floating">
        <select
          id={id}
          className="form-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  );
}

export function OrdersFilter({
  onFilter,
  seasons = ["FW26", "SS27", "FA26", "AW26"],
  styles = [
    "F2606LHBM418M",
    "F2606LHAF512M",
    "F2606LHBJ522M",
    "S2607JKT009",
  ],
  buys = ["01-1", "01-2", "01-3", "02-1", "02-2"],
}: OrdersFilterProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const handleChange = (key: keyof FilterState) => (value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilter?.(filters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    onFilter?.(INITIAL_FILTERS);
  };

  return (
    <div className="orders-filter-bar">
      <div className="filter-group">
        <FilterSelect
          id="seasonFilter"
          label="Season"
          value={filters.season}
          options={seasons.map((s) => ({ value: s, label: s }))}
          onChange={handleChange("season")}
        />

        <FilterSelect
          id="stylesFilter"
          label="Styles"
          value={filters.styles}
          options={styles.map((s) => ({ value: s, label: s }))}
          onChange={handleChange("styles")}
        />

        <FilterSelect
          id="buyFilter"
          label="Buy"
          value={filters.buy}
          options={buys.map((b) => ({ value: b, label: b }))}
          onChange={handleChange("buy")}
        />

        <FilterSelect
          id="statusFilter"
          label="Plan Status"
          value={filters.status}
          options={STATUS_OPTIONS.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
          onChange={handleChange("status")}
        />

        <div className="filter-actions d-flex gap-2">
          <button className="btn btn-success" onClick={handleApply}>
            Search
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleReset}
          >
            ⭯ Reset
          </button>
        </div>
      </div>
    </div>
  );
}