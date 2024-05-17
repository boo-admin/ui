export const mapTree = <From extends { children?: From[] }, To extends { children?: To[] }>(
  tree: From[],
  cb: (item: From) => To | null
): To[] => {
  const result: To[] = [];
  tree.forEach(item => {
    const newel = cb(item);
    if (!newel) {
      return;
    }
    if (item.children && item.children.length > 0) {
      newel.children = mapTree(item.children, cb);
    }
    result.push(newel);
  });
  return result;
};
