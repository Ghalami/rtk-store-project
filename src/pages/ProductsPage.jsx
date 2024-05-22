import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { fetchProducts } from "../features/product/productSlice";
import SearchBox from "../components/SearchBox";

import { useSearchParams } from "react-router-dom";

import styles from "./ProductsPage.module.css";

import {
  filterProducts,
  getInitialQuery,
  searchProducts,
} from "../helper/helper";
import Sidebar from "../components/Sidebar";

function ProductsPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const [displayed, setDisplayed] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    setDisplayed(products);

    setQuery(getInitialQuery(searchParams));
  }, [products]);

  useEffect(() => {
    setSearchParams(query);
    setSearch(query.search || "");
    let finalProducts = searchProducts(products, query.search);
    finalProducts = filterProducts(finalProducts, query.category);
    setDisplayed(finalProducts);
  }, [query]);

  return (
    <>
      <SearchBox search={search} setSearch={setSearch} setQuery={setQuery} />

      <div className={styles.container}>
        <div className={styles.products}>
          {!displayed.length && <Loader />}
          {displayed.map((item) => (
            <Card key={item.id} data={item} />
          ))}
        </div>
        <Sidebar query={query} setQuery={setQuery} />
      </div>
    </>
  );
}

export default ProductsPage;
