const createId = () => {
  let i = 0;
  return () => {
    return ++i;
  };
};

export const getUserIndex = createId();
