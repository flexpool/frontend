export const groupDataItemSum = (val: any) => {
  val.value = 0;
  for (let i = 0; i < val.dataItem.groupDataItems.length; i++) {
    let item = val.dataItem.groupDataItems[i];
    val.value += item.valueY;
  }
  return val;
};
