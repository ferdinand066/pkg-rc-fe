import { useNavigate, useParams } from "react-router-dom";
import { useGetOneUser } from "../../../hooks/admin/use-user";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/general/use-auth-user";
import PageHeader from "../../../components/layout/PageHeader";
import InputText from "../../../components/forms/InputText";
import { toast } from "react-toastify";
import InputSelect from "../../../components/forms/InputSelect";
import { ADMIN_ROLE_INT, USER_ROLE_MAPPING } from "../../../lib/constants";
import InputTextarea from "../../../components/forms/InputTextarea";
import useUpdateUser from "../../../hooks/general/use-manage-user";

const ShowUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: selectedUser, status: selectedUserStatus } = useGetOneUser(
    id ?? ""
  );

  const {
    register,
    setValue,
    errors,
    handleActivateUser,
    handleUpdateRole,
    handleRejectUser,
    handleSubmit,
  } = useUpdateUser(selectedUser);

  const [ableToUpdate, setAbleToUpdate] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (selectedUserStatus === "error") {
      toast.error("Invalid request!");
      return navigate("/admin/user");
    }

    if (!selectedUser) return;

    if ((user.id as string) === selectedUser!.id) {
      setAbleToUpdate(true);
    }
  }, [user, selectedUser, selectedUserStatus]);

  const handleActionComponent = () => {
    if (!user) return <></>;
    if (user.role !== ADMIN_ROLE_INT) return <></>;

    if (!selectedUser) return <></>;
    // if (!selectedUser.email_verified_at) return <></>;

    if (!selectedUser.account_accepted_at && !selectedUser.suspended_at)
      return (
        <div className="flex flex-row gap-4">
          <button 
            onClick={() => handleRejectUser()} className="btn btn-error" type="button">
            Tolak User
          </button>
          <button
            onClick={() => handleActivateUser()}
            className="btn btn-primary"
            type="button"
          >
            Setujui User
          </button>
        </div>
      );

    if (selectedUser.account_accepted_at)
      return <div className="badge badge-success badge-outline">Active</div>;
    if (selectedUser.suspended_at)
      return <div className="badge badge-error badge-outline">Suspended</div>;
    return <></>;
  };

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-8 divide-y">
      {selectedUserStatus !== "error" && (
        <div className="flex flex-col">
          {selectedUserStatus === "success" ? (
            <PageHeader
              pageName={`Data dari ${selectedUser!.name}`}
              action={handleActionComponent()}
            />
          ) : (
            <></>
          )}

          <form
            onSubmit={handleSubmit(handleUpdateRole)}
            className="grid grid-cols-6 gap-4 mx-6"
          >
            <div className="col-span-6 sm:col-span-5">
              <InputText
                label="Nama"
                type="text"
                name="name"
                placeholder="Contoh: John Doe"
                disabled={!ableToUpdate}
                register={register("name", {
                  required: "Nama harus diisi",
                })}
                setValue={setValue}
                errors={errors}
              />
            </div>
            <div className="col-span-6 sm:col-span-4">
              <InputText
                label="Email"
                type="email"
                name="email"
                placeholder="Contoh: example@gmail.com"
                disabled={true}
                description={
                  selectedUser && !selectedUser?.email_verified_at ? (
                    <div className="badge badge-error mt-2">Not verified</div>
                  ) : (
                    <></>
                  )
                }
                register={register("email", {
                  required: "Email harus diisi",
                })}
                setValue={setValue}
                errors={errors}
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <InputSelect
                label="Role"
                name="role"
                disabled={!(user?.role === ADMIN_ROLE_INT)}
                model={USER_ROLE_MAPPING}
                register={register("role", {
                  required: "Role harus diisi",
                })}
                setValue={setValue}
                errors={errors}
              />
            </div>
            <div className="col-span-6">
              <InputTextarea
                disabled={!ableToUpdate}
                label="Alamat"
                name="address"
                id="address"
                register={register("address", {
                  required: "Alamat harus diisi",
                })}
                setValue={setValue}
                errors={errors}
              />
            </div>
            {selectedUser?.account_accepted_at && (
              <div className="col-span-6 modal-action flex-row-reverse justify-between">
                <div className="flex flex-row gap-4">
                  <button onClick={() => navigate('/admin/user')} className="btn btn-neutral" type="button">
                    Tutup
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Kirim
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </section>
  );
};

export default ShowUserPage;
