import { regex } from "./common";
export default isValidDate;

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
