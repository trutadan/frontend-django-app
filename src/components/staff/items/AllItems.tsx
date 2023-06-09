import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Typography,
  Slider,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL } from "../../../constants";
import { DetailedItem } from "../../../models/Item";
import { NavigationBar } from "../../user/NavigationBar";
import axios from "axios";

export const AllItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DetailedItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    let url = `${BACKEND_API_URL}/item/`;

    url += `?price__gte=${minPrice}&price__lte=${maxPrice}&`;

    if (searchTerm) url += `search=${searchTerm}&`;

    if (sortOrder) url += `ordering=${sortOrder.replace("_", "")}&`;

    url += `limit=${pageSize}&offset=${(page - 1) * pageSize}`;

    axios
      .get(url, { withCredentials: true })
      .then((response) => {
        setItems(response.data.results);
        setTotalCount(response.data.count);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, [minPrice, maxPrice, searchTerm, sortOrder, page, pageSize]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handlePriceFilterChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    if (Array.isArray(newValue)) {
      setMinPrice(newValue[0]);
      setMaxPrice(newValue[1]);
    }
  };

  return (
    <>
      <NavigationBar />
      <Container style={{ backgroundColor: "#4e4e50" }}>
        <IconButton component={Link} sx={{ mr: 3 }} to={`/menu`}>
          <ArrowBackIcon />
        </IconButton>
        <h1>All Items</h1>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            "@media (min-width:600px)": {
              flexDirection: "row",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mr: 3 }}
            />

            <FormControl sx={{ minWidth: "100px" }}>
              <InputLabel id="sort-order-label">Sort by</InputLabel>
              <Select
                labelId="sort-order-label"
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="-price">Price: High to Low</MenuItem>
                <MenuItem value="discount_price">
                  Discount Price: Low to High
                </MenuItem>
                <MenuItem value="-discount_price">
                  Discount Price: High to Low
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ mr: 3, mt: 0.5 }}>Price Range:</Typography>
            <Slider
              min={0}
              max={1000}
              step={1}
              value={[minPrice, maxPrice]}
              valueLabelDisplay="auto"
              aria-labelledby="price-range-slider"
              sx={{
                width: "100%",
                maxWidth: "350px",
                "@media (min-width: 600px)": {
                  maxWidth: "500px",
                },
                "@media (min-width: 960px)": {
                  maxWidth: "600px",
                },
              }}
              onChange={handlePriceFilterChange}
            />
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {!loading && items.length === 0 && <p>No Items found!</p>}
        {!loading && (
          <div style={{ display: "flex" }}>
            <IconButton
              component={Link}
              sx={{ mr: 3, flexGrow: 1 }}
              to={`/items/add`}
            >
              <Tooltip title="Add a new Item" arrow>
                <AddIcon color="primary" />
              </Tooltip>
            </IconButton>
          </div>
        )}
        {!loading && items.length > 0 && (
          <Box sx={{ overflow: "auto" }}>
            <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell align="center">Title</TableCell>
                      <TableCell align="center">Category</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Available number</TableCell>
                      <TableCell align="center">Orders count</TableCell>
                      <TableCell align="center">Refunds requested</TableCell>
                      <TableCell align="center">Operations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {(page - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Link
                            to={`/items/${item.id}/details`}
                            title="View item's details"
                          >
                            {item.title}
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          {item.category.name}
                        </TableCell>
                        <TableCell align="center">{item.price}</TableCell>
                        <TableCell align="center">
                          {item.available_number}
                        </TableCell>
                        <TableCell align="center">
                          {item.orders_count}
                        </TableCell>
                        <TableCell align="center">
                          {item.refunds_requested_count}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            component={Link}
                            sx={{ mr: 3 }}
                            to={`/items/${item.id}/edit`}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            component={Link}
                            sx={{ mr: 3 }}
                            to={`/items/${item.id}/delete`}
                          >
                            <DeleteForeverIcon sx={{ color: "red" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  count={Math.ceil(totalCount / pageSize)}
                  page={page}
                  onChange={handlePageChange}
                />
              </TableContainer>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
};
