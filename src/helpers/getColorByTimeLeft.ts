const getColorByTimeLeft = (
  remainingTime: number | null | undefined,
  totalDuration: number | null | undefined
) => {
  if (
    remainingTime === null ||
    totalDuration === null ||
    remainingTime == undefined ||
    totalDuration == undefined
  )
    return "error";
  const progress = (remainingTime / totalDuration) * 100;

  if (progress >= 75) {
    return "success";
  } else if (progress >= 25) {
    return "warning";
  } else {
    return "error";
  }
};

export default getColorByTimeLeft;
