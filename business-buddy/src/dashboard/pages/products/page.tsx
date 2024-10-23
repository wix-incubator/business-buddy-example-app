import {
  AutoComplete,
  Card,
  Layout,
  Cell,
  Divider,
  Page,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { products } from '@wix/stores';
import React from 'react';
import { useQuery } from 'react-query';
import { withProviders } from '../../withProviders';
import { ProductChat } from './ProductChat';
import './styles.global.css';
import { useWixModules } from '@wix/sdk-react';

export default withProviders(function ProductsPage() {
  const [currentProduct, setCurrentProduct] = React.useState<
    products.Product | undefined
  >();
  const [searchQuery, setSearchQuery] = React.useState('');

  const { queryProducts } = useWixModules(products);

  const {
    data: storeProducts,
    isLoading,
    error,
  } = useQuery(['products', searchQuery], () =>
    queryProducts().startsWith('name', searchQuery).find()
  );

  if (error) return <div>Something went wrong</div>;

  return (
    <Page>
      <Page.Header title='Chat About Products' />
      <Page.Content>
        <Layout>
          <Cell>
            <Card>
              <Card.Header title='Select a product to chat about' />
              <Card.Content>
                <AutoComplete
                  placeholder='Select a product to chat about'
                  size='large'
                  status={isLoading ? 'loading' : undefined}
                  options={storeProducts?.items.map((product) => ({
                    id: product._id!,
                    value: product.name,
                  }))}
                  onSelect={(e) => {
                    setCurrentProduct(
                      storeProducts!.items.find(
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
