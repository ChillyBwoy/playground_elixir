const A_UPPER_CODE = "A".charCodeAt(0);
const Z_UPPER_CODE = "Z".charCodeAt(0);

export function toSnakeCase(str: string): string {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const code = str[i].charCodeAt(0);
    if (code >= A_UPPER_CODE && code <= Z_UPPER_CODE) {
      result += "_" + str[i].toLowerCase();
    } else {
      result += str[i];
    }
  }

  return result;
}

export function toCamelCase(str: string): string {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "_") {
      if (!str[i + 1]) {
        result += "_";
        break;
      }
      if (str[i + 1] === "_") {
        result += "_";
        continue;
      }
      result += str[++i].toUpperCase();
    } else {
      result += str[i];
    }
  }

  return result;
}
