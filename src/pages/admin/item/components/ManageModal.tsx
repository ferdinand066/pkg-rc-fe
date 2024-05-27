import { forwardRef, useEffect, useState } from "react";
import InputText from "../../../../components/forms/InputText";
import useManageItem from "../../../../hooks/admin/form/use-manage-item";
import { ItemModel } from "../../../../model/entities/item";

type ItemManageModalProps = {
  selectedItem: ItemModel | undefined;
};

const ItemManageModal = forwardRef<HTMLDialogElement, ItemManageModalProps>(
  ({ selectedItem }, ref) => {
    const [selectedData, setSelectedData] = useState(selectedItem);

    useEffect(() => {
      if (!selectedItem){
        setSelectedData(undefined);
        return;
      }

      const newData = {
        ...selectedItem,
      }

      setSelectedData(newData);

    }, [selectedItem]);

    const {
      register,
      setValue,
      errors,
      handleManageItem,
      handleDeleteItem,
      handleSubmit,
    } = useManageItem(selectedData);

    return (
      <>
        <h3 className="font-bold text-lg">
          {!selectedItem ? "Buat Barang" : "Ubah Barang"}
        </h3>
        <form
          onSubmit={handleSubmit(handleManageItem)}
          className="flex flex-col gap-2"
        >
          <InputText
            label="Nama Barang"
            type="text"
            name="name"
            register={register("name", {
              required: "Nama barang harus diisi",
            })}
            setValue={setValue}
            placeholder="Cth: Speaker Portable"
            errors={errors}
          />
          <div className="modal-action flex-row-reverse justify-between">
            <div className="flex flex-row gap-4">
              <button
                className="btn"
                type="button"
                onClick={() =>
                  (ref as React.RefObject<HTMLDialogElement>).current?.close()
                }
              >
                Tutup
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() =>
                  (ref as React.RefObject<HTMLDialogElement>).current?.close()
                }
              >
                {selectedItem ? "Ubah" : "Buat"}
              </button>
            </div>
            {selectedItem && (
              <button
                className="btn !ml-0 btn-error"
                type="button"
                onClick={async () => {
                  await handleDeleteItem();
                  return (
                    ref as React.RefObject<HTMLDialogElement>
                  ).current?.close();
                }}
              >
                Hapus
              </button>
            )}
          </div>
        </form>
      </>
    );
  }
);

export default ItemManageModal;
