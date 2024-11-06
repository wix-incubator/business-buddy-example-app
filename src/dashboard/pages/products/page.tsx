import {
  AutoComplete,
  Card,
  Layout,
  Cell,
  Divider,
  Page,
  EmptyState,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";
import { products } from "@wix/stores";
import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { withProviders } from "../../withProviders";
import { ProductChat } from "./ProductChat";
import "./styles.global.css";
import { useWixModules } from "@wix/sdk-react";

export default withProviders(function ProductsPage() {
  const [currentProduct, setCurrentProduct] = React.useState<
    products.Product | undefined
  >();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { queryProducts } = useWixModules(products);

  const {
    data: storeProducts,
    isLoading,
    error,
  } = useQuery(["products", searchQuery], () =>
    queryProducts().startsWith("name", searchQuery).find(),
  );

  const options = useMemo(
    () =>
      storeProducts?.items.map((product) => ({
        id: product._id!,
        value: product.name,
      })),
    [storeProducts],
  );

  const handleSelect = useCallback(
    (event) => {
      setCurrentProduct(
        storeProducts!.items.find(
          (product) => product._id === (event.id as string),
        ),
      );
    },
    [storeProducts, setCurrentProduct],
  );

  const handleChange = useCallback(
    (event) => {
      setSearchQuery(event.target.value);
      setCurrentProduct(undefined);
    },
    [setSearchQuery, setCurrentProduct],
  );

  if (error) {
    return (
      <EmptyState
        theme="page-no-border"
        title="We coudn't load products"
        subtitle="Please try again later"
      />
    );
  }

  return (
    <Page>
      <Page.Header title="Chat About Products" />
      <Page.Content>
        <Layout>
          <Cell>
            <Card>
              <Card.Header title="Select a product to chat about" />
              <Card.Content>
                <AutoComplete
                  placeholder="Select a product to chat about"
                  size="large"
                  status={isLoading ? "loading" : undefined}
                  options={options}
                  onSelect={handleSelect}
                  onChange={handleChange}
                  value={currentProduct?.name ?? undefined}
                />
              </Card.Content>
            </Card>
          </Cell>

          {currentProduct && (
            <Cell>
              <ProductChat product={currentProduct} />
            </Cell>
          )}
        </Layout>
      </Page.Content>
    </Page>
  );
});
