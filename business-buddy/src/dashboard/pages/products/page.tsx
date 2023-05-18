import { createClient } from "@wix/api-client";
import { authStrategy } from "@wix/dashboard-sdk";
import {
  AutoComplete,
  Card,
  Cell,
  Divider,
  Layout,
  Page,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";
import { products } from "@wix/stores";
import React from "react";
import { useQuery } from "react-query";
import { withProviders } from "../../withProviders";
import { ProductChat } from "./ProductChat";
import "./styles.global.css";

const wixClient = createClient({
  auth: authStrategy(),
  modules: {
    products,
  },
});

export default withProviders(function ProductsPage() {
  const [currentProduct, setCurrentProduct] = React.useState<
    products.Product | undefined
  >();
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    data: products,
    isLoading,
    error,
  } = useQuery(["products", searchQuery], () =>
    wixClient.products.queryProducts().startsWith("name", searchQuery).find()
  );

  if (error) return <div>Something went wrong</div>;

  return (
    <Page>
      <Page.Header title="Chat On Products" />
      <Page.Content>
        <Layout>
          <Cell>
            <Card>
              <Card.Header title="Select product to chat about" />
              <Card.Content>
                <AutoComplete
                  placeholder="Select product to chat about"
                  size="large"
                  status={isLoading ? "loading" : undefined}
                  options={products?.items.map((product) => ({
                    id: product._id!,
                    value: product.name,
                  }))}
                  onSelect={(e) => {
                    setCurrentProduct(
                      products!.items.find(
                        (product) => product._id === (e.id as string)
                      )
                    );
                  }}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentProduct(undefined);
                  }}
                  value={currentProduct?.name ?? undefined}
                />
              </Card.Content>
            </Card>
          </Cell>

          <Divider />
          <Cell>
            {currentProduct && <ProductChat product={currentProduct} />}
          </Cell>
        </Layout>
      </Page.Content>
    </Page>
  );
});
