  export function formatJoinedAt(joinedAt: string) {
    const months = [
      "January",
      "Feburary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let day: number = new Date(joinedAt).getDate();
    const month = months[new Date(joinedAt).getMonth()];
    const year = new Date(joinedAt).getFullYear();
    let suffix = ''
    if (day >= 11 && day <= 13) {
      suffix += "th";
    } else {
      switch (day % 10) {
        case 1:
          suffix += "st";
          break;
        case 2:
          suffix += "nd";
          break;
        case 3:
          suffix += "rd";
          break;
        default:
          suffix += "th";
      }
    }
    return `${day}${suffix} ${month}, ${year}`;
  }