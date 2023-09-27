import dayjs from "dayjs";

const EditFormFormated = (tob) => {
  if (tob.birthday) {
    tob.birthday = dayjs(tob.birthday).format("YYYY-MM-DD");
  }
  tob.roleId = tob?.role.id;
  // if (tob.city) {
  if (tob.region) {
    tob.regionId = tob?.region.id;
  }
  if (tob?.country) {
    tob.countryId = tob?.country.id;
  }
  if (tob?.city) {
    tob.cityId = tob?.city.id;
  }
  // }
  tob.genderId = tob?.gender.id;

  tob.grpId = tob?.grp.id;
  tob.ste.grpId = tob?.ste?.grp.id;

  return tob;
};

export default EditFormFormated;
