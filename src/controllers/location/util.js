import LocationOps from './services';

export const modifyHandler = (model, h, request, table) => {
  const { title, male, female } = request.payload;
  const { locationId } = request.params;
  const { userId, role } = request.auth.credentials;

  const location = new LocationOps(model, table, h);
  const { data, criteria } = location.prepareForDb(
    role,
    title,
    male,
    female,
    locationId,
    userId,
  );
  return location.update(data, criteria);
};

export const deleteHandler = (model, h, request, table) => {
  const { locationId } = request.params;
  const { userId, role } = request.auth.credentials;
  const isAdmin = role === 'admin';
  const location = new LocationOps(model, table, h);
  const criteria = isAdmin
    ? { where: { id: locationId } }
    : { where: { id: locationId, userId } };
  return location.delete(criteria);
};
