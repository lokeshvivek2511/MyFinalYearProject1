export const parseSoilValues = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const findValueNear = (keywords) => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      if (keywords.some(k => line.includes(k))) {
        // search current + next 2 lines
        const searchZone = [lines[i], lines[i + 1], lines[i + 2]]
          .join(" ");

        // extract ALL numbers (including decimals)
        const nums = searchZone.match(/\d+(\.\d+)?/g);
        if (!nums) return null;

        // heuristic:
        // - prefer decimal (pH)
        // - else largest number (nutrients)
        const decimals = nums.filter(n => n.includes("."));
        if (decimals.length) return Number(decimals[0]);

        return Number(nums.sort((a, b) => b - a)[0]);
      }
    }
    return null;
  };

  return {
    ph: findValueNear(["ph"]),
    phosphorus: findValueNear(["phosphor"]),
    potassium: findValueNear(["potas"]),
    nitrogen: findValueNear(["nitrate nitrogen", "nitrogen"])
  };
};