function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
const stringAvatar = (name) => {
  if (!name) {
    return;
  }
  const splitName = name.split(" ");
  const abbrName =
    splitName.length > 1
      ? `${splitName[0][0]}${splitName[1][0]}`
      : `${splitName[0][0]}${splitName[0][1]}`;
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${abbrName}`,
  };
};

export default stringAvatar;
