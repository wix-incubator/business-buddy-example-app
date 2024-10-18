import { items } from '@wix/data';

interface DataItem {
    _id: string;
    data: Record<string, any>;
}

interface GetDataOptions {
    dataCollectionId: string 
}

// FIXME: Queries to data collection requires a user to create a collection in the Editor.
// FIXME: User also needs to have proper permissions in order to operate items in a collection.
export async function getDataFromCollection({
    dataCollectionId
}: GetDataOptions) {
  try {
      return items.queryDataItems({
        dataCollectionId,
      }).find();
  } catch (error) {
    console.error('Error getting data from collection', error);
  }
}

interface UpdateDataOptions {
    dataCollectionId: string
    item: DataItem;
}

export async function getItemFromCollection({
    dataCollectionId,
    itemId
}: GetDataOptions & { itemId: string }) {
    try {
        const {data} = await items.getDataItem(itemId, {dataCollectionId});
        return data;
    } catch (error) {
        console.error('Error getting item from collection', error);
    }
}

export async function updateDataInCollection({
    dataCollectionId,
    item,
}: UpdateDataOptions) {
  const collection = await getDataFromCollection({ dataCollectionId });
  const existsInCollection = item._id && collection?.items.find(existingItem => existingItem._id === item._id);

  if (item._id && existsInCollection) {
    await items.updateDataItem(item._id, {
      dataCollectionId,
      dataItem: {
        data: {
          _id: item._id,
          ...item.data
        },
      },
    });
  } else {
    await items.insertDataItem({
      dataCollectionId,
      dataItem: {
        _id: item._id ?? undefined,
        data: {
          _id: item._id ?? undefined,
          ...item.data
        },
      },
    });
  };
}