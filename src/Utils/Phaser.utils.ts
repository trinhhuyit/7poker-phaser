export const centralizeObject = (obj: any) => {
  obj.setOrigin(0.5);
};

export const centralizeGraphics = ({ x, y, width, height }) => {
  return {
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
  };
};
