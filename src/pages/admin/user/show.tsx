const UserShow = () => {
    return <form>
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="px-4 py-6 space-y-6 bg-white sm:p-6">
        <div className="flex flex-row items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {'User'}
            </h3>
            {/* <p className="mt-1 text-sm text-gray-500">{header.description}</p> */}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-4">
            {/* <InputText
              label="Nama lengkap"
              id="full-name"
              type="text"
              name="full_name"
              placeholder="Full name"
              setValue={setValue}
              register={register("full_name", {
                required: "Full name is required",
              })}
              description={
                errorLabel && <span className="text-red-500">{errorLabel}</span>
              }
              errors={errors}
              disabled={!_availableToUpdateChild()}
              onBlur={async () => {
                try {
                  await ChildService.checkFullName(fullNameValue);
                  setAbleToRegister(true);
                  setErrorLabel('')
                } catch (e) {
                  setAbleToRegister(false);
                  setErrorLabel((e as Error).message)
                  console.log(e);
                }
              }}
            /> */}
          </div>

          {/* <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Nama panggilan"
              id="nickname"
              type="text"
              name="nickname"
              placeholder="Nickname"
              setValue={setValue}
              register={register("nickname", {
                required: "Nickname is required",
              })}
              errors={errors}
              disabled={!_availableToUpdateChild()}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <InputText
              label="Tanggal lahir"
              id="dob"
              type="date"
              name="dob"
              setValue={setValue}
              register={register("dob", {
                required: "BIrthdate is required",
              })}
              errors={errors}
              disabled={!_availableToUpdateChild()}
            />
          </div>
          {grades && (
            <div className="col-span-6 sm:col-span-3">
              <InputSelect
                label="Kelas"
                id="grade"
                name="grade_id"
                model={grades}
                setValue={setValue}
                register={register("grade_id", {
                  required: "Role is required",
                })}
                errors={errors}
                disabled={!_availableToUpdateChild()}
              />
            </div>
          )}
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Nama orang tua"
              id="parent-name"
              type="text"
              name="parent_name"
              placeholder="Parent name"
              setValue={setValue}
              register={register("parent_name", {
                required: "Parent name is required",
              })}
              errors={errors}
              description={
                child?.user_id && currentUser.role === USER_ROLE.ADMIN ? (
                  <Link href={getPath("ADMIN", "SHOW_USER", child.user_id)}>
                    <span className="text-yellow-500 cursor-pointer hover:text-yellow-600">
                      Show parent
                    </span>
                  </Link>
                ) : (
                  ""
                )
              }
              disabled={!_availableToUpdateChild()}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Nomor telepon"
              id="phone-number"
              type="text"
              name="phone_number"
              placeholder="Phone number"
              setValue={setValue}
              register={register("phone_number", {
                required: "Phone number is required",
              })}
              errors={errors}
              disabled={!_availableToUpdateChild()}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Paroki"
              id="parish"
              type="text"
              name="parish"
              placeholder="Parish"
              setValue={setValue}
              register={register("parish", {
                required: "Parish is required",
              })}
              errors={errors}
              disabled={!_availableToUpdateChild()}
            />
          </div>
          <div className="col-span-6 sm:col-span-5">
            <InputTextarea
              rows={3}
              label="Address"
              id="address"
              name="address"
              placeholder="Ex: Jl. Mediterania Boulevard, No.1, Pantai Indah Kapuk, Kapuk Muara, Kec. Penjaringan, Jkt Utara, Daerah Khusus Ibukota Jakarta 14460"
              description="Write your full address"
              errors={errors}
              setValue={setValue}
              register={register("address")}
              disabled={!_availableToUpdateChild()}
            />
          </div>
          <div className="col-span-6 sm:col-span-4">
            <InputText
              prefix="https://www.instagram.com/"
              label="Akun instagram"
              id="instagram-account"
              type="text"
              name="instagram_account"
              placeholder="Instagram Account"
              setValue={setValue}
              register={register("instagram_account")}
              errors={errors}
              disabled={!_availableToUpdateChild()}
            />
          </div> */}
        </div>
      </div>
      {/* {_availableToUpdateChild() && (
        <div className="flex flex-row-reverse justify-between px-4 py-3 bg-gray-50 sm:px-6">
          <PrimaryButton className={classJoin("w-20", !ableToRegister ? " !bg-gray-500 !hover:bg-gray-600" : "")} type="submit" disabled={!ableToRegister}>
            {child ? "Submit" : "Register"}
          </PrimaryButton>
          {child && (
            <DangerButton
              className="w-28"
              type="button"
              onClick={handleDeleteChildEvent}
            >
              Delete child
            </DangerButton>
          )}
        </div>
      )} */}
    </div>
  </form>
}

export default UserShow;