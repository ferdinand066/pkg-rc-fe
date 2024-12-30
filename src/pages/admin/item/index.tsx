import { useRef, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import DialogButton from "../../../components/utils/DialogButton";
import Table from "../../../components/utils/Table";
import { useFetchItem } from "../../../hooks/general/use-item";
import { ItemModel } from "../../../model/entities/item";
import ItemManageModal from "./components/ManageModal";

const header = ["name", "room_at"];

const ItemIndex = () => {
  const { data } = useFetchItem({});

  const items = data?.map((item: ItemModel) => {
    const d = {
      ...item,
      room_at: (item.room_items ?? []).map((item) => item.room.name).join(', '),
    }

    return {
      ...d,
      room_at: d.room_at ? d.room_at : '-',
      onClick: () => {
        setSelectedItem(d)
        ref.current?.showModal();
      }
    };
  });

  const [selectedItem, setSelectedItem] = useState<ItemModel>();
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Barang"
        action={
          <DialogButton buttonText="Tambah Barang" onClick={() => setSelectedItem(undefined)} ref={ref}>
            <ItemManageModal selectedItem={selectedItem} ref={ref} />
          </DialogButton>
        }
      />
      <Table header={header} data={items ?? []} />
    </section>
  );
};

export default ItemIndex;
